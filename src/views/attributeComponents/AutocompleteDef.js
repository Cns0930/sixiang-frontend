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
        this.select = new Renderer("CodeEditor",`
        // 下拉框选中值后触发 value是组件改变后的值
        function(value,state,getters,siblings,parent){
            
        }`);
        // this.$type = new Renderer("ElSelectC","text",{options:["text","textarea",]})
        this.debounce = new Renderer('NumberInput', 300,{vModel:300},"输入建议的去抖延时")
        this.options=new Renderer("InputArray",[""],{})
        this.value = new Renderer("ElInput","",null,"默认值")

    }
    getAttributes(){
        let options = this.options.value.map(v=>({value:v}))
       
        return {
            
            placeholder:this.placeholder.value,
            fetchSuggestions:eval(`(function(queryString, cb){
                let options=${JSON.stringify(options)}
                var results = queryString ? options.filter(v=>v.value.includes(queryString)) : options;
                // 调用 callback 返回建议列表的数据
                cb(results);
            })`),
            debounce: this.debounce.value
        }
    }
}

export default AutocompleteDef