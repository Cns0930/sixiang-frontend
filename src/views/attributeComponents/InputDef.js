import CommonComponents from "./CommonComponents"
import {rendererBuilder} from "./Renderer"
class InputDef extends CommonComponents{
    constructor(){
        super({type:"input"})
        this.component = rendererBuilder("text","ElInput")
    }
}

export default InputDef