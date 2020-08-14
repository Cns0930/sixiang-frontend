export default  [{
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
    "companyMobile",
    "1_5",
    "gudongNum",
    "dongshihui"],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        return ["1_9",
            "1_12_4_1",
            "1_13"
        ]
    },
    "component": "BusinessFormPage",
    "title": "撤销信息录入",
    "configType": 1,
    "config": ["1_9",
        "1_10",
        "1_8",
        "2_18"],
    "stepPagenum": 4
}, {
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
        "jingbanren_phone",
        "jingbanren_mobilePhone"],
    "stepPagenum": 5
}, {
    "configFn": function config(state, getters) {
        let gudongNum=state['gudongNum'].value;
    if(gudongNum>1){
    return ['31011542101_1_tpl',
        '31011542101_2_1_tpl'
        ]
        
    }else{
        return ['31011542101_1_tpl',
         '31011542101_1_2_tpl'
        ]
    }
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
    config: []
}]