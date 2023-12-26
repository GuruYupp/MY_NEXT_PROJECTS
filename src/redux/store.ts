import { configureStore } from "@reduxjs/toolkit";
import configSlice from "./feature/configSlice/configSlice";
import pageSlice from "./feature/pageSlice/pageSlice";
import userSlice from "./feature/userSlice/userSlice";
import streamSlice from "./feature/streamSlice/streamSlice";
import tvguideSlice from "./feature/tvguideSlice/tvguideSlice";
import restrictionSlice from "./feature/restrictionSlice/restrictionSlice";
import searchv3Slice from "./feature/searchv3Slice/searchv3Slice";
const Store = configureStore({
  reducer:{
    configs:configSlice,
    pageData:pageSlice,
    user:userSlice,
    streamData:streamSlice,
    tvguideData:tvguideSlice,
    pagerestrictions: restrictionSlice,
    searchv3:searchv3Slice
  }
})

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store