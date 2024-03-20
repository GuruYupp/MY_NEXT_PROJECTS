import styles from "./banners.module.scss";
import Slider, { Settings } from "react-slick";
import { useAppSelector } from "@/redux/hooks";
import Banner from "./banner/Banner";
import { useRef, useState } from "react";

export function ShimmerSection() {
  return (
    <div className={`${styles.shimmer_row}`}>
      <div
        className={`${styles.shimmer_card}`}
        style={{ animationDelay: "0s" }}
      ></div>
    </div>
  );
}

// function Dots(dots: ReactNode): JSX.Element {
//   return <ul>{dots}</ul>;
// }

function Dot() {
  return <div className={styles.dot}></div>;
}

export default function Banners() {
  const { banners } = useAppSelector((state) => state.pageData.response);
  const { loading } = useAppSelector((state) => state.pageData);
  const [currentslickIndex, setCurretnSlickIndex] = useState<number>(0);
  const slickRef = useRef<Slider | null>();

  const pauseSlider = () => {
    slickRef.current?.slickPause();
  };

  const playSlider = () => {
    slickRef.current?.slickPlay();
  };

  const settings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: Dot,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    easing: "linear",
    lazyLoad: "anticipated",
    beforeChange: (_currentSlide: number, _nextSlide: number) => {
      // console.log(currentSlide);
      // console.log(nextSlide);
      setCurretnSlickIndex(_nextSlide);
    },
    afterChange: (_currentSlide: number) => {
      // console.log(currentSlide);
    },
    // useCSS: true,
    dotsClass: styles.bannerdots,
    centerMode: false,
    arrows: false,
    // centerPadding:'140px',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          // centerPadding: '20px'
        },
      },
    ],
  };
  // console.log(banners);
  return banners.length > 0 ? (
    <div className={styles.banners}>
      <div className={styles.bannersWrapper}>
        <div className={styles.bannersContainers}>
          <Slider {...settings} ref={(slider) => (slickRef.current = slider)}>
            {banners.map((banner, index) => (
              <Banner
                key={index}
                banner={banner}
                playSlider={playSlider}
                pauseSlider={pauseSlider}
                activeSlideIndex={currentslickIndex}
                SlideIndex={index}
              />
            ))}
          </Slider>
        </div>
      </div>
      <div className={styles.sectionhelper}></div>
    </div>
  ) : (
    <>{(loading === "pending" || loading === "idle") && <ShimmerSection />}</>
  );
}
