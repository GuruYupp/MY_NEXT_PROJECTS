import { useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react";
import styles from "./Videoplayer.module.scss";
import Link from "next/link";
import { getAbsolutPath } from "@/utils";

interface VideoPlayerPropsInterface {
  // streams:StreamInteface[],
  setSuggestionHeight: (height: number) => void;
}

function PlayerOverlay(props: VideoPlayerPropsInterface) {
  const { setSuggestionHeight } = props;
  const { error, pageAttributes } = useAppSelector((state) => state.streamData);
  const { content } = useAppSelector((state) => state.pageData.response);
  let backgroundImage =
    getAbsolutPath(content[0].content?.backgroundImage || "") || "";
  const playerInfoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (playerInfoRef.current) {
      playerInfoRef.current.style.height = `${getHeight()}px`;
      setSuggestionHeight(playerInfoRef.current?.clientHeight + 200);
    }
  }, []);
  const getHeight = () => {
    if (playerInfoRef.current) {
      return playerInfoRef.current.clientWidth / (16 / 9);
    }
    return 0;
  };
  return (
    <div className={`${styles.player_overlay}`} ref={playerInfoRef}>
      {backgroundImage && (
        <div className={`${styles.imageContainer}`}>
          <img src={backgroundImage} alt="playerbg" />
        </div>
      )}
      {error.code === 402 && (
        <>
          <p className={`${styles.message2}`}>{error.message}</p>
          <div className={`${styles.buttons}`}>
            <div className={`${styles.button}`}>subscribe</div>
          </div>
        </>
      )}
      {error.code === -1000 && (
        <>
          {pageAttributes?.ContentAccessErrorMessage && (
            <h1 className={`${styles.message1}`}>
              {pageAttributes.ContentAccessErrorMessage}
            </h1>
          )}
          {pageAttributes?.SignAndSignupErrorMessage && (
            <p className={`${styles.message2}`}>
              {pageAttributes.SignAndSignupErrorMessage}
            </p>
          )}

          {!pageAttributes && (
            <p className={`${styles.message2}`}>{error.message}</p>
          )}

          <div className={`${styles.buttons}`}>
            <div className={`${styles.button} ${styles.primary}`}>
              {" "}
              <Link href={`/signup`}>Sign Up</Link>{" "}
            </div>
            <div className={`${styles.button}`}>
              {" "}
              <Link href={`/signin`}>Sign In</Link>{" "}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function VideoPlayer(props: VideoPlayerPropsInterface) {
  const { setSuggestionHeight } = props;
  const {
    response: { streams },
    error,
  } = useAppSelector((state) => state.streamData);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerparentref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let playerOBj: any;
    if (playerRef.current && typeof window !== undefined) {
      if (streams && streams.length > 0) {
        if (window.jwplayer) {
          let playlist = getPlayList();
          playerOBj = window.jwplayer(playerRef.current).setup({
            playlist: playlist,
            muted: true,
            floating: {
              dismissible: true,
            },
          });
          playerOBj.on("ready", function () {
            if (playerparentref.current) {
              setSuggestionHeight(playerparentref.current.clientHeight + 200);
            }
          });
        }
      } else if (error) {
        if (error.code === 402) {
        }
      }
    }
    return () => {
      if (playerOBj !== undefined) {
        playerOBj.remove();
      }
    };
  }, []);

  function getPlayList() {
    let Playlist: any[] = [];
    streams &&
      streams.map((stream) => {
        if (stream?.streamType !== "fairplay" && stream?.streamType) {
          let obj: any = {};
          obj["file"] = stream.url;

          if (
            stream?.streamType === "widevine" ||
            stream?.streamType === "playready"
          ) {
            obj["drm"] = {};
            obj["drm"][stream?.streamType] = stream.keys?.licenseKey;
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

  return (
    <div ref={playerparentref}>
      <div ref={playerRef}>
        {streams?.length === 0 && <PlayerOverlay {...props} />}
      </div>
    </div>
  );
}

export default VideoPlayer;
