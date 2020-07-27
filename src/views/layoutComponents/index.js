import IdentityCommon from "./IdentityCommon/IdentityCommon"

import InputList from "./InputList/InputList"
import Collection from "./Collection/Collection"
import GudongCommon from "./gudongCommon/GudongCommon"
import Chuzifangshi from "./Chuzifangshi/Chuzifangshi"
import LayoutComponentMixin from "./LayoutComponentMixin"


// 选择器
let ElSelectC = {
    name:"ElSelectC",
    props: ['options',"value"],
    mixins:[LayoutComponentMixin],
    render() {
        
        let options =  Object.prototype.toString.call(this.options)  =="[object Function]"? this.options(this.itemState,this.itemGetters):this.options;
        return <ElSelect value={this.value} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}}>
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
        return <el-checkbox-group value={this.value} onInput={(e)=>this.$emit("input",e)} onChange={(e)=>{this.$emit("change",e)}}>
            <el-row>
                {
                    this.options.map(option=> 
                    <el-col span={12} >
                        <el-checkbox label={option}>{option}</el-checkbox>
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
    Chuzifangshi
}