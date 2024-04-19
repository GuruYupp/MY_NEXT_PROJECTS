import styles from "./signin.module.scss";
import { useForm } from "react-hook-form";
import { default as clientCookie } from "js-cookie";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState, KeyboardEvent, useRef, FormEvent } from "react";
import { getData, postData } from "@/services/data.manager";
import { createPortal } from "react-dom";
import Toast from "@/components/toasts/Toast";
import {
  setActivepackages,
  setActiveprofile,
  setLoggedin,
} from "@/redux/feature/userSlice/userSlice";
import appConfig from "@/app.config";
import { getsystemConfigs, getsystemFeature } from "@/clientapis";

type IFormInput = {
  termsText: boolean;
  promotionText: boolean;
  otp: string;
  mobileNumber: string;
};

// interface countryCodesInterface {
//   code: string;
//   iconUrl: string;
//   isdCode: string;
//   name: string;
// }

type otptimerType = {
  resendTime: number;
  timerId: ReturnType<typeof setInterval> | undefined;
};

const SignIn = (): JSX.Element => {
  const router = useRouter();
  const { register, formState, getValues } = useForm<IFormInput>({
    mode: "onChange",
    defaultValues: {
      termsText: true,
      promotionText: true,
      otp: "",
      mobileNumber: "9966922412",
    },
  });

  const dispatch = useAppDispatch();

  // const [countryCodes, setCountryCodes] = useState<countryCodesInterface[]>([]);
  const [referenceId, setReferenceId] = useState<string>("");
  const [referenceKey, setReferenceKey] = useState<string>("");
  const [logincontext, setLogincontext] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastmsg, setToastMsg] = useState<string>("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const otpTimer = useRef<otptimerType>({ timerId: undefined, resendTime: 0 });
  const [otpText, setOtpText] = useState<string>("");

  const { systemConfigs } = useAppSelector((state) => state.configs);
  const { userprofiles } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );
  let showPackages = systemConfigs?.configs?.showPackages || "";

  const signinPageInfo = JSON.parse(
    systemConfigs.configs?.signinPageInfo || `{}`,
  );

  const enteronlyNumber = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Backspace") return true;
    if (!(e.code.indexOf("Digit") > -1)) {
      e.preventDefault();
    }
    return;
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

  const getOtp = async () => {
    let mobileNumber: string = getValues().mobileNumber;
    let payload = {
      context: "login",
      mobile: "91" + mobileNumber,
    };
    const otpResponse = await postData("service/api/auth/get/otp", payload);
    if (otpResponse.error?.code === -4) {
      let payload = {
        mobile: `91${mobileNumber}`,
        password: "123456",
        // eslint-disable-next-line camelcase
        additional_params: {
          isOptedForPromotions: `${getValues().promotionText}`,
        },
      };
      const signupResponse = await postData(
        "service/api/auth/signup/validate",
        payload,
      );
      if (signupResponse.status === true) {
        if (otpTimer.current?.timerId) {
          setOtpText("Resend OTP");
          clearInterval(otpTimer.current.timerId);
        }
        if (signupResponse.response?.details) {
          setReferenceKey(signupResponse.response?.details?.referenceKey || "");
          setLogincontext(signupResponse.response?.details?.context || "");
        }
      } else {
        console.log("signup response failed...");
      }
    } else if (otpResponse.error?.code === 401) {
      clientCookie.remove("boxId");
      clientCookie.remove("tenantCode");
      clientCookie.remove("sessionId");
      clientCookie.remove("isLoggedin");
      window.location.reload();
    } else {
      otpTimer.current.resendTime = otpResponse.response.resendTime;
      startResendTimer();
      setReferenceId(otpResponse.response.referenceId || "");
      setLogincontext(otpResponse.response.context || "");
    }
  };

  const handleverifyClick = () => {
    getOtp()
      .then(() => {
        console.log("verify click done..");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleverifyOtp = async () => {
    let { otp, mobileNumber, promotionText } = getValues();
    if (otp) {
      if (logincontext === "login") {
        let payload = {
          // eslint-disable-next-line camelcase
          login_id: `91${mobileNumber}`,
          manufacturer: "123",
          // eslint-disable-next-line camelcase
          login_mode: 2,
          // eslint-disable-next-line camelcase
          login_key: otp,
          // eslint-disable-next-line camelcase
          additional_params: {
            isOptedForPromotions: `${promotionText}`,
          },
        };
        const signinResponse = await postData(
          "/service/api/auth/v1/signin",
          payload,
        );
        if (signinResponse.status === true) {
          localStorage.removeItem("systemconfigs");
          localStorage.removeItem("systemfeature");
          await setuserLoggedin();
        } else if (
          signinResponse.error?.code === -3 ||
          signinResponse.error?.message
        ) {
          setToastMsg(signinResponse.error.message);
          setShowToast(true);
          toastTimer.current = setTimeout(() => {
            setToastMsg("");
            setShowToast(false);
          }, 5000);
        }
      } else if (logincontext === "signup") {
        let payload = {
          otp: Number(otp),
          // eslint-disable-next-line camelcase
          reference_key: referenceKey,
        };

        const signupResponse = await postData(
          "/service/api/auth/signup/complete",
          payload,
        );
        if (signupResponse.status === true) {
          localStorage.removeItem("systemconfigs");
          localStorage.removeItem("systemfeature");

          await setuserLoggedin();

          // if (signupResponse.response?.userDetails) {
          //   localStorage.setItem(
          //     "userDetails",
          //     JSON.stringify(signupResponse.response?.userDetails),
          //   );
          //   router.push("/add-profile-name");
          // }
        }
      }
    }
  };

  const setuserLoggedin = async () => {
    try {
      localStorage.setItem("isLoggedin", "true");
      clientCookie.set("isLoggedin", "true");
      await getsystemConfigs();
      await getsystemFeature();
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
          localStorage.setItem(
            "userDetails",
            JSON.stringify(userInfo.response),
          );
          localStorage.setItem(
            "activeProfile",
            JSON.stringify(userInfo.response),
          );
          dispatch(setActiveprofile());
          router.replace("/");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleverifyOtp();
  };

  useEffect(() => {
    getData("/service/api/v1/get/country").then((data) => {
      if (data.status === true && data.response.length > 0) {
        // setCountryCodes([...data.response]);
      } else if (data?.status == false && data?.error?.code == 401) {
        clientCookie.remove("boxId");
        clientCookie.remove("tenantCode");
        clientCookie.remove("sessionId");
        clientCookie.remove("isLoggedin");
        window.location.reload();
      } else {
        console.log("failed....");
      }
    });

    return () => {
      if (otpTimer.current?.timerId) {
        clearInterval(otpTimer.current.timerId);
      }
    };
  }, []);

  return (
    <>
      <div className={`${styles.signin_pageContainer}`}>
        <div className={`${styles.logo}`}>
          <img src={`${appConfig.headerIconpath}`} alt="logo" />
        </div>
        <div className={`${styles.signin_mainContainer}`}>
          <div className={`${styles.signin_left_container}`}>
            <img src={signinPageInfo.backgroundImage} alt="img" />
          </div>
          <div className={`${styles.signin_right_container}`}>
            <div className={`${styles.signin_form_container}`}>
              <form onSubmit={submitOtp}>
                <div className={`${styles.signin_form_header}`}>
                  <p className={`${styles.title}`}>Welcome to Watcho</p>
                  <p className={`${styles.subtitle}`}>{signinPageInfo.title}</p>
                  <p className={`${styles.description}`}>
                    {signinPageInfo.subtitile}
                  </p>
                </div>
                <div className={`${styles.signin_form_body}`}>
                  <div className={`${styles.top_inputContainer}`}>
                    <div
                      className={`${styles.inputContainer} ${styles.countryCode}`}
                    >
                      <div
                        className={`${styles.input} ${styles.countryCode_input}`}
                      >
                        <span className={`${styles.countryname}`}>
                          <img
                            src="https://yuppstatic.akamaized.net/yupptv/yuppflix/countries/india.png"
                            alt=""
                          />
                          +91
                        </span>
                        {/* <ul>
                      <li>india</li>
                     </ul> */}
                        <span className={`${styles.input_title}`}>
                          Country code
                        </span>
                      </div>
                    </div>
                    <div
                      className={`${styles.inputContainer} ${styles.mobileNumber}`}
                    >
                      <div className={`${styles.input} ${styles.mobile}`}>
                        <input
                          {...register("mobileNumber", {})}
                          type="text"
                          placeholder="Enter Number"
                          maxLength={10}
                          onKeyDown={enteronlyNumber}
                        />
                        <span className={`${styles.input_title}`}>
                          Mobile Number
                        </span>
                        <span
                          className={`${styles.btn}`}
                          onClick={handleverifyClick}
                        >
                          verify
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.inputContainer}`}>
                    <div className={`${styles.input} ${styles.otp}`}>
                      <input
                        {...register("otp", {})}
                        type="text"
                        placeholder="Enter OTP"
                        maxLength={4}
                        onKeyDown={enteronlyNumber}
                        disabled={!referenceId && !referenceKey}
                      />
                      <span className={`${styles.input_title}`}>OTP</span>
                      {otpText && (
                        <span
                          className={`${styles.resend}`}
                          onClick={handleverifyClick}
                        >
                          {otpText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`${styles.signin_form_footer}`}>
                  <label>
                    <input
                      type="checkbox"
                      {...register("termsText", { required: true })}
                    />
                    -=
                    <div className={`${styles.checkbox_container}`}>
                      <span className={`${styles.checkbox}`}></span>
                    </div>
                    <div className={`${styles.labelText_container}`}>
                      <div className={`${styles.labelText}`}>
                        <p>{signinPageInfo.termsText}</p>
                      </div>
                    </div>
                    {formState.errors?.termsText?.type === "required" && (
                      <p className={`${styles.errorText}`}>
                        TermsText required
                      </p>
                    )}
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      {...register("promotionText", { required: true })}
                    />
                    <div className={`${styles.checkbox_container}`}>
                      <span className={`${styles.checkbox}`}></span>
                    </div>
                    <div className={`${styles.labelText_container}`}>
                      <div className={`${styles.labelText}`}>
                        <p>{signinPageInfo.promotionText}</p>
                      </div>
                    </div>
                    {formState.errors?.promotionText?.type === "required" && (
                      <p className={`${styles.errorText}`}>
                        PromotionText required
                      </p>
                    )}
                  </label>

                  <button className={styles.submit_btn} type="submit">
                    continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showToast && createPortal(<Toast message={toastmsg} />, document.body)}
    </>
  );
};

export default SignIn;
