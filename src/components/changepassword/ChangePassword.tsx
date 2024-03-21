import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./ChangePassword.module.scss";
import {
  ChangePasswordFormType,
  changePasswordparamsType,
} from "./changepasswordtype";
import { DevTool } from "@hookform/devtools";
import ChnagePasswordInput from "./ChangePasswordInput";
import { useEffect, useRef, useState } from "react";
import { postData } from "@/services/data.manager";
import { useRouter } from "next/router";
const ChangePassword = () => {
  const { control, formState, handleSubmit } = useForm<ChangePasswordFormType>({
    mode: "onChange",
  });

  const [errormsg, setErrormsg] = useState<string>("");
  const errormsgToken = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();

  useEffect(() => {
    return () => {
      clearTimeout(errormsgToken.current);
    };
  }, []);

  const onSubmit: SubmitHandler<ChangePasswordFormType> = async (formData) => {
    handleChangePassword({
      oldPassword: formData.currentpassword,
      newPassword: formData.confirmnewpassword,
    });
  };

  const handleChangePassword = async (payload: changePasswordparamsType) => {
    const chagepasswordresponse = await postData(
      "/service/api/auth/change/password",
      payload,
    );
    if (chagepasswordresponse.status === true) {
      router.back();
    } else {
      if (chagepasswordresponse.error?.code === -1) {
        setErrormsg(chagepasswordresponse.error.message);
        errormsgToken.current = setTimeout(() => {
          setErrormsg("");
        }, 1000);
      }
    }
  };

  return (
    <>
      <div className={`${styles.changepassword_container}`}>
        <div className={`${styles.changepassword_inner}`}>
          <div className={`${styles.inner_top}`}>
            <p className={`${styles.title}`}>Change Password</p>
          </div>
          <div className={`${styles.inner_middle}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>
                <div className={`${styles.input_container}`}>
                  <ChnagePasswordInput
                    name="currentpassword"
                    rules={{
                      required: "This is required",
                      validate: (value, _formvalues) => {
                        if (value.length < 4 || value.length > 15) {
                          return "Password length should be 4-15 Charecters";
                        }
                      },
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.currentpassword && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.currentpassword?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div className={`${styles.input_container}`}>
                  <ChnagePasswordInput
                    name="newpassword"
                    rules={{
                      required: "This is required",
                      validate: (value, _formvalues) => {
                        if (value.length < 4 || value.length > 15) {
                          return "Password length should be 4-15 Charecters";
                        }
                      },
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.newpassword && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.newpassword?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div className={`${styles.input_container}`}>
                  <ChnagePasswordInput
                    name="confirmnewpassword"
                    rules={{
                      required: "This is required",
                      validate: (value, formvalues) => {
                        if (value.length < 4 || value.length > 15) {
                          return "Password length should be 4-15 Charecters";
                        }
                        if (value !== formvalues.newpassword) {
                          return "Passwords are mismatched";
                        }
                      },
                    }}
                    shouldUnregister={true}
                    control={control}
                    defaultValue=""
                  />
                  {formState.errors.confirmnewpassword && (
                    <p className={`${styles.input_error_msg}`}>
                      {formState.errors.confirmnewpassword?.message}
                    </p>
                  )}
                </div>
              </label>

              <label>
                <div
                  className={`${styles.input_container} ${styles.submit_input_container}`}
                >
                  <input
                    type="submit"
                    className={`${styles.change_btn}`}
                    value="Change Password"
                  />

                  {errormsg && (
                    <p className={`${styles.input_error_msg}`}>{errormsg}</p>
                  )}
                </div>
              </label>
            </form>
          </div>
        </div>
      </div>
      <DevTool control={control} />
    </>
  );
};

export default ChangePassword;
