import { FC, useEffect, useReducer } from 'react';
import styles from './ActiveScreens.module.scss';
import { getData } from '@/services/data.manager';
import { activescreensReducer, addScreensAction } from './activescreensSlice';
import { default as clientCookie } from 'js-cookie';
import ActiveScreen from './activescreen/ActiveScreen';

const ActiveScreens: FC = () => {
  const [screens, screensDispatch] = useReducer(activescreensReducer, []);
  useEffect(() => {
    fetchActiveScreens();
  }, []);

  const fetchActiveScreens = async () => {
    let active_screens_response = await getData(
      '/service/api/auth/list/user/sessions'
    );

    if (active_screens_response.status === true) {
      screensDispatch(addScreensAction(active_screens_response.response));
    } else if (active_screens_response.error?.code === 401) {
      clientCookie.remove('boxId');
      clientCookie.remove('tenantCode');
      clientCookie.remove('sessionId');
      window.location.reload();
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
