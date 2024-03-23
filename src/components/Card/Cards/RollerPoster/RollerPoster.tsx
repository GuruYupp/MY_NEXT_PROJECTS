import React, { FC, SyntheticEvent } from "react";
import styles from "./RollerPoster.module.scss";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
import CardHOC from "../../CardHOC";
const RollerPoster: FC<cardPropsInterface> = (props) => {
  const { setcardImageRef, cardImage, display } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.roller_poster}`}>
      <div className={`${styles.img_container}`} ref={setcardImageRef}>
        <img
          src={cardImage}
          alt="Picture of the author"
          loading="lazy"
          onError={handleImageonError}
        />
      </div>
      <div className={`${styles.bottom}`}>
        <div className={`${styles.card_info}`}>
          {display?.title && (
            <div className={`${styles.card_title}`}>{display.title}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardHOC(RollerPoster);
