import axios from 'axios';

// 覆盖保存所有字段
export const save = params => axios.post('/superform/fields/save', params).then(res => res.data);

// 获取字段
export const getField = params => axios.post('/superform/fields/list', params).then(res => res.data);

// 保存单个字段
export const saveOne = params => axios.post('/superform/fields/saveOne', params).then(res => res.data);

// 删除单个字段
export const deleteOne = params => axios.post('/superform/fields/deleteOne', params).then(res => res.data);