<template>
    <div class="workWrap">
        <header>情形管理</header>
        <el-button @click="addSubApproval">添加</el-button>
        <el-table>
            
        </el-table>

         <el-dialog title="添加情形" :visible.sync="dialogChangeTypeVisible" width="50%" :close-on-click-modal="false">

            <el-select v-model="temp_change_type">
                <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogChangeTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeTypeConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import {getApprovalSub,addApprovalSub} from "@/api/basicInfo/approvalSub"


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
            // addApprovalSub()
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