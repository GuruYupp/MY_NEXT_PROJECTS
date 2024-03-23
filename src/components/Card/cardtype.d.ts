import { cardInterface, templateType } from "@/shared";
import { ReactNode, RefCallback, SyntheticEvent } from "react";
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
  handleLikeButton?: (e: SyntheticEvent) => void;
  handleRemoveContinueWatching?: (e: SyntheticEvent) => void;
  setcardImageRef: RefCallback<HTMLDivElement | null>;
}

export interface RootCardPropsInterface {
  cardDetails: cardInterface;
}

export interface CardlinkWrapperPropsInterface {
  targetPath: string;
  children?: ReactNode;
  templateHandler?: (e: SyntheticEvent) => void;
  template?: templateType;
}
