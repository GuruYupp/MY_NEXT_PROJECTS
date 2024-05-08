import React, { FC, useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ParentalControlpinModalpropsInterface } from "./parentalcontrolpintype";
import styles from "./ParentalControlPin.module.scss";
import appConfig from "@/app.config";
import OtpInput from "../otpInput/OtpInput";
import { useAppSelector } from "@/redux/hooks";
import { ModalType } from "../modals/modaltypes";
import { createPortal } from "react-dom";
import Modal from "../modals/Modal";
import Getotp from "../Getotp/Getotp";
import { getotpModalType } from "../Getotp/getotptypes";
import { getData } from "@/services/data.manager";
// import { getData } from "@/services/data.manager";

const ParentalControlPin: FC<ParentalControlpinModalpropsInterface> = (
  props,
) => {
  const { closeModal, profileData, sendDatatoComponent } = props;

  const { localLang } = useAppSelector((state) => state.localization);
  const { info } = useAppSelector((state) => state.pageData.response);

  const [showModal, setShowModal] = useState<ModalType>("");
  const [otpModal, setOtpModal] = useState<getotpModalType>("");
  const [pinerrMsg, setPinerrMsg] = useState<string>("");

  const { handleSubmit } = useForm({
    mode: "onChange",
  });

  const [pin, setPin] = useState<string>("");

  const handleSetPin = useCallback((pin: string) => {
    setPin(pin);
  }, []);

  const onSubmit: SubmitHandler<{}> = () => {
    if (pin) {
      getStreamByPin(pin);
    }
  };

  const handleForgotLink = () => {
    setShowModal("getotp");
    setOtpModal("Forgot Profile & Video Lock");
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from } = Modaldata;
    switch (from) {
      default:
        break;
    }
  }

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  const getStreamByPin = async (pin: string) => {
    let params = {
      path: info.path || "",
      // eslint-disable-next-line camelcase
      pin,
    };
    const streamapiresponse = await getData(
      "/service/api/v1/page/stream",
      params,
    );
    if (streamapiresponse.status) {
      if (sendDatatoComponent) {
        sendDatatoComponent({
          from: "parentalcontrolpin",
          data: streamapiresponse,
        });
      }
      closeModal();
    } else {
      setPinerrMsg(streamapiresponse.error?.message || "");
    }
  };

  return (
    <>
      <div className={`${styles.parental_contron_pin_container}`}>
        <div className={`${styles.parental_contron_pin_container_inner}`}>
          <span
            className={`${styles.parental_contron_pin_close}`}
            onClick={() => closeModal(true)}
          >
            <img
              alt="close"
              src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
            ></img>
          </span>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`${styles.parental_contron_pin_body}`}>
              <p className={`${styles.sub_heading}`}>
                {
                  localLang[
                    "ENTER_YOUR_4_DIGIT_VIDEO_PIN_TO_WATCH_THE_RESTRICTED_CONTENT"
                  ]
                }
              </p>

              <div className={`${styles.otp_input_container}`}>
                <OtpInput pin={pin} setPin={handleSetPin} autoFocus={true} />
              </div>
              {pinerrMsg && (
                <span className={`${styles.otp_msg} ${styles.failmsg}`}>
                  {pinerrMsg}
                </span>
              )}
              {appConfig.parentalconrolpin.forgotpin && (
                <div className={`${styles.forgot_link_div}`}>
                  <span
                    className={`${styles.forgot_text}`}
                    onClick={handleForgotLink}
                  >
                    {localLang["FORGOT_PIN"]}
                  </span>
                </div>
              )}
            </div>
            <div className={`${styles.parental_contron_pin_footer}`}>
              <div className={`${styles.parental_contron_pin_footer_btns}`}>
                <button
                  className={`${styles.btn}`}
                  onClick={() => closeModal(true)}
                  type="button"
                >
                  Cancel
                </button>
                <button className={`${styles.btn}`} type="submit">
                  Confirm
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "getotp":
                    return (
                      <Getotp
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        profileData={profileData}
                        type={otpModal}
                        isPasswordOtp={appConfig.profile.type === "password"}
                      />
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body,
        )}
    </>
  );
};

export default ParentalControlPin;
