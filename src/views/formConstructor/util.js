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