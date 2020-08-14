import IdentityCommon from "./IdentityCommon/IdentityCommon"

import InputList from "./InputList/InputList"
import Collection from "./Collection/Collection"
import GudongCommon from "./GudongCommon/GudongCommon"
import Chuzifangshi from "./Chuzifangshi/Chuzifangshi"
import LayoutComponentMixin from "./LayoutComponentMixin"
import Jingyingfanwei from "./Jingyingfanwei/Jingyingfanwei"
import Jingyingqixian from "./Jingyingqixian/Jingyingqixian"
import QingxingComment from "./QingxingComment/QingxingComment"
// 选择器
let ElSelectC = {
    name:"ElSelectC",
    props: ['options',"value","siblings","parent"],
    mixins:[LayoutComponentMixin],
    render() {
        
        let options =  Object.prototype.toString.call(this.options)  =="[object Function]"? this.options(this.itemState,this.itemGetters,this.siblings,this.parent):this.options || [];
        return <ElSelect value={this.value} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}} onFocus={()=>{this.$emit('focus')}}>
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

// 情形 checkbox
let ElCheckboxC = {
    name:"ElCheckboxC",
    props:["options","value"],
    mixins:[LayoutComponentMixin],
    render(){
        if(this.options.length<1) return;
        let options = Object.prototype.toString.call(this.options[0])  =="[object Object]"?this.options:this.options.map(v=>({value:v,label:v,disabled:false}))
        return <el-checkbox-group value={this.value} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}}>
            <el-row>
                {
                    options.map(option=> 
                    <el-col span={12} >
                        <el-checkbox label={option.label} value={option.value} disabled={option.disabled}>{option.label}</el-checkbox>
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
    TextInputLike,
    Chuzifangshi,
    Jingyingfanwei,
    Jingyingqixian,
    QingxingComment
}