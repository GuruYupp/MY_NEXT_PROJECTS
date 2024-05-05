import { subprofileInterface } from "@/shared";
import styles from "./ProfilePin.module.scss";
import { useCallback, useState } from "react";
import { ModalType } from "../modals/modaltypes";
import { getAbsolutPath } from "@/utils";
import appConfig from "@/app.config";
import OtpInput from "@/components/otpInput/OtpInput";
import { useForm } from "react-hook-form";

interface profilepinModalpropsInterface {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType; data: any }) => void;
  profileData: subprofileInterface;
  pinerrMsg?: string;
}

function ProfilePin(props: profilepinModalpropsInterface) {
  const { closeModal, profileData, sendDatatoComponent, pinerrMsg } = props;
  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";

  const { handleSubmit } = useForm({
    mode: "onChange",
  });

  const [pin, setPin] = useState<string>("");

  const handleSetPin = useCallback((pin: string) => {
    setPin(pin);
  }, []);

  const onSubmit = () => {
    if (sendDatatoComponent) {
      sendDatatoComponent({ from: "profilepin", data: pin });
    }
  };

  return (
    <div className={`${styles.profile_pin_container}`}>
      <div className={`${styles.profile_pin_container_inner}`}>
        <span className={`${styles.profile_pin_close}`} onClick={closeModal}>
          <img
            alt="close"
            src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
          ></img>
        </span>
        <div className={`${styles.profile_pin_header}`}>
          <div className={`${styles.profile_icon}`}>
            <img
              src={`${
                profileData?.imageUrl
                  ? getAbsolutPath(profileData.imageUrl)
                  : defaultprofileimg
              }`}
              alt=""
            />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.profile_pin_body}`}>
            <h5 className={`${styles.heading}`}>{profileData.name}</h5>
            <p className={`${styles.sub_heading}`}>
              Enter your 4 Digit PIN to access your profile
            </p>

            <div className={`${styles.otp_input_container}`}>
              <OtpInput pin={pin} setPin={handleSetPin} autoFocus={true} />
            </div>
            {pinerrMsg && (
              <span className={`${styles.otp_msg} ${styles.failmsg}`}>
                {pinerrMsg}
              </span>
            )}
          </div>
          <div className={`${styles.profile_pin_footer}`}>
            <div className={`${styles.profile_pin_footer_btns}`}>
              <button
                className={`${styles.btn}`}
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>

              <button className={`${styles.btn}`}>Continue</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePin;
