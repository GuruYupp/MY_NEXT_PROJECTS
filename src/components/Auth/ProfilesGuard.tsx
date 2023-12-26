import { useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/router"
import { ReactNode, useEffect, } from "react"


function ProfileGuard({ children }: { children: ReactNode }) {
  const { isLoggedin,userDetails} = useAppSelector(state => state.user);
  const { asPath, replace ,back} = useRouter()

  useEffect(() => {

    console.log(userDetails?.name,'---')
    
    if ((asPath.includes("/profiles/") || asPath.includes("add-profile-name")) && isLoggedin === false) {
      replace('/signin')
    }
    else if ((asPath.includes("add-profile-name") && !userDetails?.firstName) && isLoggedin === true){
      back()
    }
    
  }, [asPath])

  if (isLoggedin === true) {
      return <>{children}</>
  }
  else {
    return <></>
  }
}

export default ProfileGuard;
