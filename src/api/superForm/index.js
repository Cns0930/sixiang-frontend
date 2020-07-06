import axios from 'axios';

// 保存字段
export const save = params => axios.post('/superform/fields/save', params).then(res => res.data);