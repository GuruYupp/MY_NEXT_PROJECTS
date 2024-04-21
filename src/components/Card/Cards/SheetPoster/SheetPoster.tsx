import React, { FC, SyntheticEvent } from "react";
import styles from "./SheetPoster.module.scss";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
import CardHOC from "../../CardHOC";
const SheetPoster: FC<cardPropsInterface> = (props) => {
  const {
    setcardImageRef,
    cardImage,
    display,
    leftOverTimeMarker,
    seekMarker,
  } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.sheet_poster}`}>
      <div className={`${styles.img_container}`} ref={setcardImageRef}>
        <img
          src={cardImage}
          alt="Picture of the author"
          onError={handleImageonError}
          loading="lazy"
        />
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
      <div className={`${styles.bottom}`}>
        <div className={`${styles.card_info}`}>
          {display?.title && (
            <div className={`${styles.card_title}`}>{display.title}</div>
          )}
          {display?.subtitle1 && (
            <div className={`${styles.card_subtitle}`}>{display.subtitle1}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardHOC(SheetPoster);
