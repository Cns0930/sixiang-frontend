<template>
    <div>
        <el-radio v-model="type" label="array">固定值</el-radio>
        <el-radio v-model="type" label="function">代码</el-radio>
        <InputArray v-model="valueInput" v-if="type=='array'" ></InputArray>
        <CodeEditor v-model="valueCode" v-if="type=='function'"></CodeEditor>
    </div>
</template>

<script>
import { InputArray, CodeEditor } from "./defRendererComponents"
export default {
    name: "InputArrayAndCodeEditor",
    props: ["value"],
    data() {
        return {
            type:"array",
            valueInput: [],
            valueCode: `
            // return array

        function(state,getters,siblings,parent){
            // return []
        }`
        }

    },
    created(){
       
        if(typeof this.value=="string"){
         
            this.type = "function"
            this.valueCode = this.value;
        }else{
            this.type="array"
            this.valueInput = this.value;
        }
    },
    watch:{
        valueInput(v){
            if(this.type =="array"){
                this.$emit("input",v)
            }
            
        },
        valueCode(v){
            if(this.type=="function"){
                this.$emit("input",v)
            }
            
        }
    },
    components: { InputArray, CodeEditor }
}
</script>

<style>
</style>