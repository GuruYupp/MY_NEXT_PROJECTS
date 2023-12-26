 import { getData } from "@/services/data.manager";
import { responseInterface, tvguidestateInterface } from "@/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const fetchChannelIds = createAsyncThunk<responseInterface>("fetchchannelIds",async (_args,thunkAPI)=>{
  const result = await getData("/service/api/v1/tvguide/channels")
  const { dispatch } = thunkAPI
  if(result.status === true){
    let channelIds_info = result.response.data.slice(0, 8)
    let ids = channelIds_info.map((channel: tvguidestateInterface["channelIds"][0]) => channel.id);
    let day = new Date();
    let d = (day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear() + ' ' + day.getHours() + ':' + (day.getMinutes() > 30 ? '30' : '00') + ':00';
    let start_time = new Date(d).getTime();
    let end_time = start_time + (24 * 60 * 60 * 1000)
    dispatch(fetchChannelData({
      start_time,
      end_time,
      page:0,
      channel_ids: ids.join(',')
    }))
  }
  return result;
})

type fetchChannelDataParams={
  start_time:number;
  end_time:number;
  channel_ids:string;
  page:number;
  skip_tabs?:number
}

export const fetchChannelData = createAsyncThunk<responseInterface,fetchChannelDataParams>('fetchchannelData',async (args)=>{
  const result = await getData("/service/api/v1/static/tvguide",args)
  return result
})

export const initialState:tvguidestateInterface ={
  title:"",
  channelsIdState:"idle",
  channelsdataState:"idle",
  channelIds:[],
  paginationchannelIds:[],
  channelsData:[],
  tabs:[],
  selectedTab:{},
  page:0
}

function getDummyProgram():tvguidestateInterface["channelsData"][0]["programs"][0]{
  let dummy_program= {
    display: {
      markers: {
        startTime: {
          value:''
        },
        endTime: {
          value:''
        }
      },
      title: "Program info is not available"
    },
    id: -1,
    metadata: {},
    target: {
      path: ""
    },
  }
  return dummy_program
}

function enhanceChanneldata(
  data: tvguidestateInterface["channelsData"], channelStartTime?: number, channelEndTime?:number
): tvguidestateInterface["channelsData"] {
  for(let i=0;i<data.length;i++){
    let programs: tvguidestateInterface["channelsData"][0]["programs"] = []
    for(let j=0;j<data[i].programs.length;j++){
      let dummy_program = getDummyProgram(); // dummy_program
      //first_program
      if(j==0){
        //check first program is start from start Time
        let curr_pgm_start_time = Number(data[i].programs[j].display.markers?.startTime?.value)
        if ( channelStartTime && curr_pgm_start_time  > channelStartTime) {
          if (dummy_program.display.markers?.startTime) {
            dummy_program.display.markers.startTime.value = channelStartTime.toString();
          }
          if (dummy_program.display.markers?.endTime) {
            dummy_program.display.markers.endTime.value = curr_pgm_start_time.toString();
          }
          programs.push(dummy_program)
        }

        programs.push(data[i].programs[j])
      }
      //last_program
      else if(j== data[i].programs.length - 1){
        //check before empty
        let prev_pgm_end_time = Number(data[i].programs[j - 1].display.markers?.endTime?.value)
        let curr_pgm_start_time = Number(data[i].programs[j].display.markers?.startTime?.value)
        if (curr_pgm_start_time - prev_pgm_end_time > 1000) {

          if (dummy_program.display.markers?.startTime) {
            dummy_program.display.markers.startTime.value = prev_pgm_end_time.toString();
          }
          if (dummy_program.display.markers?.endTime) {
            dummy_program.display.markers.endTime.value = curr_pgm_start_time.toString();
          }
          programs.push(dummy_program)
        }

        //push current program
        programs.push(data[i].programs[j])

        
        //check laste program is ending at endTime
        let curr_pgm_end_time = Number(data[i].programs[j].display.markers?.endTime?.value)
        if (channelEndTime && (curr_pgm_end_time < channelEndTime)){
            if (dummy_program.display.markers?.startTime) {
              dummy_program.display.markers.startTime.value = curr_pgm_end_time.toString();
            }
            if (dummy_program.display.markers?.endTime) {
              dummy_program.display.markers.endTime.value = channelEndTime.toString();
            }
            programs.push(dummy_program)
          
        }
      }
      //middle_programs
      else{
        let prev_pgm_end_time = Number(data[i].programs[j - 1].display.markers?.endTime?.value)
        let curr_pgm_start_time = Number(data[i].programs[j].display.markers?.startTime?.value)
        //program gap not more than 1 sec if there then add the dummy data
        if (curr_pgm_start_time - prev_pgm_end_time > 2000){
          
          if(dummy_program.display.markers?.startTime){
            dummy_program.display.markers.startTime.value  = prev_pgm_end_time.toString();
          }
          if (dummy_program.display.markers?.endTime) {
            dummy_program.display.markers.endTime.value = curr_pgm_start_time.toString();
          }
          programs.push(dummy_program)
        }
        programs.push(data[i].programs[j])
      }
    }
    if (data[i].programs.length === 0){
      let dummy_program = getDummyProgram();
      if (dummy_program.display.markers?.startTime) {
        dummy_program.display.markers.startTime.value = channelStartTime?.toString();
      }
      if (dummy_program.display.markers?.endTime) {
        dummy_program.display.markers.endTime.value = channelEndTime?.toString();
      }
      programs.push(dummy_program)
    }
    data[i].programs = programs
  }
  return data;
}

const tvgudeSlice = createSlice({
  name: 'tvguideData',
  initialState: initialState,
  reducers: {
    resettvGuidestate:()=>{
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelIds.fulfilled, (state, action) => {
        const { payload } = action
        if (payload.status === true) {
          state.channelsIdState = "succeeded"
          state.title = payload.response.title;
          state.paginationchannelIds = payload.response.data
          state.tabs = payload.response.tabs
          state.selectedTab = payload.response?.tabs?.filter((tab:tvguidestateInterface["selectedTab"])=>tab.isSelected)[0]
          let day = new Date();
          let d = (day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear() + ' ' + day.getHours() + ':' + (day.getMinutes() > 30 ? '30' : '00') + ':00';
          state.selectedTab.startTime = new Date(d).getTime();
          state.selectedTab.endTime = state.selectedTab.startTime + (24 * 60 * 60 * 1000)
        }
      })
      .addCase(fetchChannelIds.pending, (state) => {
        state.channelsIdState = "pending"
      })
      .addCase(fetchChannelIds.rejected, (state) => {
        state.channelsIdState = "failed"
      })
      .addCase(fetchChannelData.pending,(state)=>{
        state.channelsdataState = "pending"
      })
      .addCase(fetchChannelData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload.status === true) {
          state.channelIds = [...state.channelIds,...state.paginationchannelIds.slice(0, 8)]
          state.paginationchannelIds = state.paginationchannelIds.slice(8, state.paginationchannelIds.length);
          let enhanced_channel_data = enhanceChanneldata(payload.response.data,state.selectedTab.startTime,state.selectedTab.endTime)
    
          if (payload.response.data) state.channelsData = state.channelsData.concat(enhanced_channel_data);
          state.page = state.page + 1
        }
        state.channelsdataState = "succeeded";
      })
      .addCase(fetchChannelData.rejected,(state)=>{
        state.channelsdataState = "failed"
      })
  }
})

export default tvgudeSlice.reducer
export const {resettvGuidestate} = tvgudeSlice.actions