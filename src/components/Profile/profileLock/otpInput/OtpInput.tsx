import OTPInput from "react-otp-input";
import styles from "./OtpInput.module.scss";
import { FC } from "react";

interface OtpInputInterfaceProps {
  pin: string;
  setPin: (pin: string) => void;
}

const OtpInput: FC<OtpInputInterfaceProps> = (props) => {
  const { pin, setPin } = props;

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
        inputType="text"
      />
    </div>
  );
};

export default OtpInput;
