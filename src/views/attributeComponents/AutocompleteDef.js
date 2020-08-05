import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class AutocompleteDef extends CommonComponents{
    constructor(){
        super({type:"autocomplete"})
        this.component = rendererBuilder("text","ElAutocomplete")
        this.oninput = new Renderer("CodeEditor",`
        // value是组件改变后的值
        function(value,state,getters){
            
        }`);
        // this.$type = new Renderer("ElSelectC","text",{options:["text","textarea",]})
       
        this.options=new Renderer("InputArray",[""],{})
        this.value = new Renderer("ElInput","",null,"默认值")
    }
    getAttributes(){
        let options = this.options.value.map(v=>({value:v}))
       
        return {
    
            placeholder:"请输入内容",
            fetchSuggestions:function(queryString, cb){
                
                var results = queryString ? options.filter(v=>v.value.includes(queryString)) : options;
                // 调用 callback 返回建议列表的数据
                cb(results);
            }
        }
    }
}

export default AutocompleteDef