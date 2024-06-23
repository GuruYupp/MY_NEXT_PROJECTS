import React, { FC, useEffect, useRef, useState } from "react";
import {
  ProfileParentalControlDataProps,
  UserProfileParentalControlPanelProps,
} from "../../settingstypes";
import styles from "./UserParentalControlPanel.module.scss";
import { ModalType } from "@/components/modals/modaltypes";
import { getotpModalType } from "@/components/Getotp/getotptypes";
import { useAppSelector } from "@/redux/hooks";
import appConfig from "@/app.config";
import { createPortal } from "react-dom";
import Modal from "@/components/modals/Modal";
import Getotp from "@/components/Getotp/Getotp";
import ProfileParentalControlData from "../profileparentalcontroldata/ProfileParentalControlData";

const UserParentalControlPanel: FC<UserProfileParentalControlPanelProps> = (
  props,
) => {
  const { toggle = true, isActive, setActiveIndex, panelIndex } = props;
  console.log(isActive, "-->");
  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  const panelRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState<ModalType>("");
  const [otpModal, setOtpModal] = useState<getotpModalType>("");

  const { userDetails } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (panelRef.current) {
      if (isActive) {
        let height = panelRef.current.scrollHeight;
        panelRef.current.style.height = `${height}px`;
      } else {
        panelRef.current.style.height = `${0}px`;
      }
    }
  }, []);

  const handlePanelClick = () => {
    setActiveIndex(panelIndex);
  };

  const getProfileImage = () => {
    return defaultprofileimg;
  };

  const actionHandler = (
    handlerType: ProfileParentalControlDataProps["controlType"],
  ) => {
    switch (handlerType) {
      case "Parental Controls":
        handleOtp("Parental Controls");
        break;
      default:
        break;
    }
  };

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  const handleOtp = (type: getotpModalType) => {
    document.body.style.overflowY = "hidden";
    setShowModal("getotp");
    setOtpModal(type);
  };

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from } = Modaldata;
    switch (from) {
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
            toggle ? styles.show_arrow : ""
          }`}
        >
          <div className={`${styles.img_container} `}>
            <img src={getProfileImage()} alt="profile_img" />
          </div>
          <div className={`${styles.info_container} `}>
            <h4 className={`${styles.profile_name} `}>{userDetails?.name}</h4>
            <span className={`${styles.maturity}`}>All Maturity Settings</span>
          </div>
        </div>
        <div className={`${styles.pannel_data_container} `} ref={panelRef}>
          <ProfileParentalControlData
            controlType="Parental Controls"
            contentData={"Require PIN to watch 18+ and above rated content"}
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
                  case "getotp":
                    return (
                      <Getotp
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        type={otpModal}
                        isPasswordOtp={appConfig.profile.type === "password"}
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
};

export default UserParentalControlPanel;
