import axios from '../config'

// 事项管理查询
export const listApprovalItem = params => { return axios.get(`/ss/approvalItem/listApprovalItem`, {params}).then(res=>res.data); };

// 材料管理查询
export const listMaterial = params => { return axios.get(`/ss/material/listMaterial`, params).then(res=>res.data); };

// 获取大项列表
export const listApprovalAll = params => { return axios.get(`/ss/approval/listApprovalAll`, params).then(res=>res.data); };

// 获取项目列表
export const listProjectAll = params => { return axios.get(`/ss/project/listProjectAll`, params).then(res=>res.data); };

// 添加事项
export const addApprovalItem = params => { return axios.post(`/ss/approvalItem/addApprovalItem`, params).then(res=>res.data); };

// 修改事项
export const updateApprovalItem = params => { return axios.post(`/ss/approvalItem/updateApprovalItem`, params).then(res=>res.data); };

// 查询单个事项
export const getByApprovalItemId = params => { return axios.get(`/ss/approvalItem/getByApprovalItemId`, {params}).then(res=>res.data); };