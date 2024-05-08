import { cardInterface, templateType } from "@/shared";
import { CSSProperties, ReactNode, RefCallback, SyntheticEvent } from "react";
type cardElemetType = cardInterface["hover"]["elements"][0];
type cardMarkersType = cardInterface["display"]["markers"][0];
type cardDisplayType = cardInterface["display"];
export interface cardPropsInterface {
  display?: cardDisplayType;
  cardImage?: string;
  partnerIcon?: string;
  parentIcon?: string;
  showButton?: cardElemetType;
  buttonText?: cardElemetType;
  showFavoriteButton?: cardElemetType;
  isFavorite?: cardElemetType;
  showShareButton?: cardElemetType;
  seekMarker?: cardMarkersType;
  leftOverTimeMarker?: cardMarkersType;
  badgeMarker?: cardMarkersType;
  handleLikeButton: (e: SyntheticEvent) => void;
  handleRemoveContinueWatching: (e: SyntheticEvent) => void;
  getStylesFromMarkers: (marker: cardMarkersType) => CSSProperties;
  setcardImageRef: RefCallback<HTMLDivElement | null>;
  sectionCode: string;
}

export interface RootCardPropsInterface {
  cardDetails: cardInterface;
  sectionCode?: string;
}

export interface CardlinkWrapperPropsInterface {
  targetPath: string;
  children?: ReactNode;
  templateHandler?: (e: SyntheticEvent) => void;
  template?: templateType;
}
