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
                <el-form-item label="验证代码" prop="validateScript">
                    <CodeEditor  v-model="ruleForm.validateScript" ref="codeEditorAdd" style="width: 400px">
                    </CodeEditor>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

// import ace from "ace-builds";
// import beautify from "ace-builds/src-noconflict/ext-beautify";
import { CodeEditor } from "@/views/attributeComponents/defRendererComponents/defRendererComponents";

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

            },

        }
    },
    components: {CodeEditor },
    watch: {
        dialogVisible: {
            handler(v) {
                if (!v) {
                    this.$refs.codeEditorAdd.open = false;
                }
            }
        }
    },
    created() {

    },
    methods: {
        sure() {
            // this.ruleForm.validateScript = this.editor && this.editor.getValue();
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