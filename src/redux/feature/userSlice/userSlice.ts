import { getData } from '@/services/data.manager';
import {
  plansInterface,
  responseInterface,
  subprofileInterface,
  userDetailsInterface,
} from '@/shared';
import { getFromlocalStorage } from '@/utils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchProfiles = createAsyncThunk<responseInterface>(
  'fetchProfiles',
  async (_args, thunkAPI) => {
    console.log('hello');
    const result = await getData(
      'service/api/auth/list/user/profile',
      {},
      thunkAPI.signal
    );
    return result;
  }
);

type initialStateType = {
  isLoggedin: boolean;
  profiles: subprofileInterface[];
  activePackages: plansInterface[];
  userDetails: undefined | userDetailsInterface;
  activeProfile: subprofileInterface | '';
};
const initialState: initialStateType = {
  isLoggedin: false,
  profiles: [],
  activePackages: [],
  userDetails: undefined,
  activeProfile: '',
};
const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setLoggedin: (state) => {
      let Loggedin = getFromlocalStorage('isLoggedin');
      if (!!Loggedin && Loggedin === 'true') {
        state.isLoggedin = true;
        let userdetail_str = getFromlocalStorage('userDetails');
        let userdetail = userdetail_str && JSON.parse(userdetail_str);
        if (userdetail_str) {
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
        let active_profile_str = getFromlocalStorage('activeProfile');
        let active_profile =
          active_profile_str && JSON.parse(active_profile_str);
        if (active_profile_str) {
          state.activeProfile = active_profile;
        } else {
          state.activeProfile = initialState.activeProfile;
        }
      }
    },
    setActivepackages: (state) => {
      if (state.isLoggedin === true) {
        let activePackages_str = getFromlocalStorage('activePackages');
        let activePackages =
          activePackages_str && JSON.parse(activePackages_str);
        if (activePackages_str) {
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
      action: PayloadAction<subprofileInterface>
    ) => {
      if (state.isLoggedin === true) {
        state.activeProfile = action.payload;
      }
    },
    updateUserProperty: (
      state,
      action: PayloadAction<Partial<userDetailsInterface>>
    ) => {
      if (state.userDetails) {
        let { payload } = action;
        state.userDetails = { ...state.userDetails, ...payload };
        localStorage.setItem('userDetails', JSON.stringify(state.userDetails));
      }
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        profileId: subprofileInterface['profileId'];
        properties: Partial<subprofileInterface>;
      }>
    ) => {
      const { payload } = action;
      let profile_index = 0;
      state.userDetails?.profileParentalDetails?.map((profile, index) => {
        if (profile.profileId === payload.profileId) {
          profile_index = index;
        }
      });
      if (state.userDetails?.profileParentalDetails) {
        state.userDetails.profileParentalDetails[profile_index] = {
          ...state.userDetails.profileParentalDetails[profile_index],
          ...payload.properties,
        };
      }
      if (
        state.activeProfile &&
        state.activeProfile.profileId === payload.profileId
      ) {
        state.activeProfile = { ...state.activeProfile, ...payload.properties };
      }

      localStorage.setItem('userDetails',JSON.stringify(state.userDetails))
      localStorage.setItem('activeProfile', JSON.stringify(state.activeProfile))
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
              'userDetails',
              JSON.stringify(state.userDetails)
            );
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
