import React, { FC, useEffect, useRef } from "react";
import styles from "./PlayerOverlay.module.scss";
import { VideoPlayerPropsInterface } from "../../playertypes";
import { useAppSelector } from "@/redux/hooks";
import { getAbsolutPath } from "@/utils";
import Link from "next/link";
import appConfig from "@/app.config";

const PlayerOverlay: FC<VideoPlayerPropsInterface> = (props) => {
  const { setSuggestionHeight } = props;
  const { error, pageAttributes } = useAppSelector((state) => state.streamData);
  const { content } = useAppSelector((state) => state.pageData.response);
  let backgroundImage = content[0].content?.backgroundImage;
  backgroundImage = backgroundImage
    ? getAbsolutPath(content[0].content?.backgroundImage)
    : `${appConfig.staticImagesPath}default-details.png`;
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
      {error.code === -820 && (
        <p className={`${styles.message2}`}>{error.message}</p>
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
};

export default PlayerOverlay;
