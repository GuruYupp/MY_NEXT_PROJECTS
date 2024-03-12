import React, { FC } from "react";
import { DesktopRatingsInterface } from "../viewRestrictiontypes";
import styles from "./DesktopRatings.module.scss";
const DesktopRatings: FC<DesktopRatingsInterface> = (props) => {
  const { profileRationgs, ratingClick, activeProfileRatingIndex } = props;
  const getratingState = (
    index: number,
    acitveprofileIndex: number | undefined,
  ) => {
    if (acitveprofileIndex === undefined) return;
    if (index < acitveprofileIndex) {
      return styles.selected;
    } else if (index === acitveprofileIndex) {
      return `${styles.selected} ${styles.active}`;
    } else {
      return styles.unselected;
    }
  };
  return (
    <div className={`${styles.ratingsContainer}`}>
      {profileRationgs?.map((rating, key) => (
        <div
          className={`${styles.ratingContainer}`}
          key={key}
          onClick={() => ratingClick(rating.id)}
        >
          <div
            className={`${styles.iconsContainer} ${getratingState(
              key,
              activeProfileRatingIndex,
            )}`}
          >
            <div className={`${styles.default_icon}`}>
              <img
                src="https://d2ivesio5kogrp.cloudfront.net/static/herogotv/images/parental-lock.svg"
                alt=""
              />
            </div>
            <span className={`${styles.selected_icon}`}></span>
            <span className={`${styles.active_icon}`}></span>

            {key > 0 && <span className={`${styles.rating_bar}`}></span>}
          </div>
          <p className={`${styles.ratingtext}`}>{rating.displayCode}</p>
        </div>
      ))}
    </div>
  );
};

export default DesktopRatings;
