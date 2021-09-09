<template>
    <div class="add-dialog">
        <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="验证名称" prop="name">
                    <el-input type="text" v-model="ruleForm.validateName"></el-input>
                </el-form-item>
                <el-form-item label="验证描述" prop="name">
                    <el-input type="textarea" v-model="ruleForm.validateDescription">

                    </el-input>
                </el-form-item>
                <el-form-item label="是否必填" prop="region">
                    <el-select class="distance" v-model="ruleForm.isRequired" placeholder="请选择" clearable>
                        <el-option v-for="item in requiredList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="验证代码">
                    <el-button @click="initEditForConfig()">修改</el-button>
                </el-form-item>
                <div ref="configEdit" style="width:100%;height:300px"></div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import ace from "ace-builds";
import beautify from "ace-builds/src-noconflict/ext-beautify";

export default {
    name: 'AddJsDialog',
    data() {
        return {
            dialogVisible: false,
            requiredList: [
                {
                    value: 1,
                    label: '必填',
                },
                {
                    value: 0,
                    label: '非必填'
                },
            ],
            ruleForm: {
                isCustom: 1,
                isRequired: null,
                // 验证名称 
                validateDescription: "",
                // 验证代码
                validateScript: "",
                // 验证英文名
                validateValue: ""
            },
            rules: {

            }

        }
    },
    created() {

    },
    methods: {
        initEditForConfig() {
            this.aceForConfig = ace.edit(this.$refs.configEdit);
            this.aceForConfig.setTheme("ace/theme/monokai");
            this.aceForConfig.session.setMode("ace/mode/javascript");
            this.aceForConfig.setOption("wrap", "free")
            this.aceForConfig.setValue(this.ruleForm.validateScript);
            beautify.beautify(this.aceForConfig.session)
        },
        sure() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.$emit("update", this.ruleForm)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
}
</script>

<style lang="scss" scoped>
</style>