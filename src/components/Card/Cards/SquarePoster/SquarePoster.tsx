import React, { FC, SyntheticEvent } from "react";
import styles from "./SquarePoster.module.scss";
import { cardPropsInterface } from "../../cardtype";
import appConfig from "@/app.config";
import CardHOC from "../../CardHOC";

const SquarePoster: FC<cardPropsInterface> = (props) => {
  const { setcardImageRef, cardImage } = props;
  const handleImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute("src", appConfig.cardDefaultImage);
  };
  return (
    <div className={`${styles.square_poster}`}>
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

export default CardHOC(SquarePoster);
