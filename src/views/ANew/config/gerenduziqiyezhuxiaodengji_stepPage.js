export default  [{
    "configFn": function config(state, getters) {
        return []
    },
    "component": "ApprovalSelectContent",
    "title": "事项选择",
    "configType": 1,
    "config": ["fact1"],
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
        "nameOfLegalPersion"],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        if (state["fact1"].value == "简易注销") {
            return ["11_22",
                "11_23",
                "11_23_1_1"]
        }
        if (state["fact1"].value == "普通注销") {
            return [
                "11_6",
                "11_6_4_1",
                "11_9",
                "11_10",
                "11_11",
                "11_12",
                "11_15",
                "11_16"]
        }
        return []
    },
    "component": "gerenduziqiyezhuxiaodengji_BusinessFormPage",
    "title": "注销信息录入",
    "configType": 2,
    "config": [],
    "stepPagenum": 4
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "IdCardInfo",
    "title": "经办人信息验证",
    "configType": 1,
    "config": ["jingbanrenIdentity",
        "jingbanren_phone",
        "jingbanren_mobilePhone"],
    "stepPagenum": 5
}, {
    "configFn": function config(state, getters) {

        if (state['fact1'].value == '简易注销') {
            return ["31011542003_11_tpl"];
        } else {
            return ["31011542003_11_tpl",
                "31011542003_9_tpl"];
        }
        return []
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