import { menuInterface, systemconfigsInterface } from '@/shared';
import {createSlice} from '@reduxjs/toolkit'

const initialState:{
  menus:menuInterface[];
  systemConfigs:systemconfigsInterface;
  systemFeatures:any;
}={
  systemConfigs: {},
  systemFeatures: {},
  menus: []
}

const configsSlice = createSlice({
  name:'configs',
  initialState,
  reducers:{
    addSystemConfigs : (state,action)=>{
      state.systemConfigs = action.payload;
      state.menus = action.payload.menus;
    },
    addSystemFeatures : (state,action)=>{
      state.systemFeatures = action.payload;
    }
  },
})

export default configsSlice.reducer;
export const { addSystemConfigs, addSystemFeatures } = configsSlice.actions;