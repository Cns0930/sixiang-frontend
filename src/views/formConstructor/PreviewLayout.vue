<template>
    <div class="preview">
        <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk :rules="rules"
            ref="form" :validate-on-rule-change="false" @submit.native.prevent>
            <el-row>
                <el-col v-for="(v,i) in previewFields" :span="v.span || 12" v-if="!v.hidden" :key="i">
                    <el-form-item :label="v.label" :required="v.required !== false"
                        :prop="v.ruleKey ? v.ruleKey : v.required !== false ? 'required' : ''" :obj="v">
                        <component :is="v.component" v-model="v.value" v-bind="v.attributes"></component>
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>

    </div>
</template>

<script>
import { mapState } from "vuex"
import { CheckSocialCreditCode, IdentityCodeValid } from '@/utils/function.js'
import TestFormItem from './component/TestFormItem'
import layoutComponent from "@/views/layoutComponents/index"

export default {
    name: "PreviewLayout",
    components:{ElFormItem: TestFormItem,...layoutComponent},
    data() {
        const validateIdCardNum = (rule, value, callback) => {
            let isId = IdentityCodeValid(value)
            if (isId) {
                callback();
            } else {
                callback(new Error('身份证号码格式不正确'))
            }

        }
        const validateCustom = (rule, value, callback) => {
            let result = value.validateFn(value)
            if (result.success) {
                callback();
            } else {
                callback(new Error(result.msg))
            }

        }
        const validateCardNum = (rule, value, callback) => {
            let isId = IdentityCodeValid(value)
            let isSocial = CheckSocialCreditCode(value)
            if (!isId && !isSocial) {
                callback(new Error("证件号码格式不正确"))
            } else {
                callback();
            }
        }
        return {
            rules: {
                'required': [{
                    required: true,
                    message: '请填写完整信息',
                    // trigger: 'blur',
                }],
                'phone': [
                    {
                        required: true,
                        pattern: /^1\d{10}$/,
                        message: '手机号格式不正确',
                        // trigger: 'blur'
                    },
                ],
                'postCode': [
                    {                        required: true,
                        pattern: /^[0-9]{6}$/,
                        message: '邮政编码不正确',
                    }
                ],
                'idCardNum': [
                    {
                        required: true,
                        message: '身份证号格式不正确',
                        validator: validateIdCardNum,
                        // trigger: 'blur'
                    }
                ],
                'mail': [
                    {
                        required: true,
                        message: "邮箱格式不正确",
                        pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
                    }
                ],
                'cardNum': [
                    {
                        required: true,
                        validator: validateCardNum,
                    }
                ],
                "custom": [{ required: true, validator: validateCustom }]
            },
        }
    },
    computed: {
        previewFields(){
            
            return this.$store.state.preview
        }
    }
}
</script>

<style lang="scss" scoped>
.preview{
    .el-select{
        width:100%;
    }
}
</style>