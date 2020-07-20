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