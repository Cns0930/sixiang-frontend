import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class IdentityCommonDef extends CommonComponents{
    constructor(){
        super({type:"identityCommon"})
        this.component = rendererBuilder("text","IdentityCommon")
        this.$isShowRecognise = new Renderer('ElSingleCheckboxC', true,{options:[true]},"是否显示识别结果")
        this.$isZhengzhao = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否可以获取证照")
        this.span = rendererBuilder("text",24)
        this.value = rendererBuilder("text",{idPositive:"",idNagetive:""})
        this.labelWidth =  new Renderer('ElInput', '0')
        this.valueDescription = new Renderer('TextSpan', '{name:身份证名称,code:身份证号,address:身份证地址,idNagetive:身份证国徽面,idPositive:身份证人像面}',null,"value结构")
    }
    getAttributes(){
        return {
            isShowRecognise:this.$isShowRecognise.value,
            isZhengzhao:this.$isZhengzhao.value,
        }
    }
}

export default IdentityCommonDef