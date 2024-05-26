import React, { FC, SyntheticEvent } from "react";
import styles from "./LivePoster.module.scss";
import CardHOC from "../../CardHOC";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";

const LivePoster: FC<cardPropsInterface> = (props) => {
  const {
    cardImage,
    display,
    setcardImageRef,
    parentIcon = appConfig.cardDefaultImage,
    leftOverTimeMarker,
    seekMarker,
  } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.live_poster}`}>
      <div className={`${styles.img_container}`}>
        <div className={`${styles.parent_icon_container}`}>
          <img
            src={parentIcon}
            className={`${styles.parent_icon}`}
            alt="Picture of the author"
            loading="lazy"
            onError={handleImageonError}
          />
        </div>

        <div className={`${styles.card_img_container}`} ref={setcardImageRef}>
          <img
            src={cardImage}
            alt="Picture of the author"
            loading="lazy"
            onError={handleImageonError}
          />
        </div>
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
        {leftOverTimeMarker && (
          <span className={`${styles.leftover_duration}`}>
            {leftOverTimeMarker.value}
          </span>
        )}
        {seekMarker && (
          <div className={`${styles.seek}`}>
            <div className={`${styles.seek_inner_relative}`}>
              <div
                className={`${styles.seek_status_bar}`}
                style={{ width: `${Number(seekMarker.value) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardHOC(LivePoster);
