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

  const [Menus,setMenus] = useState<menuInterface[]>([]);
  const [moreMenu, setMoreMenu] = useState<menuInterface>()
  const {systemConfigs} = useAppSelector(state=>state.configs);

  function getMenus(){
    let more_menu_configs = systemConfigs?.configs?.menusMore
    if(more_menu_configs){
      let config_obj = JSON.parse(more_menu_configs)
      let config_obj_keys = Object.keys(config_obj)
      let config_menu_res = config_obj_keys.map((key)=>parseInt(key.split('_')[1]))
      for(let i=0;i<config_menu_res.length;i++){
        if(window.innerWidth >= config_menu_res[i]){
          let show_menus = parseInt(config_obj[config_obj_keys[i]])-1
          let web_menus = menus
          // let web_menus = menus.filter((menu) => (menu.params.web === "true"))
          setMenus(web_menus.slice(0,show_menus))
          let moreMenu = { ...web_menus[0], displayText: "More", code: "More", targetPath: "None" }
          let moreMenus = web_menus.slice(show_menus, web_menus.length);
          moreMenu.subMenus = moreMenus
          setMoreMenu(moreMenu);
          break;
        } 
      }
    }
  }


  const debouncMoremenus = debunceFunction(getMenus,50)

  useEffect(()=>{
    getMenus()
    window.addEventListener('resize',debouncMoremenus);
    return ()=>{
      window.removeEventListener('resize', debouncMoremenus)
    }
  },[menus])

 
  return (
    <div className={`${styles.menus}`}>
      {Menus.map((menu, index) => (<Menu menu={menu} key={index} /> ))}
      {
        moreMenu && moreMenu.subMenus.length > 0 && (<Menu menu={moreMenu}/>)
      }
    </div>
  );
}
