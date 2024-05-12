import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/router";
import styles from "./ParentalControl.module.scss";
import { getAbsolutPath } from "@/utils";
import { FC, useCallback, useState } from "react";
import { postData } from "@/services/data.manager";
import appConfig from "@/app.config";
import Ratings from "@/components/Ratings/Ratings";
import { RatingsSliceInterface } from "@/components/Ratings/ratingstype";
import OtpInput from "../otpInput/OtpInput";

const ParentalControl: FC = () => {
  const { query, back } = useRouter();
  const { enableRestrictionpage, apivalidtoken } = useAppSelector(
    (state) => state.pagerestrictions,
  );

  const { userDetails } = useAppSelector((state) => state.user);
  const { userprofiles } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );

  const [activeProfileRating, setActiveProfileRating] =
    useState<RatingsSliceInterface["activeProfileRating"]>();

  const [pin, setPin] = useState<string>("");

  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  let Profile = userDetails?.profileParentalDetails?.filter(
    (profile) => profile.profileId?.toString() === query.userId,
  )[0];

  let ProfileImage: string = Profile?.imageUrl
    ? getAbsolutPath(Profile?.imageUrl)
    : defaultprofileimg;

  const handleRatingsonChange = useCallback(
    (activeProfileRating: RatingsSliceInterface["activeProfileRating"]) => {
      setActiveProfileRating(activeProfileRating);
    },
    [activeProfileRating],
  );

  if (enableRestrictionpage === false) {
    back();
  }

  const updateParentalControl = async (payload: any) => {
    try {
      const response = await postData(
        "/service/api/auth/parental/control/action",
        payload,
      );
      if (response.status === true) {
        back();
      } else {
      }
    } catch (err) {}
  };

  const handleSavebtn = () => {
    //activeProfileRating
    let context =
      userprofiles?.fields?.is_userprofiles_supported === "true"
        ? "user_profiles"
        : "userprofiles";
    let payload: { [key: string]: string | number } = {
      context,
      parentalRatingId: activeProfileRating?.id || "",
      token: apivalidtoken,
      pin: "",
    };
    if (pin && pin.length >= 4 && pin.length <= 6) {
      payload["pin"] = pin;
    } else {
      delete payload["pin"];
    }
    updateParentalControl(payload);
  };

  const handleSetPin = useCallback((pin: string) => {
    setPin(pin);
  }, []);

  return (
    <div className={`${styles.parenatal_container}`}>
      <div className={`${styles.inner}`}>
        <div className={`${styles.header}`}>
          <img
            src={`${appConfig.staticImagesPath}back.svg`}
            alt="back-icon"
            className={`${styles.back_icon}`}
          />
          Parental Control
        </div>
        <div className={`${styles.body}`}>
          <div className={`${styles.left}`}>
            <div className={`${styles.profile_icon}`}>
              <img src={ProfileImage} alt="" />
            </div>
          </div>
          <div className={`${styles.right}`}>
            <div className={`${styles.ratings_container}`}>
              <p className={`${styles.heading}`}>Viewing Restrictions</p>
              <p className={`${styles.subheading}`}>
                Videos with these ratings require a PIN :
                <span className={`${styles.rating}`}>
                  {activeProfileRating?.displayCode || " A and Below "}
                </span>
              </p>
              <Ratings ratingsonChange={handleRatingsonChange} />
            </div>
            <div className={`${styles.videopin_container}`}>
              <p className={`${styles.heading}`}>Video PIN</p>
              <p className={`${styles.subheading}`}>
                Your PIN is used to authorize viewing when you turn on above
                restrictions
              </p>
              <OtpInput
                pin={pin}
                setPin={handleSetPin}
                inputType={"password"}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.btns}`}>
          <button className={`${styles.btn}`}>Cancel</button>
          <button
            className={`${styles.btn} ${styles.save_btn}`}
            onClick={handleSavebtn}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentalControl;
