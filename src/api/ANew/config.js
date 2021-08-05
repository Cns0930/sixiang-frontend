import axios from 'axios'
import { Message } from 'element-ui'
import store from "@/vuex/store"
let bangbanAxios = axios.create({
    baseURL:store.state.setting.bangbanUrl,
    timeout:100000,
})


// api的base_url
// axios.defaults.baseURL = "http://10.50.12.29:5002/"
// request timeout
// request interceptor
bangbanAxios.interceptors.request.use(config => {
  config.headers['X-Token'] = 'token'
  return config
}, error => {
  console.error(error)
  return Promise.reject(error)
})

// respone interceptor
bangbanAxios.interceptors.response.use(response => {
  return response
}, error => {
  const { response } = error
  if (!response) {
    Message({
      message: '系统连接超时',
      type: 'error',
      duration: 5 * 1000
    })
  }
  return Promise.reject(error)
})

export default bangbanAxios

