import { subprofileInterface } from "@/shared";
import styles from "./Getotp.module.scss";
import getConfig from "next/config";
import { FormEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { postData, postFormData } from "@/services/data.manager";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ModalType } from "../modals/modaltypes";
import { getAbsolutPath } from "@/utils";
import { useRouter } from "next/router";
import { enableRestrictionpage } from "@/redux/feature/restrictionSlice/restrictionSlice";
import { getotpModalType } from './getotptypes'
// import { default as clientCookie } from "js-cookie";

let appConfig = getConfig().publicRuntimeConfig.appconfig;

interface getotpModalpropsInterface {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType; data: any }) => void;
  profileData?: subprofileInterface;
  type : getotpModalType;
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

interface otpForm{
  otp:string
}

function Getotp(props: getotpModalpropsInterface) {
  const { closeModal, profileData, type } = props;
  const default_profile_img =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";

  const [toggleInput, setToggleInput] = useState<boolean>(false);
  // const [optInputtype,setOtpInputtype] = useState<"text" | "password">("password")
  const [showhideText, setShowHideText] = useState<"SHOW" | "HIDE">("SHOW");
  const [successText, setSuccessText] = useState<string>("");
  const [errorText,setErrorText] = useState<string>("")
  const otpRef = useRef<HTMLInputElement | null>(null)
  const error_text_timer = useRef<ReturnType<typeof setTimeout>>()
  const { register, formState ,getValues} = useForm<otpForm>({
    mode: "onChange",
    defaultValues: {
      otp: "",
    }
  });

  const { ref, ...rest } = register("otp", { required: true, maxLength: 4, minLength: 4 })

  const { userDetails } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const {push} = useRouter()


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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    //context=user_profiles&otp=4441&mobile=91-7780715079
    let form_data = new FormData()
    form_data.append("context","user_profiles")
    form_data.append("otp",getValues().otp)
    form_data.append("mobile", userDetails?.phoneNumber || "")

    let otp_valid_response = await postFormData("/service/api/auth/user/authentication",form_data)

    if(otp_valid_response.status === false){
      if(otp_valid_response.error?.code === -41){
        setSuccessText("")
        setErrorText(otp_valid_response.error?.message || "")
        error_text_timer.current = setTimeout(()=>{
          setErrorText("")
        },1000)
      }
    }
    else{
      if(type === 'Viewing Restrictions'){
        closeModal()
        dispatch(enableRestrictionpage())
        push(`/profiles/view-restrictions/${profileData?.profileId}`)
      }
    }

  }

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
                  : default_profile_img
              }`}
              alt=""
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
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
                      profileData?.name || "xxx"
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
                    Getotpheadings[type].inputenable.heading2.replace(
                      "xxx",
                      profileData?.name || "xxx"
                    )}
                </p>

                <div className={`${styles.otp_input_container}`}>
                  <input
                    type="password"
                    {...rest}
                    ref={(e)=>{
                      ref(e)
                      otpRef.current = e
                    }}
                    className={`${styles.otp_input}`}
                    placeholder="OTP"
                  />
                  <span
                    className={`${styles.otp_input_toggel}`}
                    onClick={() => {
                      if (otpRef.current && otpRef.current.type === 'text') {
                        otpRef.current.type = 'password';
                        setShowHideText('SHOW');
                      } else if (
                        otpRef.current &&
                        otpRef.current.type === 'password'
                      ) {
                        otpRef.current.type = 'text';
                        setShowHideText('HIDE');
                      }
                    }}
                  >
                    {showhideText}
                  </span>
                  {formState.errors.otp?.type === "required" && (
                    <span className={`${styles.otp_msg} ${styles.error}`}>
                      OTP required
                    </span>
                  )}
                  {formState.errors.otp?.type === "minLength" && (
                    <span className={`${styles.otp_msg} ${styles.error}`}>
                      OTP isn't long enough
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
              <button className={`${styles.btn}`} onClick={closeModal}>
                Cancel
              </button>
              {!toggleInput && (
                <button
                  className={`${styles.btn}`}
                  onClick={() => {
                    setToggleInput(!toggleInput);
                    getOtp();
                  }}
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
