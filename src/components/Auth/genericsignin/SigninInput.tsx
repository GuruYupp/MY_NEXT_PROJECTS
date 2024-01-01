import { FC } from "react";
import styles from "./Genericsignin.module.scss"
import { UseControllerProps, useController } from "react-hook-form";
import { SingnInFormType } from "./genericsignintypes";
const SignInput:FC<UseControllerProps<SingnInFormType>> = (props)=>{
  const {field} = useController(props)
  
  const type = props.name === "password" ? "password" : (props.name === "number") ? "number" : "text"
  const placeholder = props.name === "email" ? "Email Address" : (props.name === "number") ? "Mobile Number" : "Password"
  return <input className={`${styles.input}`} {...field} type={type} placeholder={placeholder}/>
}

export default SignInput