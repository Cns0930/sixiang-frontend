<template>
    <div class="collapse-common">
        <!-- <div class="one-name names" v-if="value.isOneTitle"><img class="one-img" src="./one.png">{{ value.titleOne || '情形标题' }}</div> -->
        
        <el-collapse >
            <el-collapse-item name="1" >
                <template slot="title">
                    <div class="two-name names" v-if="isTwoTitle"><img class="two-img" src="./two.png">{{titles || '板块标题' }}</div>
                    <!-- <p class="icon-text" v-if="actives">展开</p>
                    <p class="icon-text" v-else>收起</p> -->
                </template>
                <template v-for="(list,index) in children">
                    <el-col :span="24"></el-col>

                    <PureComponents :fields="list" :parent="children" ref="childrenFormItem"></PureComponents>
                    <el-col>
                        <!-- <el-divider></el-divider> -->
                    </el-col>

                </template>
                <!-- <PureComponents :fields="fields"></PureComponents> -->
            </el-collapse-item>
        </el-collapse>
        
    </div>
</template>

<script>
import _ from "lodash"
import PureComponents from "../PureComponents"
import TestFormItem from '@/components/TestFormItem'
import CommonMixin from "@/views/pageComponents/CommonMixin"
export default {
    name: "CollapseCommon",
    mixins: [CommonMixin],
    components:{
        PureComponents,ElFormItem: TestFormItem,
    },
    props: ['value','isTwoTitle','titles','children', "ruleKey", "validateFn"],
    data() {
        return {
            // value:{
            //    isOneTitle:true,
            //    isTwoTitle:true
            // }

        }
    },
    created(){

    },
    watch: {
        // "children": {
        //     handler: async function (v) {
        //         await this.$nextTick();
        //         await this.validate();
        //     },
        //     immediate: true
        // }
    },
    computed: {
        // listContext() {
        //     return {
        //         value: this.value,
        //         ruleKey: this.ruleKey,
        //         validateFn: (value, state, getters) => {
        //             return this.validateFn(state, getters)
        //         }
        //     }
        // },
    },
    methods: {

    }

}
</script>

<style scoped lang="scss">
/deep/ .el-collapse-item__header{
    background: rgba(8,5,115,0.30);
 .el-collapse-item__arrow{
    width: 66px;
    height: 24px;
    background: url('./up.png');

}
.el-collapse-item__arrow.is-active{
    transform: rotate(0);
    background: url('./open.png');

}
.el-icon-arrow-right:before {
    content: " ";
}
}
.collapse-common{
    height: 200px;
}
  .title-common{
      background: rgba(8,5,115,0.30);
      .names{
        text-align: left;
        font-size: 22px;
        color: #ffffff;
        display: flex;
        align-items: center;
      }
  }
</style>