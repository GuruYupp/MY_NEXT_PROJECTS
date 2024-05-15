import React, {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useEffect,
} from "react";
import {
  ChangeRewindIcon,
  createButton,
  getForwardIcon,
  hideButtons,
  showButtons,
  togglePlayerButton,
} from "../playerutils/playeruiservice";
import appConfig from "@/app.config";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/router";
import { getRootState } from "@/redux/store";

const VideoplayerServicewithRef: ForwardRefRenderFunction<
  any,
  PropsWithChildren
> = (props, PlayerRef) => {
  const { response } = useAppSelector((state) => state.streamData);
  const router = useRouter();
  useEffect(() => {
    if ((PlayerRef as any)?.current) {
      setPlayerListeners();
    }
  }, [(PlayerRef as any)?.current]);

  const handleFastForward = () => {
    try {
      (PlayerRef as any)?.current?.seek(
        (PlayerRef as any)?.current?.getPosition() + 10,
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartOver = () => {
    try {
      (PlayerRef as any)?.current?.seek(0);
    } catch (err) {
      console.log(err);
    }
  };

  function handleNextEpisode() {
    try {
      const store = getRootState();
      const { streamData } = store;
      if (streamData.nextvideoInfo.nextvideoData) {
        router.push(streamData.nextvideoInfo.nextvideoData.data[0].target.path);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleSkipIntro = () => {
    try {
      (PlayerRef as any)?.current?.seek(
        Number(response?.pageAttributes?.introEndTime),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const setPlayerListeners = () => {
    (PlayerRef as any)?.current?.on("firstFrame", function () {
      ChangeRewindIcon();
      let forwardIcon: JQuery<HTMLElement> | undefined = getForwardIcon();
      if (forwardIcon) {
        forwardIcon.on("click", function (this) {
          handleFastForward();
        });
      }

      if (appConfig.player.startover) {
        let startOverButton: JQuery<HTMLElement> | undefined = createButton(
          "startover",
          "Start Over",
        );
        if (startOverButton) {
          startOverButton.on("click", function () {
            handleStartOver();
          });
        }
      }

      let nextEpisodeButton: JQuery<HTMLElement> | undefined;

      if (
        appConfig.player.nextepisode &&
        response?.pageAttributes?.showNextButton === "true"
      ) {
        nextEpisodeButton = createButton(
          "nextepisode",
          response?.pageAttributes?.nextButtonTitle || "Next Episode",
        );
        if (nextEpisodeButton) {
          nextEpisodeButton.on("click", function () {
            handleNextEpisode();
          });
        }
      }

      if (
        appConfig.player.skipintro &&
        Number(response?.pageAttributes?.introStartTime) <
          Number(response?.pageAttributes?.introEndTime)
      ) {
        let skipIntroButton: JQuery<HTMLElement> | undefined = createButton(
          "skipintro",
          "Skip Intro",
        );
        if (skipIntroButton) {
          skipIntroButton.on("click", function () {
            handleSkipIntro();
          });
        }
      }
    });

    (PlayerRef as any)?.current?.on("userActive", function () {
      showButtons();
    });

    (PlayerRef as any)?.current?.on("userInactive", function () {
      if ((PlayerRef as any)?.current.getState() !== "paused") {
        hideButtons();
      }
    });

    (PlayerRef as any)?.current?.on("time", function (data: any) {
      if (data.currentTime > 60) {
        togglePlayerButton("startover", "show");
      } else {
        togglePlayerButton("startover", "hide");
      }

      if (data.currentTime > Number(response?.pageAttributes?.introEndTime)) {
        togglePlayerButton("skipintro", "hide");
      } else {
        togglePlayerButton("skipintro", "show");
      }
    });

    //   (PlayerRef as any)?.current?.on("all", function (data) {
    //     console.log(PlayerRef.current.getState())
    //     console.log(data)
    // })
  };

  return <>{props.children}</>;
};
const VideoplayerService = forwardRef(VideoplayerServicewithRef);
export default VideoplayerService;
