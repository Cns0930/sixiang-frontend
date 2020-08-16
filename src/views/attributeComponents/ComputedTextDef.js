import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"


class ComputedTextDef extends CommonComponents{
    constructor(){
        super({type:"computedText"})
        this.sample = new Renderer('ElInput', '',null,"样例值")
        this.source = new Renderer('ElInput', '',null,"来源描述")
        this.getter = new Renderer("CodeEditor",`
        // value 是组件对象； value.value 是组件的计算值，不要使用它
        function(value,state,getters,siblings,parent){
            return ""
        }`,null,"getter方法");
        this.remark = new Renderer('ElInput', '',null,"备注")
        this.value = rendererBuilder("text","");
        this.component = rendererBuilder("text","TextInputLike")
    }
}

export default ComputedTextDef