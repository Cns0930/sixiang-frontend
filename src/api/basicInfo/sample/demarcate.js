import axios from '../../config'

// 查询事项样本情形标定结果
export const listSubitemNameByItemId = params => { return axios.get(`/caseTag/SampleResultSubitem/listSubitemNameByItemId`, {params}).then(res=>res.data); };

// 新增样本情形标定结果
export const addSampleResultSubitem = params => { return axios.post(`/caseTag/SampleResultSubitem/addSampleResultSubitem`, params).then(res=>res.data); };

// 新增样本图片标定结果
export const addSampleResultSort = params => { return axios.post(`/caseTag/SampleResultSort/addSampleResultSort`, params).then(res=>res.data); };

// 查询情形对应审批规则列表
export const listRuleAll = params => { return axios.post(`/ss/rule/listRuleAll`, params).then(res=>res.data); };

// 查询标定的规则结果
export const getResultRule = params => { return axios.get(`/caseTag/SampleResultRule/getResultRule`, {params}).then(res=>res.data); };

// 更新样本规则标定结果-无则新增
export const updateSampleResultRule = params => { return axios.post(`/caseTag/SampleResultRule/updateSampleResultRule`, params).then(res=>res.data); };

// // 根据事项id，获取其材料列表,由前端处理目录结构
// export const getFileList = params => { return axios.get(`/docInfo/getFileList`, {params}).then(res=>res.data); };


// // 获取材料/图片
// export const getPic = params => { return axios.get(`/docInfo/getPic`, {params}).then(res=>res.data); };

// // 修改文件名称
// export const modifyFileName = params => { return axios.post(`/docInfo/modify_file_name`, params).then(res=>res.data); };

// // 重命名图片文件
// export const renamePic = params => { return axios.post(`/docInfo/rename_pic`, params).then(res=>res.data); };

// 真值标定接口
// 查询提取点列表(包含样本真值标定结果)
export const getSampleResultFieldByDocumentId = params => { return axios.get(`/caseTag/SampleResultField/getSampleResultFieldByDocumentId`, {params}).then(res=>res.data); };

// 导入最新测试结果
export const importSampleResultFieldByDocumentId = params => { return axios.get(`/caseTag/SampleResultField/importSampleResultFieldByDocumentId`, {params}).then(res=>res.data); };

// 保存或更新样本真值标定结果 更新时id不为空
export const addSampleResultField = params => { return axios.post(`/caseTag/SampleResultField/addSampleResultField`, params).then(res=>res.data); };