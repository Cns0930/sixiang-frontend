import axios from '../config'

// 新增全局二级文档
export const addCatalogDocumentSub = params => { return axios.post(`/ss/CatalogDocumentSub/addCatalogDocumentSub`, params).then(res=>res.data); };

// 查询全局二级文档-可根据名称模糊查询-下拉框
export const listCatalogDocumentSub = params => { return axios.get(`/ss/CatalogDocumentSub/listCatalogDocumentSub`, {params}).then(res=>res.data); };

// 删除全局二级文档
export const deleteCatalogDocumentSub = params => { return axios.delete(`/ss/CatalogDocumentSub/deleteCatalogDocumentSub`, {params}).then(res=>res.data); };

// 查询全局二级文档-分页-页面列表
export const listCatalogDocumentSubPage = params => { return axios.get(`/ss/CatalogDocumentSub/listCatalogDocumentSubPage`, {params}).then(res=>res.data); };

// 修改全局二级文档
export const updateCatalogDocumentSub = params => { return axios.post(`/ss/CatalogDocumentSub/updateCatalogDocumentSub`, params).then(res=>res.data); };

// 查询全局二级材料关联样本
export const api_listDocumentInfoByCatalogDocumentSub = params => { return axios.get('/ss/CatalogDocumentSub/listDocumentInfoByCatalogDocumentSub', {params}).then(res=> res.data)}
