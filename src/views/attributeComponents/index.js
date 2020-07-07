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
    "computed": ComputedDef

}
export function getMapping() {
    return mapping
}


export function deserializeBaseField(fieldJSON) {

    let componentDefs = fieldJSON.componentDefs
    let actualComponentDefs = new defs[fieldJSON.type]();
    Object.keys(actualComponentDefs).forEach(key => {
        actualComponentDefs[key].value = componentDefs[key].value
    })
    

    let output = {
        id:fieldJSON.id,
        fieldNo: fieldJSON.fieldNo,
        type: fieldJSON.type,
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
        label: fieldJSON.label,
        componentDefs:actualComponentDefs
    }
    return output

}

export default mapping