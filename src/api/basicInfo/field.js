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
export const listFieldUnionMaterial = params => { return axios.post(`/ss/field/listFieldUnionMaterial`, params).then(res=>res.data); };