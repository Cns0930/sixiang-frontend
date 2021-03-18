import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class OriginJingyingfanwei extends CommonComponents{
    constructor(){
        super({type:"originjingyingfanwei"})
        this.component = rendererBuilder("text","OriginJingyingfanwei")
        this.span = rendererBuilder("text",24)
        this.defalutText = new Renderer('ElInput', '请输入经营范围后缀值',null, '经营范围后缀值')
        this.value = new Renderer("ElInput","",null,"默认值")
        this.labelWidth = new Renderer('ElInput', '0')
        this.independent=rendererBuilder("text",true);
        this.$title = new Renderer('ElInput', '',null,"title")
    }
    getAttributes(){
        return {
            title: this.$title.value,
            defalutText: this.defalutText.value,
            validateFn:this.validateFn.value,
            ruleKey:this.ruleKey.value,
        }
    }
   
}

export default OriginJingyingfanwei