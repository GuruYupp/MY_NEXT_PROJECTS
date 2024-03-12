import { menuInterface, systemconfigsInterface } from "@/shared";
import { getFromlocalStorage } from "@/utils";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  menus: menuInterface[];
  systemConfigs: systemconfigsInterface;
  systemFeatures: any;
  isutUser: boolean;
} = {
  systemConfigs: {},
  systemFeatures: {},
  menus: [],
  isutUser: false,
};

const configsSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    addSystemConfigs: (state, action) => {
      state.systemConfigs = action.payload;
      state.menus = action.payload.menus;
    },
    addSystemFeatures: (state, action) => {
      state.systemFeatures = action.payload;
    },
    setutUser: (state) => {
      let isutuser = getFromlocalStorage("isutuser");
      if (isutuser === "true") {
        state.isutUser = true;
      }
    },
  },
});

export default configsSlice.reducer;
export const { addSystemConfigs, addSystemFeatures, setutUser } =
  configsSlice.actions;
