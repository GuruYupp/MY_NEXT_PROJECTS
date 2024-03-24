import { FC } from "react";
import styles from "./ForgotPassword.module.scss";
import { UseControllerProps, useController } from "react-hook-form";
import { ForgotPasswordFormType } from "./forgotpasswordtype";
import ConutryCode from "../countrycode/countrycode";

const ForgotPasswordInput: FC<
  UseControllerProps<ForgotPasswordFormType> & { currentField?: boolean }
> = (props) => {
  const { field, fieldState } = useController(props);
  const { currentField = false } = props;
  const type =
    props.name === "confirmpassword" || props.name === "newpassword"
      ? "password"
      : props.name === "email"
        ? "email"
        : "text";
  const placeholder =
    props.name === "email"
      ? "Email Address"
      : props.name === "number"
        ? "Mobile Number"
        : props.name === "otp"
          ? "Enter OTP"
          : props.name === "newpassword"
            ? "Enter New Password"
            : "Confirm New Password";
  return (
    <label>
      <div className={`${styles.input_container}`}>
        {props.name === "number" && (
          <div className={`${styles.country_code_container}`}>
            <ConutryCode />
          </div>
        )}
        <input
          className={`${styles.input}`}
          {...field}
          placeholder={placeholder}
          type={type}
          readOnly={currentField}
        />
        {fieldState.error && (
          <p className={`${styles.input_error_msg}`}>
            {fieldState.error.message}
          </p>
        )}
      </div>
    </label>
  );
};

export default ForgotPasswordInput;
