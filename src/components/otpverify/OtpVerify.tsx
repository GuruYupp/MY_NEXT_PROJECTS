import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./OtpVerify.module.scss";
import { FC, useEffect, useRef, useState } from "react";
import {
  OtpVerifyFormType,
  OtpVerifyPropsInterface,
  verifyotptimerType,
} from "./otpverifytypes";
import { postData } from "@/services/data.manager";
import appConfig from "@/app.config";
import GenericInput from "../shared/GenericInput/GenericInput";

const OtpVerify: FC<OtpVerifyPropsInterface> = (props) => {
  const {
    verifydata,
    sendDatatoComponent,
    closeModal,
    backgroundnone = false,
  } = props;

  const { handleSubmit, control } = useForm<OtpVerifyFormType>();

  const msgToken = useRef<ReturnType<typeof setTimeout>>();
  const [errormsg, setErrormsg] = useState<string>("");
  const [successmsg, setSuccessmsg] = useState<string>("");
  const otpTimer = useRef<verifyotptimerType>({
    timerId: undefined,
    resendTime: 30,
  });
  const [referenceId, setReferenceId] = useState<string>("");
  const [otpText, setOtpText] = useState<string>("");

  useEffect(() => {
    sendOtp("send");
    return () => {
      clearTimeout(msgToken.current);
      clearInterval(otpTimer.current.timerId);
    };
  }, []);

  const onSubmit: SubmitHandler<OtpVerifyFormType> = async (formData) => {
    const { otp } = formData;
    if (verifydata.context === "signup") {
      verifyOtp({
        context: verifydata.context,
        otp: Number(otp),
        // eslint-disable-next-line camelcase
        reference_key: verifydata.reference_key,
      });
    } else if (verifydata.context === "signin") {
      verifyOtp({
        context: verifydata.context,
        otp: Number(otp),
        mobile: verifydata.mobile,
      });
    } else if (verifydata.context === "update_email") {
      verifyOtp({
        context: verifydata.context,
        otp: Number(otp),
        email: verifydata.email,
        // eslint-disable-next-line camelcase
        new_identifier: verifydata.new_identifier,
      });
    }
  };

  const timerMs = (time: number) => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    let minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    let secsStr = secs < 10 ? `0${secs}` : `${secs}`;
    return `Resend OTP (${minsStr}:${secsStr})`;
  };

  const startResendTimer = () => {
    console.log("hello");
    if (otpTimer.current?.timerId) {
      setOtpText("Resend OTP");
      clearInterval(otpTimer.current.timerId);
    }

    let count = 0;
    otpTimer.current.timerId = setInterval(function () {
      setOtpText(timerMs(otpTimer.current.resendTime - count));
      count = count + 1;
      if (otpTimer.current.resendTime && count >= otpTimer.current.resendTime) {
        setOtpText("Resend OTP");
        clearInterval(otpTimer.current.timerId);
        otpTimer.current.timerId = undefined;
      }
    }, 1000);
  };

  const verifyOtp = async (payload: unknown) => {
    let verifyotpresponse;
    if (verifydata.context === "signup") {
      verifyotpresponse = await postData(
        "/service/api/auth/signup/complete",
        payload,
      );
    } else if (
      verifydata.context === "signin" ||
      verifydata.context === "update_email" ||
      verifydata.context === "update_mobile"
    ) {
      verifyotpresponse = await postData(
        "/service/api/auth/verify/otp",
        payload,
      );
    }
    console.log(verifyotpresponse);
    if (verifyotpresponse?.status === false) {
      if (verifyotpresponse.error && verifyotpresponse.error.message) {
        setErrormsg(verifyotpresponse.error.message);
        msgToken.current = setTimeout(() => {
          setErrormsg("");
        }, 2000);
      }
    } else {
      if (sendDatatoComponent) {
        // if (
        //   verifydata.context === "signup" ||
        //   verifydata.context === "signin"
        // ) {
        sendDatatoComponent({ from: "otpverify", data: verifyotpresponse });
        // }
      }
      closeModal();
    }
  };

  const sendOtp = async (type: "send" | "resend") => {
    let payload;
    let url;

    if (type === "resend") {
      url = "/service/api/auth/resend/otp";
      payload = {
        // eslint-disable-next-line camelcase
        reference_id: referenceId,
      };
    } else {
      if (verifydata.context === "signin" || verifydata.context === "signup") {
        payload = {
          context: verifydata.context,
        };
        if (verifydata.verification === "email") {
          payload = { ...payload, email: verifydata.email };
        } else if (verifydata.verification === "mobile") {
          payload = { ...payload, mobile: verifydata.mobile };
        }
        url = "/service/api/auth/get/otp";
      }
      if (verifydata.context === "update_email") {
        payload = {
          email: verifydata.email,
        };
        url = "service/api/auth/update/email";
      }
      if (verifydata.context === "update_mobile") {
        payload = {
          mobile: verifydata.mobile,
        };
        url = "service/api/auth/update/mobile";
      }
    }
    if (!url) return;

    const otpresponse = await postData(url, payload);
    if (otpresponse.status === true) {
      otpTimer.current.resendTime = otpresponse.response.resendTime;
      setSuccessmsg(otpresponse.response.message);
      msgToken.current = setTimeout(() => {
        setSuccessmsg("");
      }, 2000);
      startResendTimer();
      setReferenceId(otpresponse.response.referenceId || "");
    } else if (otpresponse.status === false) {
      setErrormsg(otpresponse.error?.message || "");
      msgToken.current = setTimeout(() => {
        setErrormsg("");
      }, 2000);
    }
  };

  const handlechangeEmail = () => {
    closeModal();
  };

  const handleResend = () => {
    sendOtp("resend");
  };

  return (
    <div
      className={`${styles.otpverify_wrapper} ${!backgroundnone ? styles.showbackground : ""}`}
    >
      <div className={`${styles.otp_container}`}>
        <div className={`${styles.otp_container_inner}`}>
          <span className={`${styles.otpverify_close}`} onClick={closeModal}>
            <img
              alt="close"
              src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
            ></img>
          </span>
          <p className={`${styles.title}`}>Enter One Time Passcode</p>
          <p className={`${styles.subtitle}`}>{verifydata.message}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`${styles.input_wrapper}`}>
              <GenericInput
                control={control}
                placeholder="OTP"
                type="text"
                name="otp"
                rules={{
                  required: "This Field required",
                  validate: (value) => {
                    if (value.length < 4) {
                      return "Please Enter a valid OTP";
                    }
                  },
                }}
                shouldUnregister={true}
              />
              {errormsg && (
                <p className={`${styles.input_error_msg}`}>{errormsg}</p>
              )}
              {otpText === "Resend OTP" && (
                <p className={`${styles.resend}`} onClick={handleResend}>
                  resend otp
                </p>
              )}
              {otpText !== "Resend OTP" && (
                <p className={`${styles.resend} ${styles.timer}`}>{otpText}</p>
              )}
            </div>

            <div className={`${styles.input_wrapper}`}>
              <GenericInput
                control={control}
                placeholder="OTP"
                type="submit"
                name="submit"
                defaultValue="verify"
              />
              {successmsg && (
                <p className={`${styles.input_success_msg}`}>{successmsg}</p>
              )}
            </div>

            {verifydata.email &&
              (verifydata.context === "signin" ||
                verifydata.context === "signup") && (
                <p
                  className={`${styles.change_text}`}
                  onClick={handlechangeEmail}
                >
                  Change Email Id
                </p>
              )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
