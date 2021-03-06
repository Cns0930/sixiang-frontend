import axios from 'axios';
// 获取字段
export const getField = params => axios.get('/superform/fields/list2', {params}).then(res => res.data);

// 获取所有字段
export const getFieldAll = params => axios.get('/superform/fields/listAll', {params}).then(res => res.data);

// 保存单个字段
export const saveOne = params => axios.post('/superform/fields/saveOne', params).then(res => res.data);

// 批量修改字段
export const batchEdit = params => axios.post('/superform/fields/batchEdit', params).then(res => res.data);

// 删除单个字段
export const deleteOne = params => axios.post('/superform/fields/deleteOne', params).then(res => res.data);

// 导入公共字段
// export const forkPublicFields = params => axios.post('/superform/fields/forkPublicFields', params).then(res => res.data);

// 根据id 获取字段
export const getFieldById = params => axios.get('/superform/fields/getById', {params}).then(res => res.data);

// 根据id获取字段 带子项 可传多个id
export const getByIds = params => axios.post('/superform/fields/getByIds', params).then(res => res.data);

// 搜索字段
export const searchFields = params => axios.post('/superform/fields/searchFields', params).then(res => res.data);

// 导入选择的字段
export const forkSelectedFields = params => axios.post('/superform/fields/forkSelectedFields', params).then(res => res.data);

// 搜索公共事项字段
export const searchPublic = params => axios.get('/superform/fields/searchPublic', {params}).then(res => res.data);

// 导入选择的公共事项字段
export const forkPublic = params => axios.post('/superform/fields/forkPublic', params).then(res => res.data);

//  获取最新的step配置保存时间
export const getSaveMaxTimeStep = params => axios.get('/superform/steps/getSaveMaxTime', {params}).then(res => res.data);

// 子字段转基础字段
export const childToParent = params => axios.get('/superform/fields/childToParent', {params}).then(res => res.data);