import { createSlice } from "@reduxjs/toolkit";

type initialStateType={
  enableRestrictionpage:boolean
}

let initialState: initialStateType={
  enableRestrictionpage:false
}

const pageRestrictionSlice = createSlice({
  name:'pageRestrictreducer',
  initialState,
  reducers:{
    enableRestrictionpage:(state)=>{
      state.enableRestrictionpage = true
    },
    disableRestrictionpage: (state) => {
      state.enableRestrictionpage = false
    }
  }
})

export const { enableRestrictionpage, disableRestrictionpage } = pageRestrictionSlice.actions

export default pageRestrictionSlice.reducer