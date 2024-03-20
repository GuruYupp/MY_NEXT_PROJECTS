import styles from "./header.module.scss";
import { menuInterface } from "@/shared";
// import Menus from "./menus/Menus";
import Link from "next/link";
// import getConfig from "next/config";
// import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// let appConfig = getConfig().publicRuntimeConfig.appconfig;
interface props {
  menus: menuInterface[];
  headerGradient: boolean;
}

export default function MobileHeaderBottom({
  menus,
  headerGradient,
}: props): JSX.Element {
  // const [Menus, setMenus] = useState<menuInterface[]>([]);
  // const [moreMenu, setMoreMenu] = useState<menuInterface>()
  const [subMenus, setSubMenus] = useState<menuInterface[]>([]);
  // const { systemConfigs } = useAppSelector(state => state.configs);
  const { asPath } = useRouter();

  useEffect(() => {
    getMenus();
    return () => {};
  }, [asPath]);

  function getMenus() {
    let targetPath: string;
    targetPath = asPath;
    if (asPath == "/") targetPath = "/home";
    menus.forEach((menu) => {
      console.log(menu);
      if (`/${menu.targetPath}` === targetPath && menu.params.web === "false") {
        setSubMenus([...menu.subMenus]);
      }
    });
  }

  const isActive: (arg: menuInterface) => boolean = (menu) =>
    asPath == `/${menu.targetPath}` ||
    (asPath == "/" && menu.targetPath == "home")
      ? true
      : false;

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
          >
            <span className={`${styles.displayText} `}>{menu.displayText}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
