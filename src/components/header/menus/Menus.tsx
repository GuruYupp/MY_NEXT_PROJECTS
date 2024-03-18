import { menuInterface } from "@/shared";
import styles from "./menus.module.scss";
import Menu from "./menu";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { debunceFunction } from "@/utils";
interface props {
  menus: menuInterface[];
}
export default function Menus({ menus }: props): JSX.Element {
  const [Menus, setMenus] = useState<menuInterface[]>([]);
  const [moreMenu, setMoreMenu] = useState<menuInterface>();
  const { systemConfigs } = useAppSelector((state) => state.configs);

  function getMenus() {
    let moremenuconfigs = systemConfigs?.configs?.menusMore || "{ \"above_1366\":\"7\" , \"above_1200\":\"6\" , \"above_950\":\"5\" }";
    if (moremenuconfigs) {
      let configobj = JSON.parse(moremenuconfigs);
      let configobjkeys = Object.keys(configobj);
      let configmenures = configobjkeys.map((key) =>
        parseInt(key.split("_")[1]),
      );
      for (let i = 0; i < configmenures.length; i++) {
        if (window.innerWidth >= configmenures[i]) {
          let showmenus = parseInt(configobj[configobjkeys[i]]) - 1;
          let webmenus = menus;
          // let web_menus = menus.filter((menu) => (menu.params.web === "true"))
          setMenus(webmenus.slice(0, showmenus));
          let moreMenu = {
            ...webmenus[0],
            displayText: "More",
            code: "More",
            targetPath: "None",
          };
          let moreMenus = webmenus.slice(showmenus, webmenus.length);
          moreMenu.subMenus = moreMenus;
          setMoreMenu(moreMenu);
          break;
        }
      }
    }
  }

  const debouncMoremenus = debunceFunction(getMenus, 50);

  useEffect(() => {
    getMenus();
    window.addEventListener("resize", debouncMoremenus);
    return () => {
      window.removeEventListener("resize", debouncMoremenus);
    };
  }, [menus]);

  return (
    <div className={`${styles.menus}`}>
      {Menus.map((menu, index) => (
        <Menu menu={menu} key={index} />
      ))}
      {moreMenu && moreMenu.subMenus.length > 0 && <Menu menu={moreMenu} />}
    </div>
  );
}
