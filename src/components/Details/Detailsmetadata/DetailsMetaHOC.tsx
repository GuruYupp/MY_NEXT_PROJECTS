import { useAppSelector } from "@/redux/hooks";
import getfrompagedata, { DetailsButtonType } from "../getfrompagedata";
import { dataRowElementInterface } from "@/shared";

function DetailsMetaHOC(WrappedComponent: any) {
  return function WithMetaProps() {
    const { content, pageButtons, shareInfo } = useAppSelector(
      (state) => state.pageData.response,
    );
    let buttonTypes: DetailsButtonType[] = [
      "signin",
      "trailer",
      "watch_latest_episode",
      "watchnow",
      "resume",
      "startover",
    ];
    let buttons: dataRowElementInterface[] = [];

    let title = getfrompagedata(content, "title")?.data || "";

    // let partnerIcon = getfrompagedata(content,"partnerIcon")?.data || "";
    let subtitle = getfrompagedata(content, "subtitle")?.data || "";
    let pgrating = getfrompagedata(content, "pgrating")?.data || "";

    let cast = getfrompagedata(content, "cast")?.data || "";
    cast = cast.split("|").join(",");

    let description = getfrompagedata(content, "description")?.data || "";
    let imdbrating = getfrompagedata(content, "imdb")?.data || "";
    let rentbtn = getfrompagedata(content, "rent")?.data || "";

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
      rentbtn,
    };
    return <WrappedComponent {...propsData} />;
  };
}

export default DetailsMetaHOC;
