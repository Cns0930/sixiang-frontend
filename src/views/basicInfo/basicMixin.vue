<template>
    
</template>
<script>
import { listApprovalItem , listMaterial } from "../../api/basicInfo/approval";
import _ from "lodash";
export default {
    data() {
        return {
            pagesize: 10,
            currentPage: 1,
            totalCount: 0,
            loginName: localStorage.getItem("username"),
        }
    },
    methods: {
        async search() {
            let result
            if(this.type === 'work') {
                result = await listApprovalItem({});
            } else if(this.type === 'material') {
                result = await listMaterial({});
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
        formatterTime(row,column,flag) {
            let value;
            if(!flag) {
                value = row.createTime.replace('T',' ').replace(/\-/g,'/').substring(0,16);
            } else {
                value = row.updateTime.replace('T',' ').replace(/\-/g,'/').substring(0,16);
            }
            return value
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
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