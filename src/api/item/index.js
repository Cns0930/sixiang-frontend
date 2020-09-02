import axios from 'axios';

//登录
export const login = params =>axios.post("/login",params).then(res => res.data);

//退出登录
export const logout = params =>axios.get("/logout",{params}).then(res => res.data);

//用户列表-含角色
export const userlist = params =>axios.post("/account/user/userlist", params).then(res => res.data)

//角色列表
export const getRolelist = params =>axios.post("/account/role/rolelist", params).then(res => res.data)

//用户角色编辑
export const editUserrole = params =>axios.post("/account/user/edituserrole", params).then(res => res.data)

//获取用户信息
export const getsession = params =>axios.get("/getsession",{params}).then(res => res.data);

// 事项列表
export const listAll = params => axios.get("/superform/item/listAll", {params}).then(res => res.data);
export const listItem = params => axios.get("/superform/item/list", {params}).then(res => res.data);

// 获取单个事项
export const getById = params => axios.get("/superform/item/getById", {params}).then(res => res.data);

// 保存事项
export const saveItem = params => axios.post("/superform/item/save", params).then(res => res.data);

// 事项委办局列表
export const listDepartment = params => axios.get("/superform/item/listDepartments", {params}).then(res => res.data);

// 删除事项
export const deleteItem = params => axios.get("/superform/item/deleteItem", {params}).then(res => res.data);

// 通过创建时间筛选事项
export const filterDateItem = params => axios.post("/superform/item/filterCreateTime", params).then(res => res.data);
