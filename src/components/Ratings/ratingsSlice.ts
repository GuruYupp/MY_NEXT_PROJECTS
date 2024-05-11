import { getData } from "@/services/data.manager";
import { profileRatingType } from "@/shared";
import { createAction, createReducer } from "@reduxjs/toolkit";
import { RatingsSliceInterface } from "./ratingstype";

let initialState: RatingsSliceInterface = {
  profileRationgs: [],
  profileRationgsstatus: "idle",
  activeProfileRatingIndex: -1,
  activeProfileRating: {
    name: "",
    priority: -1,
    displayCode: "",
    description: "",
    pinRequiredRatings: "",
    id: -1,
    imageUrl: "",
  },
};

export const profileRationgsPending = createAction(
  "fetchprofileRationgs/pending",
);
export const profileRationgsFulfiled = createAction<profileRatingType[]>(
  "fetchprofileRationgs/fulfilled",
);
export const profileRationgsRejected = createAction<any>(
  "fetchprofileRationgs/rejected",
);
export const setActiveprofileRatingsIndex = createAction<number>(
  "setActiveprofileRatingsIndex",
);

const ratingsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(profileRationgsPending, (state) => {
      state.profileRationgsstatus = "pending";
    })
    .addCase(profileRationgsFulfiled, (state, action) => {
      console.log(action.payload);
      state.profileRationgs = action.payload.sort(
        (a, b) => a.priority - b.priority,
      );
      state.profileRationgsstatus = "fulfilled";
    })
    .addCase(profileRationgsRejected, (state) => {
      state.profileRationgsstatus = "rejected";
    })
    .addCase(setActiveprofileRatingsIndex, (state, action) => {
      state.profileRationgs.map((rating, index) => {
        if (rating.id === action.payload) {
          state.activeProfileRatingIndex = index;
          state.activeProfileRating = rating;
        }
      });
    });
});

export const fetchProfileRatings = async () => {
  let response = await getData("/service/api/v1/get/parental/ratings");
  return response;
};

export const fetchUserProfileRationgs = async () => {
  let response = await getData("/service/api/v1/get/user/parental/ratings");
  return response;
};

export default ratingsReducer;
