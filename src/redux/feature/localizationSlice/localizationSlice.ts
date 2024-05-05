import appConfig from "@/app.config";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface initialStateInterface {
  localLangCode: string;
  localLang: { [key: string]: string };
}

export const fetchLocalLang = createAsyncThunk<
  Omit<initialStateInterface, "localLangCode">,
  string
>("fetchlocalLang", async (arg, thunkAPI) => {
  let langJson = await fetch(`/locales/${arg}.json`);
  let langData = await langJson.json();
  thunkAPI.dispatch(setLocalLang(arg));
  return { localLang: langData };
});

const initialState: initialStateInterface = {
  localLangCode: appConfig.appDefaultLanguage,
  localLang: {},
};

const localizationSlice = createSlice({
  name: "localizationSlice",
  initialState,
  reducers: {
    setLocalLang: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      if (payload) {
        state.localLangCode = payload;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchLocalLang.fulfilled, (state, { payload }) => {
      state.localLang = payload.localLang;
    });
  },
});

export const { setLocalLang } = localizationSlice.actions;

export default localizationSlice.reducer;
