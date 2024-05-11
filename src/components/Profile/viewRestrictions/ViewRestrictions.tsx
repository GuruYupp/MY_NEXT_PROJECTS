import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/router";
import styles from "./ViewRestrictions.module.scss";
import { getAbsolutPath } from "@/utils";

import { useCallback, useEffect, useReducer, useState } from "react";
import viewRestrictionReducer, {
  blockedContentsPending,
  fetchblockedContents,
  blockedContentsFulfiled,
  blockedContentsRejected,
  queryContentsPending,
  fetchContents,
  queryContentsRejected,
  queryContentsFulfiled,
  queryContentsEmpty,
  addblockedContent,
  removeblockedContent,
} from "./viewRestrictionSlice";

import TitleRestrictions from "./TitleRestrictions/TitleRestrictions";

import { postData } from "@/services/data.manager";
import { resetViewRestrictions } from "@/redux/feature/restrictionSlice/restrictionSlice";
import appConfig from "@/app.config";
import { ViewRestrictionSliceInterface } from "./viewRestrictiontypes";
import Ratings from "@/components/Ratings/Ratings";
import { RatingsSliceInterface } from "@/components/Ratings/ratingstype";

function ViewRestrictions() {
  const { query, back } = useRouter();
  const { enableRestrictionpage, apivalidtoken } = useAppSelector(
    (state) => state.pagerestrictions,
  );
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector((state) => state.user);
  const { userprofiles } = useAppSelector(
    (state) => state.configs.systemFeatures,
  );
  const [cstate, cdispatch] = useReducer(
    viewRestrictionReducer,
    viewRestrictionReducer.getInitialState(),
  );

  const [activeProfileRating, setActiveProfileRating] =
    useState<RatingsSliceInterface["activeProfileRating"]>();

  const defaultprofileimg =
    "https://d2ivesio5kogrp.cloudfront.net/static/watcho/images/profile-pic1.svg";
  let Profile = userDetails?.profileParentalDetails?.filter(
    (profile) => profile.profileId?.toString() === query.userId,
  )[0];

  let ProfileImage: string = Profile?.imageUrl
    ? getAbsolutPath(Profile?.imageUrl)
    : defaultprofileimg;

  useEffect(() => {
    cdispatch(blockedContentsPending());
    let unmount = false;

    fetchblockedContents({ profileId: Profile?.profileId || -1 })
      .then((response) => {
        if (response.status === true) {
          const blockedContents = response.response
            .data as ViewRestrictionSliceInterface["blockedContents"];
          if (unmount === false) {
            cdispatch(blockedContentsFulfiled(blockedContents));
            console.log(blockedContents);
          }
        }
      })
      .catch((err) => {
        cdispatch(blockedContentsRejected(err as any));
      });

    return () => {
      unmount = true;
      dispatch(resetViewRestrictions());
    };
  }, []);

  const handleSearchQuery = useCallback((query: string) => {
    console.log(query.length, "----");
    if (query.length < 3) {
      cdispatch(queryContentsEmpty());
      return;
    }
    cdispatch(queryContentsPending());
    fetchContents({ query: query })
      .then((response) => {
        if (response.status === true) {
          let contents = response.response
            ?.data as ViewRestrictionSliceInterface["queryContents"];
          cdispatch(queryContentsFulfiled(contents));
        }
      })
      .catch((err) => {
        cdispatch(queryContentsRejected(err));
      });
  }, []);

  const handleSuggestionClick = useCallback(
    (suggestiondata: { id: string; name: string; category: string }) => {
      cdispatch(addblockedContent(suggestiondata));
    },
    [],
  );

  const handleRemoveblockedContent = useCallback((id: string) => {
    cdispatch(removeblockedContent(id));
  }, []);

  const handleRatingsonChange = useCallback(
    (activeProfileRating: RatingsSliceInterface["activeProfileRating"]) => {
      setActiveProfileRating(activeProfileRating);
    },
    [activeProfileRating],
  );

  if (enableRestrictionpage === false) {
    back();
  }

  const updateviewRestrictions = async (payload: any) => {
    try {
      const response = await postData(
        "/service/api/auth/update/view/restrictions",
        payload,
      );
      if (response.status === true) {
        back();
      } else {
      }
    } catch (err) {}
  };

  const handleSavebtn = () => {
    //activeProfileRating
    const { blockedContents } = cstate;
    let blockedItems: { category: string; itemIds: string }[] = [];
    blockedContents.map(({ category, itemsMap }) => {
      blockedItems.push({ category, itemIds: Object.keys(itemsMap).join(",") });
    });
    let context =
      userprofiles?.fields?.is_userprofiles_supported === "true"
        ? "user_profiles"
        : "userprofiles";
    let payload = {
      blockedItems,
      context,
      profileId: Profile?.profileId,
      ratingsId: activeProfileRating?.id,
      token: apivalidtoken,
    };
    updateviewRestrictions(payload);
  };

  return (
    <div className={`${styles.parenatal_container}`}>
      <div className={`${styles.inner}`}>
        <div className={`${styles.header}`}>
          <img
            src={`${appConfig.staticImagesPath}back.svg`}
            alt="back-icon"
            className={`${styles.back_icon}`}
          />
          Viewing Restrictions
        </div>
        <div className={`${styles.body}`}>
          <div className={`${styles.left}`}>
            <div className={`${styles.profile_icon}`}>
              <img src={ProfileImage} alt="" />
            </div>
          </div>
          <div className={`${styles.right}`}>
            <p className={`${styles.heading}`}>
              Profile Maturity Ratings for {Profile?.name}
            </p>
            <p className={`${styles.subheading}`}>
              Only show titles of rated{" "}
              <span className={`${styles.rating}`}>
                '{activeProfileRating?.displayCode || " A and Below "}'
              </span>{" "}
              for this profile.
            </p>

            <Ratings ratingsonChange={handleRatingsonChange} />

            <div className={`${styles.restrictionContainer}`}>
              <p className={`${styles.heading}`}>
                Title Restrictions for {Profile?.name}
              </p>
              <p className={`${styles.subheading}`}>
                Don’t show specific titles for this profile regardless of
                Maturity Rating
              </p>
              <TitleRestrictions
                {...cstate}
                handleSearch={handleSearchQuery}
                handleSuggestion={handleSuggestionClick}
                handleRemoveContent={handleRemoveblockedContent}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.btns}`}>
          <button className={`${styles.btn}`}>Cancel</button>
          <button
            className={`${styles.btn} ${styles.save_btn}`}
            onClick={handleSavebtn}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewRestrictions;
