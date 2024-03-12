import appConfig from "@/app.config";
import styles from "./Banner.module.scss";
import { bannerInterface } from "@/shared";
import { FC, useEffect, useMemo, useRef, useState } from "react";
type bannerpropsType = {
  banner: bannerInterface;
  playSlider: () => void;
  pauseSlider: () => void;
  SlideIndex: number;
  activeSlideIndex: number;
};
const Banner: FC<bannerpropsType> = (props) => {
  const { banner, SlideIndex, activeSlideIndex, pauseSlider, playSlider } =
    props;
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<typeof window.jwplayer>();
  const [showplayer, setShowPlayer] = useState<boolean>(false);
  useEffect(() => {
    let playerOBj: any;
    if (playerRef.current && typeof window !== undefined) {
      if (banner.params?.streamUrl) {
        if (window.jwplayer) {
          let playlist = getPlayList();
          playerOBj = window.jwplayer(playerRef.current).setup({
            playlist: playlist,
            mute: true,
            controls: false,
            autostart: "viewable",
            aspectratio: "16:9",
            floating: false,
            preload: "auto",
            autoPause: {
              viewability: true,
              pauseAds: true,
            },
          });
          playerOBj.on("ready", function () {});
          playerOBj.on("play", function () {
            console.log("play...");
            setShowPlayer(true);
            pauseSlider();
          });
          playerOBj.on("pause", function () {
            console.log("pause...");
            setShowPlayer(false);
            playSlider();
          });
          playerOBj.on("complete", function () {
            console.log("complete...");
            setShowPlayer(false);
            playSlider();
          });
          playerOBj.on("error", function () {
            console.log("play...");
            setShowPlayer(false);
            playSlider();
          });
          playerInstance.current = playerOBj;
        }
      }
    }
    return () => {
      if (playerOBj !== undefined) {
        playerOBj.remove();
      }
    };
  }, []);

  useMemo(() => {
    console.log(SlideIndex, "-->", activeSlideIndex);
    if (SlideIndex === activeSlideIndex) {
      if (playerRef.current) {
        playerInstance.current?.play();
      }
    } else {
      if (playerRef.current) {
        playerInstance.current?.pause();
      }
    }
  }, [activeSlideIndex]);

  function getPlayList() {
    let Playlist: { file: string }[] = [];
    let obj = {
      file: "",
    };
    obj.file = banner.params?.streamUrl || "";
    Playlist.push(obj);
    return Playlist;
  }
  return (
    <div className={styles.imageContainer}>
      <img
        src={`${appConfig.bannerImgpath}/content/banner/common/${
          banner.imageUrl.split(",")[1]
        }`}
        alt=""
      />
      {banner.params?.streamUrl && (
        <div
          className={`${styles.playerContainer} ${showplayer ? styles.show : ""}`}
        >
          <div ref={playerRef}></div>
        </div>
      )}
    </div>
  );
};

export default Banner;
