<template>
    
</template>
<script>
import { userlist } from "@/api/item/index";
export default {
    data() {
        return {
            pagesize: 10,
            currentPage: 1,
            totalCount: 0,
        }
    },
    methods: {
        async search(name='') {
            let result = await userlist({
                account: name,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
            });

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
                value = row.createdTime.replace('T',' ').replace(/\-/g,'/').substring(0,16);
            } else {
                value = row.updatedTime.replace('T',' ').replace(/\-/g,'/').substring(0,16);
            }
            return value
        },
        // handleSizeChange(val) {
        //     console.log(`每页 ${val} 条`);
        // },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.search(this.value);
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