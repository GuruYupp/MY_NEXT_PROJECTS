import { useEffect, useRef, useState } from "react";
import styles from "./Grid.module.scss";
import Card from "../card/card";
import { cardDimentionsForResponsive } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  cardInterface,
  searchv1Interface,
  searchv3Interface,
  sectionInterface,
} from "@/shared";
import { default as clientCookie } from "js-cookie";
import { useRouter } from "next/router";
import { fetchSections } from "@/redux/feature/pageSlice/pageSlice";
import { ShimmerSection } from "../Sections/Sections";

interface GridTableProps {
  section: sectionInterface;
}
export function GridTable(props: GridTableProps) {
  const { section } = props;
  const { pagination } = useAppSelector((state) => state.pageData);
  const paginationreq = useRef<any>();
  const cards = section?.section?.sectionData?.data || [];
  const cardType = cards.length > 0 ? cards[0].cardType : "overlay_poster";
  const dispatch = useAppDispatch();

  const { asPath } = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<string>("0px");

  const resizeObserver = new ResizeObserver(() => {
    setSectionconfigs();
  });

  useEffect(() => {
    if (elementRef.current !== null) {
      setSectionconfigs();
      resizeObserver.observe(elementRef.current);
    }
    return () => {
      paginationreq.current?.abort();
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    let scrollfunc = () => {
      if (
        document.documentElement.scrollHeight -
          window.innerHeight -
          window.scrollY <
          300 &&
        pagination !== "pending" &&
        pagination !== "failed"
      ) {
        if (section.section.sectionData.hasMoreData === true) {
          sectionpagination();
        }
      }
    };
    window.addEventListener("scroll", scrollfunc);
    return () => {
      window.removeEventListener("scroll", scrollfunc);
    };
  }, [pagination]);

  const sectionpagination = () => {
    let arr = asPath.split("/");
    arr.shift();
    let targetPath = arr.join("/") == "" ? "home" : arr.join("/");
    let params = {
      path: targetPath,
      offset: section.section.sectionData.lastIndex,
      code: section.section.sectionData.section,
    };

    const paginationpromise = dispatch(
      fetchSections({
        from: "gridPagination",
        params,
      }),
    );

    paginationreq.current = paginationpromise;

    paginationpromise.unwrap().then(({ result }) => {
      if (
        result.response?.status == false &&
        result.response?.error?.code == 401
      ) {
        clientCookie.remove("boxId");
        clientCookie.remove("tenantCode");
        clientCookie.remove("sessionId");
        clientCookie.remove("isLoggedin");
        window.location.reload();
      }
    });
  };

  const setSectionconfigs = () => {
    if (elementRef.current) {
      const cardConfigs = cardDimentionsForResponsive(cardType);
      let cardwidth = 100 / Math.floor(cardConfigs.gridCound);
      setCardWidth(`${cardwidth}%`);
    }
  };

  return (
    <div ref={elementRef} style={{ width: "100%" }}>
      {cards.map((card, index: number) => (
        <div key={index} style={{ width: cardWidth, float: "left" }}>
          <Card cardDetails={card} />
        </div>
      ))}
      {pagination === "pending" && <ShimmerSection />}
    </div>
  );
}

export default function Grid() {
  const { sections, banners, tabsInfo } = useAppSelector(
    (state) => state.pageData.response,
  );

  let sectionInfo;
  if (sections[0].section && sections[0].section.sectionInfo) {
    sectionInfo = sections[0].section.sectionInfo;
  }

  return (
    <div
      className={
        `${styles.Grid_container}` +
        (banners.length == 0 ? ` ${styles.noBanners}` : "")
      }
    >
      {sectionInfo && !tabsInfo.showTabs && (
        <div className={`${styles.section_info}`}>
          <span className={`${styles.title}`}>{sectionInfo.name}</span>
        </div>
      )}
      {sections.length > 0 && <GridTable section={sections[0]} />}
    </div>
  );
}

interface SearchGridProps {
  cards: cardInterface[];
  searchPaginationHandler?: () => void;
  pagination?:
    | searchv3Interface["tabsdata"][0]["searchResults"]["pagination"]
    | searchv1Interface["pagination"];
}
export function SearchGrid(props: SearchGridProps) {
  const { cards, pagination, searchPaginationHandler } = props;

  const cardType = cards.length > 0 ? cards[0].cardType : "overlay_poster";
  // const { asPath } = useRouter();
  const elementRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<string>("0px");

  const resizeObserver = new ResizeObserver(() => {
    setSectionconfigs();
  });

  useEffect(() => {
    if (elementRef.current !== null) {
      setSectionconfigs();
      resizeObserver.observe(elementRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!pagination) return;

    let scrollfunc = () => {
      if (
        document.documentElement.scrollHeight -
          window.innerHeight -
          window.scrollY <
          300 &&
        pagination !== "pending" &&
        pagination !== "rejected"
      ) {
        if (searchPaginationHandler) searchPaginationHandler();
      }
    };
    window.addEventListener("scroll", scrollfunc);
    return () => {
      window.removeEventListener("scroll", scrollfunc);
    };
  }, [pagination]);

  const setSectionconfigs = () => {
    if (elementRef.current) {
      const cardConfigs = cardDimentionsForResponsive(cardType);
      let cardwidth = 100 / Math.floor(cardConfigs.gridCound);
      setCardWidth(`${cardwidth}%`);
    }
  };

  return (
    <div ref={elementRef} style={{ width: "100%" }}>
      {cards.map((card, index: number) => (
        <div key={index} style={{ width: cardWidth, float: "left" }}>
          <Card cardDetails={card} />
        </div>
      ))}
      {/* {pagination === "pending" && <ShimmerSection />} */}
    </div>
  );
}
