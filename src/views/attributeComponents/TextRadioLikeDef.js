import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class TextRadioLikeDef extends CommonComponents{
    constructor(){
        super({type:"textRadioLike"})
        this.component = rendererBuilder("text","TextRadioLike")
        this.value = new Renderer("ElInput","")
        this.tipName = new Renderer('ElInput', '符合', null, "条件预检展示名称")
    }
    getAttributes(){
        return {
            tipName:this.tipName.value,
        }
    }
}

export default TextRadioLikeDef