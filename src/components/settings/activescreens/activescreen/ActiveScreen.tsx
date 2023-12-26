import { FC } from 'react';
import { activeScreenInterface } from '../activescreensSlice';
import styles from './ActiveScreen.module.scss';

interface ActiveScreenProps {
  activeScreen: activeScreenInterface;
}

const ActiveScreen: FC<ActiveScreenProps> = (props) => {
  const { activeScreen } = props;
  const getDeviceIcon = () => {
    return activeScreen.deviceId === 5
      ? '/images/web_browser.png'
      : '/images/mobile_browser.png';
  };
  return (
    <div className={`${styles.active_screen_container}`}>
      <div className={`${styles.active_screen}`}>
        <div className={`${styles.active_screen_left}`}>
          <div className={`${styles.device_img_container}`}>
            {activeScreen.deviceId === 5 && (
              <img src={getDeviceIcon()} alt="mobile_browser_icon" />
            )}
          </div>
          <div className={`${styles.device_info}`}>
            <h5 className={`${styles.device_type}`}>
              {activeScreen.deviceTypeDetails.name}
            </h5>
            <span className={`${styles.device_subtype}`}>
              {activeScreen.deviceSubtype}
            </span>
          </div>
        </div>
        <div className={`${styles.active_screen_right}`}>
          <span
            className={`${styles.action_btn} ${
              activeScreen.isCurrentDevice ? styles.disable : ''
            }`}
          >
            {activeScreen.isCurrentDevice ? 'Current Device' : 'Logout Device'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveScreen;
