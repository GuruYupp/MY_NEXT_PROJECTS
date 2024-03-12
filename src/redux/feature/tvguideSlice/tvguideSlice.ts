import { getData } from "@/services/data.manager";
import { responseInterface, tvguidestateInterface } from "@/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchChannelIds = createAsyncThunk<responseInterface>(
  "fetchchannelIds",
  async (_args, thunkAPI) => {
    const result = await getData("/service/api/v1/tvguide/channels");
    const { dispatch } = thunkAPI;
    if (result.status === true) {
      let channelIdsinfo = result.response.data.slice(0, 8);
      let ids = channelIdsinfo.map(
        (channel: tvguidestateInterface["channelIds"][0]) => channel.id,
      );
      let day = new Date();
      let d =
        day.getMonth() +
        1 +
        "/" +
        day.getDate() +
        "/" +
        day.getFullYear() +
        " " +
        day.getHours() +
        ":" +
        (day.getMinutes() > 30 ? "30" : "00") +
        ":00";
      let starttime = new Date(d).getTime();
      let endtime = starttime + 24 * 60 * 60 * 1000;
      dispatch(
        fetchChannelData({
          // eslint-disable-next-line camelcase
          start_time: starttime,
          // eslint-disable-next-line camelcase
          end_time: endtime,
          page: 0,
          // eslint-disable-next-line camelcase
          channel_ids: ids.join(","),
        }),
      );
    }
    return result;
  },
);

type fetchChannelDataParams = {
  start_time: number;
  end_time: number;
  channel_ids: string;
  page: number;
  skip_tabs?: number;
};

export const fetchChannelData = createAsyncThunk<
  responseInterface,
  fetchChannelDataParams
>("fetchchannelData", async (args) => {
  const result = await getData("/service/api/v1/static/tvguide", args);
  return result;
});

export const initialState: tvguidestateInterface = {
  title: "",
  channelsIdState: "idle",
  channelsdataState: "idle",
  channelIds: [],
  paginationchannelIds: [],
  channelsData: [],
  tabs: [],
  selectedTab: {},
  page: 0,
};

function getDummyProgram(): tvguidestateInterface["channelsData"][0]["programs"][0] {
  let dummyprogram = {
    display: {
      markers: {
        startTime: {
          value: "",
        },
        endTime: {
          value: "",
        },
      },
      title: "Program info is not available",
    },
    id: -1,
    metadata: {},
    target: {
      path: "",
    },
  };
  return dummyprogram;
}

