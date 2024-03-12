import styles from "./header.module.scss";
import { menuInterface } from "@/shared";
import Menus from "./menus/Menus";
import Link from "next/link";
// import getConfig from "next/config";
import appConfig from "@/app.config";
import { useAppSelector } from "@/redux/hooks";
import { memo } from "react";
// import { createPortal } from "react-dom";
// import Modal from "../modals/Modal";
// import {ModalType } from "../modals/modaltypes";
import ProfileMenus from "./profileMenus/ProfileMenus";
// let appConfig = getConfig().publicRuntimeConfig.appconfig;
interface props {
  menus: menuInterface[];
  headerGradient: boolean;
}

function HeaderBottom({ menus, headerGradient }: props): JSX.Element {
  const { isLoggedin } = useAppSelector((state) => state.user);
  const { systemConfigs } = useAppSelector((state) => state.configs);
  let showPackages = systemConfigs.configs?.showPackages || false;
  // const [showModal, setShowModal] = useState<ModalType>("");

  // function handlecloseModal() {
  //   document.body.style.overflowY = "scroll";
  //   setShowModal("");
  // }

  return (
    <div
      className={`${styles.header_bottom} ${
        headerGradient ? styles.hasGradient : styles.noGradient
      }`}
    >
      <div className={`${styles.header_bottominner}`}>
        <div className={`${styles.headerbottom_left}`}>
          <div className={`${styles.logo}`}>
            <img
              src={`${appConfig.headerIconpath}`}
              width={85}
              height={30}
              alt="logo"
            />
          </div>
          <Menus menus={menus} />
        </div>
        <div className={`${styles.headerbottom_right}`}>
          <div className={`${styles.others}`}>
            <div className={`${styles.otherbtns} ${styles.search}`}>
              {/* <img
                src={`${appConfig.cloudpath}/images/search-icon.svg`}
                alt=""
             /> */}
              <Link href="/search">
                <img
                  src={`https://d2ivesio5kogrp.cloudfront.net/static/kandidtv/images/search-icon.svg`}
                  alt="logo"
                />
                Search
              </Link>
            </div>
            {showPackages == "true" && (
              <div className={`${styles.otherbtns} ${styles.pricing}`}>
                <span>Pricing</span>
              </div>
            )}
            {isLoggedin === false && (
              <>
                <div className={`${styles.authcontainer}`}>
                  <Link
                    href={"/signin"}
                    className={`${styles.otherbtns} ${styles.authbtn} ${styles.signinbtn}`}
                  >
                    signin
                  </Link>
                </div>
                <div className={`${styles.authcontainer}`}>
                  <Link
                    href={"/signup"}
                    className={`${styles.otherbtns} ${styles.authbtn} ${styles.signupbtn}`}
                  >
                    signup
                  </Link>
                </div>
              </>
            )}
            {isLoggedin === true && <ProfileMenus />}
          </div>
        </div>
      </div>
      {/* {showModal &&
        createPortal(
          <Modal modalType={showModal} closeModal={handlecloseModal} />,
          document.body
        )
        } */}
    </div>
  );
}

const MemoHeaderBottom = memo(HeaderBottom);

export default MemoHeaderBottom;
