import axios from 'axios';

// 获取步骤
export const getStep = params => axios.post('/superform/steps/list', params).then(res => res.data);

// 保存单个步骤
export const saveStep = params => axios.post('/superform/steps/save', params).then(res => res.data);

// 删除单个步骤
export const deleteStep = params => axios.get('/superform/steps/delete', {params}).then(res => res.data);

// 批量保存步骤
export const saveStepBatch = params => axios.post('/superform/steps/batchSave', params).then(res => res.data);

// 获取步骤
export const getStepResearcher = params => axios.post('/superform/steps-researcher/list', params).then(res => res.data);

// 保存单个步骤
export const saveStepResearcher = params => axios.post('/superform/steps-researcher/save', params).then(res => res.data);

// 删除单个步骤
export const deleteStepResearcher = params => axios.get('/superform/steps-researcher/delete', {params}).then(res => res.data);

// 批量保存步骤
export const saveStepBatchResearcher = params => axios.post('/superform/steps-researcher/batchSave', params).then(res => res.data);

// 根据传入类型判断查询步骤
export const listStepsBytype = params => axios.get('/superform/steps/listStepsBytype', {params}).then(res => res.data);

// 批量新增开发步骤
export const batchSaveBytype = params => axios.post('/superform/steps/batchSaveBytype', params).then(res => res.data);