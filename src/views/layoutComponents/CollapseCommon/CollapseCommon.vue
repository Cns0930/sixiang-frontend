<template>
    <div class="collapse-common">
        <!-- <div class="one-name names" v-if="value.isOneTitle"><img class="one-img" src="./one.png">{{ value.titleOne || '情形标题' }}</div> -->
        
        <el-collapse >
            <el-collapse-item name="1" >
                <template slot="title">
                    <div class="two-name names"><img class="two-img" src="./two.png">{{titles || '板块标题' }}</div>
                </template>
                <template v-for="list in children">
                    <PureComponents :fields="list" :parent="children" ref="childrenFormItem"></PureComponents>
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
    props: ['value','titles','children', "ruleKey", "validateFn"],
    data() {
        return {

        }
    },
    created(){

    },
    watch: {

    },
    computed: {

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