import CommonComponents from "./CommonComponents"
import {rendererBuilder} from "./Renderer"
class IdentityCommonDef extends CommonComponents{
    constructor(){
        super({type:"identityCommon"})
        this.component = rendererBuilder("text","IdentityCommonDef")
        this.$isShowRecognise = new Renderer('isShowRecognise', true,{options:[true]})
        this.span = rendererBuilder("text",24)
    }
    getAttributes(){
        return {
            isShowRecognise:this.$isShowRecognise
        }
    }
}

export default IdentityCommonDef