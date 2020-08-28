import _ from "lodash"

import {IdentityCodeValid,CheckSocialCreditCode} from "@/utils/function"



 const validateIdCardNum = (rule, value, callback) => {
    let isId = IdentityCodeValid(value)
    if(!isId ){
        callback(new Error("请输入正确的身份证号"))
    }else{
        callback();
    }
}

const validateCardNum = (rule, value, callback)=>{
    let isId = IdentityCodeValid(value)
    let isSocial = CheckSocialCreditCode(value)
    if(!isId && !isSocial){
        callback(new Error("请输入正确的统一社会信用代码"))
    }else{
        callback();
    }
}
const validateEmpty = (rule, value, callback)=>{
    let result=true;
    if(!value){
        result = false;
    }
    if(_.isArray(value)){
        let realArray = value.filter(v=>!!v);
        if(realArray.length<1){
            result = false;
        }
    }
    if(_.isObject(value)){
        if(_.isEmpty(value)){
            result = false;
        }
    }



    if(!result){
        callback(new Error("请填写完整信息"))
    }else{
        callback();
    }
}
export const rulesList = ["none",'required','phone','fixedTelephone','postCode','idCardNum','mail','cardNum',"custom"]
export default class  {
    constructor(state,getters){
        
         const validateCustom = (rule, customParams, callback)=>{
             
             let {self,siblings,parent} = customParams;
            let result = self.validateFn(self,state,getters,siblings,parent)
            if(result.success){
                callback();
            }else{
                callback(new Error(result.msg))
            }
            
        }
        this.getters = getters
        this.rules =  {
            "none":[{}],
        'required': [{
            required: true,
            message: '请填写完整信息',
            validator:validateEmpty
            // trigger: 'blur',
        }],
        'phone': [
            {
                required: true,
                pattern: /^1\d{10}$/,
                message: '请输入正确的手机号',
                // trigger: 'blur'
            },
        ],
        'fixedTelephone': [
            {
                required: true,
                pattern: /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|2|3|6|7|8|9]|18[3|6|7|8|9])\d{8}$)/,
                message: '请输入正确的电话号码',
                // trigger: 'blur'
            },
        ],
        'postCode':[
            {   required: true,
                pattern:/^[0-9]{6}$/,
                message: '请输入正确的邮政编码',
            }
        ],
        'idCardNum': [
            {
                required: true,
                message: '请输入正确的身份证号',
                validator: validateIdCardNum,
                // trigger: 'blur'
            }
        ],
        'mail':[
            {
                required:true,
                message:"请输入正确的电子邮箱",
                pattern:/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
            }
        ],
        'cardNum':[
            {
                required: true,
                validator: validateCardNum,
            }
        ],
        "custom":[{required: true,validator:validateCustom}]
    }
    }
}

