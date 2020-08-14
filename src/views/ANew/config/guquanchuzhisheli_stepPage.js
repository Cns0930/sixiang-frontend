import _ from "lodash"
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
let stepData = [{
    "configFn": function config(state, getters) {
        return []
    },
    "component": "ApprovalSelectContent",
    "title": "事项选择",
    "configType": 1,
    "config": [],
    "stepPagenum": 1
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "MaterialExtract",
    "title": "智能提取材料",
    "configType": 1,
    "config": [],
    "stepPagenum": 2
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "BaseFormPage",
    "title": "基本信息确认",
    "configType": 1,
    "config": ["companyName",
        "unifiedSocialCreditCode",
        "1_4",
        "1_5",
        "1_6",
        "1_7",
        "1_8",
        "1_9",
        "1_11"],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "BusinessFormPage",
    "title": "设立信息确认",
    "configType": 1,
    "config": ["1_14",
        "1_15",
        "1_16",
        "1_17"],
    "stepPagenum": 4
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "IdCardInfo",
    "beforeEnterFn": null,
    "title": "经办人信息验证",
    "configType": 1,
    "config": ["jingbanrenIdentity",
        "jingbanren_name",
        "jingbanren_idType",
        "jingbanren_idNum",
        "jingbanren_mobilePhone",
        "jingbanren_phone"],
    "stepPagenum": 5
}, {
    "configFn": function config(state, getters) {
        return ['31011542301_1_tpl']
    },
    "component": "CommonMaterial",
    "title": "材料预览",
    "configType": 2,
    "config": [],
    "stepPagenum": 6
}, {
    title: '材料打印',
    component: "LastStep",
    "configType": 1,
    config: [],
}]
export default stepData