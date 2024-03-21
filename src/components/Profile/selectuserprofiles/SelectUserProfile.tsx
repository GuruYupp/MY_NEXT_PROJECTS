import { useRouter } from "next/router";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
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
import { ModalType } from "@/components/modals/modaltypes";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import ProfilePin from "@/components/profilepin/ProfilePin";

export default function SelectUserProfiles() {
  const { systemFeatures } = useAppSelector((state) => state.configs);
  const { profiles } = useAppSelector((state) => state.user);
  const [showModal, setShowModal] = useState<ModalType>("");
  const [pinerrmsg, setPinerrmsg] = useState<string>("");
  const [selectedProfile, setSelectedProfile] = useState<subprofileInterface>(
    {},
  );
  const errortexttimer = useRef<ReturnType<typeof setTimeout>>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  useEffect(() => {
    dispatch(fetchProfiles());
    return () => {
      clearTimeout(errortexttimer.current);
    };
  }, []);
  const handleImageonError = (
    e: SyntheticEvent<HTMLImageElement, ErrorEvent>,
  ) => {
    e.currentTarget.setAttribute("src", defaultprofileimg);
  };

  const handleImageonClick = (profile: subprofileInterface) => {
    if (profile.isProfileLockActive === true) {
      setSelectedProfile(profile);
      document.body.style.overflowY = "hidden";
      setShowModal("profilepin");
    } else {
      handleSelectProfile(profile);
    }
  };

  const handleSelectProfile = async (
    profile: subprofileInterface,
    passcode?: string,
  ) => {
    let payload: any = {
      profileId: profile.profileId,
    };

    if (passcode) {
      payload.passCode = passcode;
    }
    let profileselectResponse = await postData(
      "/service/api/auth/activate/user/profile",
      payload,
    );
    if (profileselectResponse.status === true) {
      if (passcode) {
        document.body.style.overflowY = "scroll";
        setShowModal("");
      }
      let userInfoResponse = await getData("/service/api/auth/user/info");
      if (userInfoResponse.status === true) {
        localStorage.setItem(
          "userDetails",
          JSON.stringify(userInfoResponse.response),
        );
        localStorage.setItem("activeProfile", JSON.stringify(profile));
        clientCookie.set(
          "profileExpiry",
          (new Date().getTime() + 120 * 60 * 1000).toString(),
        );
        dispatch(setActiveprofile());
        router.replace("/");
      }
    } else {
      setPinerrmsg(profileselectResponse.error?.message || "");
      errortexttimer.current = setTimeout(() => {
        setPinerrmsg("");
      }, 1000);
    }
  };

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "profilepin":
        handleSelectProfile(selectedProfile, data);
        break;
      default:
        break;
    }
  }

  return (
    <>
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
                    {(profile.isPinAvailable && !profile.isPinExpired) && (
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
            <button className={`${styles.profiles_btn}`}>
              Manage Profiles
            </button>
          </Link>
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "profilepin":
                    return (
                      <ProfilePin
                        closeModal={handlecloseModal}
                        profileData={selectedProfile}
                        sendDatatoComponent={getDataFromModal}
                        pinerrMsg={pinerrmsg}
                      />
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body,
        )}
    </>
  );
}