function enhanceChanneldata(
  data: tvguidestateInterface["channelsData"],
  channelStartTime?: number,
  channelEndTime?: number,
): tvguidestateInterface["channelsData"] {
  for (let i = 0; i < data.length; i++) {
    let programs: tvguidestateInterface["channelsData"][0]["programs"] = [];
    for (let j = 0; j < data[i].programs.length; j++) {
      let dummyprogram = getDummyProgram(); // dummy_program
      //first_program
      if (j == 0) {
        //check first program is start from start Time
        let currpgmstarttime = Number(
          data[i].programs[j].display.markers?.startTime?.value,
        );
        if (channelStartTime && currpgmstarttime > channelStartTime) {
          if (dummyprogram.display.markers?.startTime) {
            dummyprogram.display.markers.startTime.value =
              channelStartTime.toString();
          }
          if (dummyprogram.display.markers?.endTime) {
            dummyprogram.display.markers.endTime.value =
              currpgmstarttime.toString();
          }
          programs.push(dummyprogram);
        }

        programs.push(data[i].programs[j]);
      }
      //last_program
      else if (j == data[i].programs.length - 1) {
        //check before empty
        let prevpgmendtime = Number(
          data[i].programs[j - 1].display.markers?.endTime?.value,
        );
        let currpgmstarttime = Number(
          data[i].programs[j].display.markers?.startTime?.value,
        );
        if (currpgmstarttime - prevpgmendtime > 1000) {
          if (dummyprogram.display.markers?.startTime) {
            dummyprogram.display.markers.startTime.value =
              prevpgmendtime.toString();
          }
          if (dummyprogram.display.markers?.endTime) {
            dummyprogram.display.markers.endTime.value =
              currpgmstarttime.toString();
          }
          programs.push(dummyprogram);
        }

        //push current program
        programs.push(data[i].programs[j]);

        //check laste program is ending at endTime
        let currpgmendtime = Number(
          data[i].programs[j].display.markers?.endTime?.value,
        );
        if (channelEndTime && currpgmendtime < channelEndTime) {
          if (dummyprogram.display.markers?.startTime) {
            dummyprogram.display.markers.startTime.value =
              currpgmendtime.toString();
          }
          if (dummyprogram.display.markers?.endTime) {
            dummyprogram.display.markers.endTime.value =
              channelEndTime.toString();
          }
          programs.push(dummyprogram);
        }
      }
      //middle_programs
      else {
        let prevpgmendtime = Number(
          data[i].programs[j - 1].display.markers?.endTime?.value,
        );
        let currpgmstarttime = Number(
          data[i].programs[j].display.markers?.startTime?.value,
        );
        //program gap not more than 1 sec if there then add the dummy data
        if (currpgmstarttime - prevpgmendtime > 2000) {
          if (dummyprogram.display.markers?.startTime) {
            dummyprogram.display.markers.startTime.value =
              prevpgmendtime.toString();
          }
          if (dummyprogram.display.markers?.endTime) {
            dummyprogram.display.markers.endTime.value =
              currpgmstarttime.toString();
          }
          programs.push(dummyprogram);
        }
        programs.push(data[i].programs[j]);
      }
    }
    if (data[i].programs.length === 0) {
      let dummyprogram = getDummyProgram();
      if (dummyprogram.display.markers?.startTime) {
        dummyprogram.display.markers.startTime.value =
          channelStartTime?.toString();
      }
      if (dummyprogram.display.markers?.endTime) {
        dummyprogram.display.markers.endTime.value = channelEndTime?.toString();
      }
      programs.push(dummyprogram);
    }
    data[i].programs = programs;
  }
  return data;
}

const tvgudeSlice = createSlice({
  name: "tvguideData",
  initialState: initialState,
  reducers: {
    resettvGuidestate: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelIds.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status === true) {
          state.channelsIdState = "succeeded";
          state.title = payload.response.title;
          state.paginationchannelIds = payload.response.data;
          state.tabs = payload.response.tabs;
          state.selectedTab = payload.response?.tabs?.filter(
            (tab: tvguidestateInterface["selectedTab"]) => tab.isSelected,
          )[0];
          let day = new Date();
          let d =
            day.getMonth() +
            1 +
            "/" +
            day.getDate() +
            "/" +
            day.getFullYear() +
            " " +
            day.getHours() +
            ":" +
            (day.getMinutes() > 30 ? "30" : "00") +
            ":00";
          state.selectedTab.startTime = new Date(d).getTime();
          state.selectedTab.endTime =
            state.selectedTab.startTime + 24 * 60 * 60 * 1000;
        }
      })
      .addCase(fetchChannelIds.pending, (state) => {
        state.channelsIdState = "pending";
      })
      .addCase(fetchChannelIds.rejected, (state) => {
        state.channelsIdState = "failed";
      })
      .addCase(fetchChannelData.pending, (state) => {
        state.channelsdataState = "pending";
      })
      .addCase(fetchChannelData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status === true) {
          state.channelIds = [
            ...state.channelIds,
            ...state.paginationchannelIds.slice(0, 8),
          ];
          state.paginationchannelIds = state.paginationchannelIds.slice(
            8,
            state.paginationchannelIds.length,
          );
          let enhancedchanneldata = enhanceChanneldata(
            payload.response.data,
            state.selectedTab.startTime,
            state.selectedTab.endTime,
          );

          if (payload.response.data)
            state.channelsData = state.channelsData.concat(enhancedchanneldata);
          state.page = state.page + 1;
        }
        state.channelsdataState = "succeeded";
      })
      .addCase(fetchChannelData.rejected, (state) => {
        state.channelsdataState = "failed";
      });
  },
});

export default tvgudeSlice.reducer;
export const { resettvGuidestate } = tvgudeSlice.actions;
