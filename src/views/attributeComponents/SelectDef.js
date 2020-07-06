import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class SelectDef extends CommonComponents{
    constructor(){
        super({type:"select"})

        this.options = new Renderer("TextAreaArray",[],{})

        this.component = rendererBuilder("text","ElSelectC")
    }
}

export default SelectDef