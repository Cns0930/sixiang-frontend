<script>
/**
 * 用户选择截止日后 再勾选长期，则截止日置空
 * 用户勾选长期后 再选择截止日，则取消勾选长期状态
 * 出现inputValues.end需要赋值checkboxLabel，都会置空
 */
export default {
    name: "IdcardValid",
    props:["value","type",'valueFormat'],
    data(){
        return {
            inputValues: {
                start: '',
                end: ''
            },
            checkboxValue:"",
            checkboxLabel:"长期",
        }
    },
    created(){
        // if(this.value.length >=2){
        //     if(this.value[1] === "长期") {
        //         this.checkboxValue = true;
        //     }
        //     this.$set(this.inputValues,'start',this.value[0]);
        //     this.$set(this.inputValues,'end',this.value[1] == '长期'? '' : this.value[1]);
        // }
        
    },
    render(h) {
        if(this.value.length >=2){
            if(this.value[1] === "长期") {
                this.checkboxValue = true;
            }
            this.$set(this.inputValues,'start',this.value[0]);
            this.$set(this.inputValues,'end',this.value[1] == '长期'? '' : this.value[1]);
        }
        let dateDoms = Object.keys(this.inputValues).map((v,i) => {
            return <el-date-picker vModel={this.inputValues[v]} type={this.type} valueFormat={this.valueFormat} onChange={(val) => this.handleChange(val,i)} placeholder="选择日期"></el-date-picker>
        })
        dateDoms.splice(1,0,<span style="margin: 15px;">至</span>)
        let checkDom = <el-checkbox vModel={this.checkboxValue} onChange={this.oncheckboxchange} style="margin-left:20px;">{this.checkboxLabel}</el-checkbox>
        return h('div',[dateDoms,checkDom])
    },
    methods:{
        handleChange(val,i){
            console.log(val,i,this.inputValues)
            if(val && i == 1) {
                this.checkboxValue = false;
            }
            if(this.checkboxValue) {
                this.inputValues.end = this.checkboxLabel;
            }
            this.$emit("input",[this.inputValues.start,this.inputValues.end]);
            this.inputValues.end = this.inputValues.end == this.checkboxLabel?'':this.inputValues.end;
        },
        oncheckboxchange(v){
            if(v===true){
                this.inputValues.end = this.checkboxLabel;
            } else {
                this.inputValues.end = '';
            }
            this.$emit("input",[this.inputValues.start,this.inputValues.end]);
            this.inputValues.end = this.inputValues.end == this.checkboxLabel?'':this.inputValues.end;

        }
    }

}
</script>

<style>
</style>