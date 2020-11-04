import axios from '../config'

// 事项管理查询
export const listApprovalItem = params => { return axios.get(`/ss/approvalItem/listApprovalItem`, params).then(res=>res.data); };

// 材料管理查询
export const listMaterial = params => { return axios.get(`/ss/material/listMaterial`, {params}).then(res=>res.data); };

// 获取大项列表
export const listApprovalAll = params => { return axios.get(`/ss/approval/listApprovalAll`, params).then(res=>res.data); };

// 获取项目列表
export const listProjectAll = params => { return axios.get(`/ss/project/listProjectAll`, params).then(res=>res.data); };

// 新增材料
export const addMaterial = params => { return axios.post(`/ss/material/addMaterial`, params).then(res=>res.data); };

// 删除某一份材料信息
export const delMaterial = params => { return axios.delete(`/ss/material/delMaterial`, {params}).then(res=>res.data); };

// 查询单个材料关联的模板
export const getTemplateByMaterialId = params => { return axios.get(`/ss/material/getTemplateByMaterialId?materialId=${params.materialId}`).then(res=>res.data); };

//修改材料信息
export const updateMaterial = params => { return axios.post(`/ss/material/updateMaterial`, params).then(res=>res.data); };

//其他-根据材料id与事项id将对应材料模板html解析到材料字段
export const ssFieldImportData = params => { return axios.get(`/ss/Import/ssFieldImportData`, {params}).then(res=>res.data); };

//查询某一份材料
export const getByMaterialId = params => { return axios.get(`/ss/material/getByMaterialId`, {params}).then(res=>res.data); };

//导入材料
export const copySelectedMaterial = params => { return axios.post(`/ss/material/copySelectedMaterial`, params).then(res=>res.data); };
//获取指定事项下的所有材料 不分页
export const getAllByApprovalItemId = params => { return axios.get(`/ss/material/getAllByApprovalItemId`, {params}).then(res=>res.data); };