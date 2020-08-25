import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class InputListDef extends CommonComponents{
    constructor(){
        super({type:"inputList"})
        // this.value = rendererBuilder("text",["",""]);
        this.value = new Renderer("InputArray",[""],{});
        this.component = rendererBuilder("text","InputList")
    }
    
}

export default InputListDef