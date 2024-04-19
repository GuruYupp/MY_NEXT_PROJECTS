import styles from "../Header.module.scss";
import { menuInterface } from "@/shared";
import Menus from "../menus/Menus";
import Link from "next/link";
import appConfig from "@/app.config";
import { useAppSelector } from "@/redux/hooks";
import { memo } from "react";
import ProfileMenus from "./profileMenus/ProfileMenus";
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

  const getSinginUpbtnPrimaryClass = (type: "signin" | "signup") => {
    let authbtnClass = `${styles.authbtn}`;
    if ((!appConfig.header.signup && type === "signin") || type === "signup") {
      return `${authbtnClass} ${styles.authactivebtn}`;
    } else {
      return authbtnClass;
    }
  };

  return (
    <div
      className={`${styles.header_bottom} ${
        headerGradient ? styles.hasGradient : styles.noGradient
      }`}
    >
      <div className={`${styles.header_bottominner}`}>
        <div className={`${styles.headerbottom_left}`}>
          <div className={`${styles.logo}`}>
            <img src={`${appConfig.headerIconpath}`} alt="logo" />
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
                    className={getSinginUpbtnPrimaryClass("signin")}
                  >
                    sign in
                  </Link>
                </div>
                {appConfig.header.signup && (
                  <div className={`${styles.authcontainer}`}>
                    <Link
                      href={"/signup"}
                      className={getSinginUpbtnPrimaryClass("signup")}
                    >
                      sign up
                    </Link>
                  </div>
                )}
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
