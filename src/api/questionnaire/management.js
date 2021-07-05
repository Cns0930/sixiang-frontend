import axios from '../config'

// get 接口

// 查询问卷表-分页
export const listQuestion = params => { return axios.get(`/qnr/question/listQuestion`, {params}).then(res=>res.data); };

// 删除问卷表
export const deleteQuestion = params => { return axios.get(`/qnr/question/deleteQuestion`, {params}).then(res=>res.data); };

// 生成问卷
export const generateQuestion = params => { return axios.post(`/qnr/question/generateQuestion`, params).then(res=>res.data); };

// 修改题目的表述和选项
export const updateItem = params => { return axios.post(`/qnr/question/updateItem`, params).then(res=>res.data); };

// 修改问卷表
export const updateQuestion = params => { return axios.post(`/qnr/question/updateQuestion`, params).then(res=>res.data); };

// 查询问卷答案表
export const getByReplyIdid = params => { return axios.get(`/qnr/question/getByReplyIdid`, {params}).then(res=>res.data); };

// 回填问卷数据
export const fillback = params => { return axios.post(`/qnr/question/fillback`, params).then(res=>res.data); };

// 发布/停止发布问卷表
export const releaseQuestion = params => { return axios.get(`/qnr/question/releaseQuestion`, {params}).then(res=>res.data); };

// 查询问卷答案表-分页
export const listReply = params => { return axios.get(`/qnr/question/listReply`, {params}).then(res=>res.data); };

// 根据key获取问卷内容
export const getByQuestionKey = params => { return axios.get(`/qnr/question/getByQuestionKey`, {params}).then(res=>res.data); };

// 删除一道题
export const deleteItem = params => { return axios.get(`/qnr/question/deleteItem`, {params}).then(res=>res.data); };

// 2021.7.5 新增
// 查询问卷答案回填日志记录-分页
export const listReplyFillbackLog = params => { return axios.get(`/qnr/question/listReplyFillbackLog`, {params}).then(res=>res.data); };
