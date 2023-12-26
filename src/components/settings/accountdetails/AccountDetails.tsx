import { FC } from 'react';
import styles from './AccountDetails.module.scss';

interface GenericAccountDetailsRowprops {
  heading1?: string;
  heading2?: string;
  action_btn_text?: string;
  action_btn_handle?: () => void;
}
const GenericAccountDetailsRow: FC<GenericAccountDetailsRowprops> = ({
  heading1,
  heading2,
  action_btn_text,
  action_btn_handle,
}) => {
  return (
    <div className={`${styles.data_row}`}>
      <p className={`${styles.heading1} ${styles.heading}`}>{heading1}</p>
      <p className={`${styles.heading2} ${styles.heading}`}>{heading2}</p>
      <span className={`${styles.action_btn}`} onClick={action_btn_handle}>
        {action_btn_text}
      </span>
    </div>
  );
};

const AccountDetails: FC = () => {
  const handleEdit = () => {};
  const handleSignOut = () => {};
  return (
    <div className={`${styles.account_details_container}`}>
      <GenericAccountDetailsRow
        heading1="Personal Details"
        heading2="Change your Name, Age and Gender"
        action_btn_text="Edit"
        action_btn_handle={handleEdit}
      />
      <GenericAccountDetailsRow
        heading1="Sign Out"
        heading2="You will be signed out from this device"
        action_btn_text="Sign Out"
        action_btn_handle={handleSignOut}
      />
    </div>
  );
};

export default AccountDetails;
