

import { useAppSelector } from "@/redux/hooks";
import styles from "./VideoSuggestions.module.scss"
import Slider, { Settings } from "react-slick";
// import { data as mockdata } from '../../Tabs/mockdata';
import SuggestionCard from "./suggestioncard/SuggestionCard";

interface VideoSuggestionsProps{
  suggestionHeight:number
}

export default function VideoSuggestions(props: VideoSuggestionsProps){
  const {suggestionHeight} = props
  let {tabsInfo,sections} = useAppSelector(state=>state.pageData.response)

  // tabsInfo = mockdata

  const tabs_settings:Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow:1,
    variableWidth:true,
  }

  return (
    <div className={`${styles.Videosuggestions}`}>
      <div className={`${styles.tabs}`}>
     <Slider {...tabs_settings}>
        {tabsInfo.tabs.map((tab, index) => {
          return (
            <div className={`${styles.tab}`} key={index}>
                <p>{tab.title}</p>
              </div>
          );
        })}
     </Slider>
      </div>
      <div className={`${styles.suggestions}`} style={{ height: `${suggestionHeight}px` }}>
        {
          sections.map((section) => {
            if (!section.section.sectionData.params?.showOnPlayer) {
              return section.section.sectionData.data.map((cardData, index) => {
                return <SuggestionCard key={index} cardDetails={cardData}/>
              })
            }
          })
        }
    </div>
    </div>
  )
}