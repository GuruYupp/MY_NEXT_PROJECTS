import styles from "./ForgotPassword.module.scss";
import { useRouter } from "next/router";
import VerifyForm from "./VerifyForm/VerifyForm";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
const ForgotPassword = () => {
  const { otpauthentication } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    <>
      <div className={`${styles.changepassword_container}`}>
        <div className={`${styles.changepassword_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>Forgot Password?</p>
            <p className={`${styles.subtitle}`}>
              Please enter your{" "}
              {otpauthentication?.fields?.forgot_password_identifier_type || ""}{" "}
              and will send you an OTP to reset password.
            </p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <VerifyForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
