import { useAppSelector } from "@/redux/hooks";
import styles from "./socialLogins.module.scss";
import appConfig from "@/app.config";

const SocialLogins = () => {
  const { sociallogin } = useAppSelector(
    (state) => state.configs.systemFeatures
  );

  return (
    <div className={`${styles.sociallogins_div}`}>
      {sociallogin?.fields?.facebook === "true" && (
        <button
          className={`${styles.sociallogin_btn} ${styles.facebook_login}`}
        >
          <img
            src={`${appConfig.cloudpath}/images/facebook-logo.png`}
            alt=""
            className={`${styles.filter_icon}`}
          />
          <span> Login with Facebook</span>
        </button>
      )}
      {sociallogin?.fields?.google === "true" && (
        <button className={`${styles.sociallogin_btn} ${styles.google_login}`}>
          <img
            src={`${appConfig.cloudpath}/images/google-icon.png`}
            alt=""
            className={`${styles.filter_icon}`}
          />
          <span>Login with Google</span>
        </button>
      )}
    </div>
  );
};

export default SocialLogins;
