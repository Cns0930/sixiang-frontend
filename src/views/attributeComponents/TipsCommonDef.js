import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TipsCommonDef extends CommonComponents{
    constructor(){
        super({type:"tipsCommon"})
        this.component = rendererBuilder("text","TipsCommon")
        this.value=new Renderer("ElInput","否")
        this.msg = new Renderer("ElInput","")

    }
    getAttributes(){
        return {
            msg:this.msg.value
        }
    }
}

export default TipsCommonDef