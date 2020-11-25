import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
import {rulesList} from "@/utils/ruleConfig"
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
        this.isLengthFixed = new Renderer('ElSingleCheckboxC', false,{options:[true]},"全部不可添加/删除")
        this.hidden = new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否隐藏")
        this.appendHead = new Renderer('ElSingleCheckboxC', false,{options:[true]},"从头部添加（默认尾部）")

        this.addHook = new Renderer("CodeEditor",`
        // siblings 有隐藏属性 $removeable
        // siblings.$unremoveable = true 本次添加的child 不可移除
        function(state,getters,siblings,parent){
            
        }`,null,"添加钩子函数");

        this.ruleKey = new Renderer("ElSelectC","none",{options:rulesList},"验证方式")
        this.validateFn = new Renderer("CodeEditor",`
        // value 是组件对象； value.value 是组件值
        // helper.CheckSocialCreditCode(code) 判断是否统一社会信用代码
        // helper.IdentityCodeValid(code) 判断是否身份证
        // helper.CheckPhone(code) 判断是否手机号
        // helper.CheckFixedTelephone(code) 判断是否固定电话
        // helper.CheckPostCode(code) 判断是否邮政编码
        // helper.CheckMail(code) 判断是否电子邮箱
        // return {success:false,msg:"验证错误提示"}
        function(value,state,getters,siblings,parent){
            
        }`,null,"自定义验证方法");
    }
    getAttributes(meta){
        
        return {
            children:[meta],
            meta,
            addBtnStyle:this.addBtnStyle.value,
            removeBtnStyle:this.removeBtnStyle.value,
            title:this.title.value,
            isLengthFixed:this.isLengthFixed.value,
            addHook:this.addHook.value,
            ruleKey:this.ruleKey.value,
            validateFn:this.validateFn.value,
            appendHead:this.appendHead.value,
        }
    }
}

export default Collection