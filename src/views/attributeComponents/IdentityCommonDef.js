import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class IdentityCommonDef extends CommonComponents{
    constructor(){
        super({type:"identityCommon"})
        this.component = rendererBuilder("text","IdentityCommon")
        this.$isShowRecognise = new Renderer('ElSingleCheckboxC', true,{options:[true]})
        this.span = rendererBuilder("text",24)
        this.value = rendererBuilder("text",{idPositive:"",idNagetive:""})
        this.labelWidth =  new Renderer('ElInput', '0')
        this.valueDescription = new Renderer('textSpan', '{name:身份证名称,code:身份证号,address:身份证地址,idNagetive:身份证国徽面,idPositive:身份证人像面}',null,"value结构")
    }
    getAttributes(){
        return {
            isShowRecognise:this.$isShowRecognise.value,
        }
    }
}

export default IdentityCommonDef