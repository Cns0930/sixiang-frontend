import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class QingxingCheckboxDef extends CommonComponents{
    constructor(){
        super({type:"qingxingCheckbox"})

        this.options = new Renderer("InputArray",[""],{})

        this.component = rendererBuilder("text","ElCheckboxC")

        this.value = rendererBuilder("text",[]) 
    }
    getAttributes(){
        return {
            options:this.options.value
        }
    }
}

export default QingxingCheckboxDef