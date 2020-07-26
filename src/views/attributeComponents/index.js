import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
import DatePickerDef from "./DatePickerDef"
import RadioDef from "./RadioDef"
import ConstantDef from "./ConstantDef"
import IdentityCommonDef from "./IdentityCommonDef.js"
import InputListDef from "./InputListDef"
import DateRangePickerDef from "./DateRangePickerDef"
import CollectionDef from "./CollectionDef"
import GudongCommonDef from "./GudongCommonDef"
import TextInputLikeDef from "./TextInputLikeDef"
import ChuzifangshiDef from "./ChuzifangshiDef"
// {

//     "input": InputDef,
//     "select": SelectDef,
//     "qingxingCheckbox": QingxingCheckboxDef,
//     "radio": RadioDef,
//     "datePicker": DatePickerDef,
//     "computed": ComputedDef

// }
let mapping = [
    {label:"文本",value:"text",componentDef:TextInputLikeDef,isList:false},
    {label:"输入框",value:"input",componentDef:InputDef,isList:false},
    {label:"输入框组",value:"inputList",componentDef:InputListDef,isList:false},
    {label:"下拉选择",value:"select",componentDef:SelectDef,isList:false},
    {label:"情形多选",value:"qingxingCheckbox",componentDef:QingxingCheckboxDef,isList:false},
    {label:"单选",value:"radio",componentDef:RadioDef,isList:false},
    {label:"日期选择",value:"datePicker",componentDef:DatePickerDef,isList:false},
    {label:"日期范围选择",value:"dateRangePicker",componentDef:DateRangePickerDef,isList:false},
    {label:"集合",value:"collection",componentDef:CollectionDef,isList:true},
    {label:"身份证扫描组件",value:"identityCommon",componentDef:IdentityCommonDef,isList:false},
    {label:"股东集合",value:"gudongCommon",componentDef:GudongCommonDef,isList:true},
    {label:"出资方式",value:"chuzifangshi",componentDef:ChuzifangshiDef,isList:false},
    {label:"合成属性",value:"computed",componentDef:ComputedDef,isList:false},
    {label:"常量",value:"constant",componentDef:ConstantDef,isList:false},
]

export function getMapping() {
    return mapping
}


export function deserializeBaseField(fieldJSON) {

    // console.log("===fieldJSON===")
    // console.log(fieldJSON)

    let componentDefs = fieldJSON.componentDefs
    let ComponentDefClass = mapping.find(v=>v.value == fieldJSON.type)?.componentDef
   
    let actualComponentDefs = new ComponentDefClass();
    Object.keys(actualComponentDefs).forEach(key => {
        if(componentDefs[key]){
            actualComponentDefs[key].value = componentDefs[key].value
        }
        
    })
    

    let output = {
        id:fieldJSON.id,
        fieldNo: fieldJSON.fieldNo,
        type: fieldJSON.type,
        fieldType: fieldJSON.fieldType,
        isList:fieldJSON.isList,
        label: fieldJSON.label,
        componentDefs: actualComponentDefs
    }

    return output


}

export function deserializeComputedField(fieldJSON){
    
    let componentDefs = fieldJSON.componentDefs
    let actualComponentDefs = new ComputedDef();
    Object.keys(actualComponentDefs).forEach(key => {
        if(componentDefs[key]){
            actualComponentDefs[key].value = componentDefs[key].value
        }
        
    })


    let output = {
        id:fieldJSON.id,
        fieldNo: fieldJSON.fieldNo,
        type: fieldJSON.type,
        fieldType: 2,
        // fieldTypeCn: "合成字段",
        label: fieldJSON.label,
        componentDefs:actualComponentDefs
    }
    return output

}

export function deserializeTableData(fieldJSON){
    // console.log(fieldJSON)
    // type为1或2时分别调用其他方法
    if(fieldJSON.fieldType == 1){
      
        
        let output = deserializeBaseField(fieldJSON)
        
        // 处理子项
        if(fieldJSON.children != null){
           
            let children = fieldJSON.children.map(v => ({ id: v.id, fieldType: v.fieldType, ...v.object })).map(deserializeBaseField)
            output.componentDefs.meta.value = children
            output.list =children;
        }
       
        return output
    }
    if(fieldJSON.fieldType == 2){
        return deserializeComputedField(fieldJSON)
    }
}

export default mapping