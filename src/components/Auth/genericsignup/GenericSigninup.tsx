import { FC, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Genericsignup.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ConutryCode from "@/components/countrycode/countrycode";
import { SubmitHandler, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import appConfig from "@/app.config";
import { SingnupFormType } from "./genericsignuptypes";
import SignupInput, { DateInput, RadioInput } from "./Signupinput";
import SocialLogins from "@/components/socialLogins/socialLogins";
import Link from "next/link";
import { postData } from "@/services/data.manager";
import { useRouter } from "next/router";
import { setLoggedin } from "@/redux/feature/userSlice/userSlice";
import { createPortal } from "react-dom";
import OtpVerify from "@/components/otpverify/OtpVerify";
import { OtpVerifydataType } from "@/components/otpverify/otpverifytypes";
import { responseInterface } from "@/shared";
import { ModalType } from "@/components/modals/modaltypes";
import Modal from "@/components/modals/Modal";

const GenericSignup: FC = () => {
  const { sociallogin, userfields, encryptApisList, userprofiles } =
    useAppSelector((state) => state.configs.systemFeatures);

  const { control, formState, setValue, handleSubmit } =
    useForm<SingnupFormType>({
      mode: "onChange",
    });

  const [errormsg, setErrormsg] = useState<string>("");
  const [showModal, setShowModal] = useState<ModalType>('');
  const [otpprops, setOtpprops] = useState<OtpVerifydataType>({verification:""});
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
    const { number, firstName, lastName, email, password, dob, gender } =
      formData;
    let apiPayload = {
      additional_params: {},
      app_version: "",
      is_header_enrichment: false,
      cookie: "",
      manufacturer: "123",
      os_version: "",
      referral_id: "",
      referral_type: "",
      first_name: firstName,
      last_name: lastName,
      email: email,
      mobile: `91-${number}`,
      password: password,
    };
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
      apiPayload.is_header_enrichment = true;
    }
    signup(apiPayload);
  };

  const signup = async (post_data: unknown) => {
    let signupresponse = await postData(
      "/service/api/auth/signup/validate",
      post_data
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
      } else if (signupresponse.response.actionCode === 3) {
        // user will register but OTP is not verified for email
        document.body.style.overflowY = "hidden";
        let email = signupresponse.response.details.email || ""
        let referenceKey = signupresponse.response.details.referenceKey || ""
        setShowModal('otpverify')
        setOtpprops({
          context: "signup",
          reference_key: referenceKey,
          message: `One Time Passcode (OTP) has been sent to your email ${email.slice(0, 5)}******${email.substring(8)}`,
          verification:"email",
          email
        });
      } else if (signupresponse.response.actionCode === 17) {
        // to handle token already registered to some other user
      } else {
       setuserLoggedin(signupresponse)
      }
    }
  };

  const setuserLoggedin = (signupresponse:responseInterface)=>{
    localStorage.setItem("isLoggedin", "true");
    if (signupresponse.response?.userDetails) {
      localStorage.setItem(
        "userDetails",
        JSON.stringify(signupresponse.response?.userDetails)
      );
    }
    dispatch(setLoggedin());
    if (userprofiles?.fields?.is_userprofiles_supported === "true") {
      let MatserProfile =
        signupresponse.response?.userDetails?.profileParentalDetails?.[0];
      if (
        appConfig.authMobilePattern.test(MatserProfile?.name || "") ||
        MatserProfile?.name === ""
      ) {
        router.replace("/add-profile-name");
      } else {
        router.replace("/profiles/select-user-profile");
      }
    } else {
      router.replace("/");
    }
  }

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case 'otpverify':
        setuserLoggedin(data)
        break;
      default:
        break;
    }
  }

  const handlecloseModal = () => {
    document.body.style.overflowY = 'scroll';
    setShowModal('');
  };


  const handleclickSignin = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    router.replace('/signin')
  }


  return (
    <>
      <div className={`${styles.signup_container}`}>
        <div className={`${styles.signup_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>Create Your Account</p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <div className={`${styles.input_container}`}>
                  <SignupInput
                    name="firstName"
                    rules={{
                      required: "This is required",
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.firstName && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.firstName?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div className={`${styles.input_container}`}>
                  <SignupInput
                    name="lastName"
                    rules={{
                      required: "This is required",
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.lastName && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.lastName?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div className={`${styles.input_container}`}>
                  <SignupInput
                    name="email"
                    rules={{
                      required: "This is required",
                      validate: (value, _formvalues) => {
                        if (!appConfig.authEmailPattern.test(value)) {
                          return "Enter a valid email address";
                        }
                      },
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.email && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.email?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div className={`${styles.input_container}`}>
                  <div className={`${styles.country_code_container}`}>
                    <ConutryCode />
                  </div>
                  <SignupInput
                    name="number"
                    rules={{
                      required: "Mobile Number Required",
                      validate: (value, _formvalues) => {
                        if (!appConfig.authMobilePattern.test(value)) {
                          return "Invalid Mobile Number";
                        }
                      },
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.number && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.number?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div className={`${styles.input_container}`}>
                  <SignupInput
                    name="password"
                    rules={{
                      required: "This is required",
                      validate: (value, _formvalues) => {
                        if (value.length < 4 || value.length > 15) {
                          return "Password length should be 4-15 Charecters";
                        }
                      },
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.password && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.password?.message}
                    </p>
                  )}
                </div>
              </label>

              {appConfig.signup.confirmPassword && (
                <label>
                  <div className={`${styles.input_container}`}>
                    <SignupInput
                      name="confirmpassword"
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
                      shouldUnregister={true}
                      control={control}
                      defaultValue=""
                    />
                    {formState.errors.confirmpassword && (
                      <p className={`${styles.input_error_msg}`}>
                        {formState.errors.confirmpassword?.message}
                      </p>
                    )}
                  </div>
                </label>
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
              <SocialLogins />
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
              <Link className={`${styles.signin}`} href="/signin" onClick={handleclickSignin}>
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
            render={(modal:ModalType) => {
              function getModal() {
                console.log(modal);
                switch (modal) {
                  case 'otpverify':
                    return <OtpVerify closeModal={handlecloseModal} sendDatatoComponent={getDataFromModal} verifydata={otpprops}/>
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )}
      {/* <DevTool control={control} /> */}
    </>
  );
};

export default GenericSignup;
