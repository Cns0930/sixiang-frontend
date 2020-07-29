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
        this.$type = new Renderer("ElSelectC","text",{options:["text","textarea",]})
        this.value = new Renderer("ElInput","",null,"默认值")
    }
    getAttributes(){
        return {
            type:this.$type.value,
            placeholder:"请输入内容"
        }
    }
}

export default InputDef