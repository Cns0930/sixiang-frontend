import axios from '../config'

// 添加全局文档
export const addGlobalDcument = params => { return axios.post(`/ss/globalDocumentList/addGlobalDcument`, params).then(res=>res.data); };

//  删除全局文档
export const deleteDcument = params => { return axios.get(`/ss/globalDocumentList/deleteDcument`, {params}).then(res=>res.data); };

//  获取单个全局文档
export const getByGlobalDcumentId = params => { return axios.get(`/ss/globalDocumentList/getByGlobalDcumentId`, {params}).then(res=>res.data); };

// 修改全局文档
export const updateGlobalDcument = params => { return axios.post(`/ss/globalDocumentList/updateGlobalDcument`, params).then(res=>res.data); };

//  获取全局文档列表
export const listGlobalDcument = params => { return axios.get(`/ss/globalDocumentList/listGlobalDcument`, {params}).then(res=>res.data); };

