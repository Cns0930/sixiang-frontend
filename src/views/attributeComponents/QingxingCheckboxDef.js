import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class QingxingCheckboxDef extends CommonComponents{
    constructor(){
        super({type:"select"})

        this.options = new Renderer("TextAreaArray",[],{})

        this.component = rendererBuilder("text","ElCheckboxC")

        this.value = rendererBuilder("text",[]) 
    }
}

export default QingxingCheckboxDef