import axios from '../config'

// 查询全局信息点-分页
export const listCatalogPoint = params => { return axios.get(`/ss/CatalogPoint/listCatalogPoint`, {params}).then(res=>res.data); };

// 全局二级文档id查询全局信息点
export const listCatalogPointById = params => { return axios.get(`/ss/CatalogPoint/listCatalogPointById`, {params}).then(res=>res.data); };

// 新增全局信息点
export const addCatalogPoint = params => { return axios.post(`/ss/CatalogPoint/addCatalogPoint`, params).then(res=>res.data); };

// 修改全局信息点
export const updateCatalogPoint = params => { return axios.post(`/ss/CatalogPoint/updateCatalogPoint`, params).then(res=>res.data); };

// 删除全局信息点
export const deleteCatalogPoint = params => { return axios.delete(`/ss/CatalogPoint/deleteCatalogPoint`, {params}).then(res=>res.data); };
