import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { VideoPlayerPropsInterface } from "../playertypes";
import PlayerOverlay from "./PlayerOverlay/PlayerOverlay";
import { ModalType } from "@/components/modals/modaltypes";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import ParentalControlPin from "@/components/ParentalControlPin/ParentalControlPin";
import {
  fetchStreamData,
  resetstreamSlice,
} from "@/redux/feature/streamSlice/streamSlice";

function VideoPlayer(props: VideoPlayerPropsInterface) {
  const { setSuggestionHeight } = props;
  const {
    response: { streams },
    error,
  } = useAppSelector((state) => state.streamData);
  const { activeProfile } = useAppSelector((state) => state.user);
  const { info } = useAppSelector((state) => state.pageData.response);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState<ModalType>("");
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
        } else if (error.code === -820) {
          setShowModal("parentalcontrolpin");
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

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    debugger;
    switch (from) {
      case "parentalcontrolpin":
        // switchSelectedProfile(selectedProfile, data);
        getStreamByPin(data);
        break;
      default:
        break;
    }
  }

  const getStreamByPin = async (pin: string) => {
    let params = {
      path: info.path || "",
      // eslint-disable-next-line camelcase
      pin,
    };

    dispatch(resetstreamSlice());
    dispatch(fetchStreamData({ params }));
  };

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  return (
    <>
      <div ref={playerparentref}>
        <div ref={playerRef}>
          {streams?.length === 0 && <PlayerOverlay {...props} />}
        </div>
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
