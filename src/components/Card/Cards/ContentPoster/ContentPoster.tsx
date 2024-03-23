import React, { FC, SyntheticEvent } from "react";
import styles from "./ContentPoster.module.scss";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
import CardHOC from "../../CardHOC";
const ContentPoster: FC<cardPropsInterface> = (props) => {
  const {
    setcardImageRef,
    cardImage,
    display,
    handleRemoveContinueWatching,
    partnerIcon,
    leftOverTimeMarker,
    seekMarker,
    parentIcon,
  } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.content_poster}`}>
      <div className={`${styles.img_container}`} ref={setcardImageRef}>
        <img
          src={cardImage}
          alt="partner icon"
          loading="lazy"
          onError={handleImageonError}
        />
        <div
          className={`${styles.close_icon}`}
          onClick={handleRemoveContinueWatching}
        >
          <img
            src={`${appConfig.staticImagesPath}close-icon.svg`}
            alt="close icon"
            loading="lazy"
          />
        </div>

        {partnerIcon && (
          <img
            src={partnerIcon}
            className={`${styles.partner_icon}`}
            alt="Picture of the author"
            loading="lazy"
            onError={handleImageonError}
          />
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
        <div className={`${styles.gradient}`}></div>
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

export default CardHOC(ContentPoster);
