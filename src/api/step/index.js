import axios from 'axios';

// 获取步骤
export const getStep = params => axios.post('/superform/steps/list', params).then(res => res.data);

// 保存单个步骤
export const saveStep = params => axios.post('/superform/steps/save', params).then(res => res.data);

// 删除单个步骤
export const deleteStep = params => axios.get('/superform/steps/delete', {params}).then(res => res.data);

// 批量保存步骤
export const saveStepBatch = params => axios.post('/superform/steps/batchSave', params).then(res => res.data);

// 保存数据到帮办
export const transferJs = params => axios.post(axios.defaults.serviceURL+"/api/sixiang/saveJavaScript", params).then(res => res.data);