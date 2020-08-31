import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class JingyingfanweiDef extends CommonComponents{
    constructor(){
        super({type:"jingyingfanwei"})
        this.component = rendererBuilder("text","Jingyingfanwei")
        this.span = rendererBuilder("text",24)
        this.value = rendererBuilder("text",{jingyingfanwei:{value:"",htmlValue:"",textArray:[]},addList:[{ fanwei: { value: "" }, shixiang: { value: "",options:[] } }]})
        this.labelWidth =  new Renderer('ElInput', '0')
        this.independent=rendererBuilder("text",true);
        this.$title = new Renderer('ElInput', '',null,"title")
    }
    getAttributes(){
        return {
            title: this.$title.value,
            validateFn:this.validateFn.value,
            ruleKey:this.ruleKey.value,
        }
    }
   
}

export default JingyingfanweiDef