import { FC, useMemo, useRef, useState } from "react";
import styles from "./ProfileParentalControlPanel.module.scss";
import { subprofileInterface } from "@/shared";
import { getAbsolutPath } from "@/utils";
import ProfileParentalControlData from "./profileparentalcontroldata/ProfileParentalControlData";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Modal from "@/components/modals/Modal";
import { postData } from "@/services/data.manager";
import { createPortal } from "react-dom";
import Languages from "@/components/languages/Languages";
import Getotp from "@/components/Getotp/Getotp";
import { getotpModalType } from "@/components/Getotp/getotptypes"
import { updateProfile } from "@/redux/feature/userSlice/userSlice";
import { ModalType } from "@/components/modals/modaltypes";
interface ProfileParentalControlPanelProps {
  toggle?: boolean;
  default_open?: boolean;
  isActive: boolean;
  setActiveIndex: (index: number) => void;
  panelIndex: number;
  profileId: subprofileInterface["profileId"];
}

const ProfileParentalControlPanel: FC<ProfileParentalControlPanelProps> = ({
  toggle = true,
  isActive,
  setActiveIndex,
  panelIndex,
  profileId,
}) => {
  const default_profile_img =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  const panelRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState<ModalType>("");
  const [otpModal,setOtpModal] = useState<getotpModalType>("")
  const dispatch = useAppDispatch();
  const {userDetails} = useAppSelector(state=>state.user)
  const profile = userDetails?.profileParentalDetails?.filter((profile) => profile.profileId === profileId)[0]
  
  useMemo(() => {
    if (panelRef.current) {
      if (isActive) {
        let height = panelRef.current.scrollHeight;
        panelRef.current.style.height = `${height}px`;
      } else {
        panelRef.current.style.height = `${0}px`;
      }
    }
  }, [isActive]);

  const handlePanelClick = () => {
    setActiveIndex(panelIndex);
  };

  const getProfileImage = () => {
    if (profile?.imageUrl) return getAbsolutPath(profile.imageUrl);
    return default_profile_img;
  };

  const getLanguagesData = () => {
    let langs = profile?.langs?.split(",").slice(0, 3) || [];
    return langs.join(",");
  };

  const getLanguagesActionText = () => {
    let langs = profile?.langs?.split(",") || [];
    if (langs?.length > 3) {
      return ` +${langs.slice(3).length} more...`;
    }
    return "";
  };

  const actionHandler = (
    handlerType: "Language" | "Viewing Restrictions" | "Profile & Video Lock"
  ) => {
    switch (handlerType) {
      case "Language":
        handleLanguages();
        break;
      case "Profile & Video Lock":
        handleOtp("Profile & Video Lock")
        break;
      case "Viewing Restrictions":
        handleOtp("Viewing Restrictions")
        break;
      default:
        break;
    }
  };

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  const handleLanguages = () => {
    document.body.style.overflowY = "hidden";
    setShowModal("languages");
  };

  const handleOtp = (type:getotpModalType)=>{
    document.body.style.overflowY = "hidden";
    setShowModal("getotp")
    setOtpModal(type)
  }

  function updateLangugaes(data: any) {
    let codes = data
      .filter((data: any) => data.isSelected)
      .map((data: any) => data.code);
    // console.log(profile)
    postData("/service/api/auth/update/user/profile", {
      profileId:profile?.profileId,
      langs: codes.join(","),
      profileName:profile?.name
    }).then((res) => {
      if (res.status === true) {
        // dispatch(updateUserProperty({ languages: codes.join(',') }));
        // dispatch(
        //   updateProfile({
        //     profileId: activeProfile?.profileId,
        //     properties: { langs: codes.join(',') },
        // })
        // );
        dispatch(updateProfile({profileId:profile?.profileId,properties:{
          langs: codes.join(",")
        }}))
      }
    });
  }

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "languages":
        updateLangugaes(data);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div
        className={`${styles.pannel} ${isActive ? styles.expand : ""}`}
        onClick={handlePanelClick}
      >
        <div
          className={`${styles.pannel_inner} ${
            toggle ? styles.show_arrow : styles.hide_arrow
          }`}
        >
          <div className={`${styles.img_container} `}>
            <img src={getProfileImage()} alt="profile_img" />
          </div>
          <div className={`${styles.info_container} `}>
            <h4 className={`${styles.profile_name} `}>{profile?.name}</h4>
            <span className={`${styles.maturity}`}>
              {profile?.profileRating}
            </span>
          </div>
        </div>
        <div className={`${styles.pannel_data_container} `} ref={panelRef}>
          <ProfileParentalControlData
            controlType="Language"
            contentData={getLanguagesData()}
            actionText={getLanguagesActionText()}
            clickHandler={actionHandler}
          />
          <ProfileParentalControlData
            controlType="Viewing Restrictions"
            contentData={profile?.profileRating || ""}
            clickHandler={actionHandler}
          />
          <ProfileParentalControlData
            controlType="Profile & Video Lock"
            contentData={
              profile?.isProfileLockActive && profile?.isPinAvailable
                ? "ON"
                : "OFF"
            }
            clickHandler={actionHandler}
          />
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                console.log(modal);
                switch (modal) {
                  case "languages":
                    return (
                      <Languages
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        profileData={profile}
                      />
                    );
                  case "getotp":
                    return (
                      <Getotp
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        profileData={profile}
                        type={otpModal}
                      />
                    );
                  default:
                    return <></>;
                }
              }
              return getModal();
            }}
          />,
          document.body
        )}
    </>
  );
};

export default ProfileParentalControlPanel;
