import axios from '../config'

// 新增事项页面操作时间
export const addSysOperatingItemTime = params => { return axios.post(`/account/SysOperatingItem/addSysOperatingItemTime`, params).then(res=>res.data); };

// 查询事项页面用时列表
export const listOperatingItemTime = params => { return axios.post(`/account/SysOperatingItem/listOperatingItemTime`, params).then(res=>res.data); };

// 查询拥有角色的用户列表
export const listUserAllByRole = params => { return axios.get(`/account/user/listUserAllByRole`, {params}).then(res=>res.data); };

// 查询页面分类列表
export const listRouterConfAndClassif = params => { return axios.get(`/account/SysRouterConf/listRouterConfAndClassif`, {params}).then(res=>res.data); };

// 查询页面分组列表
export const listRouterConfAndGroup = params => { return axios.get(`/account/SysRouterConf/listRouterConfAndGroup`, {params}).then(res=>res.data); };