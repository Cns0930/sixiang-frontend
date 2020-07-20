import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class InputDef extends CommonComponents{
    constructor(){
        super({type:"input"})
        this.component = rendererBuilder("text","ElInput")
        this.oninput = new Renderer("CodeEditor",`
        // value是组件改变后的值
        function(value,state,getters){
            
        }`);
    }
}

export default InputDef