import axios from '../config'

// 查询情形
export const getApprovalSub = params => { return axios.get(`/ss/approvalSub/listApprovalSub`, {params}).then(res=>res.data); };

// 添加情形
export const addApprovalSub = params => { return axios.post(`/ss/approvalSub/addApprovalSub`, params).then(res=>res.data); };

// 修改情形
export const updateApprovalSub = params => { return axios.post(`/ss/approvalSub/updateApprovalSub`, params).then(res=>res.data); };

// 删除情形
export const deleteApprovalSub = params => { return axios.get(`/ss/approvalSub/delApprovalSub`, {params}).then(res=>res.data); };

//选择情形对应的材料-全部替换
export const relateMaterial = params => { return axios.post(`/ss/approvalSub/relateMaterial`, params).then(res=>res.data); };

// 查询情形 不分页
export const listApprovalSubAll = params => { return axios.get(`/ss/approvalSub/listApprovalSubAll`, {params}).then(res=>res.data); };

// 查询所有情形与子文档引用关系
export const listSubitemAndDocumentNew = params => { return axios.get(`/ss/approvalSubitemAndDocumentNew/listSubitemAndDocumentNew`, {params}).then(res=>res.data); };

// 新增情形与子文档引用关系
export const addSubitemAndDocumentNew = params => { return axios.post(`/ss/approvalSubitemAndDocumentNew/addSubitemAndDocumentNew`, params).then(res=>res.data); };

// 删除情形与子文档引用关系
export const deleteSubitemAndDocumentNew = params => { return axios.get(`/ss/approvalSubitemAndDocumentNew/deleteSubitemAndDocumentNew`, {params}).then(res=>res.data); };

// 修改情形与子文档引用关系
export const updateSubitemAndDocumentNew = params => { return axios.post(`/ss/approvalSubitemAndDocumentNew/updateSubitemAndDocumentNew`, params).then(res=>res.data); };

// 新增情形提取规则
export const addApprovalSubitemSubkey = params => { return axios.post(`/ss/approvalSub/addApprovalSubitemSubkey`, params).then(res=>res.data); };

// 删除情形提取规则
export const deleteApprovalSubitemSubkey = params => { return axios.get(`/ss/approvalSub/deleteApprovalSubitemSubkey`, {params}).then(res=>res.data); };

// 修改情形提取规则
export const updateApprovalSubitemSubkey = params => { return axios.post(`/ss/approvalSub/updateApprovalSubitemSubkey`, params).then(res=>res.data); };

// 查询情形提取规则-分页
export const listApprovalSubitemSubkey = params => { return axios.get(`/ss/approvalSub/listApprovalSubitemSubkey`, {params}).then(res=>res.data); };

// id查询情形提取规则表
export const getByApprovalSubitemSubkeyId = params => { return axios.get(`/ss/approvalSub/getByApprovalSubitemSubkeyId`, {params}).then(res=>res.data); };