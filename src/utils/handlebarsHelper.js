import Handlebars from "handlebars"
import indexCn from "./indexCn.json"
import {CheckSocialCreditCode, IdentityCodeValid} from './function.js'

import _ from "lodash";
// import { CheckSocialCreditCode, IdentityCodeValid } from './function.js';


Handlebars.registerHelper('equal', function (arg1, arg2, options) {

    if (arg1 == arg2) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
});


Handlebars.registerHelper("setVar", function (varName, varValue, options) {

    options.data.root[varName] = varValue;

});
Handlebars.registerHelper("inc", function (name, options) {
    options.data.root[name] = options.data.root[name] + 1;
    return options.data.root[name];
});

Handlebars.registerHelper("indexInCn", function (index, options) {
    return indexCn[index.toString()];
});

Handlebars.registerHelper("includes", function (arr, value, options){

    if (arr.includes(value)) {
        return options.fn(this)
    } else {

        return options.inverse(this)
    }
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('cond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2);
        case '===':
            return (v1 === v2);
        case '!=':
            return (v1 != v2);
        case '!==':
            return (v1 !== v2);
        case '<':
            return (v1 < v2);
        case '<=':
            return (v1 <= v2);
        case '>':
            return (v1 > v2);
        case '>=':
            return (v1 >= v2);
        case '&&':
            return (v1 && v2);
        case '||':
            return (v1 || v2);
        default:
            return false;
    }
});
Handlebars.registerHelper("contains", function (arr, value, options) {

    // console.log("Handlebars:contains:"+typeof(arr)+"   "+arr)

    if(typeof(arr)==="string"){
        if(arr.indexOf(value)>-1){
            return true;
        }else{
            return false
        }

    }else{

        if (arr.includes(value)) {
            return true
        } else {
            return false
        }
    }


});

Handlebars.registerHelper("logicUn", function()
{	
	
	let args = [].slice.call(arguments, 0,arguments.length-1) 

	let expression = args.join(" ")
	
	return eval(expression)
	
  
});
/**
 * 判断情形是否单选 from chenchao
 */
Handlebars.registerHelper("singleFact1", function(arr)
{	

	return arr.length === 1
 
});

/**
 * 附表4, 干掉万元
 *
 */
Handlebars.registerHelper("rmWY", function(obj)
{	
    if (obj) return obj.replace('万元人民币','').replace('万元', '')
});

/**
 * 附表4, 格式化证件类型
 */

Handlebars.registerHelper("fmtCardType", function(obj)
{	
    let cardType = '请输入证件类型';
    if (obj) {
        if (CheckSocialCreditCode(obj)) {
            cardType = '营业执照'
        }
        if(IdentityCodeValid(obj)) {
            cardType= '身份证'
        }
    } else {
        cardType= ''
    }
    return cardType
});


/**
 * 写这个js的原因是因为股权转让需要，数组循环，两个一组
 */
Handlebars.registerHelper("guquan_zhuanrang_gaizhang", function (arr, options) {
    var str = ""
    for(var j = 0;j < arr.length;j=j+2) {
        var v1 = arr[j];
        var v2 = arr[j+1];
        if(j == arr.length-1){
            // 需要直接返回单个
            str = str+'<p><span style="color:black;font-family:仿宋;font-size:12.0pt;">'+'&nbsp;'+v1.othername+'（签字、盖章）</span></p><p>&nbsp;</p><p>&nbsp;</p>';
            break;
        }
        str = str+'<p><span style="color:black;font-family:仿宋;font-size:12.0pt;">'+'&nbsp;'+v1.othername+'（签字、盖章） &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;'+v2.othername+'（签字、盖章）</span></p><p>&nbsp;</p><p>&nbsp;</p>';
    }
    return str;
});

Handlebars.registerHelper('delta', function(arg1, arg2){		      
    return arg1-arg2	  
});



/**
 * 获取真实数组
 */
Handlebars.registerHelper("realList", function(arr)
{	
    // arr=[].filter
    // let length=arr.reduce(()=>{});
	return arr.filter(item=>!_.isEmpty(item))
 
});



/**
 * 获取真实数组长度
 */
Handlebars.registerHelper("realLlength", function(arr)
{	
    // arr=[].filter
    // let length=arr.reduce(()=>{});
	return arr.filter(item=>!_.isEmpty(item)).length
 
});

/**
 * 删除字符串前后特殊符号,暂时只实现了逗号
 */
Handlebars.registerHelper("removeSymbol", function(str)
{	
    if(!str)return;
    return str.replace(/^(\s|，)+|(\s|，)+$/g, '').replace(new RegExp('，+',"gm"),'，');
 
});

export default Handlebars
