import { useState } from "react";
import styles from "./ForgotPassword.module.scss";
import VerifyForm from "./VerifyForm/VerifyForm";
import { useAppSelector } from "@/redux/hooks";
import { resetPasswordformType } from "./forgotpasswordtype";

const ForgotPassword = () => {
  const [formType, setFormType] = useState<resetPasswordformType>("verify");
  const { otpauthentication } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );

  const handleFormType = (formtype: resetPasswordformType) => {
    setFormType(formtype);
  };

  const getTitle = () => {
    let title: { [key: string]: string };
    title = {
      verify: "Forgot Password?",
      otpscreen: "Enter One Time Passcode",
      resetpassword: "Reset password",
    };
    return title[formType];
  };

  const getsubTitle = () => {
    let subtitle: { [key: string]: string };
    subtitle = {
      verify: `Please enter your ${otpauthentication?.fields?.forgot_password_identifier_type || ""} and will send you an OTP to reset password.`,
      otpscreen: `One Time Passcode (OTP) has been sent to your email`,
    };
    return subtitle[formType];
  };

  return (
    <>
      <div className={`${styles.changepassword_container}`}>
        <div className={`${styles.changepassword_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>{getTitle()}</p>
            <p className={`${styles.subtitle}`}>{getsubTitle()}</p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <VerifyForm formType={formType} handleFormType={handleFormType} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
