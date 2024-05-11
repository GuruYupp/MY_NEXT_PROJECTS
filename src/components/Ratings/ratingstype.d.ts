import { profileRatingType, subprofileInterface } from "@/shared";

export interface RatingsSliceInterface {
  profileRationgsstatus: "pending" | "idle" | "fulfilled" | "rejected";
  profileRationgs: profileRatingType[];
  activeProfileRatingIndex: number;
  activeProfileRating: profileRatingType;
}

export interface RatingsPropsInterface {
  ratingsonChange: (arg: RatingsSliceInterface["activeProfileRating"]) => void;
}

export interface DesktopRatingsInterface extends RatingsSliceInterface {
  ratingClick: (
    args: RatingsSliceInterface["activeProfileRatingIndex"],
  ) => void;
}

export interface MobileRatingsInterface
  extends RatingsSliceInterface,
    DesktopRatingsInterface {
  Profile?: subprofileInterface;
}

export interface BottomRatingsInterface extends MobileRatingsInterface {
  closeModal: () => void;
}
