import { getData } from "@/services/data.manager";
import { profileRatingType } from "@/shared";
import { createAction, createReducer } from "@reduxjs/toolkit";
import { viewRestrictionInterface } from "./viewRestrictiontypes";

let initialState: viewRestrictionInterface = {
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
  blockedContentstatus: "idle",
  blockedContents: [],
  queryContentstatus: "idle",
  queryContents: [],
};

export const profileRationgsPending = createAction(
  "fetchprofileRationgs/pending"
);
export const profileRationgsFulfiled = createAction<profileRatingType[]>(
  "fetchprofileRationgs/fulfilled"
);
export const profileRationgsRejected = createAction<any>(
  "fetchprofileRationgs/rejected"
);
export const setActiveprofileRatingsIndex = createAction<number>(
  "setActiveprofileRatingsIndex"
);

export const blockedContentsPending = createAction(
  "fetchblockedContents/pending"
);
export const blockedContentsFulfiled = createAction<viewRestrictionInterface['blockedContents']>(
  "fetchblockedContents/fulfilled"
);
export const blockedContentsRejected = createAction<any>(
  "fetchblockedContents/rejected"
);
export const addblockedContent = createAction<{id:string,name:string,category:string}>('blockedContents/add')
export const removeblockedContent = createAction<string>('blockedContents/remove')

export const queryContentsPending = createAction("fetchContents/pending");
export const queryContentsFulfiled = createAction<viewRestrictionInterface['queryContents']>(
  "fetchContents/fulfilled"
);
export const queryContentsRejected = createAction<any>(
  "fetchContents/rejected"
);
export const queryContentsEmpty = createAction('querycontents/empty')

const viewRestrictionReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(profileRationgsPending, (state) => {
      state.profileRationgsstatus = "pending";
    })
    .addCase(profileRationgsFulfiled, (state, action) => {
      console.log(action.payload);
      state.profileRationgs = action.payload.sort(
        (a, b) => a.priority - b.priority
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
    })
    .addCase(blockedContentsPending, (state) => {
      state.blockedContentstatus = "pending";
    })
    .addCase(blockedContentsFulfiled, (state, action) => {
      const { payload } = action;
      state.blockedContentstatus = "fulfilled";
      state.blockedContents.push(...payload);
    })
    .addCase(blockedContentsRejected, (state) => {
      state.blockedContentstatus = "rejected";
    })
    .addCase(addblockedContent,(state,action)=>{
      const {payload} = action;
      let found = false;
      state.blockedContents.map(({category,itemsMap})=>{
        if(category === payload.category){
          found = true;
          if(itemsMap[payload.id] === undefined){
            itemsMap[payload.id] = payload.name
          }
        }
      })
      if(found === false){
        let itemsMap:{[key:string]:string}={}
        itemsMap[payload.id] = payload.name
        state.blockedContents.push({category:payload.category,itemsMap})
      }
    })
    .addCase(removeblockedContent,(state,action)=>{
      const {payload} = action
      state.blockedContents.map(({ itemsMap }) => {
        if(itemsMap[payload]){
          delete itemsMap[payload]
        }
      })
    })
    .addCase(queryContentsPending, (state) => {
      state.blockedContentstatus = "pending";
    })
    .addCase(queryContentsFulfiled, (state, action) => {
      const { payload } = action;
      state.queryContentstatus = "fulfilled";
      state.queryContents.push(...payload);
    })
    .addCase(queryContentsRejected, (state) => {
      state.queryContentstatus = "rejected";
    })
    .addCase(queryContentsEmpty,(state)=>{
      state.queryContents = []
    });
});

export const fetchProfileRatings = async () => {
  let response = await getData("/service/api/v1/get/parental/ratings");
  return response;
};

export const fetchblockedContents = async (params: { profileId: number }) => {
  let response = await getData("service/api/v1/get/blocked/items", params);
  return response;
};

export const fetchContents = async (params: { query: string }) => {
  let response = await getData("service/api/v1/search/content", params);
  return response;
};

export default viewRestrictionReducer;
