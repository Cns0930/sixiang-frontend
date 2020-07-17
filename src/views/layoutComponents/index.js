import IdentityCommon from "./IdentityCommon/IdentityCommon"



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

// input添加类 的数组
let InputList = {
    name: "InputArray",
    props: ["value"],
    render() {
        if (this.value.length == 0) {
            this.value.splice(0, 0, "")
        }
        return <div>
            {this.value.map((v, i) => <div>
                <ElInput value={v} onInput={(e) => { this.$set(this.value, i, e) }}></ElInput>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" onClick={() => { this.value.splice(i + 1, 0, "") }}></el-button>
                    <el-button type="primary" icon="el-icon-minus" onClick={() => { this.value.splice(i, 1) }}></el-button>
                </el-button-group>
            </div>)}
        </div>

    }
}

export default {
    ElSelectC,
    ElCheckboxC,
    ElRadioC,
    IdentityCommon,
    InputList
}