import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class InputListDef extends CommonComponents{
    constructor(){
        super({type:"inputList"})
        // this.value = rendererBuilder("text",["",""]);
        this.value = new Renderer("InputArray",[""],{});
        this.component = rendererBuilder("text","InputList")
        this.showAddBtn = new Renderer('ElSingleCheckboxC', true,{options:[true]},"是否显示添加按钮")
    }
    getAttributes(){
        return {
            showAddBtn:this.showAddBtn.value,
        }
    }
    
}

export default InputListDef