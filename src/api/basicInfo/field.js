import axios from '../config'

// 查询单个字段
export const getField = params => { return axios.get(`/ss/field/getByField`, {params}).then(res=>res.data); };

// 添加材料字段
export const addField = params => { return axios.post(`/ss/field/addField`, params).then(res=>res.data); };

// 修改字段信息
export const updateField = params => { return axios.post(`/ss/field/updateField`, params).then(res=>res.data); };

// 删除字段
export const deleteField = params => { return axios.get(`/ss/field/delField`, {params}).then(res=>res.data); };

// 查询所有字段-分页
export const listField = params => { return axios.post(`/ss/field/listField`, params).then(res=>res.data); };

// 获取指定事项下的所有材料
export const getAllByApprovalItemId = params => { return axios.get(`/ss/material/getAllByApprovalItemId`, {params}).then(res=>res.data); };

// 查询所有字段(包括材料名)-分页
export const listFieldUnionMaterial = params => { return axios.get(`/ss/field/listFieldUnionMaterial`, {params}).then(res=>res.data); };

// 查询事项下所有字段 带材料名
export const listMaterialFieldLayer = params => { return axios.get(`/ss/field/listMaterialFieldLayer`, {params}).then(res=>res.data); };
// 查询所有材料
export const listAllMaterial = params => { return axios.get(`/ss/material/listMaterial`, {params}).then(res=>res.data); };

// 导入字段
export const importfields = params => { return axios.get(`/ss/field/copyField`, {params}).then(res=>res.data); };

// 查询某一材料下的字段
export const lookfields = params => { return axios.get(`/ss/field/listFieldAllByMaterial`, {params}).then(res=>res.data); };

// 查询与帮办对应的字段
export const listFieldNosByIds = params => { return axios.post(`/ss/field/listFieldNosByIds`, params).then(res=>res.data); };

// 修改材料字段组件名
export const updateFieldComponentName = params => { return axios.post(`/ss/field/updateFieldComponentNameById`, params).then(res=>res.data); };

// 保存批量字段(只新增,field_no去重)
export const saveBatch = params => { return axios.post(`/superform/fields/saveBatch`, params).then(res=>res.data); };

// 根据事项id 转到帮办字段类型为checkpoint
export const saveBatchCheck = params => axios.get('/superform/fields/saveBatchCheck', {params}).then(res => res.data);

// 查询事项下提取点-分页-可根据子文档编号筛选
export const listCheckpoint = params => { return axios.get(`/ss/field/listCheckpoint`, {params}).then(res=>res.data); };

// 所有公共字段-带子项
export const listAllPublicFields = params => axios.get('/superform/fields/listAllPublicFields', {params}).then(res => res.data);
