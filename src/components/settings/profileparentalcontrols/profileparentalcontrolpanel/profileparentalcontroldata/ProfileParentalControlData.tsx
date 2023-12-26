import { FC } from 'react';
import styles from './ProfileParentalControlData.module.scss';
interface ProfileParentalControlDataProps {
  controlType: 'Language' | 'Viewing Restrictions' | 'Profile & Video Lock';
  contentData: string;
  actionText?: string;
  clickHandler?:(arg:ProfileParentalControlDataProps["controlType"])=>void
}
const ProfileParentalControlData: FC<ProfileParentalControlDataProps> = ({
  controlType,
  contentData,
  actionText,
  clickHandler
}) => {
  const handleAction=()=>{
    if(clickHandler){
      clickHandler(controlType)
    }
  }
  return (
    <div className={`${styles.data_row_container}`} onClick={(eve)=>{
      eve.stopPropagation()
    }}>
      <div className={`${styles.data_row_left}`}>
        <h4 className={`${styles.control_type}`}>{controlType}</h4>
        <span className={`${styles.conrol_data}`}>{contentData}</span>
        {actionText && (
          <span className={`${styles.actionText}`} onClick={handleAction}>{actionText}</span>
        )}
      </div>
      <div className={`${styles.data_row_right}`}>
        <span className={`${styles.action_btn}`} onClick={handleAction}>change</span>
      </div>
    </div>
  );
};

export default ProfileParentalControlData;
