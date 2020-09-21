<template>
    <div class="workWrap">
        <header>材料字段管理</header>
        <el-button @click="addDialogVisible = true" type="primary" style="margin-bottom:10px">添加</el-button>
        <el-table :data="tableData" border>
            <el-table-column prop="materialName" label="材料名称"></el-table-column>
            <el-table-column prop="fieldName" label="字段名称"></el-table-column>
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
        <!--添加字段-->
        <el-dialog title="添加材料字段" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addForm">
                <el-form-item label="材料名称" prop="materialName">
                    <el-select v-model="addForm.materialW" clearable placeholder="请选择材料名称">
                        <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName" :value="v.materialId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段名称" required prop="fieldName">
                    <el-input v-model="addForm.fieldName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addField">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑字段-->
        <el-dialog title="编辑材料字段" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <el-form label-width="80px" :model="editForm">
            <el-form-item label="材料名称" prop="materialName">
                <el-select v-model="editForm.materialId" clearable placeholder="请选择材料名称">
                    <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName" :value="v.materialId"> </el-option>
                </el-select>
            </el-form-item>
                <el-form-item label="字段名称" required prop="fieldName">
                    <el-input v-model="editForm.fieldName"></el-input>
                </el-form-item>
                
                <el-form-item label="备注">
                    <el-input v-model="editForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editField">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import { getField, addField, updateField, deleteField,getAllByApprovalItemId,listField,listFieldUnionMaterial } from "@/api/basicInfo/field";
import dayjs from "dayjs";
export default {
    name: "FieldItem",
    mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "field",
            itemId: this.$route.query.itemId,
            addDialogVisible: false,
            tableData: [],
            material_change: "",
            pageSize: 10,
            currentPage: 1,
            typeMaterialOptions: [],
            total: 0,
            addForm: {
                aliasName: "",
                note: "",
                subitemName: "",
            },
            editDialogVisible: false,
            editForm: {
                fielditemId: 0,
                aliasName: "",
                note: "",
                subitemName: "",
            }
        };
    },
    async created() {
        // await this.init();
        this.materialList();
        this.reloadTable();
    },
    methods: {
        // 查询表格
        async reloadTable() {
            let result = await listFieldUnionMaterial({pageNum:this.currentPage,pageSize:this.pageSize});
            if (!result.success) return;
            this.tableData = result.data.records;
            this.total = result.data.total;
        },
        //  切页
        handleCurrentChange(){
            this.reloadTable();
        },
        // 查询当前事项下的所有材料
        async materialList(){
            let result = await getAllByApprovalItemId({approvalItemId: this.itemId});
            if (!result.success) return;
            this.typeMaterialOptions = result.data;
        },
        // 添加
        async addField() {
            let result = await addField({
                "materialId": this.addForm.materialW,
                "approvalItemId": this.itemId,
                "note": this.addForm.note,
                "fieldName": this.addForm.fieldName
            })
            if (!result.success) return;
            this.addDialogVisible = false;
            this.reloadTable();
            this.$message({ type: "success", message: "添加成功" })

        },

        // 处理编辑
        handleEdit(scope) {
            this.editForm = _.clone(scope.row);
            this.material_change = scope.row.materialName;
            console.log("this.editForm:",this.editForm)
            this.editDialogVisible = true;
        },
        // 编辑
        async editField() {
            let result = await updateField(this.editForm);
            if (!result.success) return;
            this.reloadTable();
            this.editDialogVisible = false;
        },
        // 删除
        async handleDelete(scope) {
            try {
                await this.$confirm("是否删除", "确认删除",);
                let result = await deleteField({ fieldId: scope.row.fieldId });
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