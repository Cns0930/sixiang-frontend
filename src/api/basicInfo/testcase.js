import axios from '../config'

// 新增测试用例表
export const addTestcase = params => { return axios.post(`/superform/testcase/addTestcase`, params).then(res=>res.data); };

// 查询测试用例表-分页
export const listTestcase = params => { return axios.post(`/superform/testcase/listTestcase`, params).then(res=>res.data); };

// id查询测试用例表
export const getByTestcaseId = params => { return axios.get(`/superform/testcase/getByTestcaseId`, {params}).then(res=>res.data); };

// 删除测试用例表
export const deleteTestcase = params => { return axios.delete(`/superform/testcase/deleteTestcase`, {params}).then(res=>res.data); };

// 修改测试用例表
export const updateTestcase = params => { return axios.post(`/superform/testcase/updateTestcase`, params).then(res=>res.data); };

// 修改测试用例关联情形
export const updateTestcaseAndSubitem = params => { return axios.post(`/superform/testcase/updateTestcaseAndSubitem`, params).then(res=>res.data); };
