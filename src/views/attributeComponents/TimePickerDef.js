import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TimePickerDef extends CommonComponents{
    constructor(){
        super({type:"timePicker"})

        this.$format = new Renderer("ElInput","HH时mm分ss秒")
        this.$isRange = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否展示时间范围")
      
        this.$valueFormat = new Renderer("ElInput","HH时mm分ss秒")
        this.$rangeSeparator = new Renderer("ElInput","至")
        this.component = rendererBuilder("text","ElTimePicker")

        this.value = rendererBuilder("text","") 
        this.disabled = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否禁用")
    }
    getAttributes(){
        return {
            isRange:this.$isRange.value,
            format:this.$format.value,
            rangeSeparator:this.$rangeSeparator.value,
            valueFormat:this.$valueFormat.value || undefined,
            placeholder:this.placeholder.value,
            // placeholder:"请输入内容",
            disabled: this.disabled.value
        }
    }
}

export default TimePickerDef