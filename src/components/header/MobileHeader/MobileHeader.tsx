import React, { FC, useState } from "react";
import { MobileHeaderPropsInterface } from "../headertype";
import styles from "../Header.module.scss";
import MobileHeaderTop from "./MobileHeaderTop";
import MobileHeaderBottom from "./MobileHeaderBottom";
import { useAppSelector } from "@/redux/hooks";
import MobileMenus from "./MobileMenus/MobileMenus";
import { menuInterface } from "@/shared";

const MobileHeader: FC<MobileHeaderPropsInterface> = (props) => {
  const { showMobileHeader, moveheaderTop, headerGradient } = props;
  const { menus } = useAppSelector((state) => state.configs);
  const [activeMobileMenu, setactiveMobileMenu] = useState<
    menuInterface | undefined
  >();
  const handleActiveMobilemenu = (menu: menuInterface) => {
    setactiveMobileMenu(menu);
  };

  return (
    <>
      {showMobileHeader && (
        <div
          className={`${styles.header_container} ${
            moveheaderTop === true ? styles.move_top : ""
          }`}
        >
          <div className={`${styles.mobile_header_container}`}>
            <MobileHeaderTop />
            <MobileHeaderBottom
              menus={menus}
              headerGradient={headerGradient}
              activeMobileMenu={activeMobileMenu}
            />
          </div>
        </div>
      )}
      <MobileMenus
        menus={menus}
        handleActiveMobilemenu={handleActiveMobilemenu}
        activeMobileMenu={activeMobileMenu}
      />
    </>
  );
};

export default MobileHeader;
