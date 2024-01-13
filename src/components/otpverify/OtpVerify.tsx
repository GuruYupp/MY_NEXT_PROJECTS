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

const OtpVerify: FC<OtpVerifyPropsInterface> = (props) => {
  const { verifydata, sendDatatoComponent, closeModal, backgroundnone =false } = props;

  const { register, formState, handleSubmit } = useForm<OtpVerifyFormType>();

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
        reference_key: verifydata.reference_key,
      });
    } else if (verifydata.context === "signin") {
      verifyOtp({
        context: verifydata.context,
        otp: Number(otp),
        mobile: verifydata.number,
      });
    } else if (verifydata.context === "update_email") {
      verifyOtp({
        context: verifydata.context,
        otp: Number(otp),
        email: verifydata.email,
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

  const verifyOtp = async (post_data: unknown) => {
    let verifyotpresponse;
    if (verifydata.context === "signup") {
      verifyotpresponse = await postData(
        "/service/api/auth/signup/complete",
        post_data
      );
    } else if (verifydata.context === "signin" || verifydata.context === "update_email" || verifydata.context === "update_mobile") {
      verifyotpresponse = await postData(
        "/service/api/auth/verify/otp",
        post_data
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
    let post_data;
    let url;


    if (type === "resend") {
      url = "/service/api/auth/resend/otp";
      post_data = {
        reference_id: referenceId,
      };
    } else {
      if (verifydata.context === "signin" || verifydata.context === "signup") {
        post_data = {
          context: verifydata.context,
        };
        if (verifydata.verification === "email") {
          post_data = { ...post_data, email: verifydata.email };
        } else if (verifydata.verification === "mobile") {
          post_data = { ...post_data, mobile: verifydata.number };
        }
        url = "/service/api/auth/get/otp";
      }
      if (verifydata.context === "update_email") {
        post_data = {
          email: verifydata.email,
        };
        url = "service/api/auth/update/email";
      }
      if(verifydata.context === "update_mobile"){
        post_data={
          mobile:verifydata.number
        }
        url = "service/api/auth/update/mobile"
      }
    }
    if (!url) return;



    const otpresponse = await postData(url, post_data);
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
    <div className={`${styles.otpverify_wrapper} ${!backgroundnone ? styles.showbackground : ''}`}>
      <div className={`${styles.otp_container}`}>
        <div className={`${styles.otp_container_inner}`}>
          <span className={`${styles.otpverify_close}`} onClick={closeModal}>
            <img alt="close" src={`${appConfig.cloudpath}/images/lan-popup-close.png`}></img>
          </span>
          <p className={`${styles.title}`}>Enter One Time Passcode</p>
          <p className={`${styles.subtitle}`}>{verifydata.message}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              <div className={`${styles.input_container}`}>
                <input
                  className={`${styles.input}`}
                  placeholder="OTP"
                  {...register("otp", { required: "OTP required" })}
                  type="number"
                />
                {formState.errors.otp && (
                  <p className={`${styles.input_error_msg}`}>
                    {formState.errors.otp?.message}
                  </p>
                )}
                {otpText === "Resend OTP" && (
                  <p className={`${styles.resend}`} onClick={handleResend}>
                    resend otp
                  </p>
                )}
                {otpText !== "Resend OTP" && (
                  <p className={`${styles.resend} ${styles.timer}`}>
                    {otpText}
                  </p>
                )}
              </div>
            </label>

            <label>
              <div
                className={`${styles.input_container} ${styles.submit_input_container}`}
              >
                <input
                  type="submit"
                  className={`${styles.verify_btn}`}
                  value="Verify"
                />
                {errormsg && (
                  <p className={`${styles.input_error_msg}`}>{errormsg}</p>
                )}

                {successmsg && (
                  <p className={`${styles.input_success_msg}`}>{successmsg}</p>
                )}
              </div>
            </label>

            {verifydata.email && (verifydata.context === "signin" || verifydata.context === "signup") && (
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
