import type { AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios'
import Axios from 'axios'

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
  title?: any
}>

export class HttpClient {
  accessToken: string | null = null;
  // 创建 axios 实例
  axios: AxiosInstance;

  // 异常拦截处理器
  errorHandler = (error: RequestError): Promise<any> => {
    if (error.response) {
      const { data = {}, status, statusText } = error.response
      alert(data?.message || data?.title || statusText)
      // 403 无权限
      if (status === 403) {
        alert((data && data.message) || statusText)
      }
      // 401 未登录/未授权
      if (status === 401) {
        alert("未授权")
        // 如果你需要直接跳转登录页面
        // location.replace(loginRoutePath)
      }
    }
    else {
      console.log(error);
      if (error.code == 'ERR_NETWORK')
        alert("网络连接不稳定。");
      // TODO show a popup or use suspense error hint
    }
    return Promise.reject(error)
  }

  // 请求拦截器
  requestHandler = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    if (this.accessToken != null)
      config.headers["Authorization"] = "Bearer " + this.accessToken
    return config
  }

  // 响应拦截器
  responseHandler = (response: { data: any }) => {
    return response.data
  }

  constructor() {
    this.axios = Axios.create({
      // API 请求的默认前缀
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 6000, // 请求超时时间
    })
    // Add a request interceptor
    this.axios.interceptors.request.use(this.requestHandler, this.errorHandler)

    // Add a response interceptor
    this.axios.interceptors.response.use(this.responseHandler, this.errorHandler)

    return this;
  }

  get(url: string, params = {}) {
    return <any>this.axios.get(url, { params });
  }

  async post(url: string, data = {}) {
    return <any>this.axios.post(url, data);
  }
}

export const httpClient = new HttpClient();
