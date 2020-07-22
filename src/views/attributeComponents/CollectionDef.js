import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class Collection extends CommonComponents{
    constructor(){
        super({type:"collection"})
        this.component = rendererBuilder("text","ElInput")
        this.value = new Renderer("text",[])
        this.children=new Renderer("text",[])
    }
}

export default Collection