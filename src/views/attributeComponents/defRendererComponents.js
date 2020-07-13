// text 组件
let TextSpan = ({props})=><span>{props.value}</span>

// 数字组件
let NumberInput =  {
    name:"NumberInput",
    props: ["value"],
    
    render() {
        return <ElInput value={this.value} onInput={($event)=>this.$emit("input",parseFloat($event))}></ElInput>
    }
}
// 选择器组件
let ElSelectC = {
    name:"ElSelectC",
    props: ['options',"value"],
    
    render() {
        let realOption 
        if(Object.prototype.toString.call(this.options)=== "[object Array]"){
            realOption = this.options.map(option=>({label:option,value:option}))
        }else {
            realOption = this.options
        }
 
        return <ElSelect value={this.value} onInput={(e)=>this.$emit("input",e)} >
            {
                realOption.map(option=> <ElOption lable={option.label} value={option.value} ></ElOption>)
            }
        
        </ElSelect>
    }

}

let TextAreaArray = {
    name:"TextAreaArray",
    props: ['value'],
    render() {
        return <ElInput value={this.value.join(",")} type="textarea" onInput={($event)=>this.$emit("input",$event.split(","))}></ElInput>
    }
}

export default {
    TextSpan,
    NumberInput,
    ElSelectC,
    TextAreaArray,
}