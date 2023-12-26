import Card  from "@/components/card/card";
import styles from "./Section.module.scss";
import { memo, useEffect, useRef, useState } from "react";
import { cardDimentionsForResponsive, debunceFunction } from "@/utils";
import Link from "next/link";

function Section({ section }: any): JSX.Element {
  // console.log('section....', section.section.sectionInfo)
  let sectionInfo;
  let sectionControls;
  if (section && section.section && section.section.sectionInfo) {
    sectionInfo = section.section.sectionInfo;
  }

  if (section && section.section && section.section.sectionControls) {
    sectionControls = section.section.sectionControls;
  }


  const cards = section?.section?.sectionData?.data || [];
  const cardType = cards.length > 0 && cards[0].cardType;

  const carouselRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [enablearrows, setEnablearrows] = useState<boolean>(false);
  const [enablerightarrow, setEnablerightarrow] = useState<boolean>(false);
  const [enableviewall,setEnableviewall] = useState<boolean>(false);
  const [enableleftarrow, setEnableleftarrow] = useState<boolean>(false);
  const [carouselWidth, setCarouselWidth] = useState<string>("100%");
 
  const [cardWidth, setCardWidth] = useState<string>("0px");
  



  // console.log(proxy_sections);
  

  useEffect(() => {
    // console.log('rendering,,,,,')
    if (carouselRef.current === null) return;
    setSectionconfigs()
    let debouncFunc = debunceFunction(setSectionconfigs, 500);
    const resizeObserver = new ResizeObserver(() => {
      debouncFunc();
    });
    resizeObserver.observe(carouselRef.current);
    return () => {
      resizeObserver.disconnect();
    };

  }, []);

  const setSectionconfigs = () => {

    if(carouselRef.current){
    const cardConfigs = cardDimentionsForResponsive(cardType);

    let card_width = 100 / Math.floor(cardConfigs.cardCount); 

    let carousel_width = card_width * cards.length;

    if(carousel_width > 100){
      card_width = 100 / cards.length ;
      if (cardConfigs.cardCount < cards.length ){
        setEnablearrows(true);
        setEnablerightarrow(true);
      }
    }
    else{
      carousel_width = 100
      setEnablearrows(false);
    }

    setCarouselWidth(`${carousel_width}%`);
    setCardWidth(`${card_width}%`);

    if(Math.floor(cardConfigs.cardCount) >= cards.length){
      setEnableviewall(false);
    }
    else{
      setEnableviewall(true)
    }

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
        if ((slider_width - (current_margin_left + 100) - 100) <= 100){
          sliderRef.current.style.marginLeft = `-${slider_width - 100}%`
          setEnablerightarrow(false);
          setEnableleftarrow(true);
        }
        else{
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
        else{
          let current_margin_left = Math.abs(percTonumber(sliderRef.current.style.marginLeft));
          sliderRef.current.style.marginLeft = `-${current_margin_left - 100}%`
        }
      }
    }
  };

  

 

  return (
    <>
      {!!cards && cards.length > 0 && (
        <div className={styles.section}>
          {sectionInfo && (
            <div className={`${styles.section_info}`}>
              <span className={`${styles.title}`}>{sectionInfo.name}</span>
              {(sectionControls.showViewAll && enableviewall) && (
                <Link href={`/${sectionControls.viewAllTargetPath}`}>
                  <div className={`${styles.view_all}`}>
                    <span className={`${styles.text}`}>View All</span>
                    <span className={`${styles.arrow}`}>&gt;</span>
                  </div>
                </Link>
              )}
            </div>
          )}

          <div className={styles.cards_wrapper}>
            {enablearrows && enableleftarrow && (
              <div
                className={`${styles.arrow_container} ${styles.left_arrow_container}`}
                onClick={() => handleScrollTo("right")}
              >
                <span className={`${styles.arrowbox}`}></span>
              </div>
            )}

            <div ref={carouselRef} className={`${styles.enableScroll}`}>
              <div
                style={{
                  marginLeft: "0%",
                  width: carouselWidth,
                }}
                className={styles.cards}
               ref={sliderRef}
              >
                {cards.map((card: any, index: any) => {
                  return (
                    <div
                      key={index}
                      style={{
                        width: cardWidth,
                        // float:'left',
                        display:'inline-block'
                      }}
                    >
                      <Card
                        key={index}
                        cardDetails={card}
                        // cardImageHeight={cardImageHeight}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {enablearrows && enablerightarrow && (
              <div
                className={`${styles.arrow_container} ${styles.right_arrow_container}`}
                onClick={() => handleScrollTo("left")}
              >
                <span className={`${styles.arrowbox}`}></span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default  memo(Section)