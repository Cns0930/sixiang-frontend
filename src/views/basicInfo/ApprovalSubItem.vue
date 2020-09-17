<template>
    <div class="workWrap">
        <header>情形管理</header>
        <el-button @click="addDialogVisible = true" type="primary" style="margin-bottom:10px">添加</el-button>
        <el-table :data="tableData" border>
            <el-table-column prop="subitemName" label="情形"></el-table-column>
            <el-table-column prop="aliasName" label="别名"></el-table-column>
            <el-table-column prop="note" label="备注"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleEdit(scope)" type="primary">编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePagination">
            <el-pagination  @current-change="handleCurrentChange"
                :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
                :total="total"></el-pagination>
        </div>
        <el-dialog title="添加情形" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addForm">
                <el-form-item label="情形名称" required prop="subitemName">
                    <el-input v-model="addForm.subitemName"></el-input>
                </el-form-item>
                <el-form-item label="情形别名">
                    <el-input v-model="addForm.aliasName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubApproval">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑情形" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="editForm">
                <el-form-item label="情形名称" required prop="subitemName">
                    <el-input v-model="editForm.subitemName"></el-input>
                </el-form-item>
                <el-form-item label="情形别名">
                    <el-input v-model="editForm.aliasName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubApproval">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import { getApprovalSub, addApprovalSub, updateApprovalSub, deleteApprovalSub } from "@/api/basicInfo/approvalSub"
import dayjs from "dayjs"

export default {
    name: "ApprovalSubItem",
    mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "subItem",
            itemId: this.$route.query.itemId,
            addDialogVisible: false,
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            addForm: {
                aliasName: "",
                note: "",
                subitemName: "",
            },
            editDialogVisible: false,
            editForm: {
                approvalSubitemId: 0,
                aliasName: "",
                note: "",
                subitemName: "",
            }
        };
    },
    async created() {
        // await this.init();
        this.reloadTable();
    },
    methods: {
        // 查询表格
        async reloadTable() {
            let result = await getApprovalSub({pageNum:this.currentPage});
            if (!result.success) return;
            this.tableData = result.data.records;
            this.total = result.data.total;
        },
        //  切页
        handleCurrentChange(){
            this.reloadTable();
        },
        // 添加
        async addSubApproval() {
            let result = await addApprovalSub({
                "aliasName": this.addForm.aliasName,
                "approvalItemId": this.itemId,
                "note": this.addForm.note,
                "subitemName": this.addForm.subitemName
            })
            if (!result.success) return;
            this.addDialogVisible = false;
            this.reloadTable();
            this.$message({ type: "success", message: "添加成功" })

        },
        // 时间格式化
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD hh:mm:ss")
        },
        // 处理编辑
        handleEdit(scope) {
            this.editForm = _.clone(scope.row);
            this.editDialogVisible = true;
        },
        // 编辑
        async editSubApproval() {
            let result = await updateApprovalSub(this.editForm);
            if (!result.success) return;
            this.reloadTable();
            this.editDialogVisible = false;
        },
        // 删除
        async handleDelete(scope) {
            try {
                await this.$confirm("是否删除", "确认删除",);
                let result = await deleteApprovalSub({ approvalSubitemId: scope.row.approvalSubitemId });
                if (!result.success) return;
                this.$message({ type: "success", message: "删除成功" })
                this.reloadTable();
            } catch (e) {
                this.$message({ type: "warning", message: "取消删除" })
            }


        }
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