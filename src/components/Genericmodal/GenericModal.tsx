import React, { FC, SyntheticEvent } from "react";
import styles from "./GenericModal.module.scss";
import { GenericModalPropsInterface } from "./genericmodaltype";
import appConfig from "@/app.config";

const GenericModal: FC<GenericModalPropsInterface> = (props) => {
  const { displayData, closeModal, sendDatatoComponent } = props;
  const {
    title,
    subtitle1,
    yesbuttonText,
    nobuttonText,
    primarybtn = "yesbutton",
  } = displayData;
  const getPrimaryClass = (btn: string) =>
    btn === primarybtn ? styles.primary : "";

  const handleCancelclick = (e: SyntheticEvent) => {
    e.stopPropagation();
    closeModal();
  };

  const handleYesclick = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (sendDatatoComponent) {
      sendDatatoComponent({ from: "genericmodal", data: "yesclicked" });
    }
  };
  return (
    <div className={`${styles.genericpopup_container}`}>
      <div className={`${styles.genericpopup_inner}`}>
        <span className={`${styles.close}`} onClick={closeModal}>
          <img
            alt="close"
            src={`${appConfig.cloudpath}/images/lan-popup-close.png`}
          ></img>
        </span>
        {title && <h5 className={`${styles.title}`}>{title}</h5>}
        {subtitle1 && <p>{subtitle1}</p>}
        <div className={`${styles.buttons}`}>
          {yesbuttonText && (
            <div
              className={`${styles.btn} ${getPrimaryClass("yesbutton")}`}
              onClick={handleYesclick}
            >
              {yesbuttonText}
            </div>
          )}
          {nobuttonText && (
            <div
              className={`${styles.btn} ${getPrimaryClass("nobutton")}`}
              onClick={handleCancelclick}
            >
              {nobuttonText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
