import axios from '../config'

// 查询分类及提取结果
export const listClassifyAndKvInfo = params => { return axios.post(`/ai/DocumentClassify/listClassifyAndKvInfo`, params).then(res=>res.data); };

// 运行提取及分类
export const ObtainExtractResult = params => { return axios.post(`/ai/aiCheckpoint/ObtainExtractResult`, params).then(res=>res.data); };

// 更新提取点备注
export const updateKvInfoById = params => { return axios.post(`/ai/DocumentKvInfo/updateKvInfoById`, params).then(res=>res.data); };

// 更新分类备注
export const updateClassifById = params => { return axios.post(`/ai/DocumentClassify/updateClassifById`, params).then(res=>res.data); };
