<template>
    <div class="originjingying">
        <el-form-item label="一般项目" class="origin">
            <el-select v-model="normalVal" filterable multiple placeholder="请选择">
                <el-option
                v-for="item in normalOptions"
                :key="item.scopeCode"
                :label="item.businessScope"
                :value="item.businessScope">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="许可项目" class="origin xuke" :prop="originjingyingfanweiContext.ruleKey || ''" :obj="originjingyingfanweiContext">
            <el-select v-model="xukeVal" filterable multiple placeholder="请选择">
                <el-option
                v-for="item in xukeOptions"
                :key="item.scopeCode"
                :label="item.businessScope"
                :value="item.businessScope">
                </el-option>
            </el-select>
        </el-form-item>
    </div>
</template>

<script>

import _ from "lodash"
import {getClassifyScopes} from "./businessConfig"
import CommonMixin from "@/views/pageComponents/CommonMixin"
import TestFormItem from '@/components/TestFormItem'
export default {
    name: "OriginJingyingfanwei",
    mixins: [CommonMixin],
    components: { ElFormItem: TestFormItem, },
    props: ["value", "title","validateFn", "ruleKey",'defalutText'],
    data() {
        return {
            normalOptions: [],
            xukeOptions: [],
            normalVal:[],
            xukeVal: []
        }
    },
    computed: {
        originjingyingfanweiContext() {
            let result = {
                value: this.value,
                ruleKey: this.ruleKey,
                validateFn: (value, state, getters) => {
                    return this.validateFn(state, getters)
                }
            }
            return result
        },
    },
    watch: {
        normalVal(newVal){
            if(newVal) {
                this.calcValue('xuke',newVal);
            }
        },
        xukeVal(newVal) {
            if(newVal) {
                this.calcValue('normal',newVal);
            }
        }
    },
    async created() {
        let ops = await getClassifyScopes();
        console.log(ops,'ops',this.defalutText);
        ops.forEach(item => {
            if(item.isPermission === "一般事项") {
                this.normalOptions.push(item);
            } else if(item.isPermission === "许可事项") {
                this.xukeOptions.push(item);
            }
        })

    },
    methods: {
        calcValue(name,val) {
            let arr = this[name + 'Val'].concat(val);
            let res = arr.toString().replace(/\,/g,'；') + this.defalutText
            this.$emit('input',res);
        }
    }
}
</script>
<style lang="scss" scoped>

</style>