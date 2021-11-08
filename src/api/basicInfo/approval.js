import axios from '../config'

// 事项管理查询
export const listApprovalItem = params => { return axios.get(`/ss/approvalItem/listApprovalItem`, { params }).then(res => res.data); };

// 材料管理查询
export const listMaterial = params => { return axios.get(`/ss/material/listMaterial`, params).then(res => res.data); };

// 获取大项列表
export const listApprovalAll = params => { return axios.get(`/ss/approval/listApprovalAll`, { params }).then(res => res.data); };

// 获取大项列表 - 根据项目id 、 分页
export const pageApprovalAll = params => { return axios.get(`/ss/approval/pageApprovalAll`, { params }).then(res => res.data); };

// 新增大项
export const addApproval = params => { return axios.post(`/ss/approval/addApproval`, params).then(res => res.data); };

// 编辑大项
export const updateApproval = params => { return axios.post(`/ss/approval/updateApproval`, params).then(res => res.data); };

// 删除大项
export const deleteApproval = params => { return axios.get(`/ss/approval/deleteApproval`, { params }).then(res => res.data); };

// 获取项目列表
export const listProjectAll = params => { return axios.get(`/ss/project/listProjectAll`, { params }).then(res => res.data); };

// 新增项目
export const addProject = params => { return axios.post(`/ss/project/addProject`, params).then(res => res.data); };

// 编辑项目
export const updateProject = params => { return axios.post(`/ss/project/updateProject`, params).then(res => res.data); };

// 删除项目
export const deleteProject = params => { return axios.get(`/ss/project/deleteProject`, { params }).then(res => res.data); };

// 根据项目Id查项目信息 
export const getByProjectId = params => { return axios.get(`/ss/project/getByProjectId`, { params }).then(res => res.data); };

// 添加事项
export const addApprovalItem = params => { return axios.post(`/ss/approvalItem/addApprovalItem`, params).then(res => res.data); };

// 修改事项
export const updateApprovalItem = params => { return axios.post(`/ss/approvalItem/updateApprovalItem`, params).then(res => res.data); };

// 查询单个事项
export const getByApprovalItemId = params => { return axios.get(`/ss/approvalItem/getByApprovalItemId`, { params }).then(res => res.data); };

// 导入情形 
export const copyApprovalSub = params => { return axios.get(`/ss/approvalSub/copyApprovalSub`, { params }).then(res => res.data); };

// 关闭事项
export const shutApprovalItem = params => { return axios.get(`/ss/approvalItem/shutApprovalItem`, { params }).then(res => res.data); };

// 查询所有公共事项
export const listPublicApprovalItem = params => { return axios.get(`/ss/approvalItem/listPublicApprovalItem`, { params }).then(res => res.data); };

// 查询事项下所有帮办所需信息上传git
export const submitItemInfo = params => { return axios.get(`/ss/approvalItem/submitItemInfo?approvalItemId=${params.approvalItemId}&note=${encodeURIComponent(params.note)}&machineId=${params.machineId}`).then(res => res.data); };

// 查询对应事项从表数据
export const exApprovalItem = params => { return axios.get(`/ss/approvalItem/exApprovalItem`, { params }).then(res => res.data); };

// 获取事项版本信息列表
export const listVersionItem = params => { return axios.get(`/account/SysVersionItem/listVersionItem`, { params }).then(res => res.data); };

// 获取事项版本信息并保存
export const obtainVersionItem = params => { return axios.get(`/account/SysVersionItem/obtainVersionItem`, { params }).then(res => res.data); };

// 保存事项内版本信息
export const addSysVersionItem = params => { return axios.post(`/account/SysVersionItem/addSysVersionItem`, params).then(res => res.data); };

// 事项管理查询-按用户
export const listApprovalItemByUser = params => { return axios.get(`/ss/approvalItem/listApprovalItemByUser`, { params }).then(res => res.data); };

// 查询上传的git信息列表
export const listSysGitVersionLog = params => { return axios.get(`/account/SysGitVersionLog/listSysGitVersionLog`, { params }).then(res => res.data); };

// 删除git信息
export const deleteSysGitVersion = params => { return axios.get(`/account/SysGitVersionLog/deleteSysGitVersion`, { params }).then(res => res.data); };

//查询事项对应步骤init-js
export const getStepInitJs = params => { return axios.get('/ss/approvalItem/getStepInitJs', { params }).then(res => res.data) }

//新增事项对应步骤init-js
export const addStepInitJs = params => { return axios.post('/ss/approvalItem/addStepInitJs', params).then(res => res.data) }

//修改事项对应步骤init-js
export const updateStepInitJs = params => { return axios.post('/ss/approvalItem/updateStepInitJs', params).then(res => res.data) }

// 推送九宫数据机器列表
export const listMachines = params => { return axios.get('/ss/approvalItem/listMachines', { params }).then(res => res.data) }

// 同步九宫事项数据
export const synchronizeItemZip = params => { return axios.get('/ss/approvalItem/synchronizeItemZip', { params }).then(res => res.data) }

// copy一份事项数据
export const copyVersionItem = params => { return axios.get('/account/SysVersionItem/copyVersionItem', { params }).then(res => res.data) }

// 查询事项版本历史记录
export const listHistoryRecord = params => { return axios.get('/account/SysVersionItem/listHistoryRecord', { params }).then(res => res.data) }

// 判断当前事项版本是否最新
export const isNewItemVersion = params => { return axios.get('/ss/approvalItem/isNewItemVersion', { params }).then(res => res.data) }

// 修改事项阶段
export const updateItemStage = params => { return axios.get('/ss/approvalItem/updateItemStage', { params }).then(res => res.data) }

// 根据项目下的事项阶段筛选事项列表-级联列表
export const listApprovalItemByStage = params => { return axios.get('/ss/approvalItem/listApprovalItemByStage', { params }).then(res => res.data) }

// 查询下载git压缩包清单 
export const gitZipchecklistByLordId = params => { return axios.post('/ss/Import/gitZipchecklistByLordId', params).then(res => res.data) }

// 全局查找事项
export const listApprovalItemOverall = params => { return axios.get('/ss/approvalItem/listApprovalItemOverall', { params }).then(res => res.data) }


// 全局操作-上传upload压缩包获取需要下载的事项信息列表
export const apiGetItemListByUploadZip = params => { return axios.post('/ss/Import/getItemListByUploadZip', params).then(res => res.data) }

// 全局操作-打包事项压缩包根据文件名称
export const apidownloadUploadZipByFileName = params => { return axios.post('/ss/Import/downloadUploadZipByFileName', params).then(res => res.data) }

// 全局操作-删除文件,可多个文件路径
export const apidelectFileByPath = params => { return axios.post('/ss/Import/delectFileByPath', params).then(res => res.data) }

// 查询所有事项-分页-可筛选项目,事项,开发阶段,标签
export const apilistAllApprovalItem = params => { return axios.get('/ss/approvalItem/listAllApprovalItem', { params }).then(res => res.data) }
