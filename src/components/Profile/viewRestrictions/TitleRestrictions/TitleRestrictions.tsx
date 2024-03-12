import React, { FC, useRef, memo } from "react";
import styles from "./TitleRestrictions.module.scss";
import {
  TitleRestrictionsInterface,
  viewRestrictionInterface,
} from "../viewRestrictiontypes";
import appConfig from "@/app.config";
import { debunceFunction } from "@/utils";

const TitleRestrictions: FC<TitleRestrictionsInterface> = (props) => {
  const {
    blockedContents,
    handleSearch,
    queryContents,
    handleSuggestion,
    handleRemoveContent,
  } = props;
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const queryContent = debunceFunction(handleSearch, 1500);

  const handleonChange = () => {
    if (!titleInputRef.current) return;
    queryContent(titleInputRef.current.value);
  };

  const suggestionClick = (
    suggestion: viewRestrictionInterface["queryContents"][0],
  ) => {
    handleSuggestion({
      id: suggestion.id,
      name: suggestion.name,
      category: suggestion.elemSubType,
    });
  };

  const contentClick = (id: string) => {
    handleRemoveContent(id);
  };

  return (
    <div className={`${styles.Container}`}>
      <div className={`${styles.inputContainer}`}>
        <input
          type="text"
          placeholder="Enter Show or Movie name"
          ref={titleInputRef}
          onChange={handleonChange}
        />
      </div>
      <div className={`${styles.suggestionsContainer}`}>
        {queryContents?.map((content, keyindex) => {
          return (
            <p
              className={`${styles.suggestion}`}
              key={keyindex}
              onClick={() => suggestionClick(content)}
            >
              {content.name}
            </p>
          );
        })}
      </div>
      <div className={`${styles.blockedcontentContainer}`}>
        {blockedContents?.map(({ itemsMap }) => {
          return Object.keys(itemsMap).map((itemkey: string, keyindex) => {
            return (
              <p className={`${styles.suggestion}`} key={keyindex}>
                {itemsMap[itemkey]}
                <span
                  className={`${styles.close_icon}`}
                  onClick={() => contentClick(itemkey)}
                >
                  <img
                    src={`${appConfig.staticImagesPath}close-icon.svg`}
                    alt="close-icon"
                  />
                </span>
              </p>
            );
          });
        })}
      </div>
    </div>
  );
};

export default memo(TitleRestrictions);
