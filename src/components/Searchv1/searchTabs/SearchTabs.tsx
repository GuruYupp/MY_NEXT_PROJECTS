import { FC, memo } from "react";
import styles from "./SearchTabs.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  handlesearchSelectTab,
  searchparamsInterface,
} from "@/redux/feature/searchv1Slice/searchv1Slice";
import { searchtabInterface } from "@/shared";

interface searchtabsprops {
  handelbucketSearch: (arg: searchparamsInterface) => void;
}

const SearchTabs: FC<searchtabsprops> = () => {


  const { activeTab } = useAppSelector((state) => state.searchv1);
  const { configs } = useAppSelector((state) => state.configs.systemConfigs);
  const dispatch = useAppDispatch();
  const tabs: searchtabInterface[] =
    JSON.parse(configs?.searchStaticMenus || "[]") || [];

  const handletabClick = (tab: searchtabInterface) => {
    dispatch(handlesearchSelectTab(tab));
  };

  return (
    <div className={`${styles.tabs_container}`}>
      <div className={`${styles.tabs_inner}`}>
        {tabs.map((tab, index) => (
          <div
            className={`${styles.tab} ${
              tab.code === activeTab.code ? styles.active : ""
            }`}
            key={index}
            onClick={() => handletabClick(tab)}
          >
            {tab.displayName}
          </div>
        ))}
      </div>
    </div>
  );
};

const MemoSearchTabs = memo(SearchTabs);

export default MemoSearchTabs;
