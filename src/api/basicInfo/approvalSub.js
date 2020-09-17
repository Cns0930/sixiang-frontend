import axios from '../config'

// 查询情形
export const getApprovalSub = params => { return axios.get(`/ss/approvalSub/listApprovalSub`, {params}).then(res=>res.data); };

// 添加情形
export const addApprovalSub = params => { return axios.post(`/ss/approvalSub/addApprovalSub`, params).then(res=>res.data); };

// 修改情形
export const updateApprovalSub = params => { return axios.post(`/ss/approvalSub/updateApprovalSub`, params).then(res=>res.data); };

// 删除情形
export const deleteApprovalSub = params => { return axios.get(`/ss/approvalSub/delApprovalSub`, {params}).then(res=>res.data); };
