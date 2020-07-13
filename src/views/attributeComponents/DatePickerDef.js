import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class DatePickerDef extends CommonComponents{
    constructor(){
        super({type:"datePicker"})

        this.options = new Renderer("TextAreaArray",[],{})

        this.component = rendererBuilder("text","ElCheckboxC")

        this.value = rendererBuilder("text",[]) 
    }
}

export default DatePickerDef