import axios from '../../config'

// 根据事项id，获取其材料列表,由前端处理目录结构
export const getFileList = params => { return axios.get(`/docInfo/getFileList`, {params}).then(res=>res.data); };

// 删除事项材料
export const deleteDoc = params => { return axios.post(`/docInfo/deleteDoc`, params).then(res=>res.data); };

// 获取材料
export const getPic = params => { return axios.get(`/docInfo/getPic`, {params}).then(res=>res.data); };

// 修改文件名称
export const modifyFileName = params => { return axios.post(`/docInfo/modify_file_name`, params).then(res=>res.data); };

// 重命名图片文件
export const renamePic = params => { return axios.post(`/docInfo/rename_pic`, params).then(res=>res.data); };
