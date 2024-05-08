import { FC } from "react";
import styles from "./GenericAccountDetailsRow.module.scss";
import { GenericAccountDetailsRowprops } from "../../settingstypes";

const GenericAccountDetailsRow: FC<GenericAccountDetailsRowprops> = ({
  heading1,
  heading2,
  actionbtntext,
  actionbtnhandle,
  details,
}) => {
  return (
    <div className={`${styles.data_row}`}>
      {heading1 && (
        <p className={`${styles.heading1} ${styles.heading}`}>{heading1}</p>
      )}
      {heading2 && (
        <p className={`${styles.heading2} ${styles.heading}`}>{heading2}</p>
      )}
      {details && (
        <div className={`${styles.details}`}>
          <p className={`${styles.label}`}>{details.label}:</p>
          <p className={`${styles.value}`}>{details.value}</p>
        </div>
      )}
      {actionbtntext && (
        <span className={`${styles.action_btn}`} onClick={actionbtnhandle}>
          {actionbtntext}
        </span>
      )}
    </div>
  );
};

export default GenericAccountDetailsRow;
