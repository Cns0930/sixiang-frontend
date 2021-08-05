<template>
    <div>
        <el-input placeholder="请输入年数" v-model="inputValue" :disabled="inputDisabled"
            @input="handleInput" @focus="$emit('focus')"
           style="width:220px">
        </el-input>

        <el-checkbox v-model="checkboxValue"  @change="oncheckboxchange"
            style="margin-left:20px;">
            {{checkboxLabel}}
        </el-checkbox>
    </div>
</template>

<script>
export default {
    name: "Jingyingqixian",
    props:["value"],
    data(){
        return {
            inputValue:"",
            inputDisabled:false,
            checkboxValue:"",
            checkboxLabel:"不约定期限"
        }
    },
    created(){
        if(this.value ==="不约定期限"||this.value ==="长期"||this.value.trim() ===""){
        this.inputDisabled=true;
        this.checkboxValue=true
        }else{
            this.inputValue = this.value;
        }
    },
    methods:{
        handleInput(){
            this.$emit("input",this.inputValue);
        },
        oncheckboxchange(v){
            // context.confirm = true;
            this.$emit("focus")
            if(v===true){
                this.$emit("input",this.checkboxLabel);
                
                this.inputDisabled = true;
            
            }else{
            
                this.inputDisabled = false;

            }
        }
    }

}
</script>

<style>
</style>