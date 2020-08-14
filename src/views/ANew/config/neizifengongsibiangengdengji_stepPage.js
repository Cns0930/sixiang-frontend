export default[{
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
        let fact1 = state['fact1'].value
        let returnArr = ['parentCompanyName',
            'parentUnifiedSocialCreditCode',
            'parentCompanyType',
            'parentRegisterOrganization',
            'parentBusinessTerm',
            'companyName',
            'unifiedSocialCreditCode',
            'mobile',
            '1_10']
        if (fact1.includes('名称')) {}



        if (fact1.includes('负责人')) {
            returnArr.push('1_13_3')
        }

        if (fact1.includes('类型')) {
            returnArr.push('1_13_5')
        }

        if (fact1.includes('营业场所')) {
            returnArr.push('1_13_2')
        }

        if (fact1.includes('经营范围')) {
            returnArr.push('1_13_4')
        }



        if (fact1.includes('执照有效期')) {}

        return returnArr;
    },
    "component": "BaseFormPage",
    "title": "基本信息确认",
    "configType": 2,
    "config": [],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        let fact1 = state['fact1'].value
        let returnArr = []
        if (fact1.includes('名称')) {
            returnArr.push('1_14_1')
        }

        if (fact1.includes('营业场所')) {
            returnArr.push('1_14_2')
        }

        if (fact1.includes('负责人')) {
            returnArr.push('1_14_3')
            returnArr.push('fuzherenIdentity')
            returnArr.push('2_2')
            returnArr.push('2_3')
            returnArr.push('2_1')
            returnArr.push('2_5')
            returnArr.push('2_6')
        }

        if (fact1.includes('类型')) {
            returnArr.push('1_14_5')
        }

        if (fact1.includes('经营范围')) {
            returnArr.push('jingyingfanw')
        }



        if (fact1.includes('执照有效期')) {
            returnArr.push('1_13_6')
            returnArr.push('1_14_6')
        }

        return returnArr;
    },
    "component": "BusinessFormPage",
    "title": "变更信息录入",
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
        "jingbanren_name",
        "jingbanren_idType",
        "jingbanren_idNum",
        "jingbanren_phone",
        "jingbanren_mobilePhone"],
    "stepPagenum": 5
}, {
    "configFn": function config(state, getters) {
        let fact1 = state['fact1'].value;
        if (fact1.includes('名称')) {
            return ['31011541807_1_tpl',
                '31011541807_18_tpl']
        }
        return ['31011541807_1_tpl']
    },
    "component": "CommonMaterial",
    "title": "材料预览页面",
    "configType": 2,
    "config": [],
    "stepPagenum": 6
},{
    title: '材料打印',
    component: "LastStep",
    "configType": 1,
    config: [],
    "stepPagenum": 7
}]