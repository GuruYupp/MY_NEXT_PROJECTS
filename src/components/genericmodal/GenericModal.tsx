import React, { FC } from "react";
import styles from "./GenericModal.module.scss";
import { GenericModalPropsInterface } from "./genericmodaltype";

const GenericModal: FC<GenericModalPropsInterface> = (props) => {
  const { displayData } = props;
  const { title, subtitle1, yesbuttonText, nobuttonText } = displayData;
  return (
    <div className={`${styles.genericpopup_container}`}>
      <div className={`${styles.genericpopup_inner}`}>
        {title && <h2 className={`${styles.title}`}>{title}</h2>}
        {subtitle1 && <p>{subtitle1}</p>}
        <div className={`${styles.buttons}`}>
          {yesbuttonText && (
            <div className={`${styles.btn}`}>{yesbuttonText}</div>
          )}
          {nobuttonText && (
            <div className={`${styles.btn}`}>{nobuttonText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
