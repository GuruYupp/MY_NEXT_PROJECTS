import { useAppSelector } from "@/redux/hooks";
import styles from "./Languages.module.scss";
import Language from "./language/Language";
import { useCallback, useReducer } from "react";
import appConfig from "@/app.config";
import { ModalType } from "../modals/modaltypes";
import { clearallAction, languageReducer, languageType, selectallAction, togglelanguageAction } from "./languageSlice";
import { subprofileInterface } from "@/shared";


interface LanguageProps {
  closeModal: () => void;
  sendDatatoComponent?: (data: { from: ModalType, data: any }) => void;
  profileData?:subprofileInterface
}


function Languages(props: LanguageProps) {
  const { closeModal, sendDatatoComponent,profileData} = props
  const { systemConfigs } = useAppSelector(state => state.configs)
  const {isLoggedin} = useAppSelector(state=>state.user)
  const { contentLanguages } = systemConfigs
  const [languageState, languageDispatch] = useReducer(languageReducer, getInitialState())

  function getInitialState(){
    let languages:languageType[] = [];
    if(contentLanguages){
      contentLanguages.map(language=>{
        let lang = { ...language, isSelected: true }
        let toggelcondition = (isLoggedin && profileData && !(profileData.langs?.includes(lang.code)))
        if (toggelcondition === true){
          lang.isSelected = false
        }
        languages.push(lang)
      })
    }
    
    return { languages, selectedCount:languages.length}
  }


  const handleApply = ()=>{
    if(sendDatatoComponent){
       sendDatatoComponent({from:"languages",data:languageState.languages})
    }
    closeModal()
  }

  const handleSelectAll = ()=>{
    languageDispatch(selectallAction())
  }

  const handleClearAll = ()=>{
    languageDispatch(clearallAction())
  }


  const handleToggleLanguage = useCallback((lang:languageType)=>{
    languageDispatch(togglelanguageAction(lang))
  },[])


  return (
    <div className={`${styles.languages_container}`}>
      <span className={`${styles.languages_close}`} onClick={closeModal}>
        <img alt="close" src={`${appConfig.cloudpath}/images/lan-popup-close.png`}></img>
      </span>
      <div className={`${styles.languages_top}`}>
        <div className={`${styles.languages_text}`}>
          <h1 className={`${styles.heading1}`}>Choose your preferred languages</h1>
          <p className={`${styles.heading2}`}> This will help us to suggest you relevant content </p>
        </div>
        <div className={`${styles.languages_buttons}`}>
          <span className={`${styles.btn}`} onClick={handleSelectAll}>select all</span>
          <span className={`${styles.divider}`}></span>
          <span className={`${styles.btn}`} onClick={handleClearAll}>clear all</span>
        </div>
      </div>
      <div className={`${styles.languages}`}>
        {
          languageState.languages.map((language,index)=>{
            return <Language language={language} handleToggleLanguage={handleToggleLanguage} key={index}/>
          })
        }
      </div>
      <div className={`${styles.languages_footer}`}>
        <div className={`${styles.languages_footer_btns}`}>
          <button className={`${styles.btn}`} onClick={closeModal}>Cancel</button>
          <button className={`${styles.btn}`} onClick={handleApply} disabled={languageState.selectedCount === 0}>Apply</button>
        </div>
        {languageState.selectedCount === 0 && <p className={`${styles.languages_error_text}`}> Please Select atleast one Language </p>}
      </div>
    </div>
  );
}

export default Languages;
