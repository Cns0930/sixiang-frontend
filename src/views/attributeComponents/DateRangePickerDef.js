import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class DatePickerDef extends CommonComponents{
    constructor(){
        super({type:"dateRangePicker"})

        this.$format = new Renderer("ElInput","yyyy年MM月dd日")
        this.$type = new Renderer("ElSelectC","",{options:["datetimerange","daterange","monthrange"]})
        this.$rangeSeparator = new Renderer("ElInput","至")
        this.$valueFormat = new Renderer("ElInput","yyyy年MM月dd日")
        this.component = rendererBuilder("text","ElDatePicker")

        this.value = rendererBuilder("text",[]) 
    }
    getAttributes(){
        return {
            type:this.$type.value,
            format:this.$format.value,
            rangeSeparator:this.$rangeSeparator.value,
            valueFormat:this.$valueFormat.value || undefined,
            placeholder:"请输入内容"
        }
    }
}

export default DatePickerDef