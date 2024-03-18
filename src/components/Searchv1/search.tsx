import { FC, useEffect } from "react";
import Sections from "../Sections/Sections";
import SearchInput from "./searchInput/SearchInput";
import { useRouter } from "next/router";
import SearchTabs from "./searchTabs/SearchTabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SearchGrid } from "../grid/Grid";
import styles from "./search.module.scss";
import {
  fetchSearchv1Bucket,
  resetSearchSlice,
  searchparamsInterface,
  setsearchText,
  togglesearchSections,
  togglesearchSuggestions,
} from "@/redux/feature/searchv1Slice/searchv1Slice";

const Search: FC = () => {
  const { showSections, activeTab, tabsdata } = useAppSelector(
    (state) => state.searchv1,
  );
  const dispatch = useAppDispatch();
  const { query } = useRouter();
  console.log(tabsdata)
  useEffect(() => {
    let searchrequest: ReturnType<typeof search>;
    if (!!query.q && typeof query.q === "string") {
      dispatch(resetSearchSlice());
      dispatch(togglesearchSections(false));
      dispatch(togglesearchSuggestions(false));
      dispatch(setsearchText(query.q));
      searchrequest = search({
        query: query.q,
        pageSize: 36,
        page: 0,
      });
    }
    return () => {
      searchrequest?.abort();
      dispatch(resetSearchSlice());
    };
  }, [query.q]);

  const search = (params: searchparamsInterface) => {
    return dispatch(fetchSearchv1Bucket(params));
  };

  const getCards = () => {
    return (
      tabsdata.filter(
        (tabdata) => tabdata.searchResults.sourceType === activeTab.code,
      )[0]?.searchResults?.data || []
    );
  };

  const getbucketErrormsg = () => {
    let errormsg = tabsdata.filter(
      (tabdata) => tabdata.searchResults.sourceType === activeTab.code,
    )[0]?.error?.message;
    return errormsg || "No Results Found";
  };

  const searchPagination = () => {
    // let active_tab = tabsdata.filter((tab_data) => tab_data.searchResults.sourceType === activeTab.code)[0]
    // if(active_tab && active_tab.last_search_order === "typesense"){
    //   let params={
    //     query: searchtext,
    //     page_size: 36,
    //     page:0
    //   }
    //   dispatch(searchv1BucketPagiation(params))
    // }
  };

  const getPaginationStatus = () => {
    // let active_tab = tabsdata.filter((tab_data) => tab_data.searchResults.sourceType === activeTab.code)[0]
    // console.log(active_tab)
    // return active_tab?.searchResults?.pagination
    return undefined;
  };

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
            <h3 className={`${styles.search_error_msg}`}>
              {getbucketErrormsg()}
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
