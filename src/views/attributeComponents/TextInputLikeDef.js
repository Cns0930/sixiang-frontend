import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TextInputLikeDef extends CommonComponents{
    constructor(){
        super({type:"text"})
        this.component = rendererBuilder("text","TextInputLike")
        this.value = new Renderer("ElInput","")
        
    }
}

export default TextInputLikeDef