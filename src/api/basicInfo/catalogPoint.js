import axios from '../config'

// 查询全局信息点-分页
export const listCatalogPoint = params => { return axios.get(`/ss/CatalogPoint/listCatalogPoint`, {params}).then(res=>res.data); };