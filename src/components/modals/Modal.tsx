import { Fragment } from "react";
import style from "./Modal.module.scss";
import { ModalPropsInterface, ModalType } from "./modaltypes";

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
      case "genericmodal":
        return (
          <div className={`${style.generic_modal}`}>{render(modalType)}</div>
        );
      case "template":
        return (
          <div className={`${style.template_modal}`}>{render(modalType)}</div>
        );
      case "getotp":
        return (
          <div className={`${style.generic_modal}`}>{render(modalType)}</div>
        );
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
      case "profilepin":
        return (
          <div className={`${style.profilepin_modal}`}>{render(modalType)}</div>
        );
      case "parentalcontrolpin":
        return (
          <div className={`${style.parental_control_pin_modal}`}>
            {render(modalType)}
          </div>
        );
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
