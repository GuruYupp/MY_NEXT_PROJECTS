import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./VideoSuggestions.module.scss";
import Slider, { Settings } from "react-slick";
import SuggestionCard from "./suggestioncard/SuggestionCard";
import { useEffect, useRef, useState } from "react";
import { fetchSections } from "@/redux/feature/pageSlice/pageSlice";
import { useRouter } from "next/router";
import { VideoSuggestionsProps } from "../playertypes";
import { killSession } from "@/services/data.manager";

function VideoSuggestions(props: VideoSuggestionsProps) {
  const { suggestionHeight } = props;
  let { tabsInfo, sections, info } = useAppSelector(
    (state) => state.pageData.response,
  );

  const dispatch = useAppDispatch();
  const { asPath } = useRouter();
  const [currentslickIndex, setCurretnSlickIndex] = useState<number>(
    getInitialSlideIndex(),
  );
  const paginationReq = useRef<any>();

  const [activeTab, setActivetab] = useState<string>(
    tabsInfo.tabs[currentslickIndex]?.code || "",
  );

  useEffect(() => {
    checksectionData();
  }, [activeTab]);

  function getInitialSlideIndex() {
    for (let i = 0; i < tabsInfo.tabs.length; i++) {
      if (tabsInfo.tabs[i].title === "Today") {
        return i;
      }
    }
    return 0;
  }

  function checksectionData() {
    let makeRequest = true;
    sections.map((section) => {
      if (section.contentCode === activeTab) {
        if (section.section.sectionData.data.length > 0) {
          makeRequest = false;
        }
      }
    });
    if (makeRequest) {
      let arr = asPath.split("/");
      arr.shift();
      let targetPath = arr.join("/") == "" ? "home" : arr.join("/");
      let params = {
        path: targetPath,
        count: 40,
        offset: -1,
        code: activeTab,
      };

      const paginationPromise = dispatch(
        fetchSections({
          from: "videoSuggestions",
          params,
        }),
      );

      paginationReq.current = paginationPromise;

      paginationPromise
        .unwrap()
        .then(({ result }) => {
          if (
            result.response?.status == false &&
            result.response?.error?.code == 401
          ) {
            killSession();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // tabsInfo = mockdata

  const tabssettings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 1,
    variableWidth: true,
    initialSlide: currentslickIndex,
    centerMode: tabsInfo.tabs.length > 2,
    className: "custom_slide",
    focusOnSelect: true,
    beforeChange: (_currentSlide: number, _nextSlide: number) => {
      // console.log(_currentSlide,'---',_nextSlide)
      setActivetab(tabsInfo.tabs[_nextSlide].code);
      setCurretnSlickIndex(_nextSlide);
      // checksectionData(_nextSlide)
    },
    afterChange: (_currentSlide: number) => {},
  };

  return (
    <div className={`${styles.Videosuggestions}`}>
      <div className={`${styles.tabs}`}>
        <Slider {...tabssettings}>
          {tabsInfo.tabs.map((tab, index) => {
            if (tab.code.includes("under-player") === false) {
              return (
                <div className={`${styles.tab}`} key={index}>
                  <p>{tab.title}</p>
                </div>
              );
            }
          })}
        </Slider>
      </div>
      <div
        className={`${styles.suggestions}`}
        style={{ height: `${suggestionHeight}px` }}
      >
        {sections.map((section) => {
          if (
            section?.contentCode === activeTab ||
            section?.section.sectionInfo.code === activeTab
          ) {
            return section?.section.sectionData.data.map((cardData, index) => {
              return (
                cardData.target.path !== info.path && (
                  <SuggestionCard key={index} cardDetails={cardData} />
                )
              );
            });
          }
        })}
      </div>
    </div>
  );
}

export default VideoSuggestions;
