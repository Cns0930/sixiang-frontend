import axios from '../config'

// 查询审批规则列表
export const listRule = params => { return axios.get(`/ss/rule/listRule`, {params}).then(res=>res.data); };

// 新增审批规则
export const addRule = params => { return axios.post(`/ss/rule/addRule`, params).then(res=>res.data); };

//  查询单个审批规则
export const getByRuleId = params => { return axios.get(`/ss/rule/getByRuleId`, {params}).then(res=>res.data); };

// 修改审批规则
export const updateRule = params => { return axios.post(`/ss/rule/updateRule`, params).then(res=>res.data); };

//  删除审批规则-物理删除
export const deleteGlobalCheckpoint = params => { return axios.get(`/ss/rule/deleteGlobalCheckpoint`, {params}).then(res=>res.data); };

//  新增情形与审批关系
export const AddSubitemAndRule = params => { return axios.get(`/ss/approvalSubitemAndRule/AddSubitemAndRule`, {params}).then(res=>res.data); };

//  修改情形与审批关系
export const UpdateSubitemAndRule = params => { return axios.get(`/ss/approvalSubitemAndRule/UpdateSubitemAndRule`, {params}).then(res=>res.data); };

// 批量保存情形与审批关系
export const saveSubitemAndRuleBatch = params => { return axios.post(`/ss/approvalSubitemAndRule/saveSubitemAndRuleBatch`, params).then(res=>res.data); };

//  根据规则id返回对应的情形名称
export const listSubitemNameByRuleId = params => { return axios.get(`/ss/approvalSubitemAndRule/listSubitemNameByRuleId`, {params}).then(res=>res.data); };

// 根据编号列表查询名称
export const listDocumentSubNameByCode = params => { return axios.post(`/ss/globalDocumentSubList/listDocumentSubNameByCode`, params).then(res=>res.data); };

//  根据事项id查询出子文档id列表
export const listDocumentSubByItemId = params => { return axios.get(`/ss/globalDocumentSubList/listDocumentSubByItemId`, {params}).then(res=>res.data); };

//  查询所有子文档-分页-可根据子材料编号,子材料名称(模糊),归类(模糊)查询
export const listGlobalDcumentSub = params => { return axios.get(`/ss/globalDocumentSubList/listGlobalDcumentSub`, {params}).then(res=>res.data); };



