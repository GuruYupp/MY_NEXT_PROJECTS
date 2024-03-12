import { useAppSelector } from "@/redux/hooks";
import styles from "./VideoSuggestions.module.scss";
import Slider, { Settings } from "react-slick";
// import { data as mockdata } from '../../Tabs/mockdata';
import SuggestionCard from "./suggestioncard/SuggestionCard";
import { memo } from "react";

interface VideoSuggestionsProps {
  suggestionHeight: number;
}

function VideoSuggestions(props: VideoSuggestionsProps) {
  const { suggestionHeight } = props;
  let { tabsInfo, sections } = useAppSelector(
    (state) => state.pageData.response,
  );

  const getInitialSlideIndex = () => {
    for (let i = 0; i < tabsInfo.tabs.length; i++) {
      if (tabsInfo.tabs[i].title === "Today") {
        return i;
      }
    }
    // console.log('xxxxx')
    return 0;
  };

  // tabsInfo = mockdata

  const tabssettings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 1,
    variableWidth: true,
    initialSlide: getInitialSlideIndex(),
    centerMode: tabsInfo.tabs.length > 2,
    className: "custom_slide",
  };

  return (
    <div className={`${styles.Videosuggestions}`}>
      <div className={`${styles.tabs}`}>
        <Slider {...tabssettings}>
          {tabsInfo.tabs.map((tab, index) => {
            return (
              <div className={`${styles.tab}`} key={index}>
                <p>{tab.title}</p>
              </div>
            );
          })}
        </Slider>
      </div>
      <div
        className={`${styles.suggestions}`}
        style={{ height: `${suggestionHeight}px` }}
      >
        {sections.map((section) => {
          if (!section.section.sectionData.params?.showOnPlayer) {
            return section.section.sectionData.data.map((cardData, index) => {
              return <SuggestionCard key={index} cardDetails={cardData} />;
            });
          }
        })}
      </div>
    </div>
  );
}

export default memo(VideoSuggestions);
