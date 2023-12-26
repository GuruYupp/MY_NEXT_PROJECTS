import { FC, memo } from "react";
import styles from "./SearchTabs.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { handlesearchSelectTab, searchparamsInterface } from "@/redux/feature/searchv3Slice/searchv3Slice";
import { searchtabInterface } from "@/shared";

interface searchtabsprops{
  handelbucketSearch:(arg:searchparamsInterface)=>void
}

const SearchTabs: FC<searchtabsprops> = (props) => {
  const { handelbucketSearch } = props;
 
  const { activeTab, searchtext, tabsdata } = useAppSelector(state=>state.searchv3)
  const { configs } = useAppSelector((state => state.configs.systemConfigs))
  const dispatch = useAppDispatch()
  // const [activetab, setActivetab] = useState<searchtabInterface>(activeTab);
  const tabs: searchtabInterface[] = JSON.parse(configs?.searchStaticMenus || '[]') || []

  const handletabClick = (tab:searchtabInterface)=>{
    // setActivetab(tab)
    dispatch(handlesearchSelectTab(tab))
    let bucket = tabsdata.filter((tabdata) => tabdata.searchResults.sourceType === tab.code)[0]
    if(!bucket){
      handelbucketSearch({
        // eslint-disable-next-line camelcase
        query: searchtext, last_search_order: "typesense",
        // eslint-disable-next-line camelcase
        page_size: 30,
        bucket: tab.code
      })
    }
   
  }

  return (
    <div className={`${styles.tabs_container}`}>
      <div className={`${styles.tabs_inner}`}>
        {tabs.map((tab, index) => (
          <div
            className={`${styles.tab} ${
              tab.code === activeTab.code ? styles.active : ""
            }`}
            key={index}
            onClick={()=>handletabClick(tab)}
          >
            {tab.displayName}
          </div>
        ))}
      </div>
    </div>
  );
};

const MemoSearchTabs = memo(SearchTabs)

export default MemoSearchTabs;
