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
    ElCheckboxC
}