<template>
    
</template>
<script>
import { listApprovalItem , getByApprovalItemId, listPublicApprovalItem, getByProjectId } from "../../api/basicInfo/approval";
import { listRule } from '@/api/basicInfo/ApprovalRules'
import { listMaterial } from "../../api/basicInfo/material";
import { listitemNoSinglewindow } from "../../api/basicInfo/singleWindow";
import { listDocument } from "../../api/basicInfo/AIdocument";
import { listItemAndDocumentSub } from "../../api/basicInfo/approvalSub";
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
                this.tableData = result.data.records;
            } else if(this.type === 'material') {
                result = await listMaterial({pageNum: this.currentPage,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
                materialStatus: this.materialStatus,});
                if(!result.success) return;
                this.tableData = result.data.records;
            } else if(this.type === 'pickUp') {
                
            } else if(this.type === 'singleWindow') {
                result = await listitemNoSinglewindow({itemNo: this.$store.state.home.item.itemNo});
                this.tableData = result.data;
            } else if(this.type === 'AIdocument') {
                result = await listDocument({approvalItemId: this.$route.query.itemId});
                this.tableData = result.data;
            } else if(this.type === 'ApprovalSubItemText') {
                result = await listItemAndDocumentSub({approvalItemId: this.$route.query.itemId,pageNum: this.currentPage,
                pageSize: this.pagesize});
                this.tableData = result.data.records;
            } 
            else if(this.type === 'ApprovalRules') {
                result = await listRule({approvalItemId: this.$route.query.itemId,ruleCode:params,pageNum: this.currentPage,
                pageSize: this.pagesize});
                this.tableData = result.data.records;
                console.log(this.tableData)
                this.totalCount = result.data.total
            } 
             else if(this.type === 'public'){
                result = await listPublicApprovalItem(params)
                this.tableData = result.data.records;
            }

            if(!result.success) return;

            this.totalCount = result.data.total;
            // this.$message({ type: "success", message: "查询成功" });
        },
        indexMethod(index) {
            return (this.currentPage - 1) * this.pagesize + (index + 1);
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
        isRequiredFormatter(row, column, cellValue, index) {
            if (cellValue === 1) {
                return '是';
            } else if (cellValue === 0) {
                return '否';
            } else {
                return '-';
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        async init(){
            if(this.$store.state.home.item.approvalItemId == null){
                let itemId = this.$route.query.itemId;
                let result = await getByApprovalItemId({approvalItemId: itemId});
                if (!result.success) {
                this.$message({ type: "warning", message: "获取初始事项信息失败" });
                return;
                }
                this.$store.commit("changeItem", result.data);
            }
        },
        async initProject(){
            if(this.$store.state.home.project.projectId === undefined){
                let projectId = this.$route.query.projectId;
                let result = await getByProjectId({projectId: projectId});
                if (!result.success) {
                    this.$message({ type: "warning", message: "获取初始项目信息失败" });
                    return;
                }
                this.$store.commit("changeProject", result.data);
            }
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