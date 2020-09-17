import axios from '../config'

// 查询单个事项
export const getApprovalSub = params => { return axios.get(`/ss/approvalSub/listApprovalSub`, {params}).then(res=>res.data); };


export const addApprovalSub = params => { return axios.post(`/ss/approvalSub/addApprovalSub`, params).then(res=>res.data); };