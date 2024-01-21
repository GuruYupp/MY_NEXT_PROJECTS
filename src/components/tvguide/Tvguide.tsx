import { useEffect, useState, useRef } from "react";
import styles from "./Tvguide.module.scss";
import { getNewTimeList } from "./tvguideUtils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchChannelData,
  fetchChannelIds,
  resettvGuidestate,
} from "@/redux/feature/tvguideSlice/tvguideSlice";
import getConfig from "next/config";
import ProgramTab from "./ProgramTab/ProgramTab";
import { debunceFunction, throttelFunction } from "@/utils";
let appConfig = getConfig().publicRuntimeConfig.appconfig;
let paddingListeners: (() => void)[] = [];
export default function TvGuide() {
  const {
    selectedTab,
    paginationchannelIds,
    channelIds,
    channelsData,
    channelsdataState,
    page,
  } = useAppSelector((state) => state.tvguideData);
  const dipatch = useAppDispatch();
  let timeList: string[] = getNewTimeList();

  const [programWidth, setProgramWidth] = useState<number>(0);

  const programsRef = useRef<HTMLDivElement | null>(null);
  const livebarRef = useRef<HTMLDivElement | null>(null);
  const liveProgressRef = useRef<ReturnType<typeof setInterval>>();
  const debouncesetProgramPadding = debunceFunction(setProgramPadding, 10);
  const debounceCheckFn = debunceFunction(checkFn,10);
  const throttelliveProgress = throttelFunction(liveProgress, 10);

  useEffect(() => {
    dipatch(fetchChannelIds());
    checkFn();
    let portrait = window.matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", handlePotraitChange);
    return () => {
      paddingListeners = [];
      dipatch(resettvGuidestate());
      portrait.removeEventListener("change", handlePotraitChange);
    };
  }, []);

  function handlePotraitChange() {
    //arg Type event: MediaQueryListEvent
    if (programsRef.current && livebarRef.current) {
      programsRef.current.scrollLeft = 0;
      livebarRef.current.style.left = "0px";
    }
  }

   function checkFn(){
    if (window.innerWidth <= 991) {
      setProgramWidth(180);
    } else {
      setProgramWidth(270);
    }
  };

  useEffect(() => {
    debouncesetProgramPadding()
    window.addEventListener("resize", debounceCheckFn);
    programsRef.current?.addEventListener("scroll", handleProgramsScroll);
    return () => {
      window.removeEventListener("resize", debounceCheckFn);
      programsRef.current?.removeEventListener("scroll", handleProgramsScroll);
    };
  }, [programWidth]);

  useEffect(() => {
    window.addEventListener("scroll", scrollfunc);
    if (channelsdataState === "succeeded") debouncesetProgramPadding();
    return () => {
      window.removeEventListener("scroll", scrollfunc);
    };
  }, [channelsdataState]);

  useEffect(() => {
    liveProgressRef.current = setInterval(() => {
      throttelliveProgress();
    }, 1000);
    return () => {
      if (liveProgressRef.current) {
        clearInterval(liveProgressRef.current);
      }
    };
  }, [channelIds]);

  const setPaddingfromGuide = (cb: () => void) => {
    paddingListeners.push(cb);
  };

  function handleProgramsScroll() {
    //evt: HTMLElementEventMap["scroll"]
    if (programsRef.current && livebarRef.current) {
      livebarRef.current.style.left = `${-programsRef.current.scrollLeft}px`;
      debouncesetProgramPadding();
    }
  }

  const scrollfunc = () => {
    if (
      document.documentElement.scrollHeight -
        window.innerHeight -
        window.scrollY <
        300 &&
      channelsdataState !== "pending" &&
      channelsdataState !== "failed"
    ) {
      if (paginationchannelIds.length > 0) {
        getChannelsData();
      }
    }
  };

  function getprogramWidth(
    startTime: string | undefined,
    endTime: string | undefined
  ) {
    if (startTime && endTime) {
      if (
        selectedTab.endTime &&
        Number(endTime) > Number(selectedTab.endTime)
      ) {
        endTime = selectedTab.endTime.toString();
      }
      if (
        selectedTab.startTime &&
        Number(startTime) < Number(selectedTab.startTime)
      ) {
        startTime = selectedTab.startTime.toString();
      }
      let duration = Number(endTime) - Number(startTime);
      let durationinmins = duration / 1000 / 60;
      let width = (durationinmins * programWidth) / 30;
      return width;
    }
    return 0;
  }

  function getChannelsData() {
    let channelIdsinfo = paginationchannelIds.slice(0, 8);
    let ids = channelIdsinfo.map((channel) => channel.id);
    let startTime = selectedTab.startTime || 0;
    let endTime = selectedTab.endTime || 0;
    dipatch(
      fetchChannelData({
        // eslint-disable-next-line camelcase
        start_time: startTime,
        // eslint-disable-next-line camelcase
        end_time: endTime,
        page: page,
        // eslint-disable-next-line camelcase
        channel_ids: ids.join(","),
        // eslint-disable-next-line camelcase
        skip_tabs: 1,
      })
    );
  }

  function setProgramPadding() {
    paddingListeners.forEach((listener) => {
      listener();
    });
  }

  function handleScrollLeft() {
    if (programsRef.current) {
      if (
        programsRef.current.scrollWidth - programsRef.current.scrollLeft !==
        programsRef.current.clientWidth
      ) {
        programsRef.current.scrollLeft += programWidth * 2;
      }
    }
  }

  function handleScrollRight() {
    if (programsRef.current) {
      if (programsRef.current.scrollLeft !== 0) {
        programsRef.current.scrollLeft -= programWidth * 2;
      }
    }
  }

  function liveProgress() {
    let currentTime = new Date().getTime();
    if (livebarRef.current && selectedTab.startTime) {
      let marginleftmin = (currentTime - selectedTab.startTime) / 1000 / 60;
      let marginleftpx = (marginleftmin * programWidth) / 30;
      livebarRef.current.style.marginLeft = `${marginleftpx}px`;
    }
  }

  return (
    <div className={`${styles.tvguide_container}`}>
      <div className={`${styles.tvgudie_header}`}>
        <h1 className={`${styles.title}`}> Tv Guide </h1>
        <button className={`${styles.filterbtn}`}>
          Apply Filters{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="6"
            viewBox="0 0 10 6"
          >
            <path
              id="Path_2983"
              data-name="Path 2983"
              d="M0,8.825,3.709,5,0,1.175,1.142,0,6,5,1.142,10Z"
              transform="translate(10) rotate(90)"
              fill="#fff"
              opacity="0.85"
            />
          </svg>
        </button>
      </div>
      <div className={`${styles.guide_container}`}>
        <div className={`${styles.guide_left}`}>
          <div className={`${styles.guide_left_top}`}>
            <div className={`${styles.go_live_div}`}>
              {/* <div className={`${styles.live_circle}`}></div>
              <div className={`${styles.go_live}`}> Go Live</div> */}
            </div>
          </div>
          <div className={`${styles.guide_left_bottom}`}>
            <div className={`${styles.channels_container}`}>
              {channelIds.map((channel, index) => {
                return (
                  <div key={index} className={`${styles.channel}`}>
                    <img
                      src={`${
                        appConfig.tvguideChannelsImgPath
                      }/content/common/${
                        channel.display.imageUrl?.split(",")[1]
                      }`}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={`${styles.guide_right}`}>
          <div className={`${styles.guide_programs_wrapper}`}>
            <div
              className={`${styles.guide_programs_container}`}
              ref={programsRef}
            >
              <div className={`${styles.times}`}>
                <div className={`${styles.times_inner}`}>
                  {timeList.map((time, index) => (
                    <div key={index} className={`${styles.time}`}>
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.programs_data_container}`}>
                {channelsData.map((channel, index) => {
                  return (
                    <div
                      key={index}
                      className={`${styles.programs_inner_container}`}
                    >
                      {channel.programs.map((program, index) => {
                        return (
                          <div
                            key={index}
                            className={`${styles.program}`}
                            style={{
                              width: `${getprogramWidth(
                                program.display.markers?.startTime?.value,
                                program.display.markers?.endTime?.value
                              )}px`,
                            }}
                          >
                            <ProgramTab
                              program={program}
                              channelLeft={
                                programsRef.current?.getBoundingClientRect()
                                  .left
                              }
                              setPaddingfromGuide={setPaddingfromGuide}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${styles.guide_arrows_container}`}>
              <div
                className={`${styles.arrow} ${styles.left_arrow}`}
                onClick={handleScrollRight}
              ></div>
              <div
                className={`${styles.arrow} ${styles.right_arrow}`}
                onClick={handleScrollLeft}
              ></div>
            </div>

            <div className={`${styles.live_bar}`} ref={livebarRef}>
              <div className={`${styles.live_bar_inner}`}>
                <span className={`${styles.live_text}`}>Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
