import styles from "../Header.module.scss";

import React, { FC } from "react";
import { DesktoHeaderPropsInterface } from "../headertype";
import appConfig from "@/app.config";
import { useAppSelector } from "@/redux/hooks";
import HeaderTop from "./DesktopHeaderTop";
import HeaderBottom from "./DesktopHeaderBottom";

const DeskTopHeader: FC<DesktoHeaderPropsInterface> = (props) => {
  const { moveheaderTop, headerGradient } = props;
  const { menus } = useAppSelector((state) => state.configs);
  return (
    <div
      className={`${styles.header_container} ${
        moveheaderTop === true ? styles.move_top : ""
      }`}
    >
      {appConfig.header.topheader === true && <HeaderTop />}
      <HeaderBottom menus={menus} headerGradient={headerGradient} />
    </div>
  );
};

export default DeskTopHeader;
