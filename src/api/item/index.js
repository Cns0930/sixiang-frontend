import axios from 'axios';

// 事项列表
export const listAll = params => axios.get("/superform/item/listAll", {params}).then(res => res.data);
export const listItem = params => axios.get("/superform/item/list", {params}).then(res => res.data);

// 保存事项
export const saveItem = params => axios.post("/superform/item/save", params).then(res => res.data);

// 事项委办局列表
export const listDepartment = params => axios.get("/superform/item/listDepartments", {params}).then(res => res.data);

// 删除事项
export const deleteItem = params => axios.get("/superform/item/deleteItem", {params}).then(res => res.data);

