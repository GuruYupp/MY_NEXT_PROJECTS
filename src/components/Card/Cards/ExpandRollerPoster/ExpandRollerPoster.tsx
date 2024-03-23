import React, { FC, SyntheticEvent } from "react";
import styles from "./ExpandRollerPoster.module.scss";
import CardHOC from "../../CardHOC";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
const ExpandRollerPoster: FC<cardPropsInterface> = (props) => {
  const {
    setcardImageRef,
    cardImage,
    partnerIcon,
    display,
    showButton,
    showFavoriteButton,
    buttonText,
    handleLikeButton,
    isFavorite,
    showShareButton,
  } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.expand_roller_poster}`}>
      <div className={`${styles.img_container}`} ref={setcardImageRef}>
        <img
          src={cardImage}
          alt="Picture of the author"
          loading="lazy"
          onError={handleImageonError}
        />
        {partnerIcon && (
          <img
            src={partnerIcon}
            className={`${styles.partner_icon}`}
            alt="Picture of the author"
            loading="lazy"
            onError={handleImageonError}
          />
        )}
      </div>
      <div className={`${styles.bottom}`}>
        <div className={`${styles.card_info}`}>
          {display?.title && (
            <div className={`${styles.card_title}`}>{display.title}</div>
          )}
        </div>
      </div>
      <div className={`${styles.hover_info}`}>
        {display?.subtitle1 && (
          <div className={`${styles.card_subtitle}`}>{display.subtitle1}</div>
        )}
        <div className={`${styles.buttons}`}>
          {showButton && (
            // <Link href={button_target_path?.value || "#"}>
            <button
              className={
                `${styles.default_btn} ` +
                (showButton.value === "play" ? `${styles.play_btn}` : "")
              }
            >
              {buttonText && buttonText.value}
            </button>
            // </Link>
          )}

          {showFavoriteButton && showFavoriteButton.value === "true" && (
            <button className={`${styles.like_btn}`} onClick={handleLikeButton}>
              {isFavorite?.value === "true" ? (
                <img
                  src={`${appConfig.cloudpath + "/images/favorite-active.svg"}`}
                  alt="favorite"
                />
              ) : (
                <img
                  src={`${appConfig.cloudpath + "/images/heart.svg"}`}
                  alt="favorite"
                />
              )}
            </button>
          )}

          {showShareButton && showShareButton.value === "true" && (
            <button className={`${styles.like_btn}`}>
              <img
                src={`${appConfig.cloudpath + "/images/share.svg"}`}
                alt="share"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardHOC(ExpandRollerPoster);
