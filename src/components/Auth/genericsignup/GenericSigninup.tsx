import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Genericsignup.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import appConfig from "@/app.config";
import { SingnupFormType } from "./genericsignuptypes";
import { DateInput, RadioInput } from "./Signupinput";
import SocialLogins from "@/components/socialLogins/socialLogins";
import Link from "next/link";
import { getData, postData } from "@/services/data.manager";
import { useRouter } from "next/router";
import {
  setActivepackages,
  setActiveprofile,
  setLoggedin,
} from "@/redux/feature/userSlice/userSlice";
import { createPortal } from "react-dom";
import OtpVerify from "@/components/otpverify/OtpVerify";
import { OtpVerifydataType } from "@/components/otpverify/otpverifytypes";
import { default as clientCookie } from "js-cookie";
import { ModalType } from "@/components/modals/modaltypes";
import Modal from "@/components/modals/Modal";
import { DevTool } from "@hookform/devtools";
import GenericInput from "@/components/shared/GenericInput/GenericInput";

const GenericSignup: FC = () => {
  const { sociallogin, userfields, encryptApisList, userprofiles } =
    useAppSelector((state) => state.configs.systemFeatures);

  const { systemConfigs } = useAppSelector((state) => state.configs);
  let showPackages = systemConfigs?.configs?.showPackages || "";

  const { control, setValue, handleSubmit } = useForm<SingnupFormType>({
    mode: "onChange",
  });

  const [errormsg, setErrormsg] = useState<string>("");
  const [showModal, setShowModal] = useState<ModalType>("");
  const [otpprops, setOtpprops] = useState<OtpVerifydataType>({
    verification: "",
  });
  const errormsgToken = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      clearTimeout(errormsgToken.current);
    };
  }, []);

  const handleDate = useCallback((date: Date) => {
    setValue("dob", date?.toString() || "", {
      shouldDirty: false,
    });
  }, []);

  const onSubmit: SubmitHandler<SingnupFormType> = async (formData) => {
    const { mobile, firstName, lastName, email, password, dob, gender } =
      formData;
    let apiPayload: any = {
      // eslint-disable-next-line camelcase
      additional_params: {},
      // eslint-disable-next-line camelcase
      app_version: "",
      // eslint-disable-next-line camelcase
      is_header_enrichment: false,
      cookie: "",
      manufacturer: "123",
      // eslint-disable-next-line camelcase
      os_version: "",
      // eslint-disable-next-line camelcase
      referral_id: "",
      // eslint-disable-next-line camelcase
      referral_type: "",
      email: email,
      mobile: `91-${mobile}`,
      password: password,
    };
    if (firstName) {
      apiPayload["first_name"] = firstName;
    }
    if (lastName) {
      apiPayload["last_name"] = lastName;
    }
    if (dob) {
      apiPayload["additional_params"] = {
        ...apiPayload.additional_params,
        dob: `${new Date(dob).getTime()}`,
      };
    }
    if (gender) {
      let genderValue =
        gender === "male" ? "M" : gender === "female" ? "F" : "O";
      apiPayload["additional_params"] = {
        ...apiPayload.additional_params,
        gender: genderValue,
      };
    }
    if (encryptApisList?.fields?.signup === "true") {
      // eslint-disable-next-line camelcase
      apiPayload.is_header_enrichment = true;
    }
    signup(apiPayload);
  };

  const signup = async (payload: unknown) => {
    let signupresponse = await postData(
      "/service/api/auth/signup/validate",
      payload,
    );

    if (signupresponse.status === false) {
      if (signupresponse.error && signupresponse.error.message) {
        setErrormsg(signupresponse.error.message);
        errormsgToken.current = setTimeout(() => {
          setErrormsg("");
        }, 2000);
      }
    } else if (signupresponse.status === true) {
      if (signupresponse.response.actionCode === 1) {
        // user not register until OTP verification for mobile
        let mobile = signupresponse.response.details.mobile || "";
        let referenceKey = signupresponse.response.details.referenceKey || "";
        setShowModal("otpverify");
        setOtpprops({
          context: "signup",
          // eslint-disable-next-line camelcase
          reference_key: referenceKey,
          message: `One Time Passcode (OTP) has been sent to your email ******${mobile.substring(5)}`,
          verification: "email",
          mobile,
        });
      } else if (signupresponse.response.actionCode === 3) {
        // user will register but OTP is not verified for email
        document.body.style.overflowY = "hidden";
        let email = signupresponse.response.details.email || "";
        let referenceKey = signupresponse.response.details.referenceKey || "";
        setShowModal("otpverify");
        setOtpprops({
          context: "signup",
          // eslint-disable-next-line camelcase
          reference_key: referenceKey,
          message: `One Time Passcode (OTP) has been sent to your email ${email.slice(0, 5)}******${email.substring(8)}`,
          verification: "email",
          email,
        });
      } else if (signupresponse.response.actionCode === 17) {
        // to handle token already registered to some other user
      } else {
        await setuserLoggedin();
      }
    }
  };

  const setuserLoggedin = async () => {
    localStorage.setItem("isLoggedin", "true");
    clientCookie.set("isLoggedin", "true");
    if (showPackages === "true") {
      const userPackages = await getData(
        "service/api/auth/user/activepackages",
      );
      if (userPackages.status === true) {
        localStorage.setItem(
          "activePackages",
          JSON.stringify(userPackages.response),
        );
        dispatch(setActivepackages());
      }
    }
    const userInfo = await getData("/service/api/auth/user/info");
    if (userInfo.status === true) {
      localStorage.setItem("userDetails", JSON.stringify(userInfo.response));
      dispatch(setLoggedin());
      if (userprofiles?.fields?.is_userprofiles_supported === "true") {
        clientCookie.set("hasuserprofiles", "true");
        router.replace("/profiles/select-user-profile");
      } else {
        localStorage.setItem("userDetails", JSON.stringify(userInfo.response));
        localStorage.setItem(
          "activeProfile",
          JSON.stringify(userInfo.response),
        );
        dispatch(setActiveprofile());
        router.replace("/");
      }
    }
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from } = Modaldata;
    switch (from) {
      case "otpverify":
        setuserLoggedin();
        break;
      default:
        break;
    }
  }

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  const handleclickSignin = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    router.replace("/signin");
  };

  return (
    <>
      <div className={`${styles.signup_container}`}>
        <div className={`${styles.logo}`}>
          <img src={`${appConfig.headerIconpath}`} alt="logo" />
        </div>
        <div className={`${styles.signup_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>Create Your Account</p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {appConfig.signup.firstName && (
                <GenericInput
                  control={control}
                  rules={{
                    required: "This is required",
                  }}
                  name="firstName"
                  shouldUnregister={true}
                  defaultValue=""
                  type="text"
                  placeholder="First Name"
                />
              )}

              {appConfig.signup.lastName && (
                <GenericInput
                  control={control}
                  rules={{
                    required: "This is required",
                  }}
                  name="lastName"
                  shouldUnregister={true}
                  defaultValue=""
                  type="text"
                  placeholder="Last Name"
                />
              )}

              <GenericInput
                control={control}
                rules={{
                  required: "Email id required",
                  validate: (value, _formvalues) => {
                    if (!appConfig.authEmailPattern.test(value)) {
                      return "Enter a valid email address";
                    }
                  },
                }}
                name="email"
                shouldUnregister={true}
                defaultValue=""
                type="text"
                placeholder="Email Address"
              />

              <GenericInput
                control={control}
                rules={{
                  required: "Mobile Number Required",
                  validate: (value, _formvalues) => {
                    if (!appConfig.authMobilePattern.test(value)) {
                      return "Invalid Mobile Number";
                    }
                  },
                }}
                name="mobile"
                shouldUnregister={true}
                showCountrycode={true}
                defaultValue=""
                type="text"
                placeholder="Mobile Number"
              />

              <GenericInput
                control={control}
                rules={{
                  required: "This is required",
                  validate: (value, _formvalues) => {
                    if (value.length < 4 || value.length > 15) {
                      return "Password length should be 4-15 Charecters";
                    }
                  },
                }}
                name="password"
                shouldUnregister={true}
                defaultValue=""
                type="text"
                placeholder="Password"
              />

              {appConfig.signup.confirmPassword && (
                <GenericInput
                  control={control}
                  rules={{
                    required: "This is required",
                    validate: (value, formvalues) => {
                      if (formvalues.password !== value) {
                        return "Passwords are mismatched";
                      }
                      if (value.length < 4 || value.length > 15) {
                        return "Password length should be 4-15 Charecters";
                      }
                    },
                  }}
                  name="confirmpassword"
                  shouldUnregister={true}
                  defaultValue=""
                  type="text"
                  placeholder="Confirm Password"
                />
              )}

              {appConfig.signup.age && userfields?.fields?.age === "1" && (
                <div
                  className={`${styles.input_container} ${styles.dob_input_container}`}
                >
                  <DateInput
                    control={control}
                    name="dob"
                    handleDate={handleDate}
                  />
                </div>
              )}

              {appConfig.signup.gender &&
                userfields?.fields?.gender === "1" && (
                  <div className={`${styles.radio_inputs}`}>
                    <span className={`${styles.label}`}>Gender:</span>
                    <RadioInput
                      control={control}
                      name="gender"
                      defaultValue="male"
                    />
                    <RadioInput
                      control={control}
                      name="gender"
                      defaultValue="female"
                    />
                    <RadioInput
                      control={control}
                      name="gender"
                      defaultValue="others"
                    />
                  </div>
                )}

              <label>
                <div
                  className={`${styles.input_container} ${styles.submit_input_container}`}
                >
                  <input
                    type="submit"
                    className={`${styles.signup_btn}`}
                    value="Sign Up"
                  />
                  {errormsg && (
                    <p className={`${styles.input_error_msg}`}>{errormsg}</p>
                  )}
                </div>
              </label>
            </form>
          </div>
          <div className={`${styles.inner_bottom}`}>
            {Object.keys(sociallogin?.fields || {}).length > 0 && (
              <>
                <div className={`${styles.or_div}`}>
                  <hr />
                  <span className={`${styles.or_text}`}>OR</span>
                </div>
                <SocialLogins />
              </>
            )}

            <p className={`${styles.terms_policy}`}>
              By Signing Up, you agree to {appConfig.endPoints.product}
              <Link className={`${styles.terms}`} href="#">
                {" "}
                Terms and Conditions
              </Link>
            </p>

            <p className={`${styles.signin_text}`}>
              Have an account?
              <Link
                className={`${styles.signin}`}
                href="/signin"
                onClick={handleclickSignin}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal: ModalType) => {
              function getModal() {
                switch (modal) {
                  case "otpverify":
                    return (
                      <OtpVerify
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        verifydata={otpprops}
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
      <DevTool control={control} />
    </>
  );
};

export default GenericSignup;
