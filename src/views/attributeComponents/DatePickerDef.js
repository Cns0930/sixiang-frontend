import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class DatePickerDef extends CommonComponents{
    constructor(){
        super({type:"datePicker"})

        this.$format = new Renderer("ElInput","yyyy年MM月dd日")
        this.$type = new Renderer("ElSelectC","date",{options:["year","month","date","dates","week","datetime"]})
      
        this.$valueFormat = new Renderer("ElInput","yyyy年MM月dd日")
        this.component = rendererBuilder("text","ElDatePicker")

        this.value = rendererBuilder("text","") 
        this.disabled =  new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否禁用")
    }
    getAttributes(){
        return {
            type:this.$type.value,
            format:this.$format.value,
            valueFormat:this.$valueFormat.value || undefined,
            placeholder:"请输入内容",
            disabled: this.disabled.value
        }
    }
}

export default DatePickerDef