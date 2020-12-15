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
// export function IdentityCodeValid(str) {
//     var myreg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
//     if (str == "111111111111111" || !myreg.test(str)) {
//         return false;
//     } else {
//         return true;
//     }
// }

export function IdentityCodeValid(code) { 
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }
    
   else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    if(!pass) console.log(tip);
    return pass;
}

// 校验数字，并且大于_比较对象
export function floatMoreThanValid(num,compareValue) {
    const testNum = /^\d+(\.\d+)?$/;
    if(testNum.test(num) && (parseFloat(num)>compareValue)){
        return true;
    }
    return false;
}
// 校验：数字；大于等于_比较对象
export function floatMoreThanOrEqualValid(num,compareValue) {
    const testNum = /^\d+(\.\d+)?$/;
    if(testNum.test(num) && (parseFloat(num)>=compareValue)){
        return true;
    }
    return false;
}
// 校验：数字；大于等于_比较对象;整数
export function integerMoreThanValid(num,compareValue) {
    const testNum = /^[1-9]\d*$/;
    if(testNum.test(num) && (parseFloat(num)>compareValue)){
        return true;
    }
    return false;
}
// 校验：数字；大于_比较对象；整数
export function integerMoreThanOrEqualValid(num,compareValue) {
    const testNum = /^[0-9]\d*$/;
    if(testNum.test(num) && (parseFloat(num)>=compareValue)){
        return true;
    }
    return false;
}

function setOptions(field,options){
    field.attributes.options = options;
    if(options && options.length==1){
        field.value = options[0]
    }
}
export function CheckPhone(phone) {
    var phonereg = /^1[3456789]\d{9}$/;
    if(!phone) return false;
    if(phonereg.test(phone)) {
        return true
    } else {
        return false
    }
}
export function CheckFixedTelephone(phone) {
    var telephonereg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$|(^(13[0-9]|15[0|2|3|6|7|8|9]|18[3|6|7|8|9])\d{8}$)/;
    if(!phone) return false;
    if(telephonereg.test(phone)) {
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
export function getGudongTypeByName(name) {
    if(name.length >= 1 && name.length <= 4){
        return "自然人"
    }else if(name.length >= 7){
        return "企业"
    }else{
        return ""
    }
}
export default {
    CheckSocialCreditCode,
    IdentityCodeValid,
    setOptions,
    CheckPhone,
    CheckMail,
    CheckPostCode,
    CheckFixedTelephone,
    getGudongTypeByName
}

