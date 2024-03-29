import {
  dataRowElementInterface,
  pageButtonInterface,
  pageStateInterface,
} from "@/shared";

export type DetailsActionButtonPropsType = {
  className?: string;
  Image?: {
    defaultImgurl: string;
    selectedImgurl?: string;
    altText: string;
  };
  text?: string;
  btndata?: dataRowElementInterface;
} & (
  | { type: "signin" }
  | { type: "watch_latest_episode" }
  | { type: "resume" }
  | { type: "startover" }
  | { type: "watchnow" }
  | { type: "trailer" }
  | { type: "rent" }
  | { type: "favorite"; isFavourite?: boolean; targetpath?: string }
  | { type: "share" }
  | { type: "subscribe" }
);

export type DetailsMetaPropsType = {
  pageButtons: pageButtonInterface;
  shareInfo: pageStateInterface["response"]["shareInfo"];
  buttons: dataRowElementInterface[];
  title: string;
  subtitle: string;
  pgrating: string;
  description: string;
  imdbrating: string;
  cast: string;
  director: string;
  rentalinfo: string;
  targetpath: string;
};
