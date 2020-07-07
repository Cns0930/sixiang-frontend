import axios from 'axios';

// 获取模板列表
export const getTemplate = params => axios.post('/superform/template/list', params).then(res => res.data);

// 新增模板
export const addTemplate = params => axios.post('/superform/template/saveTemplate', params).then(res => res.data);

// 删除模板
export const deleteTemplate = params => axios.post('/superform/template/deleteTemplate', params).then(res => res.data);

// 根据模板id获取单个模板
export const getSingleTemplate = params => axios.post('/superform/template-pages/listPages', params).then(res => res.data);

// 新增/保存页面
export const addEditPage = params => axios.post('/superform/template/savePage', params).then(res => res.data);

// 删除页面
export const deletePage = params => axios.post('/superform/template/deletePage', params).then(res => res.data);