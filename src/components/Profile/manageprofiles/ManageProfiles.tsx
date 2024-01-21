import { useRouter } from "next/router"
import { SyntheticEvent, useEffect } from "react"
import styles from "./ManageProfiles.module.scss"
import { subprofileInterface } from "@/shared";
import { getAbsolutPath } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { fetchProfiles } from "@/redux/feature/userSlice/userSlice";


export default function ManageUserProfiles() {
  const { systemFeatures } = useAppSelector(state => state.configs)
  const {profiles} = useAppSelector(state=>state.user)
  const dispatch = useAppDispatch();

  const router = useRouter();
  const defaultprofileimg = 'https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg'
  useEffect(() => {
   dispatch(fetchProfiles());
  }, [])
  const handleImageonError = (e: SyntheticEvent<HTMLImageElement, ErrorEvent>) => {
    e.currentTarget.setAttribute('src', defaultprofileimg)
  }

  const handleImageonClick = (profile: subprofileInterface) => {
    console.log(profile);
    let data = {
      expireTime: new Date().getTime() + (120 * 60000),
      activeProfile: profile
    }
    localStorage.setItem('activeProfile', JSON.stringify(data));
    router.replace('/');
  }

  return (
    <div className={`${styles.ProfilePage}`}>
      <div className={`${styles.profileContainer}`}>
        <h1 className={`${styles.heading}`}>Manage Profiles</h1>
        <div className={`${styles.profiles}`}>
          {
            profiles.map((profile, index) => {
              return (<div className={`${styles.profile}`} key={index}>
                <div className={`${styles.profile_inner}`}>
                  <img
                    src={!!profile.imageUrl ? getAbsolutPath(profile.imageUrl) : defaultprofileimg}
                    onError={handleImageonError} alt={profile.name} onClick={() => handleImageonClick(profile)} />
                  {profile.isPinAvailable && <img
                    src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/profile-lock.svg`} alt="" className={`${styles.lock_icon}`} />
                  }
                  <span className={`${styles.overlay}`}></span>
                  <Link href={`/profiles/update-user-profile/${profile.profileId}/`}>
                    <img
                      src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/edit-profile.svg`} alt="" className={`${styles.edit_icon}`} />
                  </Link>
                </div>
                <span>{profile.name}</span>
              </div>)
            })
          }
          {
            Number(systemFeatures?.userprofiles?.fields?.max_profile_limit) > profiles.length && (
              <div className={`${styles.profile} ${styles.add_profile}`}>
               
                <div className={`${styles.profile_inner}`}>
                  <Link href={`/profiles/create-user-profile`}>
                  <img
                    src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/add_profile.svg`} alt="" />
                  </Link>
                  <span>Add Profile</span>
                </div>
                
              </div>
            )
          }
        </div>
        <Link href={`/profiles/select-user-profile`}>
          <button className={`${styles.profiles_btn}`}>Done</button>
        </Link>
      </div>
    </div>
  )
}