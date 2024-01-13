import { FC, useEffect, useRef, useState } from "react";
import styles from "./Genericsignin.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ConutryCode from "@/components/countrycode/countrycode";
import { SubmitHandler, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import appConfig from "@/app.config";
import { SingnInFormType } from "./genericsignintypes";
import SignInput from "./SigninInput";
import SocialLogins from "@/components/socialLogins/socialLogins";
import Link from "next/link";
import { getData, postData } from "@/services/data.manager";
import { setActivepackages, setLoggedin } from "@/redux/feature/userSlice/userSlice";
import { useRouter } from "next/router";
import { ModalType } from "@/components/modals/modaltypes";
import { OtpVerifydataType } from "@/components/otpverify/otpverifytypes";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import OtpVerify from "@/components/otpverify/OtpVerify";

const GenericSignIn: FC = () => {
  const { globalsettings, sociallogin, userprofiles } = useAppSelector(
    (state) => state.configs.systemFeatures
  );

  const { systemConfigs } = useAppSelector((state)=>state.configs)
  const { isLoggedin } = useAppSelector((state) => state.user)
  let showPackages = systemConfigs?.configs?.showPackages || ""
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {  control, formState,handleSubmit } = useForm<SingnInFormType>({
    mode: "onChange",
  });

  const [errormsg,setErrormsg] = useState<string>('')
  const errormsgToken = useRef<ReturnType<typeof setTimeout>>()
  const [showModal, setShowModal] = useState<ModalType>('');
  const [otpprops, setOtpprops] = useState<OtpVerifydataType>({ verification: "" });

  useEffect(()=>{
    if (isLoggedin){
      router.back();
      return;
    }
    return ()=>{
      clearTimeout(errormsgToken.current)
    }
  },[])

  const getInitialLoginType = () => {
    if (globalsettings?.fields?.isEmailSupported === "true" && globalsettings?.fields?.isMobileSupported === "true") {
      // return "mobile";
      return "email"
    }
    if (globalsettings?.fields?.isMobileSupported === "true" && appConfig.signin.primary == "mobile") {
      return "mobile";
    }
    return "email";
  };

  const [loginType, setLogintype] = useState<"email" | "mobile">(
    getInitialLoginType()
  );

  const toggelEmailNumberInput = () => {
    setLogintype(loginType === "email" ? "mobile" : "email");
  };

  const handleclickSignup = (e:React.MouseEvent<HTMLAnchorElement>):void=>{
    e.preventDefault();
    router.replace('/signup')
  }

  const onSubmit:SubmitHandler<SingnInFormType> = async (formData) => {
    const {email,number,password} = formData
      let payload={
        login_key: password,
        login_mode:1,
        manufacturer:"123",
        login_id:""
      }
      if(loginType === "email"){
        payload.login_id = email
      }
      else{
        payload.login_id = `91-${number}`
      }
      signIn(payload)
  };

  const signIn = async (post_data:any)=>{
    let signInresponse = await postData('/service/api/auth/v1/signin', post_data)
    console.log(signInresponse)
    if(signInresponse.status === false){
      if(signInresponse.error?.code === -6 && signInresponse.error.actionCode === 1){
        // user will register but OTP is not verified for email
        document.body.style.overflowY = "hidden";
        let identifier = signInresponse.error.details.identifier || ""
        setShowModal('otpverify')
        setOtpprops({
          context: "signin",
          message: `One Time Passcode (OTP) has been sent to your mobile ******${identifier.substring(7)}`,
          verification: "mobile",
          number:identifier
        });
      }
     else if(signInresponse.error &&signInresponse.error.message){
      setErrormsg(signInresponse.error.message)
      errormsgToken.current = setTimeout(()=>{
        setErrormsg('')
      },1000)
     }
    }
    else if(signInresponse.status === true){
      // localStorage.setItem('isLoggedin', 'true');
      // if(showPackages === "true"){
      //   const userPackages = await getData(
      //     'service/api/auth/user/activepackages'
      //   );
      //   if (userPackages.status === true) {
      //     localStorage.setItem(
      //       'activePackages',
      //       JSON.stringify(userPackages.response)
      //     );
      //     dispatch(setActivepackages());
      //   }
      // }
      // const userInfo = await getData('/service/api/auth/user/info');
      // if (userInfo.status === true) {
      //   localStorage.setItem(
      //     'userDetails',
      //     JSON.stringify(userInfo.response)
      //   );
      //   dispatch(setLoggedin())
      //   if (userprofiles?.fields?.is_userprofiles_supported === "true"){
      //     router.replace('/profiles/select-user-profile');
      //   }
      //   else{
      //     router.replace('/')
      //   }
      // }
      setuserLoggedin();
    }
  }

  const setuserLoggedin = async ()=>{
    console.log('---dddd')
    localStorage.setItem('isLoggedin', 'true');
    if (showPackages === "true") {
      const userPackages = await getData(
        'service/api/auth/user/activepackages'
      );
      if (userPackages.status === true) {
        localStorage.setItem(
          'activePackages',
          JSON.stringify(userPackages.response)
        );
        dispatch(setActivepackages());
      }
    }
    const userInfo = await getData('/service/api/auth/user/info');
    if (userInfo.status === true) {
      localStorage.setItem(
        'userDetails',
        JSON.stringify(userInfo.response)
      );
      dispatch(setLoggedin())
      if (userprofiles?.fields?.is_userprofiles_supported === "true") {
        router.replace('/profiles/select-user-profile');
      }
      else {
        router.replace('/')
      }
    }
  }

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    let { from, data } = Modaldata;
    console.log(data,'-----',from)
    switch (from) {
      case 'otpverify':
        if(data.status == true){
          console.log('ffjhfhjfjfj')
          setuserLoggedin();
        }
        break;
      default:
        break;
    }
  }

  const handlecloseModal = () => {
    document.body.style.overflowY = 'scroll';
    setShowModal('');
  };


  return (
    <>
      <div className={`${styles.signin_container}`}>
        <div className={`${styles.signin_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>Sign in to your Account</p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {loginType === "mobile" && (
                <label>
                  <div className={`${styles.input_container}`}>
                    <div className={`${styles.country_code_container}`}>
                      <ConutryCode />
                    </div>
                    <SignInput
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
              )}
              {loginType === "email" && (
                <label>
                  <div className={`${styles.input_container}`}>
                    <SignInput
                      name="email"
                      rules={{
                        required: "This is required",
                        // validate: {
                        //   matchPattern: (v) => appConfig.authEmailPattern.test(v)
                        // },
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
              )}
              <label>
                <div className={`${styles.input_container}`}>
                  <SignInput
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

              <label>
                <div className={`${styles.input_container} ${styles.submit_input_container}`}>
              <input
                type="submit"
                className={`${styles.signin_btn}`}
                value="Sign in"
              />
                  {errormsg && (
                    <p className={`${styles.input_error_msg}`}>
                      {errormsg}
                    </p>
                  )}
                </div>
              </label>
            </form>
            <div className={`${styles.or_div}`}>
              <hr />
              <span className={`${styles.or_text}`}>OR</span>
            </div>
          </div>
          <div className={`${styles.inner_bottom}`}>
            {appConfig.signin.emailPhoneToggle === true && (
              <button
                className={`${styles.email_number_toggle}`}
                onClick={toggelEmailNumberInput}
              >
                Sign In with{" "}
                {loginType == "mobile" ? "Email Id" : "Mobile Number"}
              </button>
            )}
            
           {Object.keys(sociallogin?.fields || {}).length > 0 && <SocialLogins/>}

            <p className={`${styles.signup_text}`}>
              Don't have an account ?
              <Link className={`${styles.signup}`} href="/signup" onClick={handleclickSignup}>Sign Up</Link>
            </p>

            <p className={`${styles.terms_policy}`}>
              <Link className={`${styles.terms}`} href="#">Terms of Service</Link>
              and 
              <Link className={`${styles.policy}`} href="#">Privacy Policy</Link>
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
                console.log(modal);
                switch (modal) {
                  case 'otpverify':
                    return <OtpVerify closeModal={handlecloseModal} sendDatatoComponent={getDataFromModal} verifydata={otpprops} />
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )}
      <DevTool control={control} />
    </>
  );
};

export default GenericSignIn;
