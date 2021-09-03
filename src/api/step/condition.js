import axios from 'axios';

// 获取步骤
export const getStep = params => axios.post('/superform/step-condition/list', params).then(res => res.data);

// 保存单个步骤
export const saveStep = params => axios.post('/superform/step-condition/save', params).then(res => res.data);

// 删除单个步骤
export const deleteStep = params => axios.get('/superform/step-condition/delete', {params}).then(res => res.data);

// 查询事项条件预检的开关
export const getConditionSwitch = params => axios.get('/superform/switch/getConditionSwitch', {params}).then(res => res.data);

// 设置事项条件预检的开关
export const setConditionSwitch = params => axios.get('/superform/switch/setConditionSwitch', {params}).then(res => res.data);
