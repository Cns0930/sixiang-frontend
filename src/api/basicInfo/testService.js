import axios from '../config'
// 获取服务列表
export const likelistMachine = params => { return axios.get(`/superform/Machine/listMachine`, {params}).then(res=>res.data); };

// 新增测试服务
export const addMachine = params => { return axios.post(`/superform/Machine/addMachine`, params).then(res=>res.data); };

// 编辑委办局
export const updateMachine = params => { return axios.post(`/superform/Machine/updateMachine`, params).then(res=>res.data); };

// 删除委办局
export const deleteMachine = params => { return axios.get(`/superform/Machine/deleteMachine`, {params}).then(res=>res.data); };