import Handlebars from "handlebars"

Handlebars.registerHelper('equal', function(arg1, arg2, options){
			
    if(arg1 == arg2) {
      return options.fn(this)
    }else{
      return options.inverse(this)
    }
});

export default Handlebars