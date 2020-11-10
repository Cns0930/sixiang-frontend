<template>
    <el-col :span="24" style="position:relative">
        <div class="sub-title-n" v-if="title">
            <div class="tag"></div>
            <span class="text">{{title}}</span>
            <el-button @click="handleAdd" class="side" icon="el-icon-plus" :style="addBtnStyle" v-if="!isLengthFixed">添加
            </el-button>
        </div>

        <!-- <el-divider></el-divider> -->
        <template v-for="(list,index) in children">
            <el-col :span="24"></el-col>
            <el-col :style="removeBtnStyle" class="position" v-if="!isLengthFixed">
                <div class="remove-btn remove-btn-position" @click="handleRemove(index)">
                    <span class="minus"></span>
                </div>

                <!-- <el-button @click="handleRemove(index)" class="side "  icon="el-icon-minus">删除</el-button> -->
            </el-col>

            <PureComponents :fields="list" :parent="children" ref="childrenFormItem"></PureComponents>
            <el-col>
                <el-divider></el-divider>
            </el-col>

        </template>
        <!-- 无表单的验证 —— 验证 本身 -->
        <el-col :span=" 24" key="listself">
            <el-form-item :prop="listContext.ruleKey || ''" :obj="listContext" ref="listFormItem">
            </el-form-item>
        </el-col>

    </el-col>
</template>

<script>

import _ from "lodash"
import PureComponents from "../PureComponents"
import CommonMixin from "@/views/pageComponents/CommonMixin"
import TestFormItem from '@/components/TestFormItem'
export default {
    name: "Collection",
    mixins: [CommonMixin],
    components: { PureComponents, ElFormItem: TestFormItem, },
    props: ['value', 'children', 'meta', "removeBtnStyle", "addBtnStyle", "title", "isLengthFixed", "addHook", "ruleKey", "validateFn"],
    data() {
        return {

        }
    },
    watch: {
        "children": {
            handler: async function (v) {
                await this.$nextTick();
                await this.validate();
            },
            immediate: true
        }
    },
    computed: {
        listContext() {
            return {
                value: this.value,
                ruleKey: this.ruleKey,
                validateFn: (value, state, getters) => {
                    return this.validateFn(state, getters)
                }
            }
        },
    },
    methods: {
        async validate() {

            let fields = [ ...(this.$refs.childrenFormItem ? this.$refs.childrenFormItem.map(v => v.$refs.formItem) : []), this.$refs.listFormItem].flat()

            let promises = fields.map(field => {
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
        handleAdd() {

            let newChild = _.cloneDeep(this.meta);
            Object.values(newChild).forEach(comp => {

                if (comp.type == "computedText") {

                    Object.defineProperty(comp, "value", {
                        get: comp.getter.bind(null, comp, this.itemState, this.itemGetters, newChild, this.children)
                    })

                }
            })

            this.children.push(newChild);
            if (this.addHook && typeof this.addHook == 'function') {
                this.addHook(this.itemState, this.itemGetters, newChild, this.children)
            }
        },
        handleRemove(i) {
            this.children.splice(i, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
.position {
    position: relative;
    top: 0px;
    left: 0px;
}
.remove-btn {
    position: absolute;
    left: 6px;
    top: 4px;
    z-index: 10;
    margin-left: 5px;
    width: 25px;
    height: 25px;
    border-radius: 4px;
    background: linear-gradient(
        to bottom,
        rgba(51, 151, 255, 1) 0%,
        rgba(1, 59, 211, 1) 100%
    );

    display: inline-flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    .minus {
        width: 18px;
        height: 2px;
        background: white;
    }
}
</style>