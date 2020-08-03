<template>
    <div>
        
        <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk class="form-detail"
            :rules="rules" ref="form" :validate-on-rule-change="false" @submit.native.prevent>
            <el-row>

                <template v-for="(v,i) in fields">
                   
                    <div v-if="!v">没有找到{{config[i]}}</div>
                    <template v-else-if="v.hidden"></template>
                    

                    <el-col v-else :span="v.span || 12" :key="i">
                        <component v-if="v.isList" :is="v.component" v-bind="v.attributes"
                        @change="v.onchange && v.onchange($event,itemState)"
                        @input="v.oninput && v.oninput($event,itemState)"></component>
                        
                        <component v-else-if="v.independent" :is="v.component" v-bind="v.attributes"
                        @change="v.onchange && v.onchange($event,itemState)"
                        @input="v.oninput && v.oninput($event,itemState)" v-model="v.value">
                        </component>

                        <el-form-item v-else :key="i" :label="v.label" :prop="v.ruleKey || ''" :obj="v" 
                        :label-width="v.label?_.isNil(v.labelWidth)? '200px':v.labelWidth:'50px'">
                            <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                                @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                                @input="v.oninput && v.oninput($event,itemState,itemGetters)"></component>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="24" v-if="v.wrap"></el-col>
                </template>

            </el-row>
        </el-form>
        <el-button @click="goPrev">上一步</el-button>
        <el-button @click="goNext">下一步</el-button>
    </div>
</template>

<script>
import TestFormItem from "@/components/TestFormItem"
// import rules from "@/utils/ruleConfig"
import CommonMixin from "./CommonMixin"
import _ from "lodash"
export default {
    name: "CommonForm",
    mixins: [CommonMixin],
    components: { ElFormItem: TestFormItem,  },
    props: ['config',],

    data() {
        return {
            // rules
            test:""
        }
    },
    computed: {

        fields() {
            if (this.config.every(v => _.isString(v))) {
                return this.config.map(fieldNo => this.itemState[fieldNo]).sort((a,b)=>a.sort-b.sort)
            }
            return this.config.map(group => {

                return group.fields.map(fieldNo => this.itemState[fieldNo])
            }).flat().sort((a,b)=>a.sort-b.sort)

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