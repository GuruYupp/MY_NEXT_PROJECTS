import { responseInterface } from '@/shared';
import { Axios, axiosPost, axiosget } from '@/axios';
import { default as clientCookie } from 'js-cookie';
import { setupCache } from 'axios-cache-interceptor';
import { AxiosResponse } from 'axios';

export async function getData(
  url: string,
  params: any = {},
  signal?: AbortSignal,
  cache: boolean = false
) {
  if (cache) {
  }
  let headers = {
    'session-id': clientCookie.get('sessionId') || '',
    'tenant-code': clientCookie.get('tenantCode') || '',
    'box-id': clientCookie.get('boxId') || '',
  };
  let data = await axiosget<responseInterface>({
    url,
    headers,
    params,
    signal,
  });
  return data;
}

export async function postData<T>(url: string, PostData: T) {
  let headers = {
    'session-id': clientCookie.get('sessionId') || '',
    'tenant-code': clientCookie.get('tenantCode') || '',
    'box-id': clientCookie.get('boxId') || '',
  };
  let data = await axiosPost<responseInterface>({ url, headers }, PostData);
  return data;
}

export async function postFormData<T>(url: string, PostData: T) {
  let headers = {
    'session-id': clientCookie.get('sessionId') || '',
    'tenant-code': clientCookie.get('tenantCode') || '',
    'box-id': clientCookie.get('boxId') || '',
    'Content-Type': "multipart/form-data" 
  };
  let data = await axiosPost<responseInterface>({ url, headers }, PostData);
  return data;
}

export async function getpageData(
  url: string,
  params: any = {},
  signal?: AbortSignal,
  cache: any = false
) {
  let headers = {
    'session-id': clientCookie.get('sessionId') || '',
    'tenant-code': clientCookie.get('tenantCode') || '',
    'box-id': clientCookie.get('boxId') || '',
  };

  let axios;
  if (cache) {
    axios = setupCache(Axios, {
      methods: ['get'],
    });
  } else {
    axios = Axios;
  }

  // let data = await axiosget<responseInterface>({ url, headers, params, signal })
  // return data;

  let response: AxiosResponse<responseInterface> =
    await axios.get<responseInterface>(url, {
      headers: headers,
      params: params,
      signal: signal,
      cache:{
        interpretHeader:false,
        cacheTakeover:false,
        // ttl:1000
      }
    });
  return response.data;
}
