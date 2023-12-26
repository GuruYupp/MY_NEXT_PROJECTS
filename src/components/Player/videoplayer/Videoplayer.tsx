import { useAppSelector } from "@/redux/hooks";
import { StreamInteface } from "@/shared"
import { useEffect, useRef } from "react"

interface VideoPlayerPropsInterface{
  // streams:StreamInteface[],
  setSuggestionHeight:(height:number)=>void
}


function VideoPlayer(props:VideoPlayerPropsInterface){
  const { setSuggestionHeight } = props
  const {response:{streams}} = useAppSelector(state=>state.streamData);
  const playerRef = useRef<HTMLDivElement>(null);
  const player_parent_ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let playerOBj:any;
    if(playerRef.current && typeof window !== undefined){
      if(window.jwplayer){
        let playlist = getPlayList();
        playerOBj = window.jwplayer(playerRef.current).setup({
          playlist: playlist,
          muted:true,
          floating: {
            dismissible: true
          }
        })
        playerOBj.on('ready',function(){
          if (player_parent_ref.current){
            setSuggestionHeight(player_parent_ref.current.clientHeight + 200)
          }
          
        })

      }
    }
    return ()=>{
      if (playerOBj !== undefined){
        playerOBj.remove();
      }
    }
  }, [])

  function getPlayList() {
    let Playlist:StreamInteface[] = [];
    streams && streams.map((stream) => {
      if (stream?.streamType !== "fairplay" && stream?.streamType) {
        let obj: any = {};
        console.log("Stream: ", stream);
        obj["file"] = stream.url;

        if(stream?.streamType === "widevine" ||stream?.streamType === "playready"){
          obj["drm"] = {};
          (obj["drm"][stream?.streamType] = stream.keys?.licenseKey);
        }

        if (stream?.params?.sessionid && stream?.params?.token) {
          obj.onXhrOpen = function (xhr: XMLHttpRequest) {
            // console.log(url)
            if (stream?.params?.sessionid)
              xhr.setRequestHeader("sessionid", stream.params.sessionid);
            if (stream?.params?.token)
              xhr.setRequestHeader("token", stream.params.token);
          };
        }

        Playlist.push(obj);

      }
    });
    return Playlist;
  }

  return <div ref={player_parent_ref}><div ref={playerRef}></div></div>
}

export default VideoPlayer