import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class SelectDef extends CommonComponents{
    constructor(){
        super({type:"select"})

        this.options = new Renderer("InputArray",[""],{})

        this.component = rendererBuilder("text","ElSelectC")
    }
    getAttributes(){
        return {
            options:this.options.value,
            placeholder:"请输入内容"
        }
    }
}

export default SelectDef