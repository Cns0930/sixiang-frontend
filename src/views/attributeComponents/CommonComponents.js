
import Renderer,{rendererBuilder} from "./Renderer"
import { getMapping } from "./index"
import {rulesList} from "@/utils/ruleConfig"

class CommonComponents {
    constructor({ type }) {


        this.hasConfirmed = new Renderer('ElSingleCheckboxC', true,{options:[true]},"已确认")
        // 24 ： 一行一个，12：一行两个
        this.span = new Renderer('NumberInput', 12,{vModel:12},"占据(24为100%)")

        this.sort = new Renderer('NumberInput', 0,null,"顺序号")
        // 组件类型
        this.type =rendererBuilder("text",type,null,"组件") 
        // 样例 值
        this.sample = new Renderer('ElInput', '',null,"样例值")
        // 是否必填
        // this.required = new Renderer('ElSingleCheckboxC', true,{options:[true]})
        // 是否隐藏
        this.hidden = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否隐藏")
       
        // // 事件
        this.onchange = new Renderer("CodeEditor",`
        // value是组件改变后的值
        // helper.setOptions(state['fieldNo'],['value1','value2'])  设置select的options 当options只有一个元素时，将value设置为options的第一个值
        // 当组件属于集合时 siblings 是集合中本元素， parent 是整个集合
        function(value,state,getters,siblings,parent){
            
        }`,null,"change事件");
        // 备注
        this.remark = new Renderer('ElInput', '',null,"备注")
        this.placeholder = new Renderer('ElInput', '请输入内容',null, '预留文字')
        this.ruleKey = new Renderer("ElSelectC","required",{options:rulesList},"验证方式")
        this.validateFn = new Renderer("CodeEditor",`
        // value 是组件对象； value.value 是组件值
        // helper.CheckSocialCreditCode(code) 判断是否统一社会信用代码
        // helper.IdentityCodeValid(code) 判断是否身份证
        // helper.CheckPhone(code) 判断是否手机号
        // helper.CheckPostCode(code) 判断是否邮政编码
        // helper.CheckMail(code) 判断是否电子邮箱
        // return {success:false,msg:"验证错误提示"}
        function(value,state,getters,siblings,parent){
            
        }`,null,"自定义验证方法");

        this.wrapStart =  new Renderer('ElSingleCheckboxC', false,{options:[true]},"起始换行")
        this.wrapEnd =  new Renderer('ElSingleCheckboxC', false,{options:[true]},"末端换行")
    }
    getAttributes(){
        return {
            placeholder:this.placeholder.value
        }
    }
}

export default CommonComponents