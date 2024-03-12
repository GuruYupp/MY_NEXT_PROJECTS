import { FC, useState, MouseEvent } from "react";
import styles from "./UserSettings.module.scss";
const UserSettings: FC = () => {
  const [showquality, setshowQuality] = useState<boolean>(false);
  const handleToggle = (e: MouseEvent) => {
    // console.log('hhheheh')
    setshowQuality(!showquality);
    e.stopPropagation();
  };
  console.log(showquality, "---");
  return (
    <div className={`${styles.user_settings_container}`}>
      <div className={`${styles.settings_inner}`}>
        <div className={`${styles.label}`}>Video Quality</div>
        <div className={`${styles.quality_info}`}>
          <div
            className={`${styles.quality_info_label}`}
            onClick={handleToggle}
          >
            Auto
          </div>
          <div
            className={`${styles.quality_drop_down} ${showquality ? styles.show : ""}`}
          >
            <div className={`${styles.quality}`}>Auto</div>
            <div className={`${styles.quality}`}>Best</div>
            <div className={`${styles.quality}`}>Better</div>
            <div className={`${styles.quality}`}>Good</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
