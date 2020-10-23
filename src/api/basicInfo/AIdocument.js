import axios from '../config'

// 事项id查询文档列表
export const listDocument = params => { return axios.get(`/ss/document/listDocument?approvalItemId=${params.approvalItemId}`).then(res=>res.data); };

// 新增文档
export const addDocument = params => { return axios.post(`/ss/document/addDocument`, params).then(res=>res.data); };

// 修改文档
export const updateDocument = params => { return axios.post(`/ss/document/updateDocument`, params).then(res=>res.data); };

// 查询单个文档
export const getByDocumentId = params => { return axios.get(`/ss/document/getByDocumentId`, {params}).then(res=>res.data); };

// 删除文档
export const delDocument = params => { return axios.get(`/ss/document/delDocument`, {params}).then(res=>res.data); };