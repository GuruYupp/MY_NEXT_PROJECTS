import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ForgotPasswordFormType } from "../forgotpasswordtype";
import { useAppSelector } from "@/redux/hooks";
import styles from "../ForgotPassword.module.scss";
import ForgotPasswordInput from "../ForgotPasswordInput";
import appConfig from "@/app.config";
import ConutryCode from "@/components/countrycode/countrycode";
import Link from "next/link";
import { postData } from "@/services/data.manager";

const VerifyForm = () => {
  const { control, formState, handleSubmit } = useForm<ForgotPasswordFormType>({
    mode: "onChange",
  });
  const { otpauthentication } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );
  const [errormsg, setErrormsg] = useState<string>("");
  const errormsgtimer = useRef<ReturnType<typeof setTimeout>>();
  const [verifyField, setVerifyField] = useState<"email" | "mobile" | "">(
    otpauthentication?.fields?.forgot_password_identifier_type || "",
  );
  const onSubmit: SubmitHandler<ForgotPasswordFormType> = async (formData) => {
    if (!verifyField) return;
    const { email, number } = formData;
    let data = { Platform: "web", Source: "home", context: "update_password" };
    let payload = {};
    if (verifyField === "email") {
      payload = { ...data, email };
    }
    if (verifyField === "mobile") {
      payload = { ...data, mobile: number };
    }
    SendOtp(payload);
  };

  const SendOtp = async (payload: any) => {
    let otpvalidresponse = await postData("/service/api/auth/get/otp", payload);
    if (otpvalidresponse.status === false) {
      if (otpvalidresponse.error?.message) {
        setErrormsg(otpvalidresponse.error?.message || "");
        errormsgtimer.current = setTimeout(() => {
          setErrormsg("");
        }, 1000);
      }
    } else {
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {verifyField === "email" && (
          <label>
            <div className={`${styles.input_container}`}>
              <ForgotPasswordInput
                name="email"
                rules={{
                  required: "This is required",
                  validate: (value, _formvalues) => {
                    if (!appConfig.authEmailPattern.test(value)) {
                      return "Enter a valid email address";
                    }
                  },
                }}
                shouldUnregister={true}
                control={control}
                defaultValue=""
              />
              {formState.errors.email && (
                <p className={`${styles.input_error_msg}`}>
                  {formState.errors.email?.message}
                </p>
              )}
            </div>
          </label>
        )}
        {verifyField === "mobile" && (
          <label>
            <div className={`${styles.input_container}`}>
              <div className={`${styles.country_code_container}`}>
                <ConutryCode />
              </div>
              <ForgotPasswordInput
                name="number"
                rules={{
                  required: "Mobile Number Required",
                  validate: (value, _formvalues) => {
                    if (!appConfig.authMobilePattern.test(value)) {
                      return "Invalid Mobile Number";
                    }
                  },
                }}
                shouldUnregister={true}
                control={control}
                defaultValue=""
              />
              {formState.errors.number && (
                <p className={`${styles.input_error_msg}`}>
                  {formState.errors.number?.message}
                </p>
              )}
            </div>
          </label>
        )}
        <label>
          <div
            className={`${styles.input_container} ${styles.submit_input_container}`}
          >
            <input
              type="submit"
              className={`${styles.submit_btn}`}
              value="Get OTP"
            />

            {errormsg && (
              <p className={`${styles.input_error_msg}`}>{errormsg}</p>
            )}
          </div>
        </label>
        <p className={`${styles.goBackText}`}>
          <Link href={`/signin`}>Back to Sign In</Link>
        </p>
      </form>
    </>
  );
};

export default VerifyForm;
