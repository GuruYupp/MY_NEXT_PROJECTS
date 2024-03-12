import styles from "./BottomRatings.module.scss";
import appConfig from "@/app.config";
import { BottomRatingsInterface } from "../../viewRestrictiontypes";
import { FC } from "react";

const BottomRatings: FC<BottomRatingsInterface> = (props) => {
  const {  Profile,profileRationgs, activeProfileRatingIndex, ratingClick,closeModal,activeProfileRating } = props;
  const getratingState = (
    index: number,
    acitveprofileIndex: number | undefined
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
    <div className={`${styles.ratings_modal}`}>
      <div className={`${styles.ratings_inner_modal}`}>
        <div className={`${styles.close_btn}`} onClick={closeModal}>
          <img
            alt="close"
            src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
          ></img>
        </div>
        <p className={`${styles.heading}`}>
          Profile Maturity Ratings for {Profile?.name}
        </p>
        <p className={`${styles.subheading}`}>
          Show all titles of rated{" "}
          <span className={`${styles.rating}`}>
            '{activeProfileRating?.displayCode || Profile?.profileRating || " A and Below "}'
          </span>{" "}
          for this profile.
        </p>
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
                  activeProfileRatingIndex
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

                <span className={`${styles.rating_bar}`}></span>
              </div>
              <p className={`${styles.ratingtext}`}>{rating.displayCode}</p>
              <p className={`${styles.ratingtext} ${styles.ratingcode}`}>{rating.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomRatings;
