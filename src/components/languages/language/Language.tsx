import { contentLanguageInterface } from "@/shared";
import styles from "./Language.module.scss";
import { memo } from "react";
import { languageType } from "../languageSlice";

interface LanguageProps {
  language: contentLanguageInterface & { isSelected: boolean };
  handleToggleLanguage: (arg: languageType) => void;
}

const Language = (props: LanguageProps) => {
  const { language, handleToggleLanguage } = props;

  const handelLanguageClick = () => {
    handleToggleLanguage(language);
  };

  return (
    <div className={`${styles.lang_container}`} onClick={handelLanguageClick}>
      <div className={`${styles.lang}`}>
        <span className={`${styles.lang_text}`}>{language.name}</span>
        <span className={`${styles.lang_native_text}`}>
          {language.displayText}
        </span>
        <div
          className={`${styles.select_lang_icon} ${language.isSelected ? styles.active : ""}`}
        ></div>
      </div>
    </div>
  );
};

export const MemoLanguage = memo(Language);

export default MemoLanguage;
