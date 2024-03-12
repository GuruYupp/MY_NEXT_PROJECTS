import React,{FC} from "react";
import styles from "./CheckInfo.module.scss";
import { UseControllerProps, useController } from "react-hook-form";
import { CheckInfoPropsInterface, ProfileLockFormInterface } from "../profilelocktypes";
const CheckInfo:FC<UseControllerProps<ProfileLockFormInterface> & CheckInfoPropsInterface> = (props) => {
    const {field} = useController(props)
    const {labelText} = props
  return (
    <div className={`${styles.check_info}`}>
      <span className={`${styles.checkbox_span}`}>
        <input type="checkbox" className={`${styles.checkbox_input}`} {...field} defaultChecked = {field.value === "true" ? true : false}/>
      </span>
      {labelText && <p className={`${styles.label_text}`}>{labelText}</p>}
    </div>
  );
};

export default CheckInfo;
