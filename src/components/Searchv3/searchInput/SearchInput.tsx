import styles from "./Searchinput.module.scss";
import { ChangeEvent, FC, FormEvent, useCallback } from "react";
import { useRouter } from "next/router";
import {
  emptysearchSuggestions,
  fetchSearchSuggestions,
  setsearchText,
  togglesearchSections,
  togglesearchSuggestions
} from "@/redux/feature/searchv3Slice/searchv3Slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { debunceFunction } from "@/utils";
import appConfig from "@/app.config";

const SearchInput: FC = () => {
  const { asPath, replace } = useRouter();
  const { searchtext, suggestions } = useAppSelector((state) => state.searchv3);

  const dispatch = useAppDispatch();

  const handleSearch =
    useCallback((text: string) => {
      dispatch(setsearchText(text));
      if (text.length >= 3) {
        dispatch(togglesearchSections(true));
        dispatch(togglesearchSuggestions(true))
        getSuggestions(text);
      } else if (text.length === 0) {
        dispatch(emptysearchSuggestions);
      }
    },[])

  const getSuggestions = 
    useCallback(debunceFunction((text: string) => {
      console.log(text)
      dispatch(fetchSearchSuggestions(text))
    }, 1500),[])

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const handleSubmit = (eve: FormEvent) => {
    eve.preventDefault();
    replace({
      pathname: asPath.split("?")[0],
      query: {
        q: searchtext,
      },
    });
  };

  return (
    <div className={styles.searhwrapper}>
      <div className={styles.searchContainer}>
        <img
          src={`${appConfig.cloudpath}/images/search-icon.svg`}
          width={22}
          height={18}
          alt="logo"
        />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchtext}
            onChange={handleInput}
            autoFocus={true}
          />
        </form>
        {searchtext.length > 0 && <div className={styles.crossbtn}></div>}
      </div>
      {(suggestions.show && suggestions.data.length > 0) && (
        <div className={styles.suggestionsContainer}>
          {suggestions.data.map((suggestion, index) => (
            <p key={index} className={styles.suggestion}>
              {suggestion}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
