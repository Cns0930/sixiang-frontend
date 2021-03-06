import Handlebars from "handlebars"
import indexCn from "./indexCn.json"
import _ from "lodash"
import {CheckSocialCreditCode, IdentityCodeValid} from './function.js'

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

    console.log("Handlebars:contains:"+typeof(arr)+"   "+arr)

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
 * ???????????????????????? from chenchao
 */
Handlebars.registerHelper("singleFact1", function(arr)
{	

	return arr.length === 1
 
});

/**
 * ??????4, ????????????
 *
 */
Handlebars.registerHelper("rmWY", function(obj)
{	
    if (obj) return obj.replace('???????????????','').replace('??????', '')
});

/**
 * ??????????????????   ***???
 *
 */
Handlebars.registerHelper("addBeforeStr", function(obj)
{	
    if (obj) return (obj+'???')
});

/**
 * ??????4, ?????????????????????
 */

Handlebars.registerHelper("fmtCardType", function(obj)
{	
    let cardType = '?????????????????????';
    if (obj) {
        if (CheckSocialCreditCode(obj)) {
            cardType = '????????????'
        }
        if(IdentityCodeValid(obj)) {
            cardType= '?????????'
        }
    } else {
        cardType= ''
    }
    return cardType
});


/**
 * ?????????js??????????????????????????????????????????????????????????????????
 */
Handlebars.registerHelper("guquan_zhuanrang_gaizhang", function (arr, options) {
    var str = ""
    for(var j = 0;j < arr.length;j=j+2) {
        var v1 = arr[j];
        var v2 = arr[j+1];
        if(j == arr.length-1){
            // ????????????????????????
            str = str+'<p><span style="color:black;font-family:??????;font-size:12.0pt;">'+'&emsp;&emsp;'+v1.othername+'?????????????????????</span></p><p>&emsp;</p><p>&emsp;</p>';
            break;
        }
        str = str+'<p><span style="color:black;font-family:??????;font-size:12.0pt;">'+'&emsp;&emsp;'+v1.othername+'????????????????????? &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;'+v2.othername+'?????????????????????</span></p><p>&emsp;</p><p>&emsp;</p>';
    }
    return str;
});

Handlebars.registerHelper('delta', function(arg1, arg2){		      
    return arg1-arg2	  
});



/**
 * ??????????????????
 */
Handlebars.registerHelper("realList", function(arr)
{	
    // arr=[].filter
    // let length=arr.reduce(()=>{});
    if(!arr || arr.length == 0){
        return []
    }
	return arr.filter(item=>!_.isEmpty(item))
 
});



/**
 * ????????????????????????
 */
Handlebars.registerHelper("realLlength", function(arr)
{	
    // arr=[].filter
    // let length=arr.reduce(()=>{});
    if(!arr || arr.length == 0){
        return 0
    }
	return arr.filter(item=>!_.isEmpty(item)).length
 
});

/**
 * ?????????????????????????????????,????????????????????????
 */
Handlebars.registerHelper("removeSymbol", function(str)
{	
    if(!str)return;
    return str.replace(/^(\s|???)+|(\s|???)+$/g, '').replace(new RegExp('???+',"gm"),'???');
 
});


/**
 * ?????????????????????????????????,????????????????????????
 */
Handlebars.registerHelper("includeStr", function(arg1, arg2){
    if(!arg1){
        return false
    }
    if(!arg2){
        return true
    }
    if(arg1.includes(arg2)){
        return true
    }
    return false
});

Handlebars.registerHelper("zhiwu_chanshengfangshi_for_short", function(arg1){
    if(arg1.includes("??????")){
        return "??????";
    }else if(arg1.includes("??????")){
        return "??????";
    }else if(arg1.includes("??????")){
        return "??????";
    }else{
        return "??????";
    }
});

export default Handlebars
