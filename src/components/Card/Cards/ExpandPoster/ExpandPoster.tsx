import React, { FC, SyntheticEvent } from "react";
import styles from "./ExpandPoster.module.scss";
import CardHOC from "../../CardHOC";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
const ExpandPoster: FC<cardPropsInterface> = (props) => {
  const { setcardImageRef, cardImage, parentIcon, display } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.expand_poster}`}>
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
          {parentIcon && (
            <div className={`${styles.channel_logo}`}>
              <img
                src={parentIcon}
                className={`${styles.partner_icon}`}
                alt="Picture of the author"
                loading="lazy"
                onError={handleImageonError}
              />
            </div>
          )}
          <div className={`${styles.meta_data}`}>
            {display?.title && (
              <div className={`${styles.card_title}`}>{display.title}</div>
            )}
            {display?.subtitle1 && (
              <div className={`${styles.card_subtitle}`}>
                {display.subtitle1}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHOC(ExpandPoster);
