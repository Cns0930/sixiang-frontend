import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"
class QRCodeUploadDef extends CommonComponents{
    constructor(){
        super({type:"QRCodeUploadDef"})
        // this.value = rendererBuilder("text",["",""]);
        this.value = new Renderer("text","",{height:"200",borderRadius:"10",milliseconds:2000});
        this.component = rendererBuilder("text","QRCodeUpload")
        this.height =  new Renderer('ElInput', '200',null,"高度")
        this.borderRadius =  new Renderer('ElInput', '10',null,"圆角")
        this.content =  new Renderer('ElInput', '',null,"提示文字")
        this.uploadUrlDev=new Renderer('ElInput', '/api/out/upload/getTwoBarcode', null, "上传图片接口地址(get)-开发")
        this.uploadUrlProd=new Renderer('ElInput', '/api/out/upload/getTwoBarcode', null, "上传图片接口地址(get)-生产")
        this.getImgUrlDev= new Renderer('ElInput', '/api/out/upload/getFileList', null,"获取图片接口地址-开发")
        this.getImgUrlProd= new Renderer('ElInput', '/api/out/upload/getFileList', null,"获取图片接口地址-生产")
        this.milliseconds = new Renderer('NumberInput', 2000,null,"轮询间隔（毫秒）")
        this.disabled = new Renderer('ElSingleCheckboxC',false,{options:[true]})
    }
    getAttributes(){
        return {
            placeholder:this.placeholder.value,
            height:this.height.value,
            borderRadius:this.borderRadius.value,
            content:this.content.value,
            uploadUrlDev:this.uploadUrlDev.value,
            uploadUrlProd:this.uploadUrlProd.value,
            getImgUrlDev:this.getImgUrlDev.value,
            getImgUrlProd:this.getImgUrlProd.value,
            milliseconds:this.milliseconds.value,
            disabled:this.disabled.value,
        }
    }
    
}

export default QRCodeUploadDef