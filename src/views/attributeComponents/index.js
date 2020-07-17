import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
import DatePickerDef from "./DatePickerDef"
import RadioDef from "./RadioDef"
import ConstantDef from "./ConstantDef"
import IdentityCommonDef from "./IdentityCommonDef.js"

// {

//     "input": InputDef,
//     "select": SelectDef,
//     "qingxingCheckbox": QingxingCheckboxDef,
//     "radio": RadioDef,
//     "datePicker": DatePickerDef,
//     "computed": ComputedDef

// }
let mapping = [
    {label:"输入框",value:"input",componentDef:InputDef},
    {label:"下拉选择",value:"select",componentDef:SelectDef},
    {label:"情形多选",value:"qingxingCheckbox",componentDef:QingxingCheckboxDef},
    {label:"单选",value:"radio",componentDef:RadioDef},
    {label:"日期选择",value:"datePicker",componentDef:DatePickerDef},
    {label:"身份证扫描组件",value:"identityCommon",componentDef:IdentityCommonDef},
    {label:"合成属性",value:"computed",componentDef:ComputedDef},
    {label:"常量",value:"constant",componentDef:ConstantDef},
]

export function getMapping() {
    return mapping
}


export function deserializeBaseField(fieldJSON) {

    // console.log("===fieldJSON===")
    // console.log(fieldJSON)

    let componentDefs = fieldJSON.componentDefs
    let ComponentDefClass = mapping.find(v=>v.value == fieldJSON.type)?.componentDef
   
    if(!ComponentDefClass){
        console.log(fieldJSON)
    }
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
        // fieldTypeCn: "基础字段",
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
            output.children = fieldJSON.children.map(v => ({ id: v.id, fieldType: v.fieldType, ...v.object })).map(deserializeBaseField)
        }
       
        return output
    }
    if(fieldJSON.fieldType == 2){
        return deserializeComputedField(fieldJSON)
    }
}

export default mapping