import { MenusContext } from "@/contexts/HeaderMenusContext";
import { useContext } from "react";
import { MenusInitialStateInterface } from "./headertype";

type DeeplyNested<T extends unknown> = {
  [K: string]: T | DeeplyNested<T>;
};
type MenusSelectorType = (
  arg: MenusInitialStateInterface,
) => DeeplyNested<MenusInitialStateInterface>;

const useMenusState = (selector: MenusSelectorType) => {
  const menusContext = useContext(MenusContext);
  if (!menusContext) return {};
  return selector(menusContext.menusState);
};

export default useMenusState;
