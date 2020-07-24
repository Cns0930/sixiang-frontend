
import Renderer,{rendererBuilder} from "./Renderer"
class GudongCommon {
    constructor(){
        
        this.type = rendererBuilder("text","gudongCommon") 
        this.component = rendererBuilder("text","GudongCommon")
        this.value = new Renderer("text",[])
        this.meta=new Renderer("text",[])
        this.gudongNameFieldNo = new Renderer('ElInput', '')
        this.gudongCodeFieldNo = new Renderer('ElInput', '')
    }
    getAttributes(meta){
        
        return {
            children:[meta],
            meta,
            gudongNameFieldNo:this.gudongNameFieldNo.value,
            gudongCodeFieldNo:this.gudongCodeFieldNo.value,
        }
    }
}

export default GudongCommon