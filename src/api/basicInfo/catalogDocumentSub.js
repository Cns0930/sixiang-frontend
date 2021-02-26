import axios from '../config'

// 新增全局二级文档
export const addCatalogDocumentSub = params => { return axios.post(`/ss/CatalogDocumentSub/addCatalogDocumentSub`, params).then(res=>res.data); };

// 查询全局二级文档-可根据名称模糊查询
export const listCatalogDocumentSub = params => { return axios.get(`/ss/CatalogDocumentSub/listCatalogDocumentSub`, {params}).then(res=>res.data); };