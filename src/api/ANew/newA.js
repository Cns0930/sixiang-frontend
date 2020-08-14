import axios from './config'



// 获取默认值

export const queryDefault = (params) => axios.get('/api/selfservice/record/queryNew', { params }).then(res => res.data)
