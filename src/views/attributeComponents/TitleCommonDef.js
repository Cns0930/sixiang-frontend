import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TitleCommonDef{
    constructor(){
        this.type = rendererBuilder("text","titleCommon") 
        this.component = rendererBuilder("text","TitleCommon")
        this.value = new Renderer("text",false)
        this.titles = new Renderer('ElInput', '')
        this.isOneTitle = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否一级标题")
        this.isTwoTitle = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否二级标题")

    }
    getAttributes(){
        return {
            titles:this.titles.value,
            isOneTitle:this.$isOneTitle.value,
            isTwoTitle:this.$isTwoTitle.value
            // ifRead:this.$ifRead.value,
        }
    }
}

export default TitleCommonDef