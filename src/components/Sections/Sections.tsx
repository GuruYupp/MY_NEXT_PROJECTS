import { memo, useEffect, useRef } from "react";
import style from "./Sections.module.scss";
import Section from "@/components/Sections/Section/Section";
import { useRouter } from "next/router";
import { default as clientCookie } from "js-cookie";
import { useAppSelector } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchSections } from "@/redux/feature/pageSlice/pageSlice";
import SlickSection from "./SlickSection/SlickSection";

export function ShimmerSection() {
  return (
    <div className={`${style.shimmer_row}`}>
      <div
        className={`${style.shimmer_card}`}
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className={`${style.shimmer_card}`}
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className={`${style.shimmer_card}`}
        style={{ animationDelay: "0.4s" }}
      ></div>
      <div
        className={`${style.shimmer_card}`}
        style={{ animationDelay: "0.6s" }}
      ></div>
      <div
        className={`${style.shimmer_card}`}
        style={{ animationDelay: "0.8s" }}
      ></div>
    </div>
  );
}

function Sections(): JSX.Element {
  const { sections, paginationData } = useAppSelector(
    (state) => state.pageData.response,
  );
  const { pagination } = useAppSelector((state) => state.pageData);
  const paginationReq = useRef<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { asPath } = useRouter();

  useEffect(() => {
    return () => {
      paginationReq.current?.abort();
    };
  }, [asPath]);

  useEffect(() => {
    window.addEventListener("scroll", scrollfunc);
    return () => {
      window.removeEventListener("scroll", scrollfunc);
    };
  }, [pagination]);

  let scrollfunc = async () => {
    if (
      document.documentElement.scrollHeight -
        window.innerHeight -
        window.scrollY <
        300 &&
      pagination !== "pending" &&
      pagination !== "failed"
    ) {
      if (paginationData.length > 0) {
        sectionPagination();
      }
    }
  };

  const sectionPagination = () => {
    let arr = asPath.split("/");
    arr.shift();
    let targetPath = arr.join("/") == "" ? "home" : arr.join("/");
    let codes: string[] = [];
    paginationData.forEach((paginationSection, index) => {
      if (index < 4) codes.push(paginationSection.data.contentCode);
    });
    let params = {
      path: targetPath,
      count: 40,
      offset: -1,
      code: codes.join(","),
    };

    const paginationPromise = dispatch(
      fetchSections({
        from: "carouselPagination",
        params,
      }),
    );

    paginationReq.current = paginationPromise;

    paginationPromise
      .unwrap()
      .then(({ result }) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={`${style.sections}`}>
      {sections.map((section, index) => {
        if (section.section.sectionInfo.name != "Cast & Crew") {
          return <SlickSection key={index} section={section} />;
        }
      })}
      {pagination === "pending" && <ShimmerSection />}
    </div>
  );
}
const MemoSections = memo(Sections);
export default MemoSections;
