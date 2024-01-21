import { menuInterface } from "@/shared";
import styles from "./MobileMenus.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import getConfig from "next/config";
let appConfig = getConfig().publicRuntimeConfig.appconfig

const  mobilemenuImages:{[key:string] : any} = {
  'home_mobile__v2':{
    selectedImg:'bottom-menu-home-active.svg',
    defaultImg:'bottom-menu-home-default.svg'
  },
  'swag_mobile__v2':{
    selectedImg: 'bottom-menu-swag-active.svg',
    defaultImg: 'bottom-menu-swag-default.svg'
  },
  'plans__v2':{
    selectedImg: 'bottom-menu-plans-active.svg',
    defaultImg: 'bottom-menu-plans-default.svg'
  },
  'book_dth_mobile__v2':{
    selectedImg: 'bottom-menu-mydish-active.svg',
    defaultImg: 'bottom-menu-mydish-default.svg'
  },
  'account__v2':{
    selectedImg: 'bottom-menu-myaccount-active.svg',
    defaultImg: 'bottom-menu-myaccount-default.svg'
  }
}

interface props {
  menus: menuInterface[];
}
export default function MobileMenus({ menus }: props): JSX.Element {
  const { asPath } = useRouter()


  const checkPathinsubmenu = (menu:menuInterface) => {
    if (menu.subMenus.length === 0) return false;
    let path = asPath.split('/')[1]
    if (path) {
      let pathFound = false;
      menu.subMenus.forEach((menu: menuInterface) => {
        if (menu.targetPath === path) pathFound = true;
      })
      return pathFound;
    }
    return false;
  }

  const isActive: (arg: menuInterface) => boolean = (menu) => (asPath == `/${menu.targetPath}` ||
    (asPath == "/" && menu.targetPath == "home") || checkPathinsubmenu(menu)
    ? true
    : false);

  const getmenuIcon = (menu:menuInterface)=>{
    let menuIcon = isActive(menu) ? mobilemenuImages[menu.code].selectedImg : mobilemenuImages[menu.code].defaultImg
    return menuIcon
  }

  return (
    <div className={`${styles.mobile_menus}`}>
      {menus.map((menu, index) => ((menu.params.web === "false") && <Link href={`/${menu.targetPath}`} key={index}>
        <div className={`${styles.menu} ` + (isActive(menu) ? styles.active : "")}>
          <div className={`${styles.menu_inner}`}>
            <div className={`${styles.menu_icon}`}>
              <img src={`${appConfig.cloudpath}/images/${getmenuIcon(menu)}`} alt=""/>
            </div>
            <span className={`${styles.displayText} `}>{menu.displayText}</span>
          </div>
        </div>
      </Link>))}
    </div>
  );
}
