import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type initialStateType = {
  enableRestrictionpage: boolean;
  apivalidtoken: string;
};

let initialState: initialStateType = {
  enableRestrictionpage: false,
  apivalidtoken: "",
};

const pageRestrictionSlice = createSlice({
  name: "pageRestrictreducer",
  initialState,
  reducers: {
    enableRestrictionpage: (
      state,
      action: PayloadAction<{ token: string }>,
    ) => {
      const { payload } = action;
      state.enableRestrictionpage = true;
      state.apivalidtoken = payload.token;
    },
    disableRestrictionpage: (state) => {
      state.enableRestrictionpage = false;
    },
    resetViewRestrictions: () => {
      return initialState;
    },
  },
});

export const {
  enableRestrictionpage,
  disableRestrictionpage,
  resetViewRestrictions,
} = pageRestrictionSlice.actions;

export default pageRestrictionSlice.reducer;
