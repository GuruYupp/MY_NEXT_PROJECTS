import { FC } from "react";
import styles from "./ForgotPassword.module.scss";
import { UseControllerProps, useController } from "react-hook-form";
import { ForgotPasswordFormType } from "./forgotpasswordtype";

const ForgotPasswordInput: FC<UseControllerProps<ForgotPasswordFormType>> = (
  props,
) => {
  const { field } = useController(props);

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
        : "Confirm New Password";
  return (
    <input
      className={`${styles.input}`}
      {...field}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default ForgotPasswordInput;
