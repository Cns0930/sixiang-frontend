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
        this.isLengthFixed = new Renderer('ElSingleCheckboxC', false,{options:[true]},"不可添加/删除")
        this.hidden = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否隐藏")
        
        this.addHook = new Renderer("CodeEditor",`
        function(state,getters,siblings,parent){
            
        }`,null,"添加钩子函数");
    }
    getAttributes(meta){
        
        return {
            children:[meta],
            meta,
            addBtnStyle:this.addBtnStyle.value,
            removeBtnStyle:this.removeBtnStyle.value,
            title:this.title.value,
            isLengthFixed:this.isLengthFixed.value,
            addHook:this.addHook.value
        }
    }
}

export default Collection