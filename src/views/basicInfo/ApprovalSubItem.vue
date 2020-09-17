<template>
    <div class="workWrap">
        <header>情形管理</header>
        <el-button @click="addSubApproval">添加</el-button>
        <el-table>
            
        </el-table>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import {getSubApproval} from "@/api/basicInfo/approvalSub"


export default {
    name: "ApprovalSubItem",
    // mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "subItem",
            itemId:this.$route.query.itemId
        };
    },
    async created() {
        // await this.init();
        await getSubApproval();
    },
    methods:{
        addSubApproval(){
            
        },
    }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
    }
}
</style>