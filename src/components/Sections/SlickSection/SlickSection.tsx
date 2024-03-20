import Card from "@/components/card/card";
import styles from "./SlickSection.module.scss";
import { FC, memo } from "react";
import { cardCountForSectionSlick } from "@/utils";
import Link from "next/link";
import { sectionInterface } from "@/shared";
import Slider, { Settings } from "react-slick";

function SampleNextArrow(props: any) {
  const { onClick, className } = props;
  let arrowClass = `${styles.arrow_container} ${styles.right_arrow_container} ${className.includes("slick-disabled") ? styles.disabled : ""}`;
  return (
    <div className={arrowClass} onClick={onClick}>
      <span className={`${styles.arrowbox}`}></span>
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { onClick, className } = props;
  let arrowClass = `${styles.arrow_container} ${styles.left_arrow_container} ${className.includes("slick-disabled") ? styles.disabled : ""}`;
  return (
    <div className={arrowClass} onClick={onClick}>
      <span className={`${styles.arrowbox}`}></span>
    </div>
  );
}

const SlickSection: FC<{ section: sectionInterface }> = (props) => {
  const { section } = props;

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

  const settings: Settings = {
    accessibility: false,
    dots: false,
    infinite: false,
    easing: "linear",
    lazyLoad: "progressive",
    arrows: true,
    centerPadding: "0px",
    initialSlide: 0,
    className: "section_carousel",
    ...cardCountForSectionSlick(cardType),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      {!!cards && cards.length > 0 && (
        <div className={styles.section}>
          {sectionInfo && (
            <div className={`${styles.section_info}`}>
              <span className={`${styles.title}`}>{sectionInfo.name}</span>
              {sectionControls?.showViewAll && (
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
            <Slider {...settings}>
              {cards.map((card: any, index: any) => {
                return (
                  <div
                    key={index}
                    style={{
                      //   width: cardWidth,
                      // float:'left',
                      display: "inline-block",
                    }}
                  >
                    <Card key={index} cardDetails={card} />
                  </div>
                );
              })}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(SlickSection);
