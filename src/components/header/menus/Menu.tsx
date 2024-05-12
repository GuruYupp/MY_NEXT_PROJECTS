import { menuInterface } from "@/shared";
import styles from "./Menus.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
interface props {
  menu: menuInterface;
}

function LinkWrapper({
  menu,
  children,
}: {
  menu: menuInterface;
  children: ReactNode;
}) {
  let targetpath =
    menu.targetPath.indexOf("http") > -1
      ? menu.targetPath
      : `/${menu.targetPath}`;
  return menu.subMenus.length === 0 ? (
    <Link href={targetpath}>{children}</Link>
  ) : (
    <span className={`${styles.more_menu} ${styles.menu}`}>{children}</span>
  );
}

function SubMenu({ submenus }: { submenus: menuInterface[] }) {
  return (
    <div className={`${styles.menu} ${styles.submenus}`}>
      {submenus.map((menu, index) => (
        <LinkWrapper menu={menu} key={index}>
          <div className={`${styles.menu}`}>
            <span>{menu.displayText}</span>
          </div>
          {menu.subMenus.length > 0 && <SubMenu submenus={menu.subMenus} />}
        </LinkWrapper>
      ))}
    </div>
  );
}

export default function Menu({ menu }: props) {
  const { asPath } = useRouter();

  const checkPathinsubmenu = () => {
    if (menu.subMenus.length === 0) return false;
    let path = asPath.split("/")[1];
    if (path) {
      let pathFound = false;
      menu.subMenus.forEach((menu: menuInterface) => {
        if (menu.targetPath === path) pathFound = true;
      });
      return pathFound;
    }
    return false;
  };

  const isActive: boolean =
    asPath == `/${menu.targetPath}` ||
    (asPath == "/" && menu.targetPath == "home") ||
    checkPathinsubmenu()
      ? true
      : false;
  // const [showsubMenu, setShowSubMenu] = useState<boolean>(false);

  // const handleMouseEnter = () => {
  //   setShowSubMenu(true);
  // };
  // const handleMouseLeave = () => {
  //   setShowSubMenu(false);
  // };

  return (
    <LinkWrapper menu={menu}>
      <div
        className={`${styles.menu} ` + (isActive ? styles.active : "")}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
        <span className={`${styles.displayText} `}>{menu.displayText}</span>
        {menu.subMenus.length > 0 && <SubMenu submenus={menu.subMenus} />}
      </div>
    </LinkWrapper>
  );
}
