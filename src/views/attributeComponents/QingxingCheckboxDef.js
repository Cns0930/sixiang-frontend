import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class QingxingCheckboxDef extends CommonComponents{
    constructor(){
        super({type:"qingxingCheckbox"})

        this.options = new Renderer("TextAreaArray",[],{})

        this.component = rendererBuilder("text","InputList")

        this.value = rendererBuilder("text",[]) 
    }
    getAttributes(){
        return {
            options:this.options.value
        }
    }
}

export default QingxingCheckboxDef