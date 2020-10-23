import axios from '../config'

// 事项id查询单窗材料列表
export const listSinglewindow = params => { return axios.get(`/ss/singlewindow-material/listSinglewindow?approvalItemId=${params.approvalItemId}`).then(res=>res.data); };

// 新增材料
export const addSinglewindow = params => { return axios.post(`/ss/singlewindow-material/addSinglewindow`, params).then(res=>res.data); };

// 修改单窗材料
export const updateSinglewindow = params => { return axios.post(`/ss/singlewindow-material/updateSinglewindow`, params).then(res=>res.data); };

// 材料id查询单窗材料
export const getBySinglewindowId = params => { return axios.get(`/ss/singlewindow-material/getBySinglewindowId`, {params}).then(res=>res.data); };

// 删除单窗材料
export const delSinglewindow = params => { return axios.delete(`/ss/singlewindow-material/delSinglewindow`, {params}).then(res=>res.data); };