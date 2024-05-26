import { getData, killSession } from "@/services/data.manager";
import {
  plansInterface,
  responseInterface,
  subprofileInterface,
  userDetailsInterface,
} from "@/shared";
import { getFromlocalStorage } from "@/utils";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProfiles = createAsyncThunk<responseInterface>(
  "fetchProfiles",
  async (_args, thunkAPI) => {
    console.log("hello");
    const result = await getData(
      "service/api/auth/list/user/profile",
      {},
      thunkAPI.signal,
    );
    return result;
  },
);

type initialStateType = {
  isLoggedin: boolean;
  profiles: subprofileInterface[];
  activePackages: plansInterface[];
  userDetails: undefined | userDetailsInterface;
  activeProfile: subprofileInterface | "";
};
const initialState: initialStateType = {
  isLoggedin: false,
  profiles: [],
  activePackages: [],
  userDetails: undefined,
  activeProfile: "",
};
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setLoggedin: (state) => {
      let Loggedin = getFromlocalStorage("isLoggedin");
      if (!!Loggedin && Loggedin === "true") {
        state.isLoggedin = true;
        let userdetailstr = getFromlocalStorage("userDetails");
        let userdetail = userdetailstr && JSON.parse(userdetailstr);
        if (userdetail) {
          state.userDetails = userdetail;
        } else {
          state.userDetails = initialState.userDetails;
        }
      } else {
        state.isLoggedin = false;
      }
    },
    setActiveprofile: (state) => {
      if (state.isLoggedin === true) {
        let activeprofilestr = getFromlocalStorage("activeProfile");
        let activeprofile = activeprofilestr && JSON.parse(activeprofilestr);
        if (activeprofilestr) {
          state.activeProfile = activeprofile;
        } else {
          state.activeProfile = initialState.activeProfile;
        }
      }
    },
    setActivepackages: (state) => {
      if (state.isLoggedin === true) {
        let activePackagesstr = getFromlocalStorage("activePackages");
        let activePackages = activePackagesstr && JSON.parse(activePackagesstr);
        if (activePackagesstr) {
          state.activePackages = activePackages;
        } else {
          state.activePackages = initialState.activePackages;
        }
      }
    },
    setLogout: () => {
      return initialState;
    },
    updateUserDetails: (state, action: PayloadAction<userDetailsInterface>) => {
      state.userDetails = action.payload;
    },
    updateActiveProfile: (
      state,
      action: PayloadAction<subprofileInterface>,
    ) => {
      if (state.isLoggedin === true) {
        state.activeProfile = action.payload;
      }
    },
    updateUserProperty: (
      state,
      action: PayloadAction<Partial<userDetailsInterface>>,
    ) => {
      if (state.userDetails) {
        let { payload } = action;
        state.userDetails = { ...state.userDetails, ...payload };
        localStorage.setItem("userDetails", JSON.stringify(state.userDetails));
      }
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        profileId: subprofileInterface["profileId"];
        properties: Partial<subprofileInterface>;
      }>,
    ) => {
      const { payload } = action;
      let profileindex = 0;
      state.userDetails?.profileParentalDetails?.map((profile, index) => {
        if (profile.profileId === payload.profileId) {
          profileindex = index;
        }
      });
      if (state.userDetails?.profileParentalDetails) {
        state.userDetails.profileParentalDetails[profileindex] = {
          ...state.userDetails.profileParentalDetails[profileindex],
          ...payload.properties,
        };
      }
      if (
        state.activeProfile &&
        state.activeProfile.profileId === payload.profileId
      ) {
        state.activeProfile = { ...state.activeProfile, ...payload.properties };
      }

      if (state.userDetails) {
        localStorage.setItem("userDetails", JSON.stringify(state.userDetails));
      }

      if (state.activeProfile) {
        localStorage.setItem(
          "activeProfile",
          JSON.stringify(state.activeProfile),
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, () => {})
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status === true) {
          if (payload.response.length > 0) {
            state.profiles = payload.response;
            if (state.userDetails) {
              state.userDetails.profileParentalDetails = payload.response;
            }
            localStorage.setItem(
              "userDetails",
              JSON.stringify(state.userDetails),
            );
          }
        } else {
          if (payload.error?.code === -1000) {
            killSession();
          }
        }
      })
      .addCase(fetchProfiles.rejected, () => {});
  },
});

export const {
  setLoggedin,
  setLogout,
  setActivepackages,
  updateUserDetails,
  updateUserProperty,
  setActiveprofile,
  updateActiveProfile,
  updateProfile,
} = userSlice.actions;
export default userSlice.reducer;
