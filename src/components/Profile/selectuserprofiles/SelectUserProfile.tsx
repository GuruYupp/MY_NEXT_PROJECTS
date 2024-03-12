import { useRouter } from "next/router";
import { SyntheticEvent, useEffect } from "react";
import styles from "./SelectUserProfile.module.scss";
import { subprofileInterface } from "@/shared";
import { getAbsolutPath } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import {
  fetchProfiles,
  setActiveprofile,
} from "@/redux/feature/userSlice/userSlice";
import { getData, postData } from "@/services/data.manager";
import { default as clientCookie } from "js-cookie";

export default function SelectUserProfiles() {
  const { systemFeatures } = useAppSelector((state) => state.configs);
  const { profiles } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  useEffect(() => {
    dispatch(fetchProfiles());
  }, []);
  const handleImageonError = (
    e: SyntheticEvent<HTMLImageElement, ErrorEvent>,
  ) => {
    e.currentTarget.setAttribute("src", defaultprofileimg);
  };

  const handleImageonClick = (profile: subprofileInterface) => {
    postData("/service/api/auth/activate/user/profile", {
      profileId: profile.profileId,
    }).then((data) => {
      if (data.status === true) {
        getData("/service/api/auth/user/info").then((data) => {
          if (data.status === true) {
            localStorage.setItem("userDetails", JSON.stringify(data.response));
            localStorage.setItem("activeProfile", JSON.stringify(profile));
            clientCookie.set(
              "profileExpiry",
              (new Date().getTime() + 120 * 60 * 1000).toString(),
            );
            dispatch(setActiveprofile());
            router.replace("/");
          }
        });
      }
    });
  };

  return (
    <div className={`${styles.ProfilePage}`}>
      <div className={`${styles.profileContainer}`}>
        <h1 className={`${styles.heading}`}>Who's watching ?</h1>
        <div className={`${styles.profiles}`}>
          {profiles.map((profile, index) => {
            return (
              <div className={`${styles.profile}`} key={index}>
                <div className={`${styles.profile_inner}`}>
                  <img
                    src={
                      !!profile.imageUrl
                        ? getAbsolutPath(profile.imageUrl)
                        : defaultprofileimg
                    }
                    onError={handleImageonError}
                    alt={profile.name}
                    onClick={() => handleImageonClick(profile)}
                  />
                  {profile.isPinAvailable && (
                    <img
                      src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/profile-lock.svg`}
                      alt=""
                      className={`${styles.lock_icon}`}
                    />
                  )}
                </div>
                <span>{profile.name}</span>
              </div>
            );
          })}
          {Number(systemFeatures?.userprofiles?.fields?.max_profile_limit) >
            profiles.length && (
            <div className={`${styles.profile} ${styles.add_profile}`}>
              <div className={`${styles.profile_inner}`}>
                <Link href={`/profiles/create-user-profile`}>
                  <img
                    src={`https://d2ivesio5kogrp.cloudfront.net/static/reeldrama/images/add_profile.svg`}
                    alt=""
                  />
                </Link>
                <span>Add Profile</span>
              </div>
            </div>
          )}
        </div>
        <Link href={`${"/profiles/manage-user-profile"}`}>
          <button className={`${styles.profiles_btn}`}>Manage Profiles</button>
        </Link>
      </div>
    </div>
  );
}
