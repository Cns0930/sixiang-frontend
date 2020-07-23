import _ from "lodash"
import dayjs from "dayjs"
export const  mergeFieldAttr = (result, item) => {
    let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
    let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo }, attrObj)
    result[item.fieldNo] = mergeObj;
    return result;
}

export const utils={
    _,
    dayjs
}
// getter方法 string -> function  ——预览
export function   functionReviverGettersRuntime(value,tag) {
          
    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {
           
            return new Function("state","getters" ,`
           
            with(this){
                try{
                    
                    
                    ${match[1]}
                }catch(e){
                    console.warn("错误",'${tag}')
                    console.warn(e)
                    return null;
                }
                
                }`).bind({ _, dayjs });
        }
    }
    return value;
}
// 事件方法 string -> function  ——预览
export function   functionReviverEventRuntime(value,tag) {
          
    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {
           
            return new Function("value","state","getters" ,`
           
            with(this){
                try{
                    
                    
                    ${match[1]}
                }catch(e){
                    console.warn("错误",'${tag}')
                    console.warn(e)
                    return null;
                }
                
                }`).bind({ _, dayjs });
        }
    }
    return value;
}
// 事件方法 string -> function  ——输出
export function   functionReviverEventBundle(value,tag,key) {
          
    if (typeof value === 'string') {
        var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
            match = value.match(rfunc);

        if (match) {
           
            return new Function("value","state","getters" ,`
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

// 将 定义def对象转为配置对象
export function convertDefToConfigEventRuntime(fields,metaName="meta",childrenName="children"){
    return fields.reduce((result, item) => {
                
        let attrObj = _.mapValues(item.componentDefs, function (o,key) { 
            if(key == metaName){
                let convertResult = convertDefToConfigEventRuntime(o.value)

                return convertResult
            }
            return functionReviverEventRuntime(o.value) 
        });
        
        let mergeObj = _.merge(
            { label: item.label, fieldNo: item.fieldNo,isList:item.isList },
            attrObj, { attributes: item.componentDefs.getAttributes ? item.componentDefs.getAttributes(attrObj[metaName]) || {} : {} }
        );

        if(mergeObj.meta){
      
            Object.defineProperty(mergeObj,"value",{
                get: function () {
                  
                    return mergeObj.attributes.children.map(v=>_.mapValues(v,o=>o.value))
                  },
            })
        }


        result[item.fieldNo] = mergeObj;
        return result;
    }, {});
    
}