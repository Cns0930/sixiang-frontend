import _ from "lodash"
import dayjs from "dayjs"
import state from "@/vuex/home/state";
import helper from "@/utils/function"
import Vue from "vue"

export const mergeFieldAttr = (result, item) => {
    let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
    let mergeObj = _.merge({
        label: item.label,
        fieldNo: item.fieldNo
    }, attrObj)
    result[item.fieldNo] = mergeObj;
    return result;
}

export const utils = {
    _,
    dayjs
}
// 常用 string 转function  ——输出
export function functionReviverBundle(value, tag) {

    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {
            if (!match[1].trim()) return new Function();
            return new Function("state", "getters", `
             try{
                    ${match[1]}
                }catch(e){
                    console.warn("错误",'${tag}')
                    console.warn(e)
                    return null;
                }
            `);
        }
    }
    return value;
}

// 事件方法 string 转function  ——输出
export function functionReviverEventBundle(value, tag, key) {

    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {
            if (!match[1].trim()) return new Function();
            return new Function("value", "state", "getters", "siblings", "parent", `
            try{
                    ${match[1]}
                }catch(e){
                    console.warn("错误",'${tag}','${key}')
                    console.warn(e)
                    return null;
                }`);
        }
    }
    return value;
}



// 常用方法(或者其他不需要额外参数的方法) string -> function  ——预览
export function functionReviverRuntime(value, tag) {

    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {

            return new Function("state", "getters", `
           
            with(this){
                try{
                    ${match[1]}
                }catch(e){
                    console.warn("错误",'${tag}')
                    console.warn(e)
                    return null;
                }
                
                }`).bind({
                _,
                dayjs,
                helper
            });
        }
    }
    return value;
}
// 事件方法 string -> function  ——预览 onchange, 以及validateFn 用这个
export function functionReviverEventRuntime(value, tag, key) {

    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {
            try {
                return new Function("value", "state", "getters", "siblings", "parent", `
           
            with(this){
                try{
                    ${match[1]}
                }catch(e){
                    console.warn("错误",'${tag}')
                    console.warn(e)
                    return null;
                }
                
                }`).bind({
                    _,
                    dayjs,
                    helper
                });
            } catch (e) {
                console.warn("错误代码：function body"+match[1])
                console.warn(e)
            }

        }
    }
    return value;
}



// 将 定义def对象转为配置对象
export function convertDefToConfigEventRuntime(fields, metaName = "meta", childrenName = "children", ) {
    let state = fields.reduce((result, item) => {

        let attrObj = _.mapValues(item.componentDefs, function (o, key) {
            if (key == metaName) {
                let convertResult = convertDefToConfigEventRuntime(o.value)

                return convertResult
            }

            return functionReviverEventRuntime(o.value, item.fieldNo, key)
        });

        let mergeObj = _.merge({
                label: item.label,
                fieldNo: item.fieldNo,
                isList: item.isList
            },
            attrObj, {
                attributes: item.componentDefs.getAttributes ? _.mapValues(item.componentDefs.getAttributes(attrObj[metaName]), function (o, k) {
                    return functionReviverRuntime(o, item.fieldNo)
                }) : {}
            }
        );

        // if (mergeObj.meta) {
        //     mergeObj.attributes.children.forEach(child=>{

        //         Object.values(child).forEach(comp=>{

        //             if(comp.type=="computedText"){
        //                 console.log(comp)
        //                 Object.defineProperty(comp,"value",{
        //                     get:comp.getter.bind(null,mergeObj.attributes.children)
        //                 })

        //             }
        //         })
        //     })

        // }


        result[item.fieldNo] = mergeObj;
        return result;
    }, {});
    // 对state中的计算属性进行处理
    _.forEach(state, function (value, key) {
        if (value.meta) {



            Object.defineProperty(value, "value", {
                set: function (list) {

                    value.attributes.children = [];
                    list.forEach(obj => {
                        let child = _.cloneDeep(value.meta);
                        Object.keys(obj).forEach(key => {
                            if (!child[key]) return;

                            if (child[key].type == "computedText") return;


                            child[key].value = obj[key]



                        })
                        Object.values(child).forEach(comp => {

                            if (comp.type == "computedText") {

                                Object.defineProperty(comp, "value", {
                                    get: comp.getter.bind(null, comp, state, null, child, value.attributes.children),
                                })

                            }
                        })


                        value.attributes.children.push(child)
                    })
                },
                get: function () {

                    let result = value.attributes.children.map(v => _.mapValues(v, o => o.value))

                    return result
                },
            })
        }

    })

    return state;
}

// 将 定义def对象转为配置对象 ——输出
export function convertDefToConfigBundle(fields, metaName = "meta", childrenName = "children") {
    return fields.reduce((result, item) => {

        let attrObj = _.mapValues(item.componentDefs, function (o, key) {
            if (key == metaName) {
                let convertResult = convertDefToConfigBundle(o.value)

                return convertResult
            }
            return functionReviverEventBundle(o.value, item.fieldNo, key)
        });

        let mergeObj = _.merge({
                label: item.label,
                fieldNo: item.fieldNo,
                isList: item.isList
            },
            attrObj, {
                attributes: item.componentDefs.getAttributes ? _.mapValues(item.componentDefs.getAttributes(attrObj[metaName]), function (o, k) {
                    return functionReviverBundle(o, item.fieldNo)
                }) : {}
            }
        );

        result[item.fieldNo] = mergeObj;
        return result;
    }, {});

}