import axios from '../config'
// 获取大项列表
export const likelistDepartments = params => { return axios.get(`/ss/department/likelistDepartments`, {params}).then(res=>res.data); };

// 新增委办局
export const addDepartments = params => { return axios.post(`/ss/department/addDepartments`, params).then(res=>res.data); };

// 编辑委办局
export const updateDepartments = params => { return axios.post(`/ss/department/updateDepartments`, params).then(res=>res.data); };

// 删除委办局
export const deleteDepartments = params => { return axios.get(`/ss/department/deleteDepartments`, {params}).then(res=>res.data); };