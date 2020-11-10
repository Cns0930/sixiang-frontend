
import Renderer,{rendererBuilder} from "./Renderer"
import {rulesList} from "@/utils/ruleConfig"
class GudongCommon {
    constructor(){
        
        this.type = rendererBuilder("text","gudongCommon") 
        this.component = rendererBuilder("text","GudongCommon",null,"组件")
        this.value = new Renderer("text",[])
        this.meta=new Renderer("text",[])
        this.span = rendererBuilder("text",24)
        this.labelFieldNo = new Renderer('ElInput', '',null,"tab标签的fieldNo")
        this.gudongNameFieldNo = new Renderer('ElInput', '',null,"股东名称的fieldNo")
        this.gudongCodeFieldNo = new Renderer('ElInput', '',null,"股东代码的fieldNo")
        this.deleteOrigin = new Renderer('ElSingleCheckboxC',false,{options:[true]},"不可删除")
        this.canAdd = new Renderer('ElSingleCheckboxC',false,{options:[true]},"不可新增")
        this.title = new Renderer('ElInput', '股东列表',null,"股东列表标题")
        
        
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
            canAdd: this.canAdd.value,
            deleteOrigin: this.deleteOrigin.value,
            children:[meta],
            meta,
            gudongNameFieldNo:this.gudongNameFieldNo.value,
            gudongCodeFieldNo:this.gudongCodeFieldNo.value,
            labelFieldNo:this.labelFieldNo.value,
            title:this.title.value,
            ruleKey:this.ruleKey.value,
            validateFn:this.validateFn.value,
        }
    }
}

export default GudongCommon