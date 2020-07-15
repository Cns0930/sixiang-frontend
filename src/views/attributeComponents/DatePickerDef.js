import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class DatePickerDef extends CommonComponents{
    constructor(){
        super({type:"datePicker"})

        this.$format = new Renderer("ElInput","yyyy年MM月DD日")
        this.$type = new Renderer("ElSelectC","",{options:["year","month","date","dates","week","datetime","datetimerange","daterange","monthrange"]})
        this.$rangeSeparator = new Renderer("ElInput","至")
        this.component = rendererBuilder("text","ElDatePicker")

        this.value = rendererBuilder("text",[]) 
    }
    getAttributes(){
        return {
            type:this.$type.value,
            format:this.$format.value,
            rangeSeparator:this.$rangeSeparator.value,
            placeholder:"请输入内容"
        }
    }
}

export default DatePickerDef