import {
  ComponentType,
  FC,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import ratingsReducer, {
  fetchProfileRatings,
  fetchUserProfileRationgs,
  profileRationgsFulfiled,
  profileRationgsPending,
  profileRationgsRejected,
  setActiveprofileRatingsIndex,
} from "./ratingsSlice";
import { profileRatingType } from "@/shared";
import { useAppSelector } from "@/redux/hooks";
import {
  DesktopRatingsInterface,
  MobileRatingsInterface,
  RatingsPropsInterface,
} from "./ratingstype";

const RatingsHOC = (
  Component: ComponentType<DesktopRatingsInterface | MobileRatingsInterface>,
) => {
  const RenderComponent: FC<RatingsPropsInterface> = (props) => {
    const { ratingsonChange } = props;
    const [cstate, cdispatch] = useReducer(
      ratingsReducer,
      ratingsReducer.getInitialState(),
    );

    const { activeProfileRating } = cstate;

    const [unmount, setUnmount] = useState<Boolean>(false);
    const { userprofiles } = useAppSelector(
      (state) => state.configs.systemFeatures,
    );

    const { activeProfile } = useAppSelector((state) => state.user);

    useEffect(() => {
      cdispatch(profileRationgsPending());
      getProfileRatings();
      if (userprofiles?.fields?.is_userprofiles_supported !== "true") {
        getUserProfileRatings();
      }
      return () => {
        setUnmount(true);
      };
    }, []);

    useEffect(() => {
      ratingsonChange(activeProfileRating);
    }, [activeProfileRating]);

    const getProfileRatings = async () => {
      try {
        const response = await fetchProfileRatings();
        if (response.status === true) {
          const ratings = response.response
            ?.parentalRatings as profileRatingType[];
          if (unmount === false) {
            cdispatch(profileRationgsFulfiled(ratings));
            if (
              userprofiles?.fields?.is_userprofiles_supported === "true" &&
              activeProfile
            ) {
              cdispatch(
                setActiveprofileRatingsIndex(
                  activeProfile?.profileRatingId || -1,
                ),
              );
            }
          }
        }
      } catch (err) {
        cdispatch(profileRationgsRejected(err as any));
      }
    };

    const getUserProfileRatings = async () => {
      try {
        const response = await fetchUserProfileRationgs();
        if (response.status === true) {
          const ratings = response.response;
          if (unmount === false) {
            cdispatch(setActiveprofileRatingsIndex(ratings?.id || -1));
          }
        }
      } catch (err) {
        cdispatch(profileRationgsRejected(err as any));
      }
    };

    const handleRatingClick = useCallback((id: number) => {
      cdispatch(setActiveprofileRatingsIndex(id));
    }, []);

    return <Component {...cstate} ratingClick={handleRatingClick} />;
  };

  return RenderComponent;
};

export default RatingsHOC;
