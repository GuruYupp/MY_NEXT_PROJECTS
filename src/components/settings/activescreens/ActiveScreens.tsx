import { FC, useEffect, useReducer } from "react";
import styles from "./ActiveScreens.module.scss";
import { getData } from "@/services/data.manager";
import { activescreensReducer, addScreensAction } from "./activescreensSlice";
import { default as clientCookie } from "js-cookie";
import ActiveScreen from "./activescreen/ActiveScreen";

const ActiveScreens: FC = () => {
  const [screens, screensDispatch] = useReducer(activescreensReducer, []);
  useEffect(() => {
    fetchActiveScreens();
  }, []);

  const fetchActiveScreens = async () => {
    try {
      let activescreensresponse = await getData(
        "/service/api/auth/list/user/sessions",
      );

      if (activescreensresponse.status === true) {
        screensDispatch(addScreensAction(activescreensresponse.response));
      } else if (activescreensresponse.error?.code === 401) {
        clientCookie.remove("boxId");
        clientCookie.remove("tenantCode");
        clientCookie.remove("sessionId");
        clientCookie.remove("isLoggedin");
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={`${styles.actvie_screens_container}`}>
      <div className={`${styles.active_btn_wrapper}`}>
        <button className={`${styles.btn}`}>Active Devices</button>
      </div>
      <div className={`${styles.active_screens}`}>
        {screens.map((screen, index) => (
          <ActiveScreen activeScreen={screen} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ActiveScreens;
