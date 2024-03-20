import Card from "@/components/card/card";
import styles from "./Section.module.scss";
import { FC, memo, useEffect, useRef, useState } from "react";
import { cardDimentionsForResponsive, debunceFunction } from "@/utils";
import Link from "next/link";
import { sectionInterface } from "@/shared";

const Section: FC<{ section: sectionInterface }> = (props) => {
  const { section } = props;
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
  const cardType = cards.length > 0 ? cards[0].cardType : "";

  const carouselRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [enablearrows, setEnablearrows] = useState<boolean>(false);
  const [enablerightarrow, setEnablerightarrow] = useState<boolean>(false);
  const [enableviewall, setEnableviewall] = useState<boolean>(false);
  const [enableleftarrow, setEnableleftarrow] = useState<boolean>(false);
  const [carouselWidth, setCarouselWidth] = useState<string>("100%");

  const [cardWidth, setCardWidth] = useState<string>("0px");

  // console.log(proxy_sections);

  useEffect(() => {
    // console.log('rendering,,,,,')
    if (carouselRef.current === null) return;
    setSectionconfigs();
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
    if (carouselRef.current) {
      const cardConfigs = cardDimentionsForResponsive(cardType);

      let cardwidth = 100 / Math.floor(cardConfigs.cardCount);

      let carouselwidth = cardwidth * cards.length;

      if (carouselwidth > 100) {
        cardwidth = 100 / cards.length;
        if (cardConfigs.cardCount < cards.length) {
          setEnablearrows(true);
          setEnablerightarrow(true);
        }
      } else {
        carouselwidth = 100;
        setEnablearrows(false);
      }

      setCarouselWidth(`${carouselwidth}%`);
      setCardWidth(`${cardwidth}%`);

      if (Math.floor(cardConfigs.cardCount) >= cards.length) {
        setEnableviewall(false);
      } else {
        setEnableviewall(true);
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
        let currentmarginleft = Math.abs(
          percTonumber(sliderRef.current.style.marginLeft),
        );
        let sliderwidth = percTonumber(sliderRef.current.style.width);
        console.log(sliderwidth - (currentmarginleft + 100));
        if (sliderwidth - (currentmarginleft + 100) - 100 <= 100) {
          sliderRef.current.style.marginLeft = `-${sliderwidth - 100}%`;
          setEnablerightarrow(false);
          setEnableleftarrow(true);
        } else {
          let currentmarginleft = Math.abs(
            percTonumber(sliderRef.current.style.marginLeft),
          );
          // if (current_margin_left + 100)
          sliderRef.current.style.marginLeft = `-${currentmarginleft + 100}%`;
          setEnableleftarrow(true);
        }
      } else if (to === "right") {
        let currentmarginleft = Math.abs(
          percTonumber(sliderRef.current.style.marginLeft),
        );
        if (currentmarginleft - 100 < 100) {
          sliderRef.current.style.marginLeft = `${0}%`;
          setEnableleftarrow(false);
          setEnablerightarrow(true);
        } else {
          let currentmarginleft = Math.abs(
            percTonumber(sliderRef.current.style.marginLeft),
          );
          sliderRef.current.style.marginLeft = `-${currentmarginleft - 100}%`;
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
              {sectionControls?.showViewAll && enableviewall && (
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
                        display: "inline-block",
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
};

export default memo(Section);
