import axios from '../config'

// 获取附件列表
export const listAccessory = params => { return axios.get(`/superform/additional/listAdditional`, {params} ).then(res=>res.data); };

// 材料附件下载
export const downloadFile = params => { return axios.get(`/superform/additional/downloadWord`, {params} ).then(res=>res.data); };

// 材料附件上传
export const uploadFile = params => { return axios.post(`/superform/additional/uploadWord`, params ).then(res=>res.data); };