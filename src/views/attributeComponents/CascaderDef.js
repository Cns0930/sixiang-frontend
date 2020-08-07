import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class CascaderDef extends CommonComponents{
    constructor(){
        super({type:"cascader"})

        this.options = new Renderer("CodeEditor","");

        this.component = rendererBuilder("text","ElCascader")
        this.value = new Renderer("text",[])
    }
    getAttributes(){
        return {
            options:eval(`${this.options.value}`),
            placeholder:"请输入内容"
        }
    }
}

export default CascaderDef