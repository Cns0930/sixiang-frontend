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
let TypeSelector = {
    name:"TypeSelector",
    props: ['value','options'],
    render() {
        return <ElSelect vModel={this.value}>{

            this.options.map(option => <ElOption label={option.label} value={option.value}></ElOption>)

        }</ElSelect>
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
    TypeSelector,
    TextAreaArray,
}