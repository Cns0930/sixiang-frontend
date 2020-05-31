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

Handlebars.registerHelper("includes", function (arr,value, options) {


    if (arr.includes(value)) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
    
});



export default Handlebars