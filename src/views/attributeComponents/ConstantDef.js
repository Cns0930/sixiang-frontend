
import Renderer,{rendererBuilder} from "./Renderer"

class ConstantDef{
    constructor(){
        this.sample = new Renderer('ElInput', 'sample_ConC')
        this.value = new Renderer('ElInput', '')
        this.type =rendererBuilder("text","constant") 
    }
}

export default ConstantDef