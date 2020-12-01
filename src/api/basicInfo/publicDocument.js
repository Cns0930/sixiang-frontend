import axios from '../config'

/* 材料 */
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

/* 材料子文档 */
// 添加子文档
export const addGlobalDcumentSub = params => { return axios.post(`/ss/globalDocumentSubList/addGlobalDcumentSub`, params).then(res=>res.data); };

// 删除子文档
export const delDcumentSub = params => { return axios.get(`/ss/globalDocumentSubList/delDcumentSub`, {params}).then(res=>res.data); };

// 查询单个子文档
export const getByGlobalDcumentSubId = params => { return axios.get(`/ss/globalDocumentSubList/getByGlobalDcumentSubId`, {params}).then(res=>res.data); };

// 查询关联整份材料的子文档
export const listGlobalDcumentSub = params => { return axios.get(`/ss/globalDocumentSubList/listGlobalDcumentSub`, {params}).then(res=>res.data); };

// 修改子文档
export const updateGlobalDcumentSub = params => { return axios.post(`/ss/globalDocumentSubList/updateGlobalDcumentSub`, params).then(res=>res.data); };
