import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TipsCommonDef extends CommonComponents{
    constructor(){
        super({type:"tipscommon"})
        this.component = rendererBuilder("text","Tipscommon")
        this.value = new Renderer("text",false)
        this.msg = new Renderer("textarea","")

    }
    getAttributes(){
        return {
            msg:this.$msg.value
            // ifRead:this.$ifRead.value,
        }
    }
}

export default TipsCommonDef