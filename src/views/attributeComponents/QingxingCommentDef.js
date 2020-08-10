
import Renderer,{rendererBuilder} from "./Renderer"
class QingxingCommentDef  {
    constructor(){
        this.type =rendererBuilder("text","qingxingComment")
        this.component = rendererBuilder("text","QingxingComment")
        this.value = new Renderer("HTMLEditor","")
    }
    getAttributes(){
        return {
           
        }
    }
}

export default QingxingCommentDef