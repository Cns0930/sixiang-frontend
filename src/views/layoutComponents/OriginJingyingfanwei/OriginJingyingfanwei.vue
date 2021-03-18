<template>
    <div class="originjingying">
        <template v-for="(v,i) of mapOptions">
            <el-form-item :label="v.label" class="origin xuke" :prop="chooseValidate(i)" :obj="originjingyingfanweiContext" :key="i">
                <el-select v-model="valueArr[v.labelEn]" filterable multiple placeholder="请选择">
                    <el-option
                    v-for="item in v.list"
                    :key="item.scopeCode"
                    :label="item.businessScope"
                    :value="item.businessScope">
                    </el-option>
                </el-select>
            </el-form-item>
        </template>
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
    /**
     * defalutText 经营范围后缀文字
     * options 经营范围分类的信息[{label,labelEn,list,value},...]
     */
    props: ["value", "title","validateFn", "ruleKey",'defalutText',"options"],
    data() {
        return {
            mapOptions: {},//映射四象optios字段
            valueArr: {}//计算最终值
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
        valueArr: {
            handler(newVal) {
                console.log(newVal,'originjingyingfanwei');
                this.calcValue(newVal);
            },
            deep: true
        },
    },
    async created() {
        this.mapOptions = this.options();
        this.valueArr = this.mapOptions.reduce((res,cur) => {
            res[cur.labelEn] = [];
            return res
        },{});

        let ops = await getClassifyScopes();
        for(var i = 0;i < this.mapOptions.length;i++) {
            ops.forEach( v => {
                if(this.mapOptions[i].labelEn == v.isPermissionCode) {
                    this.mapOptions[i].list.push(v)
                }
            })
        }
    },
    methods: {
        chooseValidate(i) {
            if(this.mapOptions.length - 1 == i) {
                return this.originjingyingfanweiContext.ruleKey;
            } else {
                return ''
            }
        },
        calcValue(val) {
            let arr = Object.values(val).flat();
            if(!arr.length) return;
            let res = arr.toString().replace(/\,/g,'；') + this.defalutText;
            this.$emit('input',res);
        }
    }
}
</script>
<style lang="scss" scoped>

</style>