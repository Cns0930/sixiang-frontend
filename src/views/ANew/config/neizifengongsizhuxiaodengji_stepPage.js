export default [{
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
    "config": ["parentCompanyName",
        "parentUnifiedSocialCreditCode",
        "parentCompanyType",
        "parentRegisterOrganization",
        "parentBusinessTerm",
        "companyName",
        "unifiedSocialCreditCode",
        "companyMobile",
        "zipcode"],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        if (state["1_12"].value == "其它原因") {
            return ["1_12",
                "1_12_4_1",
                "1_13"
            ]
        }
        return ["1_12",
            "1_13"
        ]
    },
    "component": "BusinessFormPage",
    "title": "注销信息录入",
    "configType": 2,
    "config": ["1_12",
        "1_12_4_1",
        "1_13"],
    "stepPagenum": 4
},  {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "IdCardInfo",
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
        return ['31011541808_1_tpl']
    },
    "component": "CommonMaterial",
    "title": "材料预览",
    "configType": 2,
    "config": [],
    "stepPagenum": 6
},{
    title: '材料打印',
    component: "LastStep",
    "configType": 1,
    config: [],
}]