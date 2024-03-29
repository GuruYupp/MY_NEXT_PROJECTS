import React, { Fragment, memo, FC } from "react";
import DetailsMetaHOC from "../DetailsMetaHOC";
import styles from "./DesktopDetailsMeta.module.scss";
import appConfig from "@/app.config";
import Link from "next/link";
import DetailsActionButton from "../DetailsActionButton/DetailsActionButton";
import { DetailsMetaPropsType } from "../../detailstypes";
const DesktopDetailsMeta: FC<DetailsMetaPropsType> = (props) => {
  const {
    title,
    cast,
    subtitle,
    pgrating,
    imdbrating,
    description,
    buttons,
    pageButtons,
    shareInfo,
    director,
    targetpath,
    rentalinfo,
  } = props;

  return (
    <div className={`${styles.DetailsMeta_Container}`}>
      <div className={`${styles.title} ${styles.meta_row}`}>{title}</div>
      <div className={`${styles.subtitle} ${styles.meta_row}`}>
        {subtitle}
        {pgrating && (
          <>
            &nbsp; | &nbsp;
            <span className={`${styles.rating} ${styles.meta_row}`}>
              {pgrating}
            </span>
          </>
        )}

        {imdbrating && (
          <>
            <span className={`${styles.break}`}>|</span>
            <span className={`${styles.imdb} ${styles.meta_row}`}>
              <img
                src={`${appConfig.cloudpath + "/images/imdb.png"}`}
                alt="play"
              />
              {imdbrating}
            </span>
          </>
        )}
      </div>
      <div className={`${styles.description} ${styles.meta_row}`}>
        {description}
      </div>
      {director && (
        <div className={`${styles.cast}`}>Director : {director}</div>
      )}
      {cast && (
        <div className={`${styles.cast} ${styles.meta_row}`}>
          Cast & Crew : {cast}
        </div>
      )}

      <div className={`${styles.details_footer}`}>
        <div className={`${styles.buttons}`}>
          {buttons.length > 0 &&
            buttons.map((btn: any, index: number) => (
              <Fragment key={index}>
                {btn.elementSubtype === "signin" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      className={`${styles.btn} ${styles.signin_btn}`}
                      type="signin"
                      text={btn.data}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "rent" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      type="rent"
                      text={btn.data}
                      className={`${styles.btn} ${styles.rent_btn}`}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "subscribe" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      className={`${styles.btn} ${styles.signin_btn}`}
                      type="subscribe"
                      text={btn.data}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "watch_latest_episode" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      className={`${styles.btn} ${styles.watch_now}`}
                      type="watch_latest_episode"
                      text={btn.data}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "resume" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      type="resume"
                      text={btn.data}
                      className={`${styles.btn} ${styles.resume_btn}`}
                      Image={{
                        defaultImgurl: `${
                          appConfig.cloudpath +
                          "/images/play-circle-outline.svg"
                        }`,
                        altText: "resume",
                      }}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "startover" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      className={`${styles.btn} ${styles.favorite_btn}`}
                      type="startover"
                      text={btn.data}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "watchnow" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      className={`${styles.btn} ${styles.watch_latest}`}
                      type="watchnow"
                      text={btn.data}
                      btndata={btn}
                    />
                  </Link>
                )}
                {btn.elementSubtype === "trailer" && (
                  <Link href={`${btn.target}`}>
                    <DetailsActionButton
                      type="trailer"
                      text={btn.data}
                      className={`${styles.btn} ${styles.trailer_btn}`}
                      Image={{
                        defaultImgurl: `${
                          appConfig.cloudpath + "/images/trailer-icon-web.svg"
                        }`,
                        altText: "trailer",
                      }}
                      btndata={btn}
                    />
                  </Link>
                )}
              </Fragment>
            ))}

          {pageButtons.showFavouriteButton && (
            <DetailsActionButton
              type="favorite"
              text="Add to Favorite"
              className={`${styles.btn} ${styles.favorite_btn}`}
              Image={{
                defaultImgurl: `${appConfig.cloudpath + "/images/heart.svg"}`,
                selectedImgurl: `${
                  appConfig.cloudpath + "/images/favorite-active.svg"
                }`,
                altText: "",
              }}
              isFavourite={pageButtons?.isFavourite}
              targetpath={targetpath}
            />
          )}
          {shareInfo.isSharingAllowed && (
            <DetailsActionButton
              type="share"
              className={`${styles.btn} ${styles.share_btn}`}
              Image={{
                defaultImgurl: `${appConfig.cloudpath + "/images/share.svg"}`,
                altText: "share",
              }}
            />
          )}
        </div>
        {rentalinfo && (
          <div className={`${styles.rentalinfo}`}>
            <img
              src={`${appConfig.staticImagesPath}pack-info-icon.svg`}
              alt="info"
            />
            <p className={`${styles.text}`}>{rentalinfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MemoDesktopDetailsMeta = memo(DesktopDetailsMeta);

export default DetailsMetaHOC(MemoDesktopDetailsMeta);
