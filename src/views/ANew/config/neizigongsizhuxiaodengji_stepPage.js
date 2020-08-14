export default [{
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
        "gudongNum",
        "dongshihui"],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        if (state["fact1"].value == "简易注销") {
            return ["9_22",
                "9_23",
                "9_23_1_1"]
        }
        if (state["fact1"].value == "普通注销") {
            return ["9_17",
                "9_17_2_1",
                "4_5",
                "4_4",
                "9_10",
                "9_9",
                "9_11",
                "9_12",
                "9_6",
                "9_6_7_1",
                "9_13",
                "9_14",
                "9_15",
                "9_16",
                "9_18",
                "9_19"]
        }
        return []
    },
    "component": "neizigongsizhuxiaodengji_BusinessFormPage",
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
        if (state['fact1'].value == "普通注销" && getters['9_17_1'] == '1') {
            if (state['gudongNum'].value == 1) {
                return ["31011541804_9_tpl",
                    "31011541804_4_1_tpl",
                    "31011541804_11_1_tpl"]
            } else {
                return ["31011541804_9_tpl",
                    "31011541804_4_2_tpl",
                    "31011541804_11_2_tpl"]
            }
    
        }else if (state["fact1"].value == "简易注销") {
            return ["31011541804_9_tpl"]
        } else {
            if (state['gudongNum'].value == 1) {
                return ["31011541804_9_tpl",
                    "31011541804_4_1_tpl"]
            } else {
                return ["31011541804_9_tpl",
                    "31011541804_4_2_tpl"]
            }
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
