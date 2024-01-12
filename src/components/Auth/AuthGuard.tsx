import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedin, activeProfile } = useAppSelector((state) => state.user);
  const { asPath, replace } = useRouter();
  const [loadchildren, setLoadChildren] = useState<boolean>(false);
  const protectedpaths = ['/settings','/settings/edit-profile']
  useEffect(() => {
    if (protectedpaths.indexOf(asPath) > -1 && isLoggedin === false) {
      replace('/signin');
    } else if (activeProfile === '' && isLoggedin === true) {
      replace('/profiles/select-user-profile');
    } else {
      setLoadChildren(true);
    }
  }, [asPath]);

  if (isLoggedin === true) {
    if (activeProfile !== '') {
      return <>{children}</>;
    }
    return loadchildren === true ? <>{children}</> : <></>;
  } else {
    return loadchildren === true ? <>{children}</> : <></>;
  }
}

export default AuthGuard;

/*

login

if(activeProfile === ""){
  return <Profiles />
}
else{
  return <>{children}</>
}

logout

if(aspath == "/profiles/select-user-profile"){
  replace(''/signin)
  return <><>
}
else{
  return <>{children}</>
}

*/
