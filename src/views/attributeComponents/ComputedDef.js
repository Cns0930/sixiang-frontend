import Renderer from "./Renderer"


class ComputedDef{
    constructor(){
        this.sample = new Renderer('ElInput', 'sample_CD',null,"样例值")
        this.source = new Renderer('ElInput', '',null,"来源描述")
        this.getter = new Renderer("CodeEditor",`function(state,getters){
            return ""
        }`,null,"getter方法");
        this.remark = new Renderer('ElInput', '',null,"备注")
    }
}

export default ComputedDef