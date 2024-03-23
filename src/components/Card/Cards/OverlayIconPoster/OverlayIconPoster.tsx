import React, { FC, SyntheticEvent } from "react";
import styles from "./OverlayIconPoster.module.scss";
import CardHOC from "../../CardHOC";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
const OverlayIconPoster: FC<cardPropsInterface> = (props) => {
  const { cardImage, display, setcardImageRef } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.overlayIcon_poster}`}>
      <div className={`${styles.img_container}`} ref={setcardImageRef}>
        <img
          src={cardImage}
          alt="Picture of the author"
          loading="lazy"
          onError={handleImageonError}
        />
      </div>
      <div className={`${styles.bottom}`}>
        {display && (
          <div className={`${styles.card_info}`}>
            {display.title && (
              <div className={`${styles.card_title}`}>{display.title}</div>
            )}
            {display.subtitle1 && (
              <div className={`${styles.card_subtitle}`}>
                {display.subtitle1}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardHOC(OverlayIconPoster);
