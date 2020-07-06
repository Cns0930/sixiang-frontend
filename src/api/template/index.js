import axios from 'axios';

// 获取模板列表
export const getTemplate = params => axios.post('/superform/template/list', params).then(res => res.data);