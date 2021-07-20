import axios from '../config'

// 查询材料配置信息列表-分页
export const listMaterialConfig = params => { return axios.get(`/qnr/configure/listMaterialConfig`, {params}).then(res=>res.data); };

// 修改材料配置信息
export const updateMaterialConfig = params => { return axios.post(`/qnr/configure/updateMaterialConfig`, params).then(res=>res.data); };

// 查询字段配置信息列表-分页
export const listFieldConfig = params => { return axios.get(`/qnr/configure/listFieldConfig`, {params}).then(res=>res.data); };

// 修改字段配置信息
export const updateFieldConfig = params => { return axios.post(`/qnr/configure/updateFieldConfig`, params).then(res=>res.data); };

// 添加自定问题
export const addCustomItem = params => { return axios.post(`/qnr/configure/addCustomItem`, params).then(res=>res.data); };

// 查询自定义问题匹配的材料或字段下拉列表
export const listCustomMatchOptions = params => { return axios.get(`/qnr/configure/listCustomMatchOptions`, {params}).then(res=>res.data); };

// 查询材料配置信息列表-不分页 不含图片
export const listMaterialConfigNoPage = params => { return axios.get(`/qnr/configure/listMaterialConfigNoPage`, {params}).then(res=>res.data); };

// 查询字段配置信息列表-不分页 不含图片
export const listFieldConfigNoPage = params => { return axios.get(`/qnr/configure/listFieldConfigNoPage`, {params}).then(res=>res.data); };

// 查询材料的图片配置
export const listPicConfigByMaterialId = params => { return axios.get(`/qnr/configure/listPicConfigByMaterialId`, {params}).then(res=>res.data); };

// 查询字段的图片配置
export const listPicConfigByFieldId = params => { return axios.get(`/qnr/configure/listPicConfigByFieldId`, {params}).then(res=>res.data); };

// 删除单张材料配置图片
export const deleteMaterialQnrPicById = params => { return axios.get(`/qnr/configure/deleteMaterialQnrPicById`, {params}).then(res=>res.data); };

// 删除单张材料配置图片
export const deleteFieldQnrPicById = params => { return axios.get(`/qnr/configure/deleteFieldQnrPicById`, {params}).then(res=>res.data); };
