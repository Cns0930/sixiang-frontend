import axios from 'axios'
import { Message } from 'element-ui'

// api的base_url
// axios.defaults.baseURL = "http://10.50.12.29:5002/"
// request timeout
axios.defaults.timeout = 100000

// request interceptor
axios.interceptors.request.use(config => {
  config.headers['X-Token'] = 'token'
  return config
}, error => {
  console.error(error)
  return Promise.reject(error)
})

// respone interceptor
axios.interceptors.response.use(response => {
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

export default axios
