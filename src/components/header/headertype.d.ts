import { menuInterface } from "@/shared";
import { addMenusAction } from "./headerSlice";

export interface MenusInitialStateInterface {
  menus: menuInterface[];
  submenus: menuInterface[];
  activeSubmenu?: menuInterface;
  activeMenu?: menuInterface;
  desktopMenus: menuInterface[];
  mobileMenus: menuInterface[];
}

export type MenusActionTypes = ReturnType<typeof addMenusAction>;
interface HeadercommonPropsInterface {
  moveheaderTop: boolean;
  headerGradient: boolean;
}
export interface DesktoHeaderPropsInterface
  extends HeadercommonPropsInterface {}

export interface MobileHeaderPropsInterface extends HeadercommonPropsInterface {
  showMobileHeader: boolean;
}
