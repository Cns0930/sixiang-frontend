import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
import RadioDef from "./RadioDef"
import defs from "@/views/attributeComponents/index"
let mapping = {

    "input": InputDef,
    "select": SelectDef,
    "qingxingCheckbox": QingxingCheckboxDef,
    "radio": RadioDef,
    "datePicker": DatePickerDef,
    "computed": ComputedDef

}
export function getMapping() {
    return mapping
}


export function deserializeBaseField(fieldJSON) {

    console.log("===fieldJSON===")
    console.log(fieldJSON)

    let componentDefs = fieldJSON.componentDefs
    let actualComponentDefs = new defs[fieldJSON.type]();
    Object.keys(actualComponentDefs).forEach(key => {
        actualComponentDefs[key].value = componentDefs[key].value
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
    let actualComponentDefs = new defs["computed"]();
    Object.keys(actualComponentDefs).forEach(key => {
        actualComponentDefs[key].value = componentDefs[key].value
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

}

export default mapping