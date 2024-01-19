import axios, { AxiosInstance, AxiosResponse } from 'axios';

import appConfig from './app.config'
// import { setupCache } from 'axios-cache-interceptor/dev';
type axiostype = AxiosInstance;
interface dynamicobject {
  [key: string]: string | number | boolean;
}
interface axiosgetparams {
  url: string;
  params?: dynamicobject;
  headers?: dynamicobject;
  signal?: AbortSignal;
}


export const Axios: axiostype = axios.create({
  baseURL: appConfig.endPoints.api,
});

// export const Axios2 = setupCache(axios.create({
//   baseURL: appConfig.endPoints.api,
// }), {
//   debug: console.log
// })

export async function axiosget<T>(config: axiosgetparams): Promise<T> {
  let response: AxiosResponse<T> = await Axios.get<T>(config.url, {
    headers: config.headers,
    params: config.params,
    signal: config.signal,
    // cache:{
    //   interpretHeader: false,
    //   cacheTakeover: false,
    //   // ttl:1000
    // }
  });
  return response.data;
}

export async function axiosPost<T>(
  config: axiosgetparams,
  payload: any
): Promise<T> {
  let response: AxiosResponse<T> = await Axios.post<T>(config.url, payload, {
    headers: config.headers,
    params: config.params,
  });
  let data = response.data;
  return data;
}
