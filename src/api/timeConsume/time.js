import axios from '../config'

// 新增事项页面操作时间
export const addSysOperatingItemTime = params => { return axios.post(`/account/SysOperatingItem/addSysOperatingItemTime`, params).then(res=>res.data); };
