import OTPInput, { OTPInputProps } from "react-otp-input";
import styles from "./OtpInput.module.scss";
import { FC } from "react";

interface OtpInputInterfaceProps {
  pin: string;
  setPin: (pin: string) => void;
  autoFocus?: boolean;
  inputType?: OTPInputProps["inputType"];
  placeholder?: OTPInputProps["placeholder"];
}

const OtpInput: FC<OtpInputInterfaceProps> = (props) => {
  const {
    pin,
    setPin,
    autoFocus = false,
    inputType = "text",
    placeholder = "false",
  } = props;

  const handleOnChange = (pin: string) => {
    setPin(pin);
  };
  return (
    <div className={`${styles.otpcontainer}`}>
      <OTPInput
        inputStyle={styles.inputStyle}
        onChange={handleOnChange}
        numInputs={4}
        renderInput={(props) => <input {...props} />}
        value={pin}
        inputType={inputType}
        shouldAutoFocus={autoFocus}
        placeholder={placeholder}
      />
    </div>
  );
};

export default OtpInput;
