import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TipsCommonDef extends CommonComponents{
    constructor(){
        super({type:"tipscommon"})
        this.component = rendererBuilder("text","TipsCommon")
        this.value = new Renderer("text",false)
        this.msg = new Renderer("ElInput","")

    }
    getAttributes(){
        return {
            msg:this.msg.value
        }
    }
}

export default TipsCommonDef