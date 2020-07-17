import axios from 'axios';

// 获取步骤
export const getStep = params => axios.post('/superform/steps/list', params).then(res => res.data);

// 保存单个步骤
export const saveStep = params => axios.post('/superform/steps/save', params).then(res => res.data);

// 删除单个步骤
export const deleteStep = params => axios.get('/superform/steps/delete', {params}).then(res => res.data);
