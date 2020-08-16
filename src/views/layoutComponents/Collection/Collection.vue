<template>
    <el-col :span="24" style="position:relative">
        <div class="sub-title-n" v-if="title">
            <div class="tag"></div>
            <span class="text" >{{title}}</span>
            <el-button @click="handleAdd" class="side" icon="el-icon-plus" :style="addBtnStyle" v-if="!isLengthFixed">添加</el-button>
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
    props: ['value', 'children', 'meta', "removeBtnStyle", "addBtnStyle", "title","isLengthFixed"],
    data() {
        return {

        }
    },
    methods: {
        handleAdd() {
            
            let newChild = _.cloneDeep(this.meta);
            Object.values(newChild).forEach(comp => {

                if (comp.type == "computedText") {

                    Object.defineProperty(comp, "value", {
                        get: comp.getter.bind(null, comp, this.itemState, this.itemGetters, newChild, this.children)
                    })

                }
            })

            this.children.push(newChild)
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