import { responseInterface } from "./shared";
import { axiosget, } from "./axios";
import getConfig from "next/config";

export const getBaseApi = async ():Promise<string>=>{
    const {publicRuntimeConfig} = getConfig()
    return publicRuntimeConfig.baseURL;
}

export async function systemconfigapi(headers:any):Promise<responseInterface> {
        console.log(headers)
        let apiresponse:responseInterface = await axiosget<responseInterface>({
          url:"service/api/v1/system/config",
          headers:headers
        });
        return apiresponse;
    }

  export async function systemfeaturesapi(headers:any):Promise<responseInterface>{
        let apiresponse = await axiosget<any>({
          url:"service/api/v1/system/feature",
          headers:headers
        });
        return apiresponse;
  }