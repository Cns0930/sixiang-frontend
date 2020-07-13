import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
import DatePickerDef from "./DatePickerDef"
import RadioDef from "./RadioDef"
import defs from "@/views/attributeComponents/index"


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
    {label:"合成属性",value:"computed",componentDef:ComputedDef},
]

export function getMapping() {
    return mapping
}


export function deserializeBaseField(fieldJSON) {

    // console.log("===fieldJSON===")
    // console.log(fieldJSON)

    let componentDefs = fieldJSON.componentDefs
    let ComponentDefClass = defs.find(v=>v.value == fieldJSON.type)?.componentDef
    let actualComponentDefs = new ComponentDefClass();
    Object.keys(actualComponentDefs).forEach(key => {
        console.log(key,componentDefs[key])
        actualComponentDefs[key].value = componentDefs[key]?.value 
    })
    

    let output = {
        id:fieldJSON.id,
        fieldNo: fieldJSON.fieldNo,
        type: fieldJSON.type,
        fieldType: 1,
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
        console.log(key,actualComponentDefs[key])
        actualComponentDefs[key].value = componentDefs[key]?.value
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
    console.log(fieldJSON)
    // type为1或2时分别调用其他方法
    if(fieldJSON.fieldType == 1){
        return deserializeBaseField(fieldJSON)
    }
    if(fieldJSON.fieldType == 2){
        return deserializeComputedField(fieldJSON)
    }
}

export default mapping