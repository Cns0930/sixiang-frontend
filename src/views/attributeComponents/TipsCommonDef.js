import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TipsCommonDef extends CommonComponents{
    constructor(){
        super({type:"tipsCommon"})
        this.component = rendererBuilder("text","TipsCommon")
        this.value=new Renderer("ElSelectC","否",{options:['是','否']},"是否申报住所")
        this.msg = new Renderer("ElInput","")

    }
    getAttributes(){
        return {
            msg:this.msg.value
        }
    }
}

export default TipsCommonDef