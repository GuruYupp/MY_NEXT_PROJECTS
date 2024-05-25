import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { VideoPlayerPropsInterface } from "../playertypes";
import PlayerOverlay from "./PlayerOverlay/PlayerOverlay";
import { ModalType } from "@/components/modals/modaltypes";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import ParentalControlPin from "@/components/ParentalControlPin/ParentalControlPin";
import {
  fetchNextStreamData,
  resetstreamSlice,
  updateStreamData,
} from "@/redux/feature/streamSlice/streamSlice";
import { useRouter } from "next/router";
import VideoplayerService from "./VideoplayeruiUtil";

function VideoPlayer(props: VideoPlayerPropsInterface) {
  const { setSuggestionHeight } = props;
  const {
    response: { streams },
    error,
  } = useAppSelector((state) => state.streamData);
  const { response } = useAppSelector((state) => state.pageData);
  const { activeProfile } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState<ModalType>("");
  const playerRef = useRef<HTMLDivElement>(null);
  const playerparentref = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const { back } = useRouter();

  useEffect(() => {
    let playerOBj: any;
    if (playerRef.current && typeof window !== undefined) {
      if (streams && streams.length > 0) {
        if (
          response?.info?.attributes?.showNextButton === "true" &&
          response.info.path
        ) {
          dispatch(fetchNextStreamData({ path: response.info.path, count: 1 }));
        }
        if (window.jwplayer) {
          let playlist = getPlayList();
          playerOBj = window.jwplayer(playerRef.current);
          console.log(playerOBj);
          playerInstanceRef.current = playerOBj;
          playerOBj.setup({
            playlist: playlist,
            muted: true,
            // floating: {
            //   dismissible: true,
            // },
          });

          playerOBj.on("ready", function () {
            if (playerparentref.current) {
              setSuggestionHeight(playerparentref.current.clientHeight + 200);
            }
          });
        }
      } else if (error) {
        if (error.code === 402) {
        } else if (error.code === -820) {
          setShowModal("parentalcontrolpin");
        }
      }
    }
    return () => {
      if (playerOBj !== undefined) {
        playerOBj.remove();
        // playerInstanceRef.current = undefined;
      }
    };
  }, [streams]);

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

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "parentalcontrolpin":
        dispatch(resetstreamSlice());
        dispatch(updateStreamData(data));
        break;
      default:
        break;
    }
  }

  const handlecloseModal = (isCancel: boolean = false) => {
    document.body.style.overflowY = "scroll";
    if (isCancel) {
      back();
      return;
    }
    setShowModal("");
  };

  return (
    <>
      <div ref={playerparentref}>
        <VideoplayerService ref={playerInstanceRef}>
          <div ref={playerRef}>
            {streams?.length === 0 && <PlayerOverlay {...props} />}
          </div>
        </VideoplayerService>
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "parentalcontrolpin":
                    return (
                      activeProfile && (
                        <ParentalControlPin
                          closeModal={handlecloseModal}
                          profileData={activeProfile}
                          sendDatatoComponent={getDataFromModal}
                        />
                      )
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body,
        )}
    </>
  );
}

export default VideoPlayer;
