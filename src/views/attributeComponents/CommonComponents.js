
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
        this.required = new Renderer('ElCheckboxC', true,{options:[true]})
        // 验证 文字说明
        // this.validate = new Renderer('ElInput', '')
        // // 交互限制 文字说明
        // this.limitation = new Renderer('ElInput', '')
        // // 事件
        // this.onchange = new Renderer('ElInput', '')
        // // 事件
        // this.onfocus = new Renderer('ElInput', '')
    }
    getAttributes(){
        return {
            placeholder:"请输入内容"
        }
    }
}

export default CommonComponents