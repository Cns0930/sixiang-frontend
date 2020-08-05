<template>
    <el-col :span="24" style="position:relative">
        <div class="sub-title-n">
            <div class="tag"></div>
            <span class="text"  v-if="title">{{title}}</span>
            <el-button @click="handleAdd"  class="side" icon="el-icon-plus" :style="addBtnStyle">添加</el-button>
        </div>
        
        <el-divider></el-divider>
        <template v-for="(list,index) in children">
            <el-col :span="24"></el-col>
            <el-col :style="removeBtnStyle" class="position">
                <div class="remove-btn remove-btn-position"  @click="handleRemove(index)">
                        <span class="minus"></span>
                    </div>

                <!-- <el-button @click="handleRemove(index)" class="side "  icon="el-icon-minus">删除</el-button> -->
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
    props: ['value', 'children', 'meta', "removeBtnStyle", "addBtnStyle","title"],
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