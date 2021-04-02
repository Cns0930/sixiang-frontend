import axios from '../config'

// get 接口

// 查询ai_sortconfig-分页
export const listSortconfig = params => { return axios.get(`/ai/aiSortconfig/listSortconfig`, {params}).then(res=>res.data); };

// id查询ai_sortconfig
export const getBySortconfigId = params => { return axios.get(`/ai/aiSortconfig/getBySortconfigId`, {params}).then(res=>res.data); };

// 获取sortconfig
export const getSortconfig = params => { return axios.get(`/ai/aiSortconfig/getSortconfig`, {params}).then(res=>res.data); };

// 下载sortconfig.json,sortconfigIds以,分隔
export const getSortconfigJson = params => { return axios.get(`/ai/aiSortconfig/getSortconfigJson`, {params}).then(res=>res.data); };

// post 接口

// 新增ai_sortconfig
export const addSortconfig = params => { return axios.post(`/ai/aiSortconfig/addSortconfig`, params).then(res=>res.data); };

// 修改ai_sortconfig
export const updateSortconfig = params => { return axios.post(`/ai/aiSortconfig/updateSortconfig`, params).then(res=>res.data); };

// delete 接口

// 删除ai_sortconfig
export const deleteSortconfig = params => { return axios.delete(`/ai/aiSortconfig/deleteSortconfig`, {params}).then(res=>res.data); };
