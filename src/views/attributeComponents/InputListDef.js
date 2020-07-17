import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class InputListDef extends CommonComponents{
    constructor(){
        super({type:"inputList"})
        this.value = rendererBuilder("text",[""]);
        this.component = rendererBuilder("text","InputList")
    }
    
}

export default InputListDef