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
        let fact1 = state['fact1'].value
        let returnArr = ['companyName',
            'unifiedSocialCreditCode',
            'companyMobile',
            'zipcode',
            'gudongNum',
            'dongshihui',
            'jianshihui']
        if (fact1.includes('章程')) {
            returnArr.push('betweenOperatingPeriod')
            returnArr.push('registeredAddress')
            returnArr.push('businessScope')
            returnArr.push('gudongList')

        }
        if (fact1.includes('清算组成立')) {
            _.pull(returnArr, 'dongshihui', 'jianshihui')
        }

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
        let gudongNum = state['gudongNum'].value
        let dongshihui = state['dongshihui'].value
        let jianshihui = state['jianshihui'].value
        console.log("监事会", jianshihui)
        let returnArr = []
        if (fact1.includes('董事、监事、经理')) {
            returnArr.push({
                fact: "董事、监事、经理", fields: ["dongshiList"]})
        }
        if (fact1.includes('清算组成立')) {
            returnArr.push({
                fact: "清算组负责人信息", fields: ["4_1", "1_9", "1_10", "qingsuanzuList"]})
        }
        if (fact1.includes('章程')) {
            let hezi = ["11_10",
                "11_13",
                "11_15",
                "11_17",
                "11_20"]
            let yiren = ["11_17",
                "11_13",
                "11_20"]
            if (gudongNum > 1) {
                if (dongshihui == "否" && jianshihui == "否") {
                    returnArr.push({
                        fact: "章程", fields: [...hezi, "11_16", "1_3"]})
                } else if (dongshihui == "否" && jianshihui == "是") {
                    returnArr.push({
                        fact: "章程", fields: [...hezi, "11_26", "11_27", "1_3"]})
                } else if (dongshihui == "是" && jianshihui == "否") {
                    returnArr.push({
                        fact: "章程", fields: [...hezi, "11_28", "dongshizhang_chanshengfangshi", "11_16", "1_3"]})
                } else if (dongshihui == "是" && jianshihui == "是") {
                    returnArr.push({
                        fact: "章程", fields: [...hezi, "11_28", "11_26", "dongshizhang_chanshengfangshi", "11_27", "1_3"]})
                }
            } else {
                if (dongshihui == "否" && jianshihui == "否") {
                    returnArr.push({
                        fact: "章程", fields: [...yiren, "11_16", "1_3"]})
                } else if (dongshihui == "否" && jianshihui == "是") {
                    returnArr.push({
                        fact: "章程", fields: [...yiren, "11_26", "11_27", "1_3"]})
                } else if (dongshihui == "是" && jianshihui == "否") {
                    returnArr.push({
                        fact: "章程", fields: [...yiren, "11_28", "dongshizhang_chanshengfangshi", "11_16", "1_3"]})
                } else if (dongshihui == "是" && jianshihui == "是") {
                    returnArr.push({
                        fact: "章程", fields: [...yiren, "11_28", "11_26", "dongshizhang_chanshengfangshi", "11_27", "1_3"]})
                }
            }
        }
        console.log(returnArr)
        return returnArr;
    },
    "component": "BusinessFormPage",
    "title": "备案信息录入",
    "configType": 2,
    "config": ["dongshiList"],
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
        let gudongNum = state['gudongNum'].value;
        let dongshihui = state['dongshihui'].value;
        let jianshihui = state['jianshihui'].value;
        let materialsPageArr = [];

        let allList = state['dongshiList'].value;
        let wholeZhuwuString = allList.map(v=>v.dongshi_zhiwu).join("");


        if (fact1.includes('清算组成立')) {
            if (gudongNum == 1) {
                materialsPageArr.push("31011541805_1_tpl");
                materialsPageArr.push("31011541805_9_2_tpl");
            } else {
                materialsPageArr.push("31011541805_1_tpl");
                materialsPageArr.push("31011541805_9_1_tpl");
            }
        }

        // 判断董事
        let keyList = allList.map(v=>v.dongshi_zhiwu+","+v.dongshi_chanshengfangshi);

        if (wholeZhuwuString.includes('董事')) {
            if (gudongNum == 1) {
                if (dongshihui == '是') {
                    let config = {
                        "董事长,董事会选举": ["31011541805_1_tpl",
                            "31011541805_9_3_tpl"],
                        "董事长,股东任命": ["31011541805_1_tpl",
                            "31011541805_9_2_tpl"],
                        "董事,股东任命": ["31011541805_1_tpl",
                            "31011541805_9_2_tpl"],
                        "default": []
                    }

                    keyList.forEach(key=> {
                        let materials = config[key] || config["default"];
                        materialsPageArr.push(...materials);
                    })
                    // if (allList.some(fields=>fields.dongshi_zhiwu == '董事长' && fields.dongshi_chanshengfangshi == "董事会选举")) {
                    //     materialsPageArr.push("31011541805_1_tpl");
                    //     materialsPageArr.push("31011541805_9_3_tpl");
                    // } else if (allList.some(fields=>fields.dongshi_zhiwu == '董事长' && fields.dongshi_chanshengfangshi == "股东任命")) {
                    //     materialsPageArr.push("31011541805_1_tpl");
                    //     materialsPageArr.push("31011541805_9_3_tpl");
                    // } else if (allList.some(fields=>fields.dongshi_zhiwu == '董事' && fields.dongshi_chanshengfangshi == "股东任命")) {
                    //     materialsPageArr.push("31011541805_1_tpl");
                    //     materialsPageArr.push("31011541805_9_2_tpl");
                    // }
                } else {
                    materialsPageArr.push("31011541805_1_tpl");
                    materialsPageArr.push("31011541805_9_2_tpl");
                }
            } else {
                if (dongshihui == '是') {

                    let config = {
                        "董事长,董事会选举": ["31011541805_1_tpl",
                            "31011541805_9_3_tpl"],
                        "董事长,股东会选举": ["31011541805_1_tpl",
                            "31011541805_9_1_tpl"],
                        "董事,股东会选举": ["31011541805_1_tpl",
                            "31011541805_9_1_tpl"],
                        "董事兼董事长,股东会选举": ["31011541805_1_tpl",
                            "31011541805_9_1_tpl"],
                        "default": []
                    }

                    keyList.forEach(key=> {
                        let materials = config[key] || config["default"];
                        materialsPageArr.push(...materials);
                    })


                    // if (allList.some(fields=>fields.dongshi_zhiwu == '董事长' && fields.dongshi_chanshengfangshi == "董事会选举")) {
                    //     materialsPageArr.push("31011541805_1_tpl");
                    //     materialsPageArr.push("31011541805_9_3_tpl");
                    // } else if (dongshi_zhiwu == '董事长' && dongshi_chanshengfangshi == "股东会选举") {
                    //     materialsPageArr.push("31011541805_1_tpl");
                    //     materialsPageArr.push("31011541805_9_3_tpl");
                    // } else if (dongshi_zhiwu == '董事' && dongshi_chanshengfangshi == "股东会选举") {
                    //     materialsPageArr.push("31011541805_1_tpl");
                    //     materialsPageArr.push("31011541805_9_1_tpl");
                    // }
                } else {
                    materialsPageArr.push("31011541805_1_tpl");
                    materialsPageArr.push("31011541805_9_1_tpl");
                }
            }
        }
        // 判断 经理
        if (wholeZhuwuString.includes('经理')) {
            if (gudongNum == 1) {
                if (dongshihui == '否') {
                    let config = {
                        "经理,股东聘任": ["31011541805_1_tpl",
                            "31011541805_9_2_tpl"],
                        "经理,执行董事聘任": ["31011541805_1_tpl",
                            "31011541805_33_tpl"],
                        default: []
                        }

                        keyList.forEach(key=> {
                            let materials = config[key] || config["default"];
                            materialsPageArr.push(...materials);
                        })

                        // if (manager_zhiwei == '经理' && manager_chanshengfangshi == "股东聘任") {
                        //     materialsPageArr.push("31011541805_1_tpl");
                        //     materialsPageArr.push("31011541805_9_2_tpl");
                        // } else if (manager_zhiwei == '经理' && manager_chanshengfangshi == "执行董事聘任") {
                        //     materialsPageArr.push("31011541805_1_tpl");
                        //     materialsPageArr.push("31011541805_33_tpl");
                        // }
                    } else {
                        materialsPageArr.push("31011541805_1_tpl");
                        materialsPageArr.push("31011541805_9_3_tpl");
                    }
                } else {
                    if (dongshihui == '否') {

                        let config = {
                            "经理,股东会聘任": ["31011541805_1_tpl",
                                "31011541805_9_1_tpl"],
                            "经理,执行董事聘任": ["31011541805_1_tpl",
                                "31011541805_33_tpl"],
                            default: []
                            }

                            keyList.forEach(key=> {
                                let materials = config[key] || config["default"];
                                materialsPageArr.push(...materials);
                            })


                            // if (manager_zhiwei == '经理' && manager_chanshengfangshi == "股东会聘任") {
                            //     materialsPageArr.push("31011541805_1_tpl");
                            //     materialsPageArr.push("31011541805_9_1_tpl");
                            // } else if (manager_zhiwei == '经理' && manager_chanshengfangshi == "执行董事聘任") {
                            //     materialsPageArr.push("31011541805_1_tpl");
                            //     materialsPageArr.push("31011541805_33_tpl");
                            // }
                        } else {
                            materialsPageArr.push("31011541805_1_tpl");
                            materialsPageArr.push("31011541805_9_3_tpl");
                        }
                    }
                }
                if (wholeZhuwuString.includes('监事')) {
                    if (gudongNum == 1) {
                        if (jianshihui == '是') {

                            let config = {
                                "监事,股东任命": ["31011541805_1_tpl",
                                    "31011541805_9_2_tpl"],
                                "监事会主席,监事会选举": ["31011541805_1_tpl",
                                    "31011541805_30_tpl"],
                                "监事,职工大会选举": ["31011541805_1_tpl",
                                    "31011541805_31_tpl"],
                                "监事,职工代表大会选举": ["31011541805_1_tpl",
                                    "31011541805_32_tpl"],
                                default: []
                                }

                                keyList.forEach(key=> {
                                    let materials = config[key] || config["default"];
                                    materialsPageArr.push(...materials);
                                })



                                // if (jianshi_zhiwei == '监事' && jianshi_chanshengfangshi == "股东任命") {
                                //     materialsPageArr.push("31011541805_1_tpl");
                                //     materialsPageArr.push("31011541805_9_2_tpl");
                                // } else if (jianshi_zhiwei == '监事会主席' && jianshi_chanshengfangshi == "监事会选举") {
                                //     materialsPageArr.push("31011541805_1_tpl");
                                //     materialsPageArr.push("31011541805_30_tpl");
                                // } else if (jianshi_zhiwei == '监事' && jianshi_chanshengfangshi == "职工大会选举") {
                                //     materialsPageArr.push("31011541805_1_tpl");
                                //     materialsPageArr.push("31011541805_31_tpl");
                                // } else if (jianshi_zhiwei == '监事' && jianshi_chanshengfangshi == "职工代表大会选举") {
                                //     materialsPageArr.push("31011541805_1_tpl");
                                //     materialsPageArr.push("31011541805_32_tpl");
                                // }
                            } else {
                                materialsPageArr.push("31011541805_1_tpl");
                                materialsPageArr.push("31011541805_9_2_tpl");
                            }
                        } else {
                            if (jianshihui == "是") {
                                let config = {
                                    "监事,股东会选举": ["31011541805_1_tpl",
                                        "31011541805_9_1_tpl"],
                                    "监事会主席,监事会选举": ["31011541805_1_tpl",
                                        "31011541805_30_tpl"],
                                    "监事,职工大会选举": ["31011541805_1_tpl",
                                        "31011541805_31_tpl"],
                                    "监事,职工代表大会选举": ["31011541805_1_tpl",
                                        "31011541805_32_tpl"],
                                    default: []
                                    }

                                    keyList.forEach(key=> {
                                        let materials = config[key] || config["default"];
                                        materialsPageArr.push(...materials);
                                    })
                                    // if (jianshi_zhiwei == '监事' && jianshi_chanshengfangshi == "股东会选举") {
                                    //     materialsPageArr.push("31011541805_1_tpl");
                                    //     materialsPageArr.push("31011541805_9_1_tpl");
                                    // } else if (jianshi_zhiwei == '监事会主席' && jianshi_chanshengfangshi == "监事会选举") {
                                    //     materialsPageArr.push("31011541805_1_tpl");
                                    //     materialsPageArr.push("31011541805_30_tpl");
                                    // } else if (jianshi_zhiwei == '监事' && jianshi_chanshengfangshi == "职工大会选举") {
                                    //     materialsPageArr.push("31011541805_1_tpl");
                                    //     materialsPageArr.push("31011541805_31_tpl");
                                    // } else if (jianshi_zhiwei == '监事' && jianshi_chanshengfangshi == "职工代表大会选举") {
                                    //     materialsPageArr.push("31011541805_1_tpl");
                                    //     materialsPageArr.push("31011541805_32_tpl");
                                    // }
                                } else {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_9_1_tpl");
                                }
                            }
                        }
                        if (fact1.includes('章程')) {
                            if (gudongNum == 1) {
                                if (dongshihui == '否' && jianshihui == '否') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_7_tpl");
                                    materialsPageArr.push("31011541805_9_2_tpl");
                                } else if (dongshihui == '否' && jianshihui == '是') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_8_tpl");
                                    materialsPageArr.push("31011541805_9_2_tpl");
                                } else if (dongshihui == '是' && jianshihui == '否') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_9_tpl");
                                    materialsPageArr.push("31011541805_9_2_tpl");
                                } else if (dongshihui == '是' && jianshihui == '是') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_10_tpl");
                                    materialsPageArr.push("31011541805_9_2_tpl");
                                }
                            } else {
                                if (dongshihui == '否' && jianshihui == '否') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_3_tpl");
                                    materialsPageArr.push("31011541805_9_1_tpl");
                                } else if (dongshihui == '否' && jianshihui == '是') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_4_tpl");
                                    materialsPageArr.push("31011541805_9_1_tpl");
                                } else if (dongshihui == '是' && jianshihui == '否') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_5_tpl");
                                    materialsPageArr.push("31011541805_9_1_tpl");
                                } else if (dongshihui == '是' && jianshihui == '是') {
                                    materialsPageArr.push("31011541805_1_tpl");
                                    materialsPageArr.push("31011541805_11_6_tpl");
                                    materialsPageArr.push("31011541805_9_1_tpl");
                                }
                            }
                        }
                        return Array.from(new Set(materialsPageArr));
                    },
                    "component": "CommonMaterial",
                    "title": "材料预览页面",
                    "configType": 2,
                    "config": ["31011541805_1_tpl"],
                    "stepPagenum": 6
                }, {
                    title: '材料打印',
                    component: "LastStep",
                    "configType": 1,
                    config: [],
                }]