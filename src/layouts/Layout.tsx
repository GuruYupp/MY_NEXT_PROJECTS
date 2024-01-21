import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Init } from '@/clientapis';
import {
  addSystemConfigs,
  addSystemFeatures,
  setutUser,
} from '@/redux/feature/configSlice/configSlice';
import {
  setActivepackages,
  setActiveprofile,
  setLoggedin,
} from '@/redux/feature/userSlice/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Loading from '@/components/shared/Loading';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import { SSOParamsType } from '@/shared';

function Layout({ children }: { children: ReactNode }) {
  const { reload ,asPath,query} = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);
  const {isutUser} = useAppSelector((state)=>state.configs)

  const dispatch = useAppDispatch();
  useEffect(function () {
    let isrenderd = false;
    let ssoparams: SSOParamsType | undefined;
    if(asPath.includes('sso/manage')){
      ssoparams = query as SSOParamsType
    }
    Init(ssoparams).then(({ systemConfigs, systemfeature }) => {
      if (
        (systemConfigs.status == false && systemConfigs?.error?.code == 401) ||
        (systemfeature.status == false && systemfeature?.error?.code == 401)
      ) {
        // localStorage.clear();
        // reload();
      } else {
        if (isrenderd == false) {
          dispatch(addSystemConfigs(systemConfigs.response));
          dispatch(addSystemFeatures(systemfeature.response.systemFeatures));
          dispatch(setutUser())
          dispatch(setLoggedin());
          dispatch(setActiveprofile());
          dispatch(setActivepackages());
          setLoading(false);
        }
      }
    });
    return () => {
      setLoading(false);
      isrenderd = true;
    };
  }, []);


  const isheaderShown = () => (!asPath.includes("sign") && !asPath.includes("profiles") && !asPath.includes("change-password") && isutUser !== true)
  const isfooterShown = () => (!asPath.includes("sign") && !asPath.includes("profiles") && !asPath.includes("change-password") && isutUser !== true)

  return (
    <Loading showLoading={isLoading}>
      <div style={{ minHeight: "100vh" }}>
        {isheaderShown() && <Header />}
        {children}
        {isfooterShown() && <Footer />}
      </div>
    </Loading>
  );
}

export default Layout;
