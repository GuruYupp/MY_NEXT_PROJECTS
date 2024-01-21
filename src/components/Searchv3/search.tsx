import { FC, useEffect } from "react";
import Sections from "../Sections/Sections";
import SearchInput from "./searchInput/SearchInput";
import { useRouter } from "next/router";
import SearchTabs from "./searchTabs/SearchTabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SearchGrid } from "../grid/Grid";
import styles from "./search.module.scss";
import {
  fetchSearchBucket,
  resetSearchSlice,
  searchBucketPagiation,
  searchparamsInterface,
  setsearchText,
  togglesearchSections,
  togglesearchSuggestions,
} from "@/redux/feature/searchv3Slice/searchv3Slice";


const Search: FC = () => {
  const { showSections, activeTab, tabsdata ,searchtext} = useAppSelector(
    (state) => state.searchv3
  );
  const dispatch = useAppDispatch();
  const { query } = useRouter();

  useEffect(() => {
    if (!!query.q && typeof query.q === "string") {
      dispatch(resetSearchSlice());
      dispatch(togglesearchSections(false));
      dispatch(togglesearchSuggestions(false));
      dispatch(setsearchText(query.q));
      search({
        query: query.q,
        // eslint-disable-next-line camelcase
        last_search_order: "typesense",
        // eslint-disable-next-line camelcase
        page_size: 30,
        bucket: "all",
      });
    }
  }, [query.q]);

  const search = (params: searchparamsInterface) => {
    dispatch(fetchSearchBucket(params));
  };

  const getCards = () => {
    return (
      tabsdata.filter(
        (tabdata) => tabdata.searchResults.sourceType === activeTab.code
      )[0]?.searchResults?.data || []
    );
  };

  const getbucketErrormsg = ()=>{
    let errormsg = tabsdata.filter(
      (tabdata) => tabdata.searchResults.sourceType === activeTab.code)[0]?.error?.message
    return errormsg;
  }

  const searchPagination = ()=>{
    let activetab = tabsdata.filter((tabdata) => tabdata.searchResults.sourceType === activeTab.code)[0]
    if(activetab && activetab.lastSearchOrder === "typesense"){
      let params={
        query: searchtext,
        // eslint-disable-next-line camelcase
        last_search_order: activetab.lastSearchOrder,
        // eslint-disable-next-line camelcase
        page_size: 30,
        bucket: activetab.searchResults.sourceType,
        // eslint-disable-next-line camelcase
        last_doc: activetab.lastDoc
      }
      dispatch(searchBucketPagiation(params))
    }
  }

  const getPaginationStatus = ()=>{
    
    let activetab = tabsdata.filter((tabdata) => tabdata.searchResults.sourceType === activeTab.code)[0]
    return activetab?.searchResults?.pagination
    
  }

  return (
    <div className={`${styles.search_container}`}>
      <SearchInput />
      {showSections && <Sections />}
      {!showSections && <SearchTabs handelbucketSearch={search} />}
      {tabsdata.length > 0 && (
        <div className={`${styles.search_grid}`}>
          {getCards().length > 0 ? (
            <SearchGrid
              cards={getCards()}
              searchPaginationHandler={searchPagination}
              pagination={getPaginationStatus()}
            />
          ) : (
              <h3 className={`${styles.search_error_msg}`}>{getbucketErrormsg()}</h3>
          )}
        </div>
      )}
    </div>
  );
};
export default Search;
