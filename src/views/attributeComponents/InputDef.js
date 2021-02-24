import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class InputDef extends CommonComponents{
    constructor(){
        super({type:"input"})
        this.component = rendererBuilder("text","ElInput")
        this.oninput = new Renderer("CodeEditor",`
        // value是组件改变后的值
        function(value,state,getters,siblings,parent){
            
        }`);
        this.$type = new Renderer("ElSelectC","text",{options:["text","textarea",]})
        this.$autosize = new Renderer("ElSingleCheckboxC",false,{options:[true]},'自适应高度')
        this.value = new Renderer("ElInput","",null,"默认值")
        this.disabled = new Renderer("ElSingleCheckboxC",false,{options:[true]},'不可编辑')
        this.rows = new Renderer("ElInput","4",null,"行高默认值")
    }
    getAttributes(){
        return {
            disabled: this.disabled.value,
            autosize: this.$autosize.value,
            type:this.$type.value,
            placeholder:this.placeholder.value,
            rows:this.rows.value
        }
    }
}

export default InputDef