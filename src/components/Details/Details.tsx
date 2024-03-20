import { useEffect, useRef, useState } from "react";
import { getAbsolutPath } from "@/utils";
import styles from "./Details.module.scss";
import Sections from "../Sections/Sections";
import { useAppSelector } from "@/redux/hooks";
import { GridTable } from "../grid/Grid";
import getfrompagedata from "./getfrompagedata";
import Slider, { Settings } from "react-slick";
import DesktopDetailsMeta from "./Detailsmetadata/DesktopDetailsMeta/DesktopDetailsMeta";
import MobileDetailsMeta from "./Detailsmetadata/MobileDetailsMeta/MobileDetailsMeta";

export default function DetailsPage() {
  let { content, tabsInfo, sections } = useAppSelector(
    (state) => state.pageData.response,
  );
  // tabsInfo = data
  const bgImageRef = useRef<HTMLDivElement>(null);
  let activetab = "";
  let detailsBannerImage = getfrompagedata(content, "bgImage")?.data;
  detailsBannerImage = detailsBannerImage
    ? getAbsolutPath(detailsBannerImage)
    : content[0].content?.backgroundImage
      ? getAbsolutPath(content[0].content?.backgroundImage)
      : "";

  if (tabsInfo.showTabs) {
    activetab = tabsInfo.tabs[0].code;
  }
  const [activeTab, setActivetab] = useState<string>(activetab);
  const [showDesktopMeta, setShowDesktopMeta] = useState<boolean | undefined>();

  useEffect(() => {
    setDesktopMeta();
    window.addEventListener("resize", setDesktopMeta);
    if (bgImageRef.current) {
      let height = Math.ceil(window.innerWidth * 0.437);
      bgImageRef.current.style.height = `${height}px`;
    }
    return () => {
      window.removeEventListener("resize", setDesktopMeta);
    };
  }, []);

  const handleActivetab = (code: string) => {
    if (code !== activeTab) {
      setActivetab(code);
    }
  };

  const settings: Settings = {
    className: "slider details_tab_slider",
    dots: false,
    infinite: false,
    speed: 500,
    // slidesToShow: 4,
    slidesToScroll: 1,
    variableWidth: true,
    centerMode: false,
    draggable: true,
    centerPadding: "0px",
    cssEase: "ease",
    easing: "linear",
  };

  const setDesktopMeta = () => {
    setShowDesktopMeta(window.innerWidth >= 767);
  };

  return (
    <>
      <div className={`${styles.DetailsPage_Container}`}>
        <div
          className={`${styles.DetailsPage_backgroundImage}`}
          ref={bgImageRef}
        >
          <img src={detailsBannerImage} alt="" />
          <div className={`${styles.DetailsGrdient1}`}></div>
          <div className={`${styles.DetailsGrdient2}`}></div>
        </div>
        {showDesktopMeta === true && <DesktopDetailsMeta />}
        {showDesktopMeta === false && <MobileDetailsMeta />}
      </div>
      {!tabsInfo.showTabs && <Sections />}
      {tabsInfo.showTabs && (
        <>
          <div className={`${styles.tabs_Container}`}>
            <Slider {...settings}>
              {tabsInfo.tabs.map((tab, index) => {
                return (
                  <div
                    key={index}
                    className={
                      `${styles.tab} ` +
                      (tab.code === activeTab ? `${styles.active}` : "")
                    }
                    onClick={() => handleActivetab(tab.code)}
                  >
                    <p>{tab.title}</p>
                  </div>
                );
              })}
            </Slider>
          </div>

          {sections.map((section, index) => {
            if (
              section.contentCode === activeTab ||
              section.section.sectionInfo.code === activeTab
            ) {
              return (
                section.section.sectionData.data.length > 0 && (
                  <div className={`${styles.details_grid}`} key={index}>
                    <GridTable section={section} />
                  </div>
                )
              );
            }
          })}
        </>
      )}
    </>
  );
}
