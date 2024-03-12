import { contentInterface, dataRowElementInterface } from "@/shared";

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
