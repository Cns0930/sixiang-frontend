<template>
    <div class="question-box">
        <div v-if="formConf.type === 1">
            <div v-if="expand && expand.picPath && expand.picPath.length > 0" class="demo-image__preview"
                style="margin: 20px">
                <div v-for="(pic, picIndex) in expand.picPath" :key="picIndex" style="width: 33%; height: 200px;">
                    <el-image style="width: 90%; height: 90%;border:1px solid #409EFF;" :src="pic"
                        :preview-src-list="expand.picPath">
                    </el-image>
                </div>
            </div>
            <el-radio-group v-model="formConf.answer" disabled>
                <el-radio v-for="(item,i) in this.formConf.expand.options" :key="i" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
        </div>
        <div v-else-if="formConf.type === 2">
            <div v-if="expand && expand.picPath && expand.picPath.length > 0" class="demo-image__preview"
                style="margin: 20px">
                <div v-for="(pic, picIndex) in expand.picPath" :key="picIndex" style="width: 33%; height: 200px;">
                    <el-image style="width: 90%; height: 90%;border:1px solid #409EFF;" :src="pic"
                        :preview-src-list="expand.picPath">
                    </el-image>
                </div>
            </div>
            <el-checkbox-group v-model="formConf.answer" disabled>
                <el-checkbox v-for="(item,i) in this.formConf.expand.options" :key="i" :label="item.value">{{item.label}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div v-else-if="formConf.type === 3">
            <div v-if="expand && expand.picPath && expand.picPath.length > 0" class="demo-image__preview"
                style="margin: 20px">
                <div v-for="(pic, picIndex) in expand.picPath" :key="picIndex" style="width: 33%; height: 200px;">
                    <el-image style="width: 90%; height: 90%;border:1px solid #409EFF;" :src="pic"
                        :preview-src-list="expand.picPath">
                    </el-image>
                </div>
            </div>
            <el-input placeholder="输入框组件" v-model="formConf.answer" clearable disabled />
        </div>
        <div v-else-if="formConf.type === 4">
            <div v-if="expand && expand.picPath && expand.picPath.length > 0" class="demo-image__preview"
                style="margin: 20px">
                <div v-for="(pic, picIndex) in expand.picPath" :key="picIndex" style="width: 33%; height: 200px;">
                    <el-image style="width: 90%; height: 90%;border:1px solid #409EFF;" :src="pic"
                        :preview-src-list="expand.picPath">
                    </el-image>
                </div>
            </div>
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
    created() {
        this.expand = this.formConf.expand
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

<style scoped lang="scss">
.question-box {
    .active {
        border-radius: 3px;
        box-shadow: none;
        border: 1px solid #d84966;
        display: block;
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
    }
    .demo-image__preview {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
}
</style>