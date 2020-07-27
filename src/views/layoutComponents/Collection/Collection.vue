<template>
    <div>
        <el-button @click="handleAdd" icon="el-icon-plus" :style="addBtnStyle">添加</el-button>
        <template v-for="(list,index) in children">
            <div :style="removeBtnStyle">
                <el-button @click="handleRemove(index)" style="clear:both" icon="el-icon-minus">删除</el-button>
            </div>
            <PureComponents :fields="list"></PureComponents>
        </template>
    </div>
</template>

<script>

import _ from "lodash"
import PureComponents from "../PureComponents"
import CommonMixin from "@/views/pageComponents/CommonMixin"

export default {
    name: "Collection",
    mixins: [CommonMixin],
    components: { PureComponents, },
    props: ['value', 'children', 'meta', "removeBtnStyle", "addBtnStyle"],
    data() {
        return {

        }
    },
    methods: {
        handleAdd() {
            this.children.push(_.cloneDeep(this.meta))
        },
        handleRemove(i) {
            this.children.splice(i, 1)
        }
    }
}
</script>

<style>
</style>