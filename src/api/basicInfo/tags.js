import axios from '../config'

// 查询项目标签列表-分页
export const listProjecLabelPage = params => { return axios.get(`/ss/ProjecLabel/listProjecLabelPage`, {params}).then(res=>res.data); };

// 查询项目标签列表 全部
export const listProjecLabel = params => { return axios.get(`/ss/ProjecLabel/listProjecLabel`, {params}).then(res=>res.data); };

// 查询标签功能列表
export const listLabelFunction = params => { return axios.get(`/ss/ProjecLabel/listLabelFunction`, {params}).then(res=>res.data); };

// 删除事项标签
export const deleteProjecLabel = params => { return axios.get(`/ss/ProjecLabel/deleteProjecLabel`, {params}).then(res=>res.data); };


// 新增/修改 事项标签
export const saveOrUpdateProjecLabel = params => { return axios.post(`/ss/ProjecLabel/saveOrUpdateProjecLabel`, params).then(res=>res.data); };

// 新增/修改 事项关联标签
export const saveOrUpdateLabelAndApprovalitem = params => { return axios.post(`/ss/ProjecLabel/saveOrUpdateLabelAndApprovalitem`, params).then(res=>res.data); };
