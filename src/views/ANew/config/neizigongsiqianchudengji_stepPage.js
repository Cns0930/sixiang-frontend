import dayjs from "dayjs"
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
    "config": ["companyName"],
    "stepPagenum": 3
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "BusinessFormPage",
    "title": "迁出信息录入",
    "configType": 1,
    "config": ["1_2",
        "registeredAddress",
        "1_5",
        "detail_address1",
        "1_6",
        "detail_address2",
        "1_8",
        "1_9"],
    "stepPagenum": 4
}, {
    "configFn": function config(state, getters) {
        return []
    },
    "component": "IdCardInfo",
    "useBeforeEnter":true,
    "beforeEnterFn":function beforeEnter(state, getters) {

        let date = new Date();
        
        console.log("date",date);
        let start = dayjs(date).format("YYYY年MM月DD日");
        console.log("start",start);
        date = date.setDate(date.getDate() + 90);
        
        let end = dayjs(date).format("YYYY年MM月DD日")
        state['2_10'].value = [start,
        end];
        
        },
    "title": "经办人信息确认",
    "configType": 1,
    "config": ["jingbanrenIdentity",
        "mobile",
        "jingbanren_phone",
        "2_10"],
    "stepPagenum": 5
}, {
    "configFn": function config(state, getters) {
        return ['31011542701_1_tpl',
            '31011542701_2_tpl']
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
