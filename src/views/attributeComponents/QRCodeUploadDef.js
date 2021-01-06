import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class QRCodeUploadDef extends CommonComponents{
    constructor(){
        super({type:"QRCodeUploadDef"})
        // this.value = rendererBuilder("text",["",""]);
        this.value = new Renderer("QRCodeUploadDef","",{height:"200",borderRadius:"10",});
        this.component = rendererBuilder("text","QRCodeUpload")
        this.height =  new Renderer('ElInput', '200',null,"高度")
        this.borderRadius =  new Renderer('ElInput', '10',null,"圆角")
        this.content =  new Renderer('ElInput', '',null,"提示文字")
    }
    getAttributes(){
        return {
            placeholder:this.placeholder.value,
            height:this.height.value,
            borderRadius:this.borderRadius.value,
            content:this.content.value
        }
    }
    
}

export default QRCodeUploadDef