import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TitleCommonDef{
    constructor(){
        this.type = rendererBuilder("text","titleCommon") 
        this.component = rendererBuilder("text","TitleCommon")
        this.value = new Renderer("text",false)
        this.titles = new Renderer('ElInput', '')
        this.span = rendererBuilder("text",24)
        this.independent=rendererBuilder("text",true);
        this.isWhichTitle=new Renderer("ElSelectC","一级标题",{options:['一级标题','二级标题']},"选择标题级别")
    }
    getAttributes(){
        return {
            titles:this.titles.value,
            isWhichTitle:this.isWhichTitle.value,
        }
    }
}

export default TitleCommonDef