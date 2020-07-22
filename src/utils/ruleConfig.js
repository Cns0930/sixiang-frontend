
 const validateIdCardNum = (rule, value, callback) => {
    ValidateIdCardNumApi({ cardNum: value }).then(res => {
        if (res.code === 200 && res.message === 'SUCCESS') {
            callback();
        } else {
            callback(new Error('身份证号码格式不正确'))
        }
    })
}
const validateCustom = (rule, value, callback)=>{
    let result = value.validateFn(value)
    if(result.success){
        callback();
    }else{
        callback(new Error(result.msg))
    }
    
}
const validateCardNum = (rule, value, callback)=>{
    let isId = IdentityCodeValid(value)
    let isSocial = CheckSocialCreditCode(value)
    if(!isId && !isSocial){
        callback(new Error("证件号码格式不正确"))
    }else{
        callback();
    }
}
export default  {
    "none":[{}],
    'required': [{
        required: true,
        message: '请填写完整信息',
        // trigger: 'blur',
    }],
    'phone': [
        {
            required: true,
            pattern: /^1\d{10}$/,
            message: '手机号格式不正确',
            // trigger: 'blur'
        },
    ],
    'postCode':[
        {   required: true,
            pattern:/^[0-9]{6}$/,
            message: '邮政编码不正确',
        }
    ],
    'idCardNum': [
        {
            required: true,
            message: '身份证号格式不正确',
            validator: validateIdCardNum,
            // trigger: 'blur'
        }
    ],
    'mail':[
        {
            required:true,
            message:"邮箱格式不正确",
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