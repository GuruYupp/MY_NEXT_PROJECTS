import { FC } from "react";
import styles from "./UpdateDetails.module.scss";
import { UseControllerProps, useController } from "react-hook-form";
import { UpdatedetailsFormType } from "./updatedetailstypes";
import ConutryCode from "@/components/countrycode/countrycode";

const UpdateDetailsInput: FC<
  UseControllerProps<UpdatedetailsFormType> & { currentField?: boolean }
> = (props) => {
  const { field, fieldState } = useController(props);
  const { currentField = false } = props;

  const type = "text";
  const placeholder =
    props.name === "newemail"
      ? "New Email"
      : props.name === "newnumber"
      ? "Mobile Number"
      : "";

  return (
    <label>
      <div className={`${styles.input_container}`}>
        {props.name === "newnumber" && (
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

export default UpdateDetailsInput;
