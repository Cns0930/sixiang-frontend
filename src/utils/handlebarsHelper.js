import Handlebars from "handlebars"
import indexCn from "./indexCn.json"
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

Handlebars.registerHelper("includes", function (arr, value, options) {


    if (arr.includes(value)) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }

});

// 写这个js的原因是因为股权转让需要，数组循环，两个一组
Handlebars.registerHelper("guquan_zhuanrang_gaizhang", function (arr, options) {
    var str = ""
    for(var j = 0;j < arr.length;j=j+2) {
        var v1 = arr[j];
        var v2 = arr[j+1];
        if(j == arr.length-1){
            // 需要直接返回单个
            str = str+'<p><span style="color:black;font-family:仿宋;font-size:12.0pt;">'+v1.othername+'（签字、盖章）</span></p><p>&nbsp;</p><p>&nbsp;</p>';
            break;
        }
        str = str+'<p><span style="color:black;font-family:仿宋;font-size:12.0pt;">'+v1.othername+'（签字、盖章）&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'+v2.othername+'（签字、盖章）</span></p><p>&nbsp;</p><p>&nbsp;</p>';
    }
    return str;
});

Handlebars.registerHelper("contains", function (arr, value, options) {


    if (arr.includes(value)) {
        return true
    } else {
        return false
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
Handlebars.registerHelper('calculate', function (arg1,symbol,arg2,options) {
    if(symbol=='+'){
       return arg1+arg2;
    }else if(symbol=='*'){
       return  arg1*arg2;
    }else if(symbol=='-'){
        return  arg1-arg2;
    }else if(symbol=='/'){
        return  arg1/arg2;
    }
  });

export default Handlebars