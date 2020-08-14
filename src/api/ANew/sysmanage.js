import axios from './config'


// 添加事项
export const addFeedback = (params) => axios.post('/api/feedback/addFeedback', params).then(res => res.data)
// 添加事项img
export const addFeedbackImg = (params) => axios({
    url: '/api/feedback/addFeedbackImg',
    headers: { 'Content-Type': 'multipart/form-data' },
    method: 'post',
    data: params
}).then(res => res.data)

