
import Renderer,{rendererBuilder} from "./Renderer"
class GudongCommon {
    constructor(){
        
        this.type = rendererBuilder("text","gudongCommon") 
        this.component = rendererBuilder("text","GudongCommon",null,"组件")
        this.value = new Renderer("text",[])
        this.meta=new Renderer("text",[])
        this.labelFieldNo = new Renderer('ElInput', '',null,"tab标签的fieldNo")
        this.gudongNameFieldNo = new Renderer('ElInput', '',null,"股东名称的fieldNo")
        this.gudongCodeFieldNo = new Renderer('ElInput', '',null,"股东代码的fieldNo")
    }
    getAttributes(meta){
        
        return {
            children:[meta],
            meta,
            gudongNameFieldNo:this.gudongNameFieldNo.value,
            gudongCodeFieldNo:this.gudongCodeFieldNo.value,
            labelFieldNo:this.labelFieldNo.value,
        }
    }
}

export default GudongCommon