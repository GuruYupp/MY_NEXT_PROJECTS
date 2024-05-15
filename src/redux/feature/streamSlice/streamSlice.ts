import { getData } from "@/services/data.manager";
import { responseInterface, streamDataInterface } from "@/shared";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type fetchStreamDataParams = {
  params: {
    path: string;
    stream_type?: string;
    pin?: string;
  };
};

export const fetchStreamData = createAsyncThunk<
  responseInterface,
  fetchStreamDataParams
>("fetchstream", async (args, thunkAPI) => {
  const { params } = args;
  const result = await getData(
    "/service/api/v1/page/stream",
    params,
    thunkAPI.signal,
  );
  return result;
});

export const fetchNextStreamData = createAsyncThunk<
  responseInterface,
  { path: string; count: number }
>("fetchnextstream", async (args, thunkAPI) => {
  const result = await getData(
    "service/api/v1/next/videos",
    args,
    thunkAPI.signal,
  );
  return result;
});

let initialState: streamDataInterface = {
  streamapiloading: "idle",
  response: {
    analyticsInfo: {
      contentType: "",
      customData: "",
      dataKey: "",
      dataType: "",
      id: -1,
      packageType: "",
    },
    pageAttributes: {},
    streamStatus: {},
    streams: [],
  },
  error: {},
  pageAttributes: undefined,
  nextvideoInfo: {
    nextvideoDataloading: "idle",
  },
};

const streamSlice = createSlice({
  name: "streamSlice",
  initialState,
  reducers: {
    resetstreamSlice: () => {
      return initialState;
    },
    updateStreamData: (state, action: PayloadAction<responseInterface>) => {
      const { payload } = action;
      if (payload.status == true) {
        state.response = payload.response;
      } else {
        if (payload.error) {
          state.error = payload.error;
        }
        if (payload.pageAttributes) {
          state.pageAttributes = payload.pageAttributes;
        }
      }
      state.streamapiloading = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreamData.pending, (state) => {
        state.streamapiloading = "pending";
      })
      .addCase(fetchStreamData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status == true) {
          state.response = payload.response;
        } else {
          if (payload.error) {
            state.error = payload.error;
          }
          if (payload.pageAttributes) {
            state.pageAttributes = payload.pageAttributes;
          }
        }
        state.streamapiloading = "succeeded";
      })
      .addCase(fetchStreamData.rejected, (state) => {
        state.streamapiloading = "failed";
      })
      .addCase(fetchNextStreamData.fulfilled, (state, action) => {
        const { payload } = action;
        state.nextvideoInfo.nextvideoDataloading = "succeeded";
        if (payload.status == true) {
          state.nextvideoInfo.nextvideoData = payload.response;
        } else {
          state.nextvideoInfo.errorResponse = payload;
        }
      })
      .addCase(fetchNextStreamData.pending, (state) => {
        state.nextvideoInfo.nextvideoDataloading = "pending";
      })
      .addCase(fetchNextStreamData.rejected, (state) => {
        state.nextvideoInfo.nextvideoDataloading = "failed";
      });
  },
});

export const { resetstreamSlice, updateStreamData } = streamSlice.actions;

export default streamSlice.reducer;
