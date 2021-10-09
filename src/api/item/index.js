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
// export const getById = params => axios.get("/superform/item/getById", {params}).then(res => res.data);
export const getById = params => axios.get("/ss/approvalItem/getByApprovalItemId", {params}).then(res => res.data);

// 保存事项
export const saveItem = params => axios.post("/superform/item/save", params).then(res => res.data);

// 写入传输操作记录
export const addSysTransferLog = params => axios.post("/account/sys-transfer-log/addSysTransferLog", params).then(res => res.data);

// 查询最新传输记录
export const getUptoDateSysTransferLog = params => axios.get("/account/sys-transfer-log/getUptoDateSysTransferLog", {params}).then(res => res.data);

// 编辑用户访问项目
export const apieditSysUserProject = params => axios.post('/account/SysUserProject/editSysUserProject', params).then( res => res.data)