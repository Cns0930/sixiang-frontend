import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TipsCommonDef extends CommonComponents{
    constructor(){
        super({type:"tipscommon"})
        this.component = rendererBuilder("text","Tipscommon")
        this.value = rendererBuilder("text",'123')
        // this.$ifRead = new Renderer('ElSingleCheckboxC', true,{options:[true]},"是否已阅读")

    }
    getAttributes(){
        return {
            // ifRead:this.$ifRead.value,
        }
    }
}

export default TipsCommonDef