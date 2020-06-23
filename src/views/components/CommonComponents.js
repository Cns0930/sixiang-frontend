
import Renderer from "./Renderer"

class CommonComponents{
    constructor(){
        this.span=new Renderer('ElInput',24)
        this.type=new Renderer('ElInput','')
        this.sample = new Renderer('ElInput','')
        this.validate=new Renderer('ElInput','')
        this.limitation=new Renderer('ElInput','')
        this.onchange=new Renderer('ElInput','')
        this.onfocus=new Renderer('ElInput','')
    }
}

export default CommonComponents