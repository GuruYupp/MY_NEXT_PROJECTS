import { getData } from "@/services/data.manager";
import { responseInterface, streamDataIterface } from "@/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type fetchStreamDataParams = {
  params: {
    path: string;
    stream_type?: string;
  };
};

export const fetchStreamData = createAsyncThunk<
  responseInterface,
  fetchStreamDataParams
>("fetchstream", async (args) => {
  const { params } = args;
  const result = await getData("/service/api/v1/page/stream", params);
  return result;
});

let initialState: streamDataIterface = {
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
};

const streamSlice = createSlice({
  name: "streamSlice",
  initialState,
  reducers: {
    resetstreamSlice: () => {
      return initialState;
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
      });
  },
});

export const { resetstreamSlice } = streamSlice.actions;

export default streamSlice.reducer;
