import styles from "../Header.module.scss";
import { menuInterface } from "@/shared";
// import Menus from "./menus/Menus";
import Link from "next/link";
// import getConfig from "next/config";
// import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

// let appConfig = getConfig().publicRuntimeConfig.appconfig;
interface props {
  menus: menuInterface[];
  headerGradient: boolean;
  activeMobileMenu: menuInterface | undefined;
}

export default function MobileHeaderBottom({
  menus,
  headerGradient,
  activeMobileMenu,
}: props): JSX.Element {
  // const [Menus, setMenus] = useState<menuInterface[]>([]);
  // const [moreMenu, setMoreMenu] = useState<menuInterface>()
  const [subMenus, setSubMenus] = useState<menuInterface[]>([]);
  const [activeSubmenu, setactiveSubmenu] = useState<menuInterface | undefined>(
    activeMobileMenu,
  );
  // const { systemConfigs } = useAppSelector(state => state.configs);
  // const { asPath } = useRouter();

  useEffect(() => {
    getMenus(activeMobileMenu);
    setactiveSubmenu(activeMobileMenu);
    return () => {};
  }, [activeMobileMenu]);

  const checkPathinsubmenu = (menu: menuInterface) => {
    if (menu.subMenus.length === 0) return false;
    // let path = asPath.split("/")[1];
    // if (path) {
    let pathFound = false;
    menu.subMenus.forEach((menu: menuInterface) => {
      // console.log(menu.targetPath,'---',activeMobileMenu?.targetPath)
      if (menu.targetPath === activeSubmenu?.targetPath) pathFound = true;
    });
    return pathFound;
    // }
    // return false;
  };

  function getMenus(activeSubmenu: menuInterface | undefined) {
    // let targetPath: string;
    // targetPath = asPath;
    // if (asPath == "/") targetPath = "/home";
    menus.forEach((menu) => {
      // console.log(menu);
      //&& menu.params.web === "false"
      //`/${menu.targetPath}` === targetPath
      if (
        (menu.params.web !== "true" &&
          menu.targetPath === activeSubmenu?.targetPath) ||
        checkPathinsubmenu(menu)
      ) {
        setSubMenus([...menu.subMenus]);
      }
    });
  }

  const isActive: (arg: menuInterface) => boolean = (menu) => {
    return menu.targetPath === activeSubmenu?.targetPath;
  };
  // asPath == `/${menu.targetPath}` ||
  // (asPath == "/" && menu.targetPath == "home")
  //   ? true
  //   : false;

  const handleClickMobileMenu = (menu: menuInterface) => {
    setactiveSubmenu(menu);
  };

  return (
    <div
      className={`${styles.mobile_header_bottom} ${
        headerGradient ? styles.hasGradient : styles.noGradient
      }`}
    >
      {subMenus.map((menu, index) => (
        <Link href={`${menu.targetPath}`} key={index}>
          <div
            className={
              `${styles.menu} ` + (isActive(menu) ? styles.active : "")
            }
            onClick={() => handleClickMobileMenu(menu)}
          >
            <span className={`${styles.displayText} `}>{menu.displayText}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
