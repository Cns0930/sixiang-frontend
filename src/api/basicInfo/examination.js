import axios from '../config'

//  查询所有审批点-分页-材料id升序
export const listGlobalCheckpoint = params => { return axios.get(`/ss/globalCheckpoint/listGlobalCheckpoint`, {params}).then(res=>res.data); };

// 新增审批点
export const addGlobalCheckpoint = params => { return axios.post(`/ss/globalCheckpoint/addGlobalCheckpoint`, params).then(res=>res.data); };

//  查询单个审批点
export const getByGlobalCheckpointId = params => { return axios.get(`/ss/globalCheckpoint/getByGlobalCheckpointId`, {params}).then(res=>res.data); };

// 修改审批点
export const updateGlobalCheckpoint = params => { return axios.post(`/ss/globalCheckpoint/updateGlobalCheckpoint`, params).then(res=>res.data); };

//  删除审批点-物理删除
export const deleteGlobalCheckpoint = params => { return axios.get(`/ss/globalCheckpoint/deleteGlobalCheckpoint`, {params}).then(res=>res.data); };




