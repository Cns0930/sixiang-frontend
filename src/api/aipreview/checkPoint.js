import axios from '../config'

// get 接口

// 查询ai_checkpoint-分页
export const listCheckpoint = params => { return axios.get(`/ai/aiCheckpoint/listCheckpoint`, {params}).then(res=>res.data); };

// 查询ai_checkpoint
export const getByCheckpointId = params => { return axios.get(`/ai/aiCheckpoint/getByCheckpointId`, {params}).then(res=>res.data); };

// 获取checkpoint
export const getCheckpoint = params => { return axios.get(`/ai/aiCheckpoint/getCheckpoint`, {params}).then(res=>res.data); };

// 下载checkpoint.json,checkpointId以,分隔
export const getCheckpointJson = params => { return axios.get(`/ai/aiCheckpoint/getCheckpointJson`, {params}).then(res=>res.data); };

// post 接口

// 新增ai_checkpoint
export const addCheckpoint = params => { return axios.post(`/ai/aiCheckpoint/addCheckpoint`, params).then(res=>res.data); };

// 修改ai_checkpoint
export const updateCheckpoint = params => { return axios.post(`/ai/aiCheckpoint/updateCheckpoint`, params).then(res=>res.data); };

// delete 接口

//  删除ai_checkpoint
export const deleteCheckpoint = params => { return axios.delete(`/ai/aiCheckpoint/deleteCheckpoint`, {params}).then(res=>res.data); };

// 批量删除ai_checkpoint
export const deleteCheckpointBatch = params => { return axios.post(`/ai/aiCheckpoint/deleteCheckpointBatch`, params).then(res=>res.data); };
