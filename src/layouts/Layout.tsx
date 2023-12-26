import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Init } from '@/clientapis';
import {
  addSystemConfigs,
  addSystemFeatures,
} from '@/redux/feature/configSlice/configSlice';
import {
  setActivepackages,
  setActiveprofile,
  setLoggedin,
} from '@/redux/feature/userSlice/userSlice';
import { useAppDispatch } from '@/redux/hooks';
import Loading from '@/components/shared/Loading';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';

function Layout({ children }: { children: ReactNode }) {
  const { reload ,asPath} = useRouter();
  const [isLoading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  useEffect(function () {
    console.log('kkkk')
    let isrenderd = false;
    Init().then(({ systemConfigs, systemfeature }) => {
      if (
        (systemConfigs.status == false && systemConfigs?.error?.code == 401) ||
        (systemfeature.status == false && systemfeature?.error?.code == 401)
      ) {
        localStorage.clear();
        reload();
      } else {
        if (isrenderd == false) {
          dispatch(addSystemConfigs(systemConfigs.response));
          dispatch(addSystemFeatures(systemfeature.response.systemFeatures));
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

  const isheaderShown =()=> (!asPath.includes("sign") && !asPath.includes("profiles"))
  const isfooterShown =() => (!asPath.includes("sign") && !asPath.includes("profiles"))

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
