import { memo, useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/router";
import appConfig from "@/app.config";
import DeskTopHeader from "./DesktopHeader/DesktopHeader";
import MobileHeader from "./MobileHeader/MobileHeader";

function Header() {
  const { banners, info } = useAppSelector((state) => state.pageData.response);
  const [headerGradient, setheaderGradient] = useState<boolean>(true);
  const [moveheaderTop, setmoveheaderTop] = useState<boolean>(false);
  const [toggleHeader, setToggleHeader] = useState<"web" | "mobileweb">("web");
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
  }, [asPath]);

  const handleMobileheaderToggle = () => {
    const hideheaderPaths = ["/search", "/settings", "/settings/edit-profile"];

    if (hideheaderPaths.includes(asPath) || asPath.includes("profile-lock/")) {
      setShowMobileHeader(false);
    } else {
      setShowMobileHeader(true);
    }
  };

  return (
    <>
      {toggleHeader === "web" && (
        <DeskTopHeader
          moveheaderTop={moveheaderTop}
          headerGradient={headerGradient}
        />
      )}
      {toggleHeader === "mobileweb" && (
        <MobileHeader
          moveheaderTop={moveheaderTop}
          headerGradient={headerGradient}
          showMobileHeader={showMobileHeader}
        />
      )}
    </>
  );
}

const MemoHeader = memo(Header);

export default MemoHeader;
