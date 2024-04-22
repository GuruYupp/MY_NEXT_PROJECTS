import { useAppSelector } from "@/redux/hooks";
import getfrompagedata, {
  DetailsButtonType,
  getCastInfo,
} from "../getfrompagedata";
import { dataRowElementInterface } from "@/shared";
import { ComponentType } from "react";
import { DetailsMetaPropsType } from "../detailstypes";

function DetailsMetaHOC(WrappedComponent: ComponentType<DetailsMetaPropsType>) {
  return function WithMetaProps() {
    const { content, pageButtons, shareInfo, sections, info } = useAppSelector(
      (state) => state.pageData.response,
    );
    let buttonTypes: DetailsButtonType[] = [
      "trailer",
      "signin",
      "rent",
      "subscribe",
      "watch_latest_episode",
      "watchnow",
      "startover",
      "resume",
    ];
    let buttons: dataRowElementInterface[] = [];

    let title =
      getfrompagedata(content, "title")?.data ||
      content[0].content?.title ||
      "";
    let targetpath = info.path || "";

    // let partnerIcon = getfrompagedata(content,"partnerIcon")?.data || "";
    let subtitle = getfrompagedata(content, "subtitle")?.data || "";
    let pgrating = getfrompagedata(content, "pgrating")?.data || "";

    let cast = getfrompagedata(content, "cast")?.data || "";
    cast = cast.split("|").join(",");

    let director = "";
    if (!cast) {
      let castData = getCastInfo(
        sections.filter(
          (section) => section.section.sectionInfo.name === "Cast & Crew",
        )[0],
      );
      cast = castData.cast;
      director = castData.director;
    }

    let description = getfrompagedata(content, "description")?.data || "";
    let imdbrating = getfrompagedata(content, "imdb")?.data || "";
    // let rentbtn = getfrompagedata(content, "rent")?.data || "";
    let rentalinfo = getfrompagedata(content, "rentalinfo")?.data || "";

    buttonTypes.map((button) => {
      let btn = getfrompagedata(content, button);
      btn && buttons.push(btn);
    });

    let propsData = {
      pageButtons,
      shareInfo,
      buttons,
      title,
      subtitle,
      pgrating,
      description,
      imdbrating,
      cast,
      director,
      rentalinfo,
      targetpath,
    };
    return <WrappedComponent {...propsData} />;
  };
}

export default DetailsMetaHOC;
