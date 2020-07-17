<template>
    <div>
        <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk class="form-detail"
            :rules="rules" ref="form" :validate-on-rule-change="false" @submit.native.prevent>
            <el-row>
                <el-col v-for="(v,i) in fields" :span="v.span || 12" :key="i">

                    <el-form-item :key="i" :label="v.label"
                        :prop="v.ruleKey ? v.ruleKey : v.required !== false ? 'required' : ''" :obj="v">
                        <component :is="v.component" v-model="v.value" v-bind="v.attributes"></component>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button @click="goPrev">上一步</el-button>
        <el-button @click="goNext">下一步</el-button>
    </div>
</template>

<script>
import TestFormItem from "@/components/TestFormItem"
import rules from "@/utils/ruleConfig"
import Common from "./Common"
export default {
    name: "CommonForm",

    components: { ElFormItem: TestFormItem },
    props: ['config',],
    mixins: [Common],
    data() {
        return {
            rules
        }
    },
    computed: {

        fields() {
            return this.config.map(v => this.itemState[v])

        },
    },
    methods: {
        async validate() {
            let promises = this.$refs.form.fields.map(field => {
                return new Promise((resolve, reject) => {
                    field.validate('', '', (message, field) => {

                        if (message) {
                            resolve(false)

                        } else {
                            resolve(true)
                        }

                    })
                })
            })
            let result = await Promise.all(promises)

            return result.every(Boolean)

        },
    }
}
</script>

<style>
</style>