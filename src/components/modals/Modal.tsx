import { Fragment } from "react";
import style from "./Modal.module.scss";
import { ModalPropsInterface, ModalType } from "./modaltypes";

// export type ModalType =
// 	| "network_filter"
// 	| "languages"
// 	| "emojis"
// 	| "template"
// 	| "signout"
// 	| "getotp"
// 	| "";

// export interface ModalPropsInterface {
// 	modalType: ModalType;
// 	render: (arg: ModalType)=>ReactNode
// }

function Modal(props: ModalPropsInterface) {
  const { render, modalType, withWrapper = true } = props;
  const renderModal = (modelType: ModalType) => {
    switch (modelType) {
      case "network_filter":
        return (
          <div className={`${style.filter_modal}`}>{render(modalType)}</div>
        );
      case "languages":
        return (
          <div className={`${style.languages_modal}`}>{render(modalType)}</div>
        );
      case "emojis":
        return (
          <div className={`${style.emojis_modal}`}>{render(modalType)}</div>
        );
      case "template":
        return (
          <div className={`${style.template_modal}`}>{render(modalType)}</div>
        );
      case "getotp":
        return <div className={`${style.otp_modal}`}>{render(modalType)}</div>;
      case "signout":
        return (
          <div className={`${style.template_modal}`}>{render(modalType)}</div>
        );
      case "otpverify":
        return (
          <div className={`${style.otpverify_modal}`}>{render(modalType)}</div>
        );
      case "updatedetails":
        return (
          <div className={`${style.updatedetails_modal}`}>
            {render(modalType)}
          </div>
        );
      case "mobileratings":
        return render(modalType);
      default:
        return <></>;
    }
  };
  const handlePropogation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return withWrapper ? (
    <div className={`${style.modal_container}`} onClick={handlePropogation}>
      {renderModal(props.modalType)}
    </div>
  ) : (
    <Fragment>{renderModal(props.modalType)}</Fragment>
  );
}

export default Modal;
