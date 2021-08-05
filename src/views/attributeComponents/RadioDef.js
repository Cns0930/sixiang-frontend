import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class RadioDef extends CommonComponents{
    constructor(){
        super({type:"radio"})
        this.options = new Renderer("InputArray",[""],{})
        this.component = rendererBuilder("text","ElRadioC")
        this.value = new Renderer("ElInput","")
    }
    getAttributes(){
        return {
            options:this.options.value
        }
    }
}

export default RadioDef