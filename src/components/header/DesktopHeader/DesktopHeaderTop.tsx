import { createPortal } from "react-dom";
import { memo, useState } from "react";
import Modal from "@/components/modals/Modal";
import { ModalType } from "@/components/modals/modaltypes";
import styles from "../Header.module.scss";
import appConfig from "@/app.config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  updateProfile,
  updateUserProperty,
} from "@/redux/feature/userSlice/userSlice";
import { postData } from "@/services/data.manager";
import Languages from "@/components/languages/Languages";
import NetworkFilters from "@/components/NetworkFilters/NetworFilters";
import Link from "next/link";

function HeaderTop(): JSX.Element {
  const [showModal, setShowModal] = useState<ModalType>("");
  const { activeProfile } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleFilter = () => {
    document.body.style.overflowY = "hidden";
    setShowModal("network_filter");
  };

  const handlecloseModal = () => {
    document.body.style.overflowY = "scroll";
    setShowModal("");
  };

  const handleLanguages = () => {
    document.body.style.overflowY = "hidden";
    setShowModal("languages");
  };

  function updateSessionPreference(data: any) {
    let codes = data
      .filter((data: any) => data.isSelected)
      .map((data: any) => data.code);
    postData("/service/api/auth/update/session/preference", {
      // eslint-disable-next-line camelcase
      selected_lang_codes: codes.join(","),
    }).then((res) => {
      if (res.status === true) {
        dispatch(updateUserProperty({ languages: codes.join(",") }));
        dispatch(
          updateProfile({
            profileId: activeProfile ? activeProfile?.profileId : undefined,
            properties: { langs: codes.join(",") },
          }),
        );
      }
    });
  }

  function getDataFromModal(Modaldata: { from: ModalType; data: any }) {
    const { from, data } = Modaldata;
    switch (from) {
      case "languages":
        updateSessionPreference(data);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className={`${styles.header_top}`}>
        <div className={`${styles.header_topinner}`}>
          {appConfig.header.partners && (
            <div
              className={`${styles.content} ${styles.filter}`}
              onClick={handleFilter}
            >
              <img
                src={`${appConfig.cloudpath}/images/header-filter.svg`}
                alt=""
                className={`${styles.filter_icon}`}
              />
              <span className={`${styles.text}`}>Filter</span>
              <span className={`${styles.downarrow}`}></span>
            </div>
          )}

          {appConfig.header.languages && (
            <div
              className={`${styles.content} ${styles.languages}`}
              onClick={handleLanguages}
            >
              <img
                src={`${appConfig.cloudpath}/images/language-selection-icon.svg`}
                alt=""
              />
              <span className={`${styles.text}`}>Languages</span>
              <span className={`${styles.downarrow}`}></span>
            </div>
          )}

          <div className={`${styles.content}`}>About</div>

          {/* <div className={`${styles.content}`}>
            <img
              src={`${appConfig.cloudpath}/images/header-about.svg`}
              alt=""
            />
            <span className={`${styles.text}`}>Help & support</span>
          </div> */}
          {appConfig.supportmail && (
            <div className={`${styles.content}`}>
              <img
                src={`${appConfig.cloudpath}/images/header-support-mail.svg`}
                alt=""
              />
              <Link href={`mailto:${appConfig.supportmail}`}>
                <span className={`${styles.text}`}>
                  {appConfig.supportmail}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal
            modalType={showModal}
            render={(modal) => {
              function getModal() {
                switch (modal) {
                  case "languages":
                    return (
                      <Languages
                        closeModal={handlecloseModal}
                        sendDatatoComponent={getDataFromModal}
                        profileData={activeProfile || undefined}
                      />
                    );
                  case "network_filter":
                    return <NetworkFilters closeModal={handlecloseModal} />;
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

const MemoHeaderTop = memo(HeaderTop);

export default MemoHeaderTop;
