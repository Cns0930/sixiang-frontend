import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class RadioDef extends CommonComponents{
    constructor(){
        super({type:"radio"})
        this.options = new Renderer("TextAreaArray",[],{})
        this.component = rendererBuilder("text","ElRadioC")
    }
    getAttributes(){
        return {
            options:this.options.value
        }
    }
}

export default RadioDef