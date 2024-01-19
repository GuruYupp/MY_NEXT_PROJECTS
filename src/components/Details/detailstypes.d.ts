export type DetailsActionButtonPropsType = {
  className?: string;
  Image?: {
    defaultImgurl: string;
    selectedImgurl?: string;
    altText: string;
  };
  text?: string;
} & (
  | { type: "signin" }
  | { type: "watch_latest_episode" }
  | { type: "resume" }
  | { type: "startover" }
  | { type: "watchnow" }
  | { type: "trailer" }
  | { type: "rent" }
  | { type: "favorite", isFavourite:boolean}
  | { type: "share" }
);
