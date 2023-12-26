import { apicall } from "@/services/data.manager";
import { responseInterface } from "@/shared";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk<responseInterface, { url: string; headers: any; payload: any }>('login', async (args) => {
  const { url, headers, payload } = args;
  const result = await apicall(url, headers, {}, 'post', payload);
  return result
})

interface getOtppayLoad{
  context:string;
  mobile:string
}

export const getOtp = createAsyncThunk('getOtp', async (args:getOtppayLoad,) => {
  console.log(args)
  // const result = await apicall("service/api/auth/get/otp", headers, {}, 'post', payload);
})

type initialStateType = {
  getOtp:{
    loading:"idle"|"pending"|"succeeed"|"failed"
    otp:string
  }
}
const initialState: initialStateType = {
  getOtp:{
    loading:"idle",
    otp:''
  }
}
const userSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder.addCase(loginUser.pending,()=>{})
    builder.addCase(loginUser.fulfilled,()=>{})
    builder.addCase(loginUser.rejected,()=>{})
    builder.addCase(getOtp.pending, () => { })
    builder.addCase(getOtp.fulfilled, () => { })
    builder.addCase(getOtp.rejected, () => { })
  }
})

export const {  } = userSlice.actions;
export default userSlice.reducer;