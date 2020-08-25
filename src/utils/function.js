export function CheckSocialCreditCode(Code) {
    if(!Code) return false;
    var patrn = /^[0-9A-Z]+$/;
    //18位校验及大写校验
    if ((Code.length != 18) || (patrn.test(Code) == false)) {
        // console.info("不是有效的统一社会信用编码！");
        return false;
    }
    else {
        var Ancode;//统一社会信用代码的每一个值
        var Ancodevalue;//统一社会信用代码每一个值的权重
        var total = 0;
        var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];//加权因子
        var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
        //不用I、O、S、V、Z
        for (var i = 0; i < Code.length - 1; i++) {
            Ancode = Code.substring(i, i + 1);
            Ancodevalue = str.indexOf(Ancode);
            total = total + Ancodevalue * weightedfactors[i];
            //权重与加权因子相乘之和
        }
        var logiccheckcode = 31 - total % 31;
        if (logiccheckcode == 31) {
            logiccheckcode = 0;
        }
        var Str = "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
        var Array_Str = Str.split(',');
        logiccheckcode = Array_Str[logiccheckcode];


        var checkcode = Code.substring(17, 18);
        if (logiccheckcode != checkcode) {
            // console.info("不是有效的统一社会信用编码！");
            return false;
        } else {
            return true;
        }
       
    }
}
export function IdentityCodeValid(str) {
    var myreg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
    if (str == "111111111111111" || !myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
export function CheckPhone(phone) {
    var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if(!phone) return false;
    if(phonereg.test(phone)) {
        return true
    } else {
        return false
    }
}
export function CheckPostCode(code) {
    var codereg = /^[0-9]{6}$/;
    if(!code) return false;
    if(codereg.test(code)) {
        return true
    } else {
        return false
    }
}
export function CheckMail(code) {
    var mailreg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if(!code) return false;
    if(mailreg.test(code)) {
        return true
    } else {
        return false
    }
}
function setOptions(field,options){
    field.attributes.options = options;
    if(options && options.length==1){
        field.value = options[0]
    }
}


export default {
    CheckSocialCreditCode,
    IdentityCodeValid,
    setOptions,
    CheckPhone,
    CheckMail,
    CheckPostCode
    
}