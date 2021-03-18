import IdentityCommon from "./IdentityCommon/IdentityCommon"

import InputList from "./InputList/InputList"
import Collection from "./Collection/Collection"
import GudongCommon from "./GudongCommon/GudongCommon"
import Chuzifangshi from "./Chuzifangshi/Chuzifangshi"
import LayoutComponentMixin from "./LayoutComponentMixin"
import OriginJingyingfanwei from "./OriginJingyingfanwei/OriginJingyingfanwei"
import Jingyingfanwei from "./Jingyingfanwei/Jingyingfanwei"
import Jingyingqixian from "./Jingyingqixian/Jingyingqixian"
import QingxingComment from "./QingxingComment/QingxingComment"
import QRCodeUpload from "./QRCodeUpload/QRCodeUpload"
import TipsCommon from "./TipsCommon/TipsCommon"
import TitleCommon from './TitleCommon/TitleCommon.vue'
import CollapseCommon from './CollapseCommon/CollapseCommon.vue'
// 选择器
let ElSelectC = {
    name:"ElSelectC",
    props: ['options',"value","siblings","parent","disabled"],
    mixins:[LayoutComponentMixin],
    render() {
       
        let options =  Object.prototype.toString.call(this.options)  =="[object Function]"? this.options(this.itemState,this.itemGetters,this.siblings,this.parent):this.options || [];
        console.log("重新渲染 elselectC")
        options || (options=[]);
        return <ElSelect value={this.value} clearable disabled={this.disabled} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}}>
            {
                options.map(option=> <ElOption lable={option} value={option} ></ElOption>)
            }
           
        </ElSelect>
    }

}



//  radio
let ElRadioC = {
    name:"ElRadioC",
    props:['options','value'],
    mixins:[LayoutComponentMixin],
    render(){
        return <ElRadioGroup value={this.value} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}}>
            {
                this.options.map(option=>
                <el-radio label={option}></el-radio>)
            }
        </ElRadioGroup>
    }
}

// 单个checkbox
let ElSingleCheckboxC = {
    name: "ElSingleCheckboxC",
    props: ["options", "value",'label'],

    render() {
        return <span>
            <el-checkbox  onInput={(e) => this.$emit("input", e)}  label={this.value}></el-checkbox>
        </span>

    }
}

// 情形 checkbox
let ElCheckboxC = {
    name:"ElCheckboxC",
    props:["options","value","colSpan"],
    mixins:[LayoutComponentMixin],
    render(){
        let colSpan = this.colSpan? Number(this.colSpan) : 12;
        if(this.options.length<1) return;
        let options = Object.prototype.toString.call(this.options[0])  =="[object Object]"?this.options:this.options.map(v=>({value:v,label:v,disabled:false}))
        return <el-checkbox-group value={this.value} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}}>
            <el-row>
                {
                    options.map(option=> 
                    <el-col span={colSpan} >
                        <el-checkbox label={option.value} vShow={!option.hidden} disabled={option.disabled}>{option.label}</el-checkbox>
                    </el-col>
                    )
                }
           
            </el-row>
        </el-checkbox-group>
    }
}






let TextInputLike = ({ props }) => <span class="el-input__inner-like">{props.value}</span>

export default {
    ElSelectC,
    ElCheckboxC,
    ElRadioC,
    IdentityCommon,
    InputList,
    Collection,
    GudongCommon,
    ElSingleCheckboxC,
    TextInputLike,
    Chuzifangshi,
    OriginJingyingfanwei,
    Jingyingfanwei,
    Jingyingqixian,
    QingxingComment,
    QRCodeUpload,
    TipsCommon,
    TitleCommon,
    CollapseCommon
}