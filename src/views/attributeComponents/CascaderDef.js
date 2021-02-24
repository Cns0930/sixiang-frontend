import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class CascaderDef extends CommonComponents{
    constructor(){
        super({type:"cascader"})

        this.options = new Renderer("CodeEditor","",null,"选项");

        this.component = rendererBuilder("text","ElCascader")
        this.value = new Renderer("text",[])
        this.multiple=  new Renderer('ElSingleCheckboxC', false,{options:[true]},"是否多选")
        this.showAllLevels = new Renderer('ElSingleCheckboxC', true,{options:[true]},"是否显示选中值的完整路径")
    }
    getAttributes(){
        return {
            options:eval(`${this.options.value}`),
            placeholder:"请输入内容",
            props:{ multiple: this.multiple.value },
            "show-all-levels":this.showAllLevels.value,
           "collapse-tags":true
        }
    }
}

export default CascaderDef