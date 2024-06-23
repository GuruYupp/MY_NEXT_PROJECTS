import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./UpdateDetails.module.scss";
import {
  UpdatedetailsFormType,
  UpdatedetailsPropsType,
} from "./updatedetailstypes";
import { FC, Fragment, useState } from "react";
import UpdateDetailsInput from "./UpdateDetailsInput";
import { useAppSelector } from "@/redux/hooks";
import appConfig from "@/app.config";
import { DevTool } from "@hookform/devtools";
import { ModalType } from "@/components/modals/modaltypes";
import { OtpVerifydataType } from "../otpverify/otpverifytypes";
import Modal from "../modals/Modal";
import { createPortal } from "react-dom";
import OtpVerify from "../otpverify/OtpVerify";

const UpdateDetails: FC<UpdatedetailsPropsType> = (props) => {
  const { updatetype, title1, title2, closeModal } = props;
  const { control, handleSubmit } = useForm<UpdatedetailsFormType>({
    mode: "onChange",
  });

  const { userDetails } = useAppSelector((state) => state.user);

  const [errormsg, _setErrormsg] = useState<string>("");
  // const errormsgToken = useRef<ReturnType<typeof setTimeout>>();
  const [showModal, setShowModal] = useState<ModalType>("");
  const [otpprops, setOtpprops] = useState<OtpVerifydataType>({
    verification: "",
  });

  const onSubmit: SubmitHandler<UpdatedetailsFormType> = async (formData) => {
    const { newemail, newnumber } = formData;
    console.log(updatetype);
    if (updatetype === "email") {
      setShowModal("otpverify");
      setOtpprops({
        context: "update_email",
        message: `One Time Passcode (OTP) has been sent to your email ${newemail.slice(0, 5)}******${newemail.substring(8)}`,
        verification: "email",
        email: newemail,
      });
    }
    if (updatetype === "number") {
      setShowModal("otpverify");
      setOtpprops({
        context: "update_mobile",
        message: `One Time Passcode (OTP) has been sent to your mobile ******${newnumber.slice(6)}`,
        verification: "mobile",
        mobile: `91-${newnumber}`,
      });
    }
  };

  const handlecloseModal = () => {
    setShowModal("");
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    let { from, data } = Modaldata;
    console.log(data, "-----", from);
    switch (from) {
      case "otpverify":
        if (data.status == true) {
          console.log("ffjhfhjfjfj");
          setShowModal("");
          closeModal();
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className={`${styles.updatedetails_wrapper}`}>
      <div
        className={`${styles.updatedetails_container} ${!showModal ? styles.show : styles.hide}`}
      >
        <div className={`${styles.updatedetails_inner}`}>
          <span
            className={`${styles.updatedetails_close}`}
            onClick={closeModal}
          >
            <img
              alt="close"
              src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
            ></img>
          </span>
          <div className={`${styles.updatedetails_inner_top}`}>
            {title1 && <h1 className={`${styles.title1}`}>{title1}</h1>}
            {title2 && <p className={`${styles.title2}`}>{title2}</p>}
          </div>
          <div className={`${styles.inner_middle}`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {updatetype === "email" && (
                <Fragment>
                  <UpdateDetailsInput
                    control={control}
                    name="currentemail"
                    currentField={true}
                    defaultValue={userDetails?.email}
                    shouldUnregister={true}
                  />
                  <UpdateDetailsInput
                    control={control}
                    name="newemail"
                    defaultValue=""
                    shouldUnregister={true}
                    rules={{
                      required: "This is required",
                      validate: (value, _formvalues) => {
                        if (!appConfig.authEmailPattern.test(value)) {
                          return "Enter a valid email address";
                        }
                      },
                    }}
                  />
                </Fragment>
              )}
              {updatetype === "number" && (
                <Fragment>
                  <UpdateDetailsInput
                    control={control}
                    name="currentnumber"
                    currentField={true}
                    defaultValue={userDetails?.phoneNumber}
                    shouldUnregister={true}
                  />
                  <UpdateDetailsInput
                    control={control}
                    name="newnumber"
                    rules={{
                      required: "Mobile Number Required",
                      validate: (value, _formvalues) => {
                        if (!appConfig.authMobilePattern.test(value)) {
                          return "Invalid Mobile Number";
                        }
                      },
                    }}
                    shouldUnregister={true}
                  />
                </Fragment>
              )}
              <label>
                <div
                  className={`${styles.input_container} ${styles.submit_input_container}`}
                >
                  <input
                    type="submit"
                    className={`${styles.signin_btn}`}
                    value="save"
                  />
                  {errormsg && (
                    <p className={`${styles.input_error_msg}`}>{errormsg}</p>
                  )}
                </div>
              </label>
            </form>
          </div>
        </div>
        <DevTool control={control} />
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal: ModalType) => {
              function getModal() {
                console.log(modal);
                switch (modal) {
                  case "otpverify":
                    return (
                      <OtpVerify
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        verifydata={otpprops}
                        backgroundnone={true}
                      />
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body,
        )}
    </div>
  );
};
export default UpdateDetails;
