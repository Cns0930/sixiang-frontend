import axios from 'axios';

// 获取模板列表
export const getTemplate = params => axios.post('/superform/template/list', params).then(res => res.data);

// 新增模板
export const addTemplate = params => axios.post('/superform/template/saveTemplate', params).then(res => res.data);