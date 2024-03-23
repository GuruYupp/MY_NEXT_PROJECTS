import React, { FC, SyntheticEvent } from "react";
import styles from "./PromoPoster.module.scss";
import CardHOC from "../../CardHOC";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
const PromoPoster: FC<cardPropsInterface> = (props) => {
  const { setcardImageRef, cardImage } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.promo_poster}`}>
      <div className={`${styles.img_container}`} ref={setcardImageRef}>
        <img
          src={cardImage}
          alt="Picture of the author"
          loading="lazy"
          onError={handleImageonError}
        />
      </div>
    </div>
  );
};

export default CardHOC(PromoPoster);
