import { pageState } from "@/shared";
import styles from "./Tabs.module.scss";
// import { data as mockdata } from './mockdata';
import { useEffect, useRef, useState } from "react";
import { debunceFunction } from "@/utils";

const get_tab_configs = function(width:number){
  switch (true) {
    case  width <= 991:
      return {
        tabCount: 4
      }
    case width <= 1024:
      return {
        tabCount: 4
      }
    case width <= 1366:
      return {
        tabCount: 5
      }
    case width <= 1920:
      return {
        tabCount: 5
      }
    default:
      return {
        tabCount: 4
      }
  }
}

interface Tabsprops{
  tabsInfo:pageState["response"]["tabsInfo"]
  enableSlick:boolean
}

export default function Tabs(props:Tabsprops) {
  let {tabsInfo,enableSlick} = props
  let tabs = tabsInfo.tabs
  const tabsRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [enablearrows, setEnablearrows] = useState<boolean>(false);
  const [enablerightarrow, setEnablerightarrow] = useState<boolean>(false);
  const [enableleftarrow, setEnableleftarrow] = useState<boolean>(false);
  const [disableslick,setDisableslick] = useState<boolean>(false);
  const [tabsWidth, setTabsWidth] = useState<string>("100%");

  const [tabWidth, setTabWidth] = useState<string>("0px");

  useEffect(() => {
    // console.log('rendering,,,,,')
    if (tabsRef.current === null) return;
    // setSectionconfigs()
    let debouncFunc = debunceFunction(setSectionconfigs, 500);
    const resizeObserver = new ResizeObserver(() => {
      debouncFunc();
    });
    resizeObserver.observe(tabsRef.current);
    return () => {
      resizeObserver.disconnect();
    };

  }, []);

  const setSectionconfigs = () => {

    if (tabsRef.current) {
      const tabConfigs = get_tab_configs(window.innerWidth);

      let tab_width = 100 / Math.floor(tabConfigs.tabCount);

      let carousel_width = tab_width * tabs.length;

      if (carousel_width > 100) {
        tab_width = 100 / tabs.length;
        if (tabConfigs.tabCount < tabs.length) {
          setEnablearrows(true);
          setEnablerightarrow(true);
        }
      }
      else {
        carousel_width = 100
        setEnablearrows(false);
      }

      if(window.innerWidth <= 991 || enableSlick === false){
        console.log('disable slick...')
        setDisableslick(true);
      }
      else{
        setDisableslick(false);
      }

      setTabsWidth(`${carousel_width}%`);
      setTabWidth(`${tab_width}%`);

    }
  
  };

  const percTonumber = (units: string) => {
    if (units.indexOf("%") === -1) throw Error("units must be in a pixels");
    return Number(units.split("%")[0]);
  };

  const handleScrollTo = (to: "left" | "right") => {
    if (sliderRef.current !== null) {
      if (to === "left") {
        let current_margin_left = Math.abs(percTonumber(sliderRef.current.style.marginLeft));
        let slider_width = percTonumber(sliderRef.current.style.width);
        console.log(slider_width - (current_margin_left + 100))
        if ((slider_width - (current_margin_left + 100) - 100) <= 100) {
          sliderRef.current.style.marginLeft = `-${slider_width - 100}%`
          setEnablerightarrow(false);
          setEnableleftarrow(true);
        }
        else {
          let current_margin_left = Math.abs(percTonumber(sliderRef.current.style.marginLeft));
          // if (current_margin_left + 100)
          sliderRef.current.style.marginLeft = `-${current_margin_left + 100}%`
          setEnableleftarrow(true);
        }
      } else if (to === "right") {
        let current_margin_left = Math.abs(percTonumber(sliderRef.current.style.marginLeft));
        if (current_margin_left - 100 < 100) {
          sliderRef.current.style.marginLeft = `${0}%`
          setEnableleftarrow(false);
          setEnablerightarrow(true);
        }
        else {
          let current_margin_left = Math.abs(percTonumber(sliderRef.current.style.marginLeft));
          sliderRef.current.style.marginLeft = `-${current_margin_left - 100}%`
        }
      }
    }
  };
  

  return (
    <div className={`${styles.tabs} ${(disableslick && `${styles.unslick}`)}`}>
      {!disableslick && enablearrows && enableleftarrow && (
        <div
          className={`${styles.arrow_container} ${styles.left_arrow_container}`}
          onClick={() => handleScrollTo("right")}
        >
          <span className={`${styles.arrowbox}`}></span>
        </div>
      )}
      <div ref={tabsRef} className={styles.tabs_wrapper}>
        <div
          style={{
            marginLeft: "0%",
            width: tabsWidth,
          }}
          ref={sliderRef}
        >
          {tabsInfo.tabs.map((tab, index) => {
            return (
              <div
                key={index}
                style={{
                  width: tabWidth,
                  // maxWidth:tabWidth,
                  float:'left',
                  // display: 'inline-block'
                }}
              >
              <div className={styles.tab} key={index}>
                <p>{tab.title}</p>
              </div>
              </div>
            );
          })}
        </div>
      </div>
     
      {!disableslick &&  enablearrows && enablerightarrow && (
        <div
          className={`${styles.arrow_container} ${styles.right_arrow_container}`}
          onClick={() => handleScrollTo("left")}
        >
          <span className={`${styles.arrowbox}`}></span>
        </div>
      )}
    </div>
  );
}
