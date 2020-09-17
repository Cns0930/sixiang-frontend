import axios from '../config'

// 查询单个事项
export const getSubApproval = params => { return axios.get(`/ss/approvalSub/listApprovalSub`, {params}).then(res=>res.data); };
