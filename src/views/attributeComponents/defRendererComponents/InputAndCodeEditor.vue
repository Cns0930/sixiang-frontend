<template>
    <div>
        <el-radio v-model="type" label="string">固定值</el-radio>
        <el-radio v-model="type" label="function">getter</el-radio>
        <ElInput v-model="valueInput" v-if="type=='array'" ></ElInput>
        <CodeEditor v-model="valueCode" v-if="type=='function'"></CodeEditor>
    </div>
</template>

<script>
import { CodeEditor } from "./defRendererComponents"
export default {
    name: "InputAndCodeEditor",
    props: ["value"],
    data() {
        return {
            type:"string",
            valueInput: "",
            valueCode: `
            // return array

        function(state,getters,siblings,parent){
            // return []
        }`
        }

    },
    created(){
       
        if(this.value.indexOf("function")>-1){
         
            this.type = "function"
            this.valueCode = this.value;
        }else{
            this.type="string"
            this.valueInput = this.value;
        }
    },
    watch:{
        valueInput(v){
            if(this.type =="string"){
                this.$emit("input",v)
            }
            
        },
        valueCode(v){
            if(this.type=="function"){
                this.$emit("input",v)
            }
            
        }
    },
    components: {  CodeEditor }
}
</script>

<style>
</style>