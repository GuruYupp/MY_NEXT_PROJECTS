import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "../Header.module.scss";
import { SyntheticEvent, useState } from "react";
import Link from "next/link";
import { subprofileInterface } from "@/shared";
import { getData, postData } from "@/services/data.manager";
import { useRouter } from "next/router";
import {
  updateActiveProfile,
  updateUserDetails,
} from "@/redux/feature/userSlice/userSlice";
import { ModalType } from "@/components/modals/modaltypes";
import { default as clientCookie } from "js-cookie";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import ProfilePin from "@/components/profilepin/ProfilePin";
export default function ProfileMenus() {
  const { systemFeatures, systemConfigs } = useAppSelector(
    (state) => state.configs,
  );
  const { userDetails, activeProfile } = useAppSelector((state) => state.user);
  const [showModal, setShowModal] = useState<ModalType>("");

  const [selectedProfile, setSelectedProfile] = useState<subprofileInterface>(
    {},
  );

  const dispatch = useAppDispatch();
  const { replace } = useRouter();

  const handleprofileImageonError = (e: SyntheticEvent) => {
    e.currentTarget.setAttribute(
      "src",
      "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg",
    );
  };

  function LoadHelpCenter() {
    if (userDetails) {
      window.open(
        `https://web-qa.watcho.com/contact-us?a_t=${userDetails?.authToken}&sid=${userDetails?.externalUserId}&mno=${userDetails?.phoneNumber}`,
      );
    }
  }

  function goToFaq() {
    window.open("https://faq.watcho.com/");
  }

  function handleSignout() {
    document.body.style.overflowY = "hidden";
    // setShowModal("signout");
  }

  function handleSelectProfile(profile: subprofileInterface) {
    if (profile.isProfileLockActive === true) {
      setSelectedProfile(profile);
      document.body.style.overflowY = "hidden";
      setShowModal("profilepin");
    } else {
      switchSelectedProfile(profile);
    }
  }

  async function switchSelectedProfile(
    profile: subprofileInterface,
    passcode?: string,
  ) {
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
        dispatch(updateUserDetails(userInfoResponse.response));
        dispatch(updateActiveProfile(profile));
        clientCookie.set(
          "profileExpiry",
          (new Date().getTime() + 120 * 60 * 1000).toString(),
        );
      }
    }
  }

  function hadleExitProfile() {
    localStorage.setItem("activeProfile", "");
    replace("/profiles/select-user-profile");
  }

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "profilepin":
        switchSelectedProfile(selectedProfile, data);
        break;
      default:
        break;
    }
  }

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  return (
    <div className={`${styles.profile_box}`}>
      <span className={`${styles.profile_img}`}>
        <img
          src={
            (activeProfile && activeProfile?.imageUrl) ||
            "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg"
          }
          onError={handleprofileImageonError}
          alt="profile"
        />
      </span>
      <span className={`${styles.profile_name}`}>
        {activeProfile && activeProfile?.name}
      </span>
      <div className={`${styles.profile_menu}`}>
        <ul>
          <li>
            <Link href={`/${systemConfigs?.configs?.favouritesTargetPath}`}>
              My WatchList
            </Link>
          </li>
          <li>
            <Link href={"/settings"}>Account Settings</Link>
          </li>
          {systemConfigs?.configs?.myPurchasesTargetPathWeb && (
            <li>
              <Link
                href={`/${systemConfigs?.configs?.myPurchasesTargetPathWeb}`}
              >
                My Purchases
              </Link>
            </li>
          )}
          <li className={`${styles.divider}`}></li>
          <li onClick={LoadHelpCenter}>Help & Support</li>
          <li onClick={goToFaq}>FAQ</li>
          <li onClick={handleSignout}>Sign Out</li>
        </ul>
        {systemFeatures?.userprofiles?.fields?.is_userprofiles_supported ===
          "true" && (
          <ul>
            {userDetails &&
              userDetails.profileParentalDetails?.map(
                (profile, index: number) => {
                  return (
                    profile.profileId !==
                      (activeProfile && activeProfile.profileId) && (
                      <li
                        className={`${styles.menu_profile}`}
                        key={index}
                        onClick={() => handleSelectProfile(profile)}
                      >
                        <span className={`${styles.menu_profile_img}`}>
                          <img
                            src={
                              (profile && profile?.imageUrl) ||
                              "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg"
                            }
                            onError={handleprofileImageonError}
                            alt="profile"
                          />
                        </span>
                        <span className={`${styles.menu_profile_name}`}>
                          {profile && profile?.name}
                        </span>
                        {profile?.isProfileLockActive && (
                          <img
                            src={`https://d2ivesio5kogrp.cloudfront.net/static/aastha/images/lock-icon.svg`}
                            alt=""
                            className={`${styles.lock_icon}`}
                          />
                        )}
                      </li>
                    )
                  );
                },
              )}
            <li className={`${styles.divider}`}></li>
            <li onClick={hadleExitProfile}>Exit Profile</li>
            <li>
              <Link href={`/profiles/manage-user-profile`}>Manage Profile</Link>{" "}
            </li>
          </ul>
        )}
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
    </div>
  );
}
