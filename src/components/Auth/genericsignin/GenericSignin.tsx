import { FC, useEffect, useRef, useState } from "react";
import styles from "./Genericsignin.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import appConfig from "@/app.config";
import { SingnInFormType } from "./genericsignintypes";
import SocialLogins from "@/components/socialLogins/socialLogins";
import Link from "next/link";
import { getData, postData } from "@/services/data.manager";
import {
  setActivepackages,
  setActiveprofile,
  setLoggedin,
} from "@/redux/feature/userSlice/userSlice";
import { useRouter } from "next/router";
import { ModalType } from "@/components/modals/modaltypes";
import { OtpVerifydataType } from "@/components/otpverify/otpverifytypes";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import OtpVerify from "@/components/otpverify/OtpVerify";
import { default as clientCookie } from "js-cookie";
import GenericInput from "@/components/shared/GenericInput/GenericInput";

const GenericSignIn: FC = () => {
  const { globalsettings, sociallogin, userprofiles } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );

  const { systemConfigs } = useAppSelector((state) => state.configs);
  const { isLoggedin } = useAppSelector((state) => state.user);
  let showPackages = systemConfigs?.configs?.showPackages || "";
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { control, handleSubmit } = useForm<SingnInFormType>({
    mode: "onChange",
  });

  const [errormsg, setErrormsg] = useState<string>("");
  const errormsgToken = useRef<ReturnType<typeof setTimeout>>();
  const [showModal, setShowModal] = useState<ModalType>("");
  const [otpprops, setOtpprops] = useState<OtpVerifydataType>({
    verification: "",
  });

  useEffect(() => {
    if (isLoggedin) {
      router.back();
      return;
    }
    return () => {
      clearTimeout(errormsgToken.current);
    };
  }, []);

  const getInitialLoginType = () => {
    if (
      globalsettings?.fields?.isEmailSupported === "true" &&
      appConfig.signin.primary == "email"
    ) {
      // return "mobile";
      return "email";
    }
    if (
      globalsettings?.fields?.isMobileSupported === "true" &&
      appConfig.signin.primary == "mobile"
    ) {
      return "mobile";
    }
    return "email";
  };

  const [loginType, setLogintype] = useState<"email" | "mobile">(
    getInitialLoginType(),
  );

  const toggelEmailNumberInput = () => {
    setLogintype(loginType === "email" ? "mobile" : "email");
  };

  const handleclickSignup = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    router.replace("/signup");
  };

  const onSubmit: SubmitHandler<SingnInFormType> = async (formData) => {
    const { email, number, password } = formData;
    let payload = {
      // eslint-disable-next-line camelcase
      login_key: password,
      // eslint-disable-next-line camelcase
      login_mode: 1,
      manufacturer: "123",
      // eslint-disable-next-line camelcase
      login_id: "",
    };
    if (loginType === "email") {
      // eslint-disable-next-line camelcase
      payload.login_id = email;
    } else {
      // eslint-disable-next-line camelcase
      payload.login_id = `91-${number}`;
    }
    signIn(payload);
  };

  // eslint-disable-next-line camelcase
  const signIn = async (post_data: any) => {
    let signInresponse = await postData(
      "/service/api/auth/v1/signin",
      post_data,
    );
    if (signInresponse.status === false) {
      if (
        signInresponse.error?.code === -6 &&
        signInresponse.error.actionCode === 1
      ) {
        // user will register but OTP is not verified for email
        document.body.style.overflowY = "hidden";
        let identifier = signInresponse.error.details.identifier || "";
        setShowModal("otpverify");
        setOtpprops({
          context: "signin",
          message: `One Time Passcode (OTP) has been sent to your mobile ******${identifier.substring(7)}`,
          verification: "mobile",
          number: identifier,
        });
      } else if (signInresponse.error && signInresponse.error.message) {
        setErrormsg(signInresponse.error.message);
        errormsgToken.current = setTimeout(() => {
          setErrormsg("");
        }, 1000);
      }
    } else if (signInresponse.status === true) {
      setuserLoggedin();
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
    let { from, data } = Modaldata;
    switch (from) {
      case "otpverify":
        if (data.status == true) {
          setuserLoggedin();
        }
        break;
      default:
        break;
    }
  }

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  return (
    <>
      <div className={`${styles.signin_container}`}>
        <div className={`${styles.logo}`}>
          <img src={`${appConfig.headerIconpath}`} alt="logo" />
        </div>
        <div className={`${styles.signin_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>Sign in to your Account</p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {loginType === "mobile" && (
                <GenericInput
                  control={control}
                  type="text"
                  name="mobile"
                  shouldUnregister={true}
                  rules={{
                    required: "Mobile Number Required",
                    validate: (value, _formvalues) => {
                      if (!appConfig.authMobilePattern.test(value)) {
                        return "Invalid Mobile Number";
                      }
                    },
                  }}
                  showCountrycode={true}
                  placeholder="Mobile Number"
                />
              )}
              {loginType === "email" && (
                <GenericInput
                  control={control}
                  type="email"
                  name="email"
                  shouldUnregister={true}
                  rules={{
                    required: "This is required",
                    validate: (value, _formvalues) => {
                      if (!appConfig.authEmailPattern.test(value)) {
                        return "Enter a valid email address";
                      }
                    },
                  }}
                  placeholder="Email Address"
                />
              )}
              <div className={`${styles.input_wrapper}`}>
                <GenericInput
                  control={control}
                  type="password"
                  name="password"
                  shouldUnregister={true}
                  rules={{
                    required: "This is required",
                    validate: (value, _formvalues) => {
                      if (value.length < 4 || value.length > 15) {
                        return "Password length should be 4-15 Charecters";
                      }
                    },
                  }}
                  placeholder="Password"
                />
                <p className={`${styles.forgot_password}`}>
                  <Link href={`/forgot-password`}>forgot password?</Link>
                </p>
              </div>

              <GenericInput
                control={control}
                type="submit"
                name="submit"
                shouldUnregister={true}
                defaultValue="Sign in"
              />
            </form>

            <div className={`${styles.or_div}`}>
              <hr />
              <span className={`${styles.or_text}`}>OR</span>
            </div>
          </div>
          <div className={`${styles.inner_bottom}`}>
            {appConfig.signin.emailPhoneToggle === true &&
              globalsettings?.fields?.isMobileSupported === "true" &&
              globalsettings?.fields?.isEmailSupported === "true" && (
                <button
                  className={`${styles.email_number_toggle}`}
                  onClick={toggelEmailNumberInput}
                >
                  Sign In with{" "}
                  {loginType == "mobile" ? "Email Id" : "Mobile Number"}
                </button>
              )}

            {Object.keys(sociallogin?.fields || {}).length > 0 && (
              <>
                <div className={`${styles.or_div}`}>
                  <hr />
                  <span className={`${styles.or_text}`}>OR</span>
                </div>
                <SocialLogins />
              </>
            )}

            <p className={`${styles.signup_text}`}>
              Don't have an account ?
              <Link
                className={`${styles.signup}`}
                href="/signup"
                onClick={handleclickSignup}
              >
                Sign Up
              </Link>
            </p>

            <p className={`${styles.terms_policy}`}>
              <Link className={`${styles.terms}`} href="#">
                Terms of Service
              </Link>
              and
              <Link className={`${styles.policy}`} href="#">
                Privacy Policy
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

export default GenericSignIn;
