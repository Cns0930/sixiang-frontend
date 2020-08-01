<template>
    <el-col :span="24" style="position:relative">
        <el-button @click="handleAdd"  class="side" icon="el-icon-plus" :style="addBtnStyle">添加</el-button>
        <el-divider></el-divider>
        <template v-for="(list,index) in children">
            <el-col :span="24"></el-col>
            <el-col :style="removeBtnStyle" class="position">
                <el-button @click="handleRemove(index)" class="side "  icon="el-icon-minus">删除</el-button>
            </el-col>
            <PureComponents :fields="list" :parent="children"></PureComponents>
            <el-col>
                <el-divider></el-divider>
            </el-col>
            
        </template>
        
    </el-col>
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

<style lang="scss" scoped>
.position{
    position:relative;
    top:0px;
    left:0px;
}
</style>