import Renderer from "./Renderer"


class ComputedDef{
    constructor(){
        this.sample = new Renderer('ElInput', '')
        this.source = new Renderer('ElInput', '')
        this.getter = new Renderer("CodeEditor",`function(state,getters){
            return ""
        }`);
        this.remark = new Renderer('ElInput', '')
    }
}

export default ComputedDef