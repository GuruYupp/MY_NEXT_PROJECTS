import React, { FC, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ForgotPasswordFormType,
  verifyOTPPropsInterface,
} from "../forgotpasswordtype";
import { useAppSelector } from "@/redux/hooks";
import styles from "../ForgotPassword.module.scss";
import ForgotPasswordInput from "../ForgotPasswordInput";
import appConfig from "@/app.config";
import Link from "next/link";
import { postData } from "@/services/data.manager";
import Modal from "@/components/modals/Modal";
import { createPortal } from "react-dom";
import GenericModal from "@/components/Genericmodal/GenericModal";
import { ModalType } from "@/components/modals/modaltypes";
import { dispayInterface as GenericModaldispayInterface } from "@/components/Genericmodal/genericmodaltype";
import Toast from "@/components/toasts/Toast";

const VerifyForm: FC<verifyOTPPropsInterface> = (props) => {
  const { formType, handleFormType } = props;
  const { control, handleSubmit } = useForm<ForgotPasswordFormType>({
    mode: "onChange",
  });
  const { otpauthentication } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );

  const [errormsg, setErrormsg] = useState<string>("");
  const errormsgtimer = useRef<ReturnType<typeof setTimeout>>();
  const [verifyField, setVerifyField] = useState<"email" | "mobile" | "">(
    otpauthentication?.fields?.forgot_password_identifier_type || "",
  );
  const [otpText, setOtpText] = useState<string>("");
  const [referenceId, setReferenceId] = useState<string>("");
  const [showModal, setShowModal] = useState<ModalType>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastmsg, setToastMsg] = useState<string>("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const otpTimer = useRef<{
    resendTime: number;
    timerId: ReturnType<typeof setInterval> | undefined;
  }>({ timerId: undefined, resendTime: 0 });

  const [genericPopUpdata, setGenericPopUpdata] =
    useState<GenericModaldispayInterface>({});

  useEffect(() => {
    return () => {
      clearAlltimers();
    };
  }, []);

  const clearAlltimers = () => {
    if (otpTimer.current.timerId) {
      clearTimeout(otpTimer.current.timerId);
    }
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    if (errormsgtimer.current) {
      clearTimeout(errormsgtimer.current);
    }
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = async (formData) => {
    if (!verifyField) return;
    const { email, number, otp, newpassword } = formData;
    if (formType === "verify") {
      let data = {
        Platform: "web",
        Source: "home",
        context: "update_password",
      };
      let payload = {};
      if (verifyField === "email") {
        payload = { ...data, email };
      }
      if (verifyField === "mobile") {
        payload = { ...data, mobile: number };
      }
      await sendOtp(payload);
    } else if (formType === "otpscreen") {
      let data = { otp: Number(otp), email, context: "update_password" };
      await verifyOtp(data);
    } else if (formType === "resetpassword") {
      let data = { otp: Number(otp), email, password: newpassword };
      await updatePassword(data);
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

  const showErrorMsg = (msg: string) => {
    setErrormsg(msg);
    errormsgtimer.current = setTimeout(() => {
      setErrormsg("");
    }, 1000);
  };

  const sendOtp = async (payload: any) => {
    let otpvalidresponse = await postData("/service/api/auth/get/otp", payload);
    if (otpvalidresponse.status === false) {
      if (otpvalidresponse.error?.message) {
        showErrorMsg(otpvalidresponse.error?.message || "");
      }
    } else {
      if (
        otpvalidresponse.response.showOTPScreen === true &&
        otpauthentication?.fields?.update_password_show_otp_screen === "true"
      ) {
        setToastMsg(otpvalidresponse.response.message);
        setShowToast(true);
        toastTimer.current = setTimeout(() => {
          setToastMsg("");
          setShowToast(false);
        }, 5000);
        handleFormType("otpscreen");
        otpTimer.current.resendTime = otpvalidresponse.response.resendTime;
        startResendTimer();
        setReferenceId(otpvalidresponse.response.referenceId || "");
      } else {
        handleshowModal("genericmodal");
        setGenericPopUpdata({
          title: otpvalidresponse.response.message || "",
          yesbuttonText: "Okay",
        });
      }
    }
  };

  const reSendOtp = async () => {
    let postPayload = {
      // eslint-disable-next-line camelcase
      reference_id: referenceId,
    };
    const resendotpResponse = await postData(
      "/service/api/auth/resend/otp",
      postPayload,
    );
    if (resendotpResponse.status === true) {
      otpTimer.current.resendTime = resendotpResponse.response.resendTime;
      startResendTimer();
      setReferenceId(resendotpResponse.response.referenceId || "");
    } else {
      if (resendotpResponse.error?.message) {
        showErrorMsg(resendotpResponse.error?.message || "");
      }
    }
  };

  const verifyOtp = async (payload: unknown) => {
    const verifyotpResponse = await postData(
      "/service/api/auth/verify/otp",
      payload,
    );
    if (verifyotpResponse.status === true) {
      handleFormType("resetpassword");
    }
  };

  const updatePassword = async (payload: unknown) => {
    const updatepasswordResponse = await postData(
      "/service/api/auth/update/password",
      payload,
    );
    if (updatepasswordResponse.status === true) {
    } else {
      showErrorMsg(updatepasswordResponse.error?.message || "");
    }
  };

  const handleResend = () => {
    if (!otpTimer.current.timerId) reSendOtp();
  };

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  const handleshowModal = (modal: ModalType) => {
    document.body.style.overflowY = "hidden";
    setShowModal(modal);
  };

  const handleChangeEmail = () => {
    handleFormType("verify");
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "genericmodal":
        handlecloseModal();
        break;
      default:
        break;
    }
  }

  const getSubmitbtnText = () => {
    return formType === "verify"
      ? "Get OTP"
      : formType === "otpscreen"
        ? "verify"
        : "Reset";
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {verifyField === "email" && formType == "verify" && (
          <ForgotPasswordInput
            name="email"
            control={control}
            rules={{
              required: "Email Required",
              validate: (value, _formvalues) => {
                if (!appConfig.authEmailPattern.test(value)) {
                  return "Invalid Email";
                }
              },
            }}
          />
        )}
        {verifyField === "mobile" && formType === "verify" && (
          <ForgotPasswordInput
            name="number"
            control={control}
            rules={{
              required: "Mobile Number Required",
              validate: (value, _formvalues) => {
                if (!appConfig.authMobilePattern.test(value)) {
                  return "Invalid Mobile Number";
                }
              },
            }}
          />
        )}
        {formType === "otpscreen" && (
          <div className={`${styles.input_wrapper}`}>
            <ForgotPasswordInput
              name="otp"
              control={control}
              rules={{ required: "Otp Required" }}
            />
            {otpText && (
              <span
                className={`${styles.resendCode} ${otpText !== "Resend OTP" ? styles.disabled : ""}`}
                onClick={handleResend}
              >
                {otpText}
              </span>
            )}
          </div>
        )}
        {formType === "resetpassword" && (
          <>
            <ForgotPasswordInput
              name="newpassword"
              control={control}
              rules={{
                required: "newpassword Required",
              }}
            />
            <ForgotPasswordInput
              name="confirmpassword"
              control={control}
              rules={{
                required: "This is required",
                validate: (value, formvalues) => {
                  if (formvalues.newpassword !== value) {
                    return "Passwords are mismatched";
                  }
                  if (value.length < 4 || value.length > 15) {
                    return "Password length should be 4-15 Charecters";
                  }
                },
              }}
            />
          </>
        )}
        <label>
          <div
            className={`${styles.input_container} ${styles.submit_input_container}`}
          >
            <input
              type="submit"
              className={`${styles.submit_btn}`}
              value={getSubmitbtnText()}
            />

            {errormsg && (
              <p className={`${styles.input_error_msg}`}>{errormsg}</p>
            )}
          </div>
        </label>
        {formType === "verify" && (
          <p className={`${styles.goBackText}`}>
            <Link href={`/signin`}>Back to Sign In</Link>
          </p>
        )}
        {formType === "otpscreen" && (
          <p
            className={`${styles.goBackText} ${styles.change_email}`}
            onClick={handleChangeEmail}
          >
            Change Email Id
          </p>
        )}
      </form>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              switch (modal) {
                case "genericmodal":
                  return (
                    <GenericModal
                      closeModal={handlecloseModal}
                      sendDatatoComponent={getDataFromModal}
                      displayData={genericPopUpdata}
                    />
                  );
              }
            }}
          />,
          document.body,
        )}
      {showToast && createPortal(<Toast message={toastmsg} />, document.body)}
    </>
  );
};

export default VerifyForm;
