<template>
    <div class="question-box">
        <div v-if="formConf.type === 1">
            <el-radio-group v-model="formConf.answer" disabled>
                <el-radio v-for="(item,i) in this.formConf.expand.options" :key="i" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
        </div>
        <div v-else-if="formConf.type === 2">
            <el-checkbox-group v-model="formConf.answer" disabled>
                <el-checkbox v-for="(item,i) in this.formConf.expand.options" :key="i" :label="item.value">{{item.label}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div v-else-if="formConf.type === 3">
            <el-input placeholder="输入框组件" v-model="formConf.answer" clearable disabled />
        </div>
        <div v-else-if="formConf.type === 4">
            <el-input placeholder="上传组件区域，答案展示上传的文件名" v-model="formConf.answer" clearable disabled />
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "QuestionComponent",
    props: {
        formConf: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            // expand: {},
            uploadUrl: axios.defaults.baseURL + "/qnr/question/uploadFile",
            loading: false,
        };
    },
    computed: {
        // expand() {
        //     return JSON.parse(this.formConf.expand)
        // }
    },
    async mounted() {
        await this.$nextTick()
        if(this.formConf.type === 4 && this.formConf.answer) {
            let lastIndex = this.formConf.answer.lastIndexOf('/');
            this.formConf.answer = this.formConf.answer.slice(lastIndex + 1);
        }

        // this.expand = JSON.parse(this.formConf.expand)
    },
    methods: {
        
    }
};
</script>

<style>
.question-box .el-input.is-disabled .el-input__inner {
    color: #000000;
}
.question-box .el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #000000;
    cursor: not-allowed;
}
.question-box .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #000000;
    border-color: #DCDFE6;
}
.question-box .el-radio__input.is-disabled+span.el-radio__label {
    color: #000000;
}
.question-box .el-radio__input.is-disabled .el-radio__inner::after, .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: #000000;
    border-color: #E4E7ED;
}
</style>