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
    console.log(options.data.root)
    options.data.root[varName] = varValue;

});
Handlebars.registerHelper("inc", function (name, options) {
   
    options.data.root[name] = options.data.root[name] + 1;
    return options.data.root[name];
});

Handlebars.registerHelper("incInCn", function (index, options) {

    

    return indexCn[index.toString()];
});


export default Handlebars