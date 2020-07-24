
import Renderer,{rendererBuilder} from "./Renderer"
import { getMapping } from "./index"
import rules from "@/utils/ruleConfig"

class CommonComponents {
    constructor({ type }) {
        // 24 ： 一行一个，12：一行两个
        
        this.span = new Renderer('NumberInput', 12,{vModel:12},"占据(24为100%)")

        
        // 组件类型
      
        // this.type = new Renderer("ElSelectC", type,  { value: type, options: typeOptions,onChange:(e)=>{this.$emit("changeType",e)} })
       
        this.type =rendererBuilder("text",type,null,"组件") 

        // 样例 值
        this.sample = new Renderer('ElInput', '',null,"样例值")
        // 是否必填
        // this.required = new Renderer('ElSingleCheckboxC', true,{options:[true]})
        // 是否隐藏
        this.hidden = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否显示")
        // 验证 文字说明
        // this.validate = new Renderer('ElInput', '')
        // // 交互限制 文字说明
        // this.limitation = new Renderer('ElInput', '')
        // // 事件
        this.onchange = new Renderer("CodeEditor",`
        // value是组件改变后的值
        function(value,state,getters){
            
        }`,null,"change事件");
        // // 事件
        // this.onfocus = new Renderer('ElInput', '')
        this.remark = new Renderer('ElInput', '',null,"备注")
        this.placeholder = new Renderer('ElInput', '请输入内容')
        this.ruleKey = new Renderer("ElSelectC","required",{options:Object.keys(rules)},"验证方式")
        this.validateFn = new Renderer("CodeEditor",`
        // value 是组件当前的值

        function(value,state){
            // return {success:false,msg:"验证错误提示"}
        }`,null,"自定义验证方法");
    }
    getAttributes(){
        return {
            placeholder:this.placeholder.value
        }
    }
}

export default CommonComponents