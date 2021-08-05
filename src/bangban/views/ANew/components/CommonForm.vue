<template>
    <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk class="form-detail marinTopGap"
        :rules="rules" ref="form" :validate-on-rule-change="false" @submit.native.prevent>
        <el-row>
            <template v-for="(v,i) in fields">
                <el-col :span="24" v-if="v.wrapStart"></el-col>
                <el-col  :span="v.span || 12" v-if="!v.hidden"  :id="'__'+i">
                    <component v-if="v.isList" :is="v.component" v-bind="v.attributes" :value="v.value"
                        @change="v.onchange && v.onchange($event,itemState)"
                        @input="v.oninput && v.oninput($event,itemState)"></component>

                    <el-form-item v-else :key="i" :label="v.label.trim()"
                        :label-width="v.label?_.isNil(v.labelWidth)? '200px':v.labelWidth:'50px'"
                        :prop="v.ruleKey || ''" :obj="v">

                        <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                            @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                            @input="v.oninput && v.oninput($event,itemState,itemGetters)"
                            :class="{'default-text-color':v.hasConfirmed === false}" @focus="handleFocus(v)">
                        </component>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="v.wrapEnd"></el-col>
            </template>
        </el-row>
    </el-form>
</template>

<script>
import TestFormItem from "@/components/TestFormItem"
// import rules from "../config/ruleConfig"
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
export default {
    name: "CommonForm",

    components: { ElFormItem: TestFormItem },

    mixins: [CommonMixin],
    props: ['fields',],
    data() {
        return {
            // rules,
        }
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
        handleFocus(v) {
            console.log(v)
            v.hasConfirmed = true;
        }
    }
}
</script>

<style>
</style>