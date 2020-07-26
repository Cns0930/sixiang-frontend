import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class ChuzifangshiDef extends CommonComponents{
    constructor(){
        super({type:"chuzifangshi"})
        this.component = rendererBuilder("text","Chuzifangshi")
        this.span = rendererBuilder("text",24)
        this.value = rendererBuilder("text","货币")
    }
}

export default ChuzifangshiDef