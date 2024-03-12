import { subprofileInterface } from "@/shared";
import styles from "./Getotp.module.scss";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { postData, postFormData } from "@/services/data.manager";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ModalType } from "../modals/modaltypes";
import { getAbsolutPath } from "@/utils";
import { useRouter } from "next/router";
import { enableRestrictionpage } from "@/redux/feature/restrictionSlice/restrictionSlice";
import { getotpModalType } from "./getotptypes";
import appConfig from "@/app.config";

interface getotpModalpropsInterface {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType; data: any }) => void;
  profileData?: subprofileInterface;
  type: getotpModalType;
  isPasswordOtp: boolean;
}

let Getotpheadings = {
  "Viewing Restrictions": {
    default: {
      heading1: "Get OTP To edit Viewing Restrictions",
      heading2:
        "Get OTP to edit profile Maturity Rating and Title Restrictions for xxx's Profile",
    },
    inputenable: {
      heading1: "Viewing Restrictions",
      heading2:
        "Enter OTP to edit profile Maturity Rating and Title Restrictions for xxx’s Profile",
    },
  },
  "Profile & Video Lock": {
    default: {
      heading1: "Get OTP To edit Profile Lock",
      heading2: "Get OTP to edit profile lock xxx’s Profile",
    },
    inputenable: {
      heading1: "Profile Lock",
      heading2: "Enter OTP to edit profile lock xxx’s Profile",
    },
  },
};

interface otpForm {
  otp: string;
}

function Getotp(props: getotpModalpropsInterface) {
  const { closeModal, profileData, type, isPasswordOtp = false } = props;
  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";

  const [toggleInput, setToggleInput] = useState<boolean>(isPasswordOtp);
  // const [optInputtype,setOtpInputtype] = useState<"text" | "password">("password")
  const [showhideText, setShowHideText] = useState<"SHOW" | "HIDE">("SHOW");
  const [successText, setSuccessText] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const otpRef = useRef<HTMLInputElement | null>(null);
  const errortexttimer = useRef<ReturnType<typeof setTimeout>>();
  const { register, formState, handleSubmit } = useForm<otpForm>({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const { ref, ...rest } = register("otp", {
    required: true,
    maxLength: 8,
    minLength: 4,
  });

  const { userDetails } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { push } = useRouter();

  useEffect(() => {
    if (otpRef.current) {
      otpRef.current.focus();
    }
  }, []);

  const getOtp = () => {
    let payload = {
      context: "user_profiles",
      mobile: userDetails?.phoneNumber || "",
    };
    postData("service/api/auth/get/otp", payload).then((data) => {
      if (data.status === true) {
        setSuccessText("OTP sent to your Registered mobile number");
      }
    });
  };

  const onSubmit: SubmitHandler<otpForm> = async (data) => {
    console.log("hello");
    let formdata = new FormData();
    if (isPasswordOtp) {
      formdata.append("context", "userprofiles");
      formdata.append("password", data.otp);
    } else {
      formdata.append("context", "user_profiles");
      formdata.append("otp", data.otp);
      formdata.append("mobile", userDetails?.phoneNumber || "");
    }

    let otpvalidresponse = await postFormData(
      "/service/api/auth/user/authentication",
      formdata,
    );

    if (otpvalidresponse.status === false) {
      if (otpvalidresponse.error?.message) {
        setSuccessText("");
        setErrorText(otpvalidresponse.error?.message || "");
        errortexttimer.current = setTimeout(() => {
          setErrorText("");
        }, 1000);
      }
    } else {
      if (type === "Viewing Restrictions") {
        closeModal();
        dispatch(
          enableRestrictionpage({ token: otpvalidresponse.response.token }),
        );
        push(`/profiles/view-restrictions/${profileData?.profileId}`);
      } else if (type === "Profile & Video Lock") {
        closeModal();
        dispatch(
          enableRestrictionpage({ token: otpvalidresponse.response.token }),
        );
        push(`/profiles/profile-lock/${profileData?.profileId}`);
      }
    }
  };

  return (
    <div className={`${styles.get_otp_container}`}>
      <div className={`${styles.get_otp_container_inner}`}>
        <span className={`${styles.get_otp_close}`} onClick={closeModal}>
          <img
            alt="close"
            src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
          ></img>
        </span>
        <div className={`${styles.get_otp_header}`}>
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
          <div className={`${styles.get_otp_body}`}>
            {!toggleInput && (
              <>
                {" "}
                <p className={`${styles.heading}`}>
                  {type && Getotpheadings[type].default.heading1}
                </p>
                <p className={`${styles.sub_heading}`}>
                  {type &&
                    Getotpheadings[type].default.heading2.replace(
                      "xxx",
                      profileData?.name || "xxx",
                    )}
                </p>
              </>
            )}
            {toggleInput && (
              <>
                <p className={`${styles.heading}`}>
                  {type && Getotpheadings[type].inputenable.heading1}
                </p>
                <p className={`${styles.sub_heading}`}>
                  {type &&
                    Getotpheadings[type].inputenable.heading2
                      .replace("xxx", profileData?.name || "xxx")
                      .replace("OTP", isPasswordOtp ? "your password" : "OTP")}
                </p>

                <div className={`${styles.otp_input_container}`}>
                  <input
                    type="password"
                    {...rest}
                    ref={(e) => {
                      ref(e);
                      otpRef.current = e;
                    }}
                    className={`${styles.otp_input}`}
                    placeholder={isPasswordOtp ? "Password" : "OTP"}
                  />
                  <span
                    className={`${styles.otp_input_toggel}`}
                    onClick={() => {
                      if (otpRef.current && otpRef.current.type === "text") {
                        otpRef.current.type = "password";
                        setShowHideText("SHOW");
                      } else if (
                        otpRef.current &&
                        otpRef.current.type === "password"
                      ) {
                        otpRef.current.type = "text";
                        setShowHideText("HIDE");
                      }
                    }}
                  >
                    {showhideText}
                  </span>
                  {formState.errors.otp?.type === "required" && (
                    <span className={`${styles.otp_msg} ${styles.error}`}>
                      {isPasswordOtp ? "Password" : "OTP"} required
                    </span>
                  )}
                  {formState.errors.otp?.type === "minLength" && (
                    <span className={`${styles.otp_msg} ${styles.error}`}>
                      {isPasswordOtp ? "Password" : "OTP"} isn't long enough
                    </span>
                  )}
                  {formState.errors.otp?.type === "maxLength" && (
                    <span className={`${styles.otp_msg} ${styles.error}`}>
                      {isPasswordOtp ? "Password" : "OTP"} is long
                    </span>
                  )}
                </div>
                {successText && (
                  <span className={`${styles.otp_msg} ${styles.success}`}>
                    {successText}
                  </span>
                )}
                {errorText && (
                  <span className={`${styles.otp_msg} ${styles.failmsg}`}>
                    {errorText}
                  </span>
                )}
              </>
            )}
          </div>
          <div className={`${styles.get_otp_footer}`}>
            <div className={`${styles.get_otp_footer_btns}`}>
              <button
                className={`${styles.btn}`}
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              {!toggleInput && (
                <button
                  className={`${styles.btn}`}
                  onClick={() => {
                    setToggleInput(!toggleInput);
                    getOtp();
                  }}
                  type="button"
                >
                  Get Otp
                </button>
              )}
              {toggleInput && (
                <button className={`${styles.btn}`} type="submit">
                  Continue
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Getotp;
