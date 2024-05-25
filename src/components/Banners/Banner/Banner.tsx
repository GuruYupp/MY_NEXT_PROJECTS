import styles from "./Banner.module.scss";
import { bannerInterface } from "@/shared";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { getAbsolutPath } from "@/utils";
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
  const bannerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<typeof window.jwplayer>();
  const [showplayer, setShowPlayer] = useState<boolean>(false);
  const [enablePreview, setenablePreview] = useState<boolean>(false);
  useEffect(() => {
    setPreview();
    window.addEventListener("resize", setPreview);
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
    if (bannerRef.current) {
      const width = bannerRef.current.clientWidth;
      bannerRef.current.style.height = `${width * 0.4375}px`;
    }
    return () => {
      window.removeEventListener("resize", setPreview);
      if (playerOBj !== undefined) {
        playerOBj.remove();
      }
    };
  }, []);

  useMemo(() => {
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

  function setPreview() {
    if (window.innerWidth < 991 && enablePreview) {
      setenablePreview(false);
    } else if (!enablePreview) {
      setenablePreview(true);
    }
  }
  return (
    <div className={styles.imageContainer} ref={bannerRef}>
      <img src={`${getAbsolutPath(banner.imageUrl)}`} alt="" />
      {enablePreview && banner.params?.streamUrl && (
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
