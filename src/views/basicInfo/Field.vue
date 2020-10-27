<template>
    <div class="workWrap">
        <header>材料字段管理</header>
        <el-button @click="addDialogVisible = true" type="primary" style="margin-bottom:10px">添加</el-button>
        <el-button @click="openImportDialog" type="primary" style="margin-bottom:10px">导入</el-button>
        <div class="upload-box">
        <el-upload class="upload-demo" ref="upload" :action="url" :limit="1" accept=".xlsx" :with-credentials="true"
            :on-success="upFile" :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload="false"
            :before-upload="customUpload">
            <el-button type="primary">选择材料字段数据Excel</el-button>
            <el-button type="success" @click="upload()">导入</el-button>
            <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
        </el-upload>
        
        </div>
        <el-table :data="tableData" border style="margin-top: 10px;">
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
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next" :total="total"></el-pagination>
        </div>
        <div class="right-bar">
            <el-button class="button" size="medium" @click="goFormconstructor" round>前端字段管理<i
                    class="el-icon-edit"></i>帮办工具模块<i class="el-icon-right el-icon--right"></i></el-button>
        </div>
        <!--添加字段-->
        <el-dialog title="添加材料字段" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addForm">
                <el-form-item label="材料名称" prop="materialName">
                    <el-select v-model="addForm.materialW" clearable placeholder="请选择材料名称" @focus="changeMaterialValue">
                        <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                            :value="v.materialId"> </el-option>
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
                        <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                            :value="v.materialId"> </el-option>
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
        <!-- 导入字段 -->
        <el-dialog title="导入材料字段" :visible.sync="importDialogVisible" width="75%" :close-on-click-modal="false">
            <div class="searchBox">
                <el-input placeholder="筛选事项名称/材料名称/材料编码" v-model="reloadTableItem.keyword" clearable
                    style="width: 250px;" @keyup.native.enter='materialSearch' @change="materialSearch"></el-input>
                <el-button @click="materialSearch">搜索</el-button>
            </div>

            <el-table ref="multipleTable" class="workTable" :data="tableDataImport" style="width: 100%;" border
                tooltip-effect="dark">
                <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>
                <el-table-column prop="approvalItemId" label="审批事项编号" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="itemName" label="审批事项名称"></el-table-column>
                <el-table-column prop="materialCode" label="材料编码" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="materialId" label="材料ID" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="materialName" label="材料名称"></el-table-column>

                <el-table-column label="是否关联" fixed="right" width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isRelevance">
                            <span style="display: none;">{{scope.$index}}</span>
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="materialName" label="关联材料名称" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.aimsMaterialId" clearable placeholder="请选择材料名称">
                            <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                                :value="v.materialId"> </el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type='text' @click="LookMaterial(scope.row)">查看该材料字段</el-button>
                        <el-button type='text' @click="importMaterial(scope.row)">导入字段</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChangeImport" :current-page.sync="currentPageImport"
                    :page-size="reloadTableItem.pagesize" layout="total, prev, pager, next" :total="totalImport">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 查看字段 -->
        <el-dialog :title="getMaterialName" :visible.sync="lookFieldsDialogVisible" width="50%"
            :close-on-click-modal="false">
            <div v-if="this.lookFieldsData.length !== 0">
                <el-row :gutter="20" v-for="(item,index) in lookFieldsData" :key="index">
                    <el-col :span="6" v-for="fieldName in item" :key="fieldName">
                        <div class="grid-content bg-purple">{{fieldName}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">{{noLookFieldsData}}</div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lookFieldsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="importMaterial(materialRow)">导 入</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import {
    getField, addField, updateField, deleteField,
    getAllByApprovalItemId, listField,
    listFieldUnionMaterial, listAllMaterial, importfields, lookfields
} from "@/api/basicInfo/field";
import dayjs from "dayjs";
import { getRolelist } from '@/api/item';
import axios from "axios";
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
            },
            // 导入材料字段相关
            importDialogVisible: false,
            tableDataImport: [],
            totalImport: null,
            currentPageImport: 1,
            totalImport: null,
            reloadTableItem: {
                approvalItemId: null,
                pageNum: null,
                pageSize: null,
                keyword: null,
                materialStatus: null,
            },
            importRequest: {
                aimsMaterialId: null,
                approvalItemId: null,
                materialId: null,
            },
            // 导入材料->查看该材料下字段
            lookFieldsDialogVisible: false,
            materialRow: null,
            lookFieldsData: [],
            getMaterialName: null,
            noLookFieldsData: null,
            // 文件上传
            fileList: [],
            url: process.env.VUE_APP_BASE_IP + "/ss/Import/ssFieldImportData",
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
            console.log("this.itemId:", this.$route.query.itemId)
            let result = await listFieldUnionMaterial({ approvalItemId: this.itemId, pageNum: this.currentPage, pageSize: this.pageSize });
            if (!result.success) return;
            this.tableData = result.data.records;
            this.total = result.data.total;
        },
        //  切页
        handleCurrentChange() {
            this.reloadTable();
        },
        // 查询当前事项下的所有材料
        async materialList() {
            let result = await getAllByApprovalItemId({ approvalItemId: this.itemId });
            if (!result.success) return;
            this.typeMaterialOptions = result.data;
        },
        // 添加字段的导入材料字段
        changeMaterialValue() {
            this.typeMaterialOptions.forEach(v => {
                if (v.materialName === null) {
                    v.materialName = v.docxTemplateName;
                }
            })
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


        },
        // 导入字段相关
        async reloadImportTable() {
            console.log("this.itemId:", this.$route.query.itemId)
            this.reloadTableItem.pageNum = this.currentPageImport;
            let result = await listAllMaterial(this.reloadTableItem);
            if (!result.success) return;
            this.tableDataImport = result.data.records;
            this.tableDataImport.forEach(item => {
                this.$set(item, "aimsMaterialId", null);
                this.$set(item, "isRelevance", true);
            });
            this.totalImport = result.data.total;
        },
        handleCurrentChangeImport() {
            this.reloadImportTable();
        },
        materialSearch() {
            this.currentPageImport = 1;
            this.reloadImportTable();
        },
        openImportDialog() {
            this.reloadImportTable();
            this.importDialogVisible = true;
        },
        async importMaterial(row) {
            console.log('row');
            console.log(row);
            this.importRequest = {
                aimsMaterialId: null,
                approvalItemId: null,
                materialId: null,
            };
            this.importRequest.approvalItemId = this.itemId;
            this.importRequest.materialId = row.materialId;
            if (row.isRelevance) {
                if (row.aimsMaterialId === null) {
                    this.$message({ type: "warning", message: "请选择要导入的材料" });
                    return;
                }
                this.importRequest.aimsMaterialId = row.aimsMaterialId;
            }
            let result = await importfields(this.importRequest);
            if (!result.success) {
                this.$message({ type: "warning", message: "导入失败" });
                return;
            } else if (result.data === 0) {
                this.$message({ type: "warning", message: "该材料下无字段可导入" });
                return;
            } else {
                this.reloadTable();
                this.$message({ type: "success", message: "导入成功" });
                this.lookFieldsDialogVisible = false;
            }
        },
        async LookMaterial(row) {
            this.lookFieldsData = [];
            this.noLookFieldsData = null;
            console.log('row');
            console.log(row);
            if (row.materialName !== null) {
                this.getMaterialName = row.materialName;
            } else {
                this.getMaterialName = '无材料名';
            }
            this.materialRow = row;
            let result = await lookfields({ materialId: row.materialId });
            let fieldData = [];
            if (result.data.length === 0) {
                this.noLookFieldsData = '该材料下无对应的字段';
            } else {
                this.noLookFieldsData = null;
            }
            let y = 0;
            for (let i = 0; i < result.data.length; i += 1) {
                fieldData.push(result.data[i].fieldName);
                y += 1;
                if (y === 4) {
                    this.lookFieldsData.push(fieldData);
                    y = 0;
                    fieldData = [];
                }
            }
            this.lookFieldsData.push(fieldData);
            this.lookFieldsDialogVisible = true;
        },
        // 跳转到帮办工具模块并打开新标签页
        goFormconstructor() {
            let routeUrl = this.$router.resolve({ name: "FormConstructor", query: { 'itemId': this.$route.query.itemId } });
            window.open(routeUrl.href, '_blank');
            // this.$router.push({ name: "FormConstructor", query:{'itemId': this.$route.query.itemId }});
        },
        // 上传文件
        customUpload(file) {
            let fd = new FormData();
            fd.append("file", file);
            console.log('fd');
            console.log(fd);
            axios.post(
                this.url,
                fd
            )
                .then(
                    (res) => {
                        console.log('res');
                        console.log(res);
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.reloadTable();
                            this.$refs.upload.clearFiles();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                        }
                    },
                );
            return false;
        },
        upload() {
            this.$refs.upload.submit();
        },
        // 成功上传文件
        upFile(res, file) {
            if (res.status == 200) {
                this.$message.success(res);
            }
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`只能选择上传 1 个文件`);
        },
        //  移除文件
        handleRemove(file, fileList) {
        },
    }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    .upload-box {
        padding: 10px 12px 12px 12px;
        width: 250px;
        background: #f0f2f5;
        display: flex;
        flex-direction: row;
    }
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
    }
    .searchBox {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        background: #fff;
    }
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #ffffff;
    }
    .bg-purple {
        background: #ffffff;
    }
    .bg-purple-light {
        background: #ffffff;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .right-bar {
        .button {
            //   width: 60px;
            //   height: 20px;
            font-size: 18px;
            font-weight: 600;
            font-family: Tahoma, Helvetica, "Arial", "Microsoft YaHei", "宋体",
                sans-serif;
        }
    }
}
</style>