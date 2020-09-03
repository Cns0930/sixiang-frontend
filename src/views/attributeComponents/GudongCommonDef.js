
import Renderer,{rendererBuilder} from "./Renderer"
class GudongCommon {
    constructor(){
        
        this.type = rendererBuilder("text","gudongCommon") 
        this.component = rendererBuilder("text","GudongCommon",null,"组件")
        this.value = new Renderer("text",[])
        this.meta=new Renderer("text",[])
        this.span = rendererBuilder("text",24)
        this.labelFieldNo = new Renderer('ElInput', '',null,"tab标签的fieldNo")
        this.gudongNameFieldNo = new Renderer('ElInput', '',null,"股东名称的fieldNo")
        this.gudongCodeFieldNo = new Renderer('ElInput', '',null,"股东代码的fieldNo")
        this.deleteOrigin = new Renderer('ElSingleCheckboxC',false,{options:[true]},"不可删除")
        this.canAdd = new Renderer('ElSingleCheckboxC',false,{options:[true]},"不可新增")
        this.title = new Renderer('ElInput', '股东列表',null,"股东列表标题")
    }
    getAttributes(meta){
        
        return {
            canAdd: this.canAdd.value,
            deleteOrigin: this.deleteOrigin.value,
            children:[meta],
            meta,
            gudongNameFieldNo:this.gudongNameFieldNo.value,
            gudongCodeFieldNo:this.gudongCodeFieldNo.value,
            labelFieldNo:this.labelFieldNo.value,
            title:this.title.value,
        }
    }
}

export default GudongCommon