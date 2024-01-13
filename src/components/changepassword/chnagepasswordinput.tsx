import { FC } from "react";
import styles from "./ChangePassword.module.scss"
import { UseControllerProps, useController } from "react-hook-form";
import { ChangePasswordFormType } from "./chagepasswordtype";

const ChnagePasswordInput: FC<UseControllerProps<ChangePasswordFormType>> = (props) => {
  const { field } = useController(props)

  const type = "password"
  const placeholder = props.name === "newpassword" ? "Confirm Password" : (props.name === "currentpassword") ? "Current Password" : "Confirm New Password"
  return <input className={`${styles.input}`} {...field} type={type} placeholder={placeholder} />
}

export default ChnagePasswordInput