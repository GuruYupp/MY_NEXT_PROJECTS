import { FC } from 'react';
import styles from './UserSettings.module.scss';
const UserSettings: FC = () => {
  return (
    <div className={`${styles.user_settings_container}`}>
      <div className={`${styles.settings_inner}`}>
        <div className={`${styles.label}`}>Video Quality</div>
        <div className={`${styles.quality_info}`}>
          <div className={`${styles.quality_info_label}`}>
            Auto
            <div className={`${styles.quality_drop_down}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
