import axios from './config'

/**
 * 登录接口
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const LoginAxios = (params) => axios.post('/api/user/login',  params).then(res => res.data)

/**
 * 票号二维码查询
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const QueryBarcodeApi = (params) => axios.get('/api/selfservice/3rd/barcode', { params }).then(res => res.data)

/**
 * 提交扫描材料
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const CommitDocApi = (params) => axios.post('/api/selfservice/scan/commit', params).then(res => res.data)

/**
 * skip扫描材料
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const SkipScanApi = (params) => axios.post('/api/selfservice/scan/skip', params).then(res => res.data)

/**
 * 获取后端事项数据模板
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const QueryRecordTempalte = (params) => axios.get('/api/selfservice/record/query', { params }).then(res => res.data)

/**
 * 高拍仪 扫描身份证，返回识别结果和 base64身份证正反面
 * @returns {Promise<T>}
 * @constructor
 */
export const IdCrodTakePhotoApi = (params) => axios.post('/api/selfservice/3rd/idcard', params).then(res => res.data)

/**
 * 身份证复印件，返回识别结果和 base64身份证正反面
 * @returns {Promise<T>}
 * @constructor
 */
export const idCardCopyRecogApi = (params) => axios.post('/api/selfservice/3rd/idcardA4', params).then(res => res.data)


/**
 * 根据证照内部编号获取证照基本信息
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const GetCertBaseDataApi = (params) => axios.get('/api/selfservice/3rd/suishenban', {
    params,
    timeout: 50000
}).then(res => res.data)

/* export const GetCertBaseDataApi = (params) => axios.get('http://192.68.60.55:8999/getCertBaseData', {
    params,
    timeout: 20000
}).then(res => res.data) */

/**
 * 提交流水记录填写的表单
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const CommitSelfRecord = (params) => axios.post('/api/selfservice/record/commit', params).then(res => res.data)

/**
 * 查询记录
 * @param params
 * @returns {Promise<T>}
 * @constructor
 */
export const QuerySelfServiceRecord = (params) => axios.get('/api/selfservice/record/docs', { params }).then(res => res.data)

export const ValidateIdCardNumApi = (params) => axios.get('/api/selfservice/validateCard', { params }).then(res => res.data)

/**
 * 根据委办局获取事项列表
 * @param {department} params
 */
export const listApprovalList = (params) => axios.get('/api/selfservice/listApprovalList', { params }).then(res => res.data)

/**
 * 根据事项id，返回情形列表
 * @param {approvalId} params
 */
export const listApprovalItemList = (params) => axios.get('/api/selfservice/listApprovalItemList', { params }).then(res => res.data)

/**
 * 获取情形所需要的材料信息
 * @param {*} params
 */
export const queryApprovalItemDocuments = (params) => axios.post('/api/selfservice/items/query', params).then(res => res.data)


export const BatchDownloadApi = params => axios.post('/api/selfservice/getZipFile', params, { responseType: 'blob' })
    .then((res) => {
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = '材料列表.zip';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        URL.revokeObjectURL(href);
    });


/**
 * 获取身份证测试图片
 */
export const TestIdCard = (params) => axios.get('/test/getIdCard', { params }).then(res => res.data)

/**
 * 根据模板名称获取 文档 html 模板
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
// export const GetDocHtmlTempApi = (params) => axios.get('/html_templates/' + params.tempName + '?r=' + new Date().getTime()).then(res => res.data)
export const GetDocHtmlTempApi = (params) => axios.get('/api/selfservice/getDocHtmlTemplate', {params}).then(res => res.data)


export const queryMaterials = (params) => axios.post('/api/selfservice/material/query', params).then(res => res.data)

/**
 * 本地的打印服务，调用本地的接口
 * @param {} params 
 */
export const localPrintFile =process.env.NODE_ENV === 'development' ?
()=>new Promise(resolve=>{
    setTimeout(()=>{resolve({message:"",code:400,data:['development']})},2000)
})
: (params) => axios.post('http://localhost:12828/listen', params).then(res => res.data)

/**
 * 添加新股东，获取股东信息—— 模糊查询
 */
export const getEnterpriseInfoLike = (params)=>axios.get('/api/selfservice/getEnterpriseInfoLike',{params}).then(res => res.data)

/**
 * 精确查询企业信息
 */
export const getEnterpriseInfo = (params)=>axios.get('/api/selfservice/getEnterpriseInfo',{params}).then(res => res.data)

/**
 * 提交到辅助审批
 */
export const sendToPdsc = (params)=>axios.post('/api/selfservice/3rd/sendToPdsc',params).then(res => res.data)

/** 
 * 提交 所有的fieldNo
*/
export const sendAllData = (params)=>axios.post('/api/selfservice/insertHistory',params).then(res => res.data)
/**
 * 查询历史记录
 */
export const searchHistory = (params)=>axios.get('/api/selfservice/historyByCompanyName',{params}).then(res => res.data)

//获取高亮经营范围数据
export const listHighlighterScopes = (params) => axios.get('/api/user/listHilightScopes',{ params }).then(res => res.data)

//获取经营范围对应关系
export const listScopesRelation = (params) => axios.get('/api/user/listScopesRelation',{ params }).then(res => res.data)

//获取经营范围数据
export const listScopes = (params) => axios.get('/api/user/listScopes',{headers:{projectCode: 330106}},{ params }).then(res => res.data)

export const updateRecordIsBatchPrint = (params) => axios.get('/api/selfservice/record/isBatchPrint', { params }).then(res => res.data)
