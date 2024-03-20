import { useEffect, useState } from "react";
import styles from "./header.module.scss";
import HeaderBottom from "./headerbottom";
import HeaderTop from "./headertop";
import { useAppSelector } from "@/redux/hooks";
import MobileHeaderTop from "./MobileHeaderTop";
import MobileHeaderBottom from "./MobileHeaderBottom";
import MobileMenus from "./menus/MobileMenus";
import { useRouter } from "next/router";
import appConfig from "@/app.config";

export default function Header() {
  const { menus } = useAppSelector((state) => state.configs);
  const { banners, info } = useAppSelector((state) => state.pageData.response);
  const [headerGradient, setheaderGradient] = useState<boolean>(true);
  const [moveheaderTop, setmoveheaderTop] = useState<boolean>(false);
  const [toggleHeader, setToggleHeader] = useState<"web" | "mobileweb">(
    "mobileweb",
  );
  const [showMobileHeader, setShowMobileHeader] = useState<boolean>(false);

  const { asPath } = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setheaderGradient(false);
        if (appConfig.header.topheader === true) setmoveheaderTop(true);
      } else {
        if (
          banners.length === 0 &&
          ((info.pageType === "details" &&
            info.attributes?.contentType === "network") ||
            info.pageType === "list" ||
            info.pageType === "player" ||
            info.pageType === "content" ||
            asPath === "/settings")
        ) {
          setheaderGradient(false);
        } else {
          setheaderGradient(true);
        }
        if (appConfig.header.topheader === true) setmoveheaderTop(false);
      }
    };
    // console.log(asPath);
    if (
      banners.length === 0 &&
      ((info.pageType === "details" &&
        info.attributes?.contentType === "network") ||
        info.pageType === "list" ||
        info.pageType === "player" ||
        info.pageType === "content" ||
        asPath === "/settings")
    ) {
      // console.log('haasss');
      setheaderGradient(false);
    } else {
      setheaderGradient(true);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [banners]);

  useEffect(() => {
    let bodyELe = document.querySelector("body");
    const resizeObserver = new ResizeObserver(() => {
      if (window.innerWidth > 950) {
        setToggleHeader("web");
      } else {
        setToggleHeader("mobileweb");
        handleMobileheaderToggle();
      }
    });
    if (bodyELe) {
      resizeObserver.observe(bodyELe);
    }
    handleMobileheaderToggle();
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMobileheaderToggle = () => {
    const hideheaderPaths = ["/search", "/settings", "/settings/edit-profile"];

    if (hideheaderPaths.includes(asPath) || asPath.includes("profile-lock/")) {
      setShowMobileHeader(false);
    } else {
      setShowMobileHeader(true);
    }
  };

  const showMobileHeaderc2 = () => {
    if (info.pageType === "player" || info.pageType === "details") {
      return false;
    }
    return true;
  };
  return (
    <div
      className={`${styles.header_container} ${
        moveheaderTop === true ? styles.move_top : ""
      }`}
    >
      {toggleHeader === "web" && (
        <>
          {appConfig.header.topheader === true && <HeaderTop />}
          <HeaderBottom menus={menus} headerGradient={headerGradient} />
        </>
      )}
      {toggleHeader === "mobileweb" && (
        <>
          {showMobileHeader && showMobileHeaderc2() && (
            <div className={`${styles.mobile_header_container}`}>
              <MobileHeaderTop />
              <MobileHeaderBottom
                menus={menus}
                headerGradient={headerGradient}
              />
            </div>
          )}
          <MobileMenus menus={menus} />
        </>
      )}
    </div>
  );
}
