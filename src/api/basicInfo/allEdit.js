import axios from '../config'

// 查询对应事项下相同字段信息
export const listEqualFields = params => { return axios.post(`/superform/fields/listEqualFields`, params).then(res=>res.data); };

// 添加情形
// export const addApprovalSub = params => { return axios.post(`/ss/approvalSub/addApprovalSub`, params).then(res=>res.data); };