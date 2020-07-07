import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
import RadioDef from "./RadioDef"
let mapping = {

    "input":InputDef,
    "select":SelectDef,
    "qingxingCheckbox":QingxingCheckboxDef,
    "radio":RadioDef,
    "computed":ComputedDef
    
}
export function getMapping(){
    return mapping
}
export default mapping