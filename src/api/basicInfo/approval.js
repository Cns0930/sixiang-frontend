import axios from '../config'

// 事项管理查询
export const listApprovalItem = params => { return axios.get(`/ss/approvalItem/listApprovalItem`, {params}).then(res=>res.data); };

// 材料管理查询
export const listMaterial = params => { return axios.get(`/ss/material/listMaterial`, params).then(res=>res.data); };

// 获取大项列表
export const listApprovalAll = params => { return axios.get(`/ss/approval/listApprovalAll`, params).then(res=>res.data); };

// 获取项目列表
export const listProjectAll = params => { return axios.get(`/ss/project/listProjectAll`, {params}).then(res=>res.data); };

// 新增项目
export const addProject = params => { return axios.post(`/ss/project/addProject`, params).then(res=>res.data); };

// 编辑项目
export const updateProject = params => { return axios.post(`/ss/project/updateProject`, params).then(res=>res.data); };

// 删除项目
export const deleteProject = params => { return axios.get(`/ss/project/deleteProject`, {params}).then(res=>res.data); };

// 根据项目Id查项目信息 
export const getByProjectId = params => { return axios.get(`/ss/project/getByProjectId`, {params}).then(res=>res.data); };

// 添加事项
export const addApprovalItem = params => { return axios.post(`/ss/approvalItem/addApprovalItem`, params).then(res=>res.data); };

// 修改事项
export const updateApprovalItem = params => { return axios.post(`/ss/approvalItem/updateApprovalItem`, params).then(res=>res.data); };

// 查询单个事项
export const getByApprovalItemId = params => { return axios.get(`/ss/approvalItem/getByApprovalItemId`, {params}).then(res=>res.data); };

// 导入情形 
export const copyApprovalSub = params => { return axios.get(`/ss/approvalSub/copyApprovalSub`, {params}).then(res=>res.data); };

// 关闭事项
export const shutApprovalItem = params => { return axios.get(`/ss/approvalItem/shutApprovalItem`, {params}).then(res=>res.data); };

// 查询所有公共事项
export const listPublicApprovalItem = params => { return axios.get(`/ss/approvalItem/listPublicApprovalItem`, {params}).then(res=>res.data); };

// 查询事项下所有帮办所需信息上传git
export const submitItemInfo = params => { return axios.get(`/ss/approvalItem/submitItemInfo`, {params}).then(res=>res.data); };

// 查询对应事项从表数据
export const exApprovalItem = params => { return axios.get(`/ss/approvalItem/exApprovalItem`, {params}).then(res=>res.data); };

// 获取事项版本信息列表
export const listVersionItem = params => { return axios.get(`/account/SysVersionItem/listVersionItem`, {params}).then(res=>res.data); };

// 获取事项版本信息并保存
export const obtainVersionItem = params => { return axios.get(`/account/SysVersionItem/obtainVersionItem`, {params}).then(res=>res.data); };

// 保存事项内版本信息
export const addSysVersionItem = params => { return axios.post(`/account/SysVersionItem/addSysVersionItem`, params).then(res=>res.data); };

// 事项管理查询-按用户
export const listApprovalItemByUser = params => { return axios.get(`/ss/approvalItem/listApprovalItemByUser`, {params}).then(res=>res.data); };
