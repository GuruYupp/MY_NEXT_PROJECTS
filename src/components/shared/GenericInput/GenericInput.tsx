import { FC } from "react";
import styles from "./GenericInput.module.scss";
import { UseControllerProps, useController } from "react-hook-form";
import ConutryCode from "@/components/countrycode/countrycode";
import { GenericInputPropsInterface } from "./genericinputtype";

const GenericInput: FC<UseControllerProps<any> & GenericInputPropsInterface> = (
  props,
) => {
  const { field, fieldState } = useController(props);
  const { readonly = false, placeholder, type, showCountrycode } = props;

  return (
    <label>
      <div
        className={`${styles.input_container} ${type === "submit" ? styles.submit_input_container : ""}`}
      >
        {showCountrycode && type === "number" && (
          <div className={`${styles.country_code_container}`}>
            <ConutryCode />
          </div>
        )}
        <input
          className={`${type === "submit" ? styles.submit_btn : styles.input}`}
          {...field}
          placeholder={placeholder}
          type={type}
          readOnly={readonly}
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

export default GenericInput;
