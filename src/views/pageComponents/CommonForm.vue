<template>
    <div>
        <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk class="form-detail"
            :rules="rules" ref="form" :validate-on-rule-change="false" @submit.native.prevent>
            <el-row>

                <template v-for="(v,i) in fields">
                    <template v-if="v.hidden"></template>
                    <component v-else-if="v.isList" :is="v.component" v-bind="v.attributes"
                        @change="v.onchange && v.onchange($event,itemState)"
                        @input="v.oninput && v.oninput($event,itemState)"></component>

                    <el-col v-else :span="v.span || 12" :key="i">

                        <el-form-item :key="i" :label="v.label" :prop="v.ruleKey || ''" :obj="v">
                            <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                                @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                                @input="v.oninput && v.oninput($event,itemState,itemGetters)"></component>
                        </el-form-item>
                    </el-col>

                </template>

            </el-row>
        </el-form>
        <el-button @click="goPrev">上一步</el-button>
        <el-button @click="goNext">下一步</el-button>
    </div>
</template>

<script>
import TestFormItem from "@/components/TestFormItem"
import rules from "@/utils/ruleConfig"
import CommonMixin from "./CommonMixin"
import layoutComponent from "@/views/layoutComponents/index"

export default {
    name: "CommonForm",
    mixins: [CommonMixin],
    components: { ElFormItem: TestFormItem, ...layoutComponent },
    props: ['config',],

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