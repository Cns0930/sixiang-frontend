<template>
    
</template>
<script>
import { listApprovalItem , getByApprovalItemId } from "../../api/basicInfo/approval";
import { listMaterial } from "../../api/basicInfo/material";
import _ from "lodash";
import dayjs from "dayjs";
export default {
    data() {
        return {
            pagesize: 10,
            currentPage: 1,
            totalCount: 0,
            materialStatus: "Y",
            loginName: localStorage.getItem("username"),
        }
    },
    methods: {
        async search(params) {
            let result
            if(this.type === 'work') {
                result = await listApprovalItem(params);
            } else if(this.type === 'material') {
                result = await listMaterial({pageNum: this.currentPage,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
                materialStatus: this.materialStatus,});
                if(!result.success) return;
                this.tableData = result.data.records;
            } else if(this.type === 'pickUp') {

            }

            if(!result.success) return;

            this.totalCount = result.data.total;
            this.tableData = result.data.records;
            this.$message({ type: "success", message: "查询成功" });
        },
        indexMethod(index) {
            return (this.currentPage - 1) * this.pagesize + (index + 1);
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        async init(){
            if(this.$store.state.basic.approvalItem.approvalItemId == null){
                let itemId = this.$route.query.itemId;
                let result = await getByApprovalItemId({approvalItemId: itemId});
                if (!result.success) {
                this.$message({ type: "warning", message: "获取初始事项信息失败" });
                return;
                }
                this.$store.commit("changeApprovalItem", result.data);
            }
        }
    }
}
</script>
<style lang="scss">
    .tablePagination {
        margin-top: 20px;
        width: 100%;
        text-align: center;
    }
</style>