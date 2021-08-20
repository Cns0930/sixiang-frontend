import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class IdcardValidDef extends CommonComponents{
    constructor(){
        super({type:"IdcardValid"})
        this.component = rendererBuilder("text","IdcardValid")
        this.$type = new Renderer("ElSelectC","date",{options:["year","month","date","dates","week","datetime"]})
        this.span = rendererBuilder("text",24)
        this.value = rendererBuilder("text","")
        this.$valueFormat = new Renderer("ElInput","yyyy年MM月dd日")
        this.independent=rendererBuilder("text",false);
    }
    getAttributes(){
        return {
            type:this.$type.value,
            valueFormat:this.$valueFormat.value || undefined,
        }
    }
}

export default IdcardValidDef