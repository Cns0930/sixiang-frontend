import axios from 'axios';

// 获取字段
export const getField = params => axios.post('/superform/fields/list2', params).then(res => res.data);

// 保存单个字段
export const saveOne = params => axios.post('/superform/fields/saveOne', params).then(res => res.data);

// 删除单个字段
export const deleteOne = params => axios.post('/superform/fields/deleteOne', params).then(res => res.data);

// 导入公共字段
export const forkPublicFields = params => axios.post('/superform/fields/forkPublicFields', params).then(res => res.data);

// 根据id 获取字段
export const getFieldById = params => axios.get('/superform/fields/getById', {params}).then(res => res.data);

// 搜索字段
export const searchFields = params => axios.post('/superform/fields/searchFields', params).then(res => res.data);

// 导入选择的字段
export const forkSelectedFields = params => axios.post('/superform/fields/forkSelectedFields', params).then(res => res.data);