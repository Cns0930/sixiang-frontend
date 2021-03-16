import axios from '../config'

export const getUnitTest = params => { return axios.get(`/superform/UnitTest/listUnitTest`, {params}).then(res=>res.data); };

export const deleteUnitTest = params => { return axios.delete(`/superform/UnitTest/deleteUnitTest`, {params}).then(res=>res.data); };

export const updateUnitTest = params => { return axios.post(`/superform/UnitTest/updateUnitTest`, params).then(res=>res.data); };

export const getUnitTestById = params => { return axios.get(`/superform/UnitTest/getByUnitTestId`, {params}).then(res=>res.data); };

export const addUnitTest = params => { return axios.post(`/superform/UnitTest/addUnitTest`, params).then(res=>res.data); };
