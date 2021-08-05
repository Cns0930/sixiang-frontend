<template>
    <div>
        <el-radio :label="rv" v-model="radioValue" v-for="(rv,ri) in options" :key="ri"
            @input="handleRadioInput">{{rv}}</el-radio>

        <el-input v-model="inputValue" style="width:160px" @input="handleInputInput" v-if="inputShow">
        </el-input>
    </div>
</template>

<script>
export default {
    name: "Chuzifangshi",
    props: ["value"],
    data() {
        return {
            options: ["货币", "实物", "知识产权", "土地使用权", "其他",],
            radioValue: "货币",
            inputValue: "",

        }
    },
    created(){
        
        if(!this.value){
            this.emitEvent("货币")
        }else if(this.options.includes(this.value)){
            this.radioValue = this.value
        }else{
            this.inputValue = this.value;
            this.radioValue = "其他"
        }
    },
    computed: {
        inputShow() {
            if (this.radioValue == "其他") {
                return true;
            }
            return false;
        }
    },
    methods: {
        handleRadioInput(v) {
            if (v == '其他') {
                 this.emitEvent(this.inputValue);
            } else {
                this.inputValue = "";
                this.emitEvent(v);
            }

            
        },
        handleInputInput(v) {
            this.emitEvent(v);
        },
        emitEvent(data) {
            this.$emit("input", data);
        }
    }

}
</script>

<style>
</style>