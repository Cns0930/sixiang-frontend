import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class JingyingqixianDef extends CommonComponents{
    constructor(){
        super({type:"jingyingqixian"})
        this.component = rendererBuilder("text","Jingyingqixian")
        this.span = rendererBuilder("text",24)
        this.value = rendererBuilder("text","")
        this.independent=rendererBuilder("text",true);
    }
   
}

export default JingyingqixianDef