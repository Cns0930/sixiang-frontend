// 选择器
let ElSelectC = {
    name:"ElSelectC",
    props: ['options',"value"],
    
    render() {
        return <ElSelect value={this.value} onInput={(e)=>this.$emit("input",e)}>
            {
                this.options.map(option=> <ElOption lable={option} value={option} ></ElOption>)
            }
           
        </ElSelect>
    }

}


{/* <el-radio-group v-model="radio">
<el-radio :label="3">备选项</el-radio>
<el-radio :label="6">备选项</el-radio>
<el-radio :label="9">备选项</el-radio>
</el-radio-group */}
//  radio
let ElRadioC = {
    name:"ElRadioC",
    props:['options','value'],
    render(){
        return <ElRadioGroup value={this.value} onInput={(e)=>this.$emit("input",e)}>
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
    render(){
        return <el-checkbox-group value={this.value} onInput={(e)=>this.$emit("input",e)}>
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
export default {
    ElSelectC,
    ElCheckboxC,
    ElRadioC
}