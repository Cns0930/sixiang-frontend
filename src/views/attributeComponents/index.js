import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
let mapping = {

    "input":InputDef,
    "select":SelectDef,
    "qingxingCheckbox":QingxingCheckboxDef,
    "computed":ComputedDef
    
}
export function getMapping(){
    return mapping
}
export default mapping