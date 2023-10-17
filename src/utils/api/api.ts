import axios from 'axios'
import qs from 'qs'
import { STORAGE_TOKEN_KEY } from '../constants'

export const axiosInstance: any = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api/v1`,
  timeout: 60000,
})

/**
 * get request headers
 * @returns
 */

axiosInstance.interceptors.request.use(
  function (config: any) {
    // Do something before request is sent
    const token = localStorage.getItem(STORAGE_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error: any) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// define error handle
axiosInstance.interceptors.response.use(
  (response: any) => {
    const { data } = response
    // handle error code
    switch (data.error_code) {
      default:
        break
    }
    return response.data
  },
  async (error: any) => {
    const { response } = error
    if (response && response.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return response && response.data ? response : Promise.reject(error)
  }
)

export default {
  /**
   * post request
   * @param {string} endpoint
   * @param {*} data All parameter need to pass for server
   */
  post: (endpoint: string, data: any) => {
    return axiosInstance.post(endpoint, data)
  },

  /**
   * put
   * @param {string} endpoint
   * @param {*} data All parameter need to pass for server
   */
  put: (endpoint: string, data: any) => {
    return axiosInstance.put(endpoint, qs.stringify(data), {})
  },

  /**
   * get request
   * @param {string} endpoint
   * @param {*} params All parameter need to pass for server
   */
  get: (endpoint: string, params: any = {}) => {
    return axiosInstance.get(endpoint, {
      params,
      paramsSerializer: {
        encode: qs.parse,
        serialize: qs.stringify,
      },
    })
  },

  /**
   * delete request
   * @param {string} endpoint
   * @param {*} data All parameter need to pass for server
   */
  delete: (endpoint: string, data: any) => {
    return axiosInstance.delete(endpoint, {
      data,
    })
  },

  /**
   * patch request
   * @param {string} endpoint
   * @param {*} data All parameter need to pass for server
   */
  patch: (endpoint: string, data: any) => {
    return axiosInstance.patch(endpoint, data)
  },

  /**
   * upload file
   * @param {string} endpoint
   * @param {*} agrs All parameter need to pass for server
   * @param {string} method
   * @param {boolean} formDataParsed
   */
  uploadFile: (
    endpoint: string,
    agrs: any = {},
    method: string = 'post',
    formDataParsed: boolean = false
  ) => {
    let formData = agrs
    if (!formDataParsed) {
      formData = new FormData()
      Object.keys(agrs).forEach((item) => {
        formData.append(item, agrs[item])
      })
    }
    return axiosInstance[method](endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
