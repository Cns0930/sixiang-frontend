import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class SelectDef extends CommonComponents{
    constructor(){
        super({type:"select"})

        this.options = new Renderer("InputArrayAndCodeEditor",[""],{})

        this.component = rendererBuilder("text","ElSelectC")
        this.value = new Renderer("ElInput","")
        this.disabled = new Renderer("ElSingleCheckboxC",false,{options:[true]},'不可编辑')
        
    }
    getAttributes(){
        
        return {
            disabled: this.disabled.value,
            options:this.options.value,
            placeholder:"请输入内容"
        }
    }
}

export default SelectDef