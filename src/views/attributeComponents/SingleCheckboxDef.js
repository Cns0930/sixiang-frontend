import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class SingleCheckboxDef extends CommonComponents{
    constructor(){
        super({type:"checkbox"})
        this.component = rendererBuilder("text","ElSingleCheckboxC")
        this.value = new Renderer('ElSingleCheckboxC',false,{options:[true]})
    }
}

export default SingleCheckboxDef