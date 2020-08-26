import axios from 'axios';
import { Message } from 'element-ui';
import _ from 'lodash';
import router from '../router';
// axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.baseURL = process.env.VUE_APP_BASE_IP;
// axios.defaults.serviceURL = process.env.VUE_APP_SERVICE_IP;
axios.defaults.timeout = 1000 * 60;
axios.defaults.headers['Content-Type'] = 'application/json';
// axios.defaults.headers.AUTHORIZTION_FLAG = '';
axios.defaults.headers.Authorization = '';

const { CancelToken } = axios;
const source = CancelToken.source();

/* axios.interceptors.request.use(function (config) {
    console.log(config);
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }); */
const throttleMessage = _.debounce((msg) => {
    Message({
        type: 'warning',
        message: msg,
    });
}, 500);

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.data.success === false) {
            throttleMessage(response.data.msg);
            // sessionStorage.clear();
            // router.push('/login');
        }
        if (response.data.code === 4000) {
            sessionStorage.clear();
            router.push('/login');
            source.cancel('Operation canceled by the user.');
        }
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
            case 400:
                if (error.response && error.response.data && error.response.data.msg) {
                    /* Notice.error(
                            {
                                title: error.response.data.message,
                                duration: 5,
                                closable: true
                            }
                        ) */
                }
                break;
            case 401:
                // 401 清除token信息
                break;
            case 403:
                /* Notice.error(
                        {
                            title: '没有操作权限',
                            duration: 5,
                            closable: true
                        }
                    ) */
                break;
            case 500:
                /* Notice.error(
                        {
                            title: '服务器出了小问题',
                            duration: 5,
                            closable: true
                        }
                    ) */
                break;
            default:
                /* Notice.error(
                        {
                            title: '未知错误',
                            duration: 5,
                            closable: true
                        }
                    ) */
                break;
            }
        }
        return Promise.reject(error);
    },
);
export default axios;
