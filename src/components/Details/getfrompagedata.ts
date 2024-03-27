import {
  contentInterface,
  dataRowElementInterface,
  sectionInterface,
} from "@/shared";

export type DetailsButtonType =
  | "bgImage"
  | "partnerIcon"
  | "title"
  | "pgrating"
  | "cast"
  | "signin"
  | "trailer"
  | "watch_latest_episode"
  | "description"
  | "subtitle"
  | "watchnow"
  | "image"
  | "tvguide"
  | "resume"
  | "startover"
  | "imdb"
  | "rent"
  | "subscribe"
  | "rentalinfo"
  | "";

export default function getfrompagedata(
  content: contentInterface[],
  type: DetailsButtonType,
): dataRowElementInterface | undefined {
  let res;
  content.map((content) => {
    content.content?.dataRows?.map((dataRow) => {
      dataRow?.elements?.map((element) => {
        if (element.elementSubtype === type || element.elementType === type) {
          res = element;
        }
      });
    });
  });
  return res;
}

export function getCastInfo(section?: sectionInterface) {
  let res = { cast: "", director: "" };
  if (!section) return res;
  section.section.sectionData.data.map((data) => {
    if (data.display.subtitle1 === "Director") {
      res.director = data.display.title || "";
    } else {
      res.cast = !res.cast
        ? `${data.display.title}`
        : res.cast + `, ${data.display.title}`;
    }
  });
  return res;
}
