
import Renderer,{rendererBuilder} from "./Renderer"
import { getMapping } from "./index"


class CommonComponents {
    constructor({ type }) {
        // 24 ： 一行一个，12：一行两个
        
        this.span = new Renderer('NumberInput', 12,{vModel:12})

        
        // 组件类型
      
        // this.type = new Renderer("ElSelectC", type,  { value: type, options: typeOptions,onChange:(e)=>{this.$emit("changeType",e)} })
       
        this.type =rendererBuilder("text",type) 

        // 样例 值
        this.sample = new Renderer('ElInput', '')
        // 是否必填
        this.required = new Renderer('ElSingleCheckboxC', true,{options:[true]})
        // 是否隐藏
        this.hidden = new Renderer('ElSingleCheckboxC', false,{options:[true]})
        // 验证 文字说明
        // this.validate = new Renderer('ElInput', '')
        // // 交互限制 文字说明
        // this.limitation = new Renderer('ElInput', '')
        // // 事件
        this.onchange = new Renderer("CodeEditor",`
        // value是组件改变后的值
        function(value,state,getters){
            
        }`);
        // // 事件
        // this.onfocus = new Renderer('ElInput', '')
        this.remark = new Renderer('ElInput', '这里写备注')
    }
    getAttributes(){
        return {
            placeholder:"请输入内容"
        }
    }
}

export default CommonComponents