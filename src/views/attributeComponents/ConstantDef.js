
import Renderer,{rendererBuilder} from "./Renderer"

class ConstantDef{
    constructor(){
        this.sample = new Renderer('ElInput', '')
        this.value = new Renderer('ElInput', '')
        this.type =rendererBuilder("text","constant") 
    }
}

export default ConstantDef