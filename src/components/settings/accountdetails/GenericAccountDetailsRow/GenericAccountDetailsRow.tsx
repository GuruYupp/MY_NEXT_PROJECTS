import { FC } from "react";

import styles from './GenericAccountDetailsRow.module.scss';

interface GenericAccountDetailsRowprops {
  heading1?: string;
  heading2?: string;
  action_btn_text?: string;
  details?: { label: string; value: string };
  action_btn_handle?: (...args: any) => void;
}
const GenericAccountDetailsRow: FC<GenericAccountDetailsRowprops> = ({
  heading1,
  heading2,
  action_btn_text,
  action_btn_handle,
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
      {(action_btn_text) && (
        <span className={`${styles.action_btn}`} onClick={action_btn_handle}>
          {action_btn_text}
        </span>
      )}
    </div>
  );
};

export default GenericAccountDetailsRow;