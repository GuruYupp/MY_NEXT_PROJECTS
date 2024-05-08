import { cardInterface } from "@/shared";

export type cardhoverType =
  | "showButton"
  | "ButtonText"
  | "showFavouriteButton"
  | "isFavourite"
  | "showShareButton"
  | "showButton"
  | "showShareButton"
  | "targetPath";

export default function getfromcarddata(
  content: cardInterface,
  type: cardhoverType,
): cardInterface["hover"]["elements"][0] | undefined {
  let res;
  content.hover.elements.map((element) => {
    if (element.key === type) {
      res = element;
    }
  });
  return res;
}

export type markerType = "seek" | "leftOverTime" | "badge" | "";

export function getcardMarker(
  content: cardInterface,
  marker: markerType,
): cardInterface["display"]["markers"][0] | undefined {
  let res;
  content.display.markers.map((element) => {
    if (element.markerType === marker) {
      res = element;
    }
  });
  return res;
}
