import { bannerInterface } from '@/shared';
// import { ReactNode } from "react";
import styles from './banners.module.scss';
import Slider, { Settings } from 'react-slick';
import appConfig from '@/app.config';
import { useAppSelector } from '@/redux/hooks';

export function ShimmerSection() {
  console.log('banners....')
  return (
    <div className={`${styles.shimmer_row}`}>
      <div
        className={`${styles.shimmer_card}`}
        style={{ animationDelay: '0s' }}
      ></div>
      {/* <div
        className={`${styles.shimmer_card}`}
        style={{ animationDelay: '0.2s' }}
      ></div>
      <div
        className={`${styles.shimmer_card}`}
        style={{ animationDelay: '0.4s' }}
      ></div>
      <div
        className={`${styles.shimmer_card}`}
        style={{ animationDelay: '0.6s' }}
      ></div>
      <div
        className={`${styles.shimmer_card}`}
        style={{ animationDelay: '0.8s' }}
      ></div> */}
    </div>
  );
}

function Banner({ banner }: { banner: bannerInterface }) {
  return (
    <div className={styles.imageContainer}>
      <img
        src={`${appConfig.bannerImgpath}/content/banner/common/${
          banner.imageUrl.split(',')[1]
        }`}
        alt=""
      />
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
  // const { banners } = useContext(PageContext);
  const { banners } = useAppSelector((state) => state.pageData.response);
  const {loading} = useAppSelector(state=>state.pageData)
  const settings: Settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: Dot,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    easing: 'linear',
    beforeChange: (_currentSlide: number, _nextSlide: number) => {
      // console.log(currentSlide);
      // console.log(nextSlide);
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
          <Slider {...settings}>
            {banners.map((banner, index) => (
              <Banner key={index} banner={banner} />
            ))}
          </Slider>
        </div>
      </div>
      <div className={styles.sectionhelper}></div>
    </div>
  ) : (
    <>{(loading === "pending" || loading === "idle" ) && <ShimmerSection/>}</>
  );
}
