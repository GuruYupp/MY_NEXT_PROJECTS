import VideoPlayer from "./videoplayer/Videoplayer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import styles from "./Player.module.scss";
import Link from "next/link";
import VideoSuggestions from "./videosuggestions/VideoSuggestions";
import {
  fetchStreamData,
  resetstreamSlice,
} from "@/redux/feature/streamSlice/streamSlice";
import { getPlayerpageMeta } from "./playermeta";
import appConfig from "@/app.config";
import SlickSection from "../Sections/SlickSection/SlickSection";

export default function Player() {
  const { asPath } = useRouter();
  const { streamapiloading } = useAppSelector((state) => state.streamData);
  const {
    content,
    pageButtons,
    shareInfo,
    sections,
    streamStatus,
    info,
    tabsInfo,
  } = useAppSelector((state) => state.pageData.response);

  const dispatch = useAppDispatch();
  const [suggestionheight, SetsuggestionHeight] = useState<number>(0);

  const setSuggestionHeight = (height: number) => {
    SetsuggestionHeight(height);
  };

  // eslint-disable-next-line camelcase
  const {
    title,
    subtitle,
    description,
    // eslint-disable-next-line camelcase
    content_img,
    tvguide,
    // eslint-disable-next-line camelcase
    tvguide_target,
    pgrating,
    cast,
  } = getPlayerpageMeta(content);

  useEffect(
    function () {
      let params = {
        path: info.path || "",
        // eslint-disable-next-line camelcase
        stream_type: "",
      };

      if (
        streamStatus.trailerStreamStatus &&
        streamStatus.isParentControlled === false
      ) {
        // eslint-disable-next-line camelcase
        // params.stream_type = "trailer";
      }
      dispatch(resetstreamSlice());
      dispatch(fetchStreamData({ params }));
    },
    [asPath],
  );
  return (
    <div className={`${styles.player_page_container}`}>
      <div className={`${styles.player_page_top_container}`}>
        <div className={`${styles.player_page_top_left}`}>
          {streamapiloading === "succeeded" && (
            <div className={`${styles.player_wrapper}`}>
              <VideoPlayer setSuggestionHeight={setSuggestionHeight} />
            </div>
          )}
          {(streamapiloading === "pending" || streamapiloading === "idle") && (
            <div className={`${styles.player_wrapper}`}>
              <div className={`${styles.player_skelton}`}></div>
            </div>
          )}
          <div className={`${styles.player_footer}`}>
            <div className={`${styles.player_footer_inner}`}>
              <div className={`${styles.player_footer_inner_top}`}>
                <div className={`${styles.player_footer_inner_top_left}`}>
                  {/* eslint-disable-next-line camelcase*/}
                  {content_img && (
                    <div className={`${styles.image_container}`}>
                      {/* eslint-disable-next-line camelcase*/}
                      <img src={content_img} alt={title} />
                    </div>
                  )}
                  <div className={`${styles.meta_container}`}>
                    {title && <p className={`${styles.title}`}>{title}</p>}
                    {subtitle && (
                      <p className={`${styles.subtitle}`}>
                        {subtitle}
                        {pgrating && (
                          <span
                            className={`${styles.rating} ${styles.meta_row}`}
                          >
                            {pgrating}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${styles.player_footer_inner_top_right}`}>
                  <div className={`${styles.buttons}`}>
                    {pageButtons.showFavouriteButton && (
                      <span className={`${styles.btn} ${styles.favorite_btn}`}>
                        <img
                          src={`${appConfig.cloudpath + "/images/heart.svg"}`}
                          alt="heart"
                        />
                        Add To Favorite
                      </span>
                    )}
                    {pageButtons.showFavouriteButton &&
                      shareInfo.isSharingAllowed && (
                        <span className={`${styles.line}`}></span>
                      )}
                    {shareInfo.isSharingAllowed && (
                      <span className={`${styles.btn} ${styles.share_btn}`}>
                        <img
                          src={`${appConfig.cloudpath + "/images/share.svg"}`}
                          alt="share"
                        />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={`${styles.player_footer_inner_bottom}`}>
                {description && (
                  <p className={`${styles.description}`}>{description}</p>
                )}
                {cast && (
                  <div className={`${styles.cast_box}`}>
                    <p className={`${styles.cast}`}>Cast & Crew : {cast}</p>
                  </div>
                )}
                {tvguide && (
                  <div className={`${styles.tvguide_Box}`}>
                    {/* eslint-disable-next-line camelcase*/}
                    <Link href={`/${tvguide_target}`}>
                      <div className={`${styles.tvguide_btn}`}>{tvguide}</div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.player_page_top_right}`}>
          <div className={`${styles.player_page_top_right_inner}`}>
            {tabsInfo.showTabs === true && (
              <VideoSuggestions suggestionHeight={suggestionheight} />
            )}
          </div>
        </div>
      </div>
      <div className={`${styles.player_page_bottom_container}`}>
        <div className={`${styles.sections}`}>
          {sections.map((section, index) => {
            if (section.section.sectionData.params?.showOnPlayer == "true") {
              return <SlickSection key={index} section={section} />;
            }
          })}
        </div>
      </div>
    </div>
  );
}
