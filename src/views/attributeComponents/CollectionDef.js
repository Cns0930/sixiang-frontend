import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class Collection {
    constructor(){
        
        this.type = rendererBuilder("text","collection") 
        this.component = rendererBuilder("text","Collection")
        // this.value = new Renderer("text",[])
        this.span = rendererBuilder("text",24)
        this.meta=new Renderer("text",[])
        this.title = new Renderer('ElInput', '')
        this.addBtnStyle=new Renderer('ElInput', '')
        this.removeBtnStyle = new Renderer('ElInput', '')
    }
    getAttributes(meta){
        
        return {
            children:[meta],
            meta,
            addBtnStyle:this.addBtnStyle.value,
            removeBtnStyle:this.removeBtnStyle.value,
            title:this.title.value,
        }
    }
}

export default Collection