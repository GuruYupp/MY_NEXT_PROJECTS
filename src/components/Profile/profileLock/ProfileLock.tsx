import { useRouter } from "next/router";
import styles from "./ProfileLock.module.scss";
import { getAbsolutPath } from "@/utils";

import { useAppSelector } from "@/redux/hooks";
import appConfig from "@/app.config";

import OtpInput from "@/components/otpInput/OtpInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProfileLockFormInterface } from "./profilelocktypes";
import CheckInfo from "./checkInfo/CheckInfo";
import { useCallback, useEffect, useRef, useState } from "react";
import { postData } from "@/services/data.manager";

function ProfileLock() {
  const { query, back } = useRouter();

  const { userDetails } = useAppSelector((state) => state.user);
  const { apivalidtoken, enableRestrictionpage } = useAppSelector(
    (state) => state.pagerestrictions,
  );
  const { register, control, handleSubmit } = useForm<ProfileLockFormInterface>(
    {
      defaultValues: { profilelock: "off" },
      mode: "onChange",
    },
  );
  const [pin, setPin] = useState<string>("");
  const [errormsg, setErrormsg] = useState<string>("");
  const errormsgToken = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(errormsgToken.current);
    };
  }, []);

  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  let Profile = userDetails?.profileParentalDetails?.filter(
    (profile) => profile.profileId?.toString() === query.userId,
  )[0];
  console.log(Profile);

  let ProfileImage: string = Profile?.imageUrl
    ? getAbsolutPath(Profile?.imageUrl)
    : defaultprofileimg;

  if (enableRestrictionpage === false) {
    back();
  }

  const onSubmit: SubmitHandler<ProfileLockFormInterface> = async (data) => {
    if (
      data.profilelock === "on" &&
      (data.maturaitypin === "true" || data.pinaddprofile === "true") &&
      !pin
    ) {
      setErrormsg("PIN Required");
      errormsgToken.current = setTimeout(() => {
        setErrormsg("");
      }, 1000);
      return;
    } else if (
      data.profilelock === "off" &&
      (data.maturaitypin === "true" || data.pinaddprofile === "true") &&
      !pin
    ) {
      setErrormsg("Enable PIN Access");
      errormsgToken.current = setTimeout(() => {
        setErrormsg("");
      }, 1000);
      return;
    }
    console.log(data);
    let payload = {
      profileId: Profile?.profileId,
      pin: pin,
      isProfileLockActive: data.profilelock === "on",
      isParentalControlEnable: data.maturaitypin === "true",
      addProfilePinEnable: data.pinaddprofile === "true",
      token: apivalidtoken,
      context: "userprofiles",
    };
    handleProfileLock(payload);
  };

  const handleProfileLock = async (data: any) => {
    try {
      let profilelockResponse = await postData(
        "/service/api/auth/update/user/profile/lock",
        data,
      );
      if (profilelockResponse.status === true) {
        back();
      } else {
        console.log(profilelockResponse);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetPin = useCallback((pin: string) => {
    setPin(pin);
  }, []);

  return (
    <div className={`${styles.profilelock_container}`}>
      <div className={`${styles.inner}`}>
        <div className={`${styles.header}`}>
          <img
            src={`${appConfig.staticImagesPath}back.svg`}
            alt="back-icon"
            className={`${styles.back_icon}`}
          />
          Profile Lock
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.body}`}>
            <div className={`${styles.left}`}>
              <div className={`${styles.profile_icon}`}>
                <img src={ProfileImage} alt="" />
              </div>
            </div>
            <div className={`${styles.right}`}>
              <div className={`${styles.heading_container}`}>
                <p className={`${styles.heading}`}>
                  Require a PIN to access {Profile?.name}'s Profile
                </p>
                <div className={`${styles.toggle_btn}`}>
                  <div className={`${styles.toggle_inner}`}>
                    <div className={`${styles.btn}`}>
                      ON
                      <input
                        type="radio"
                        {...register("profilelock")}
                        value="on"
                        className={`${styles.radio_input}`}
                      />
                    </div>
                    <div className={`${styles.btn} ${styles.active}`}>
                      OFF
                      <input
                        type="radio"
                        {...register("profilelock")}
                        value="off"
                        className={`${styles.radio_input}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <OtpInput pin={pin} setPin={handleSetPin} />
              <CheckInfo
                control={control}
                name="pinaddprofile"
                defaultValue={
                  (Profile?.addProfilePinEnable || "") === true
                    ? "true"
                    : "false"
                }
                labelText={`Require ${Profile?.name}'s PIN to add new profiles`}
              />
              <CheckInfo
                control={control}
                name="maturaitypin"
                defaultValue={
                  (Profile?.isParentalControlEnabled || "") === true
                    ? "true"
                    : "false"
                }
                labelText={`Require ${Profile?.name}'s PIN to watch 16+, 18+ videos from this profile regardless of maturity rating`}
              />
              {errormsg && <p className={`${styles.error_msg}`}>{errormsg}</p>}
            </div>
          </div>

          <div className={`${styles.btns}`}>
            <button className={`${styles.btn}`}>Cancel</button>
            <button
              className={`${styles.btn} ${styles.save_btn}`}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileLock;
