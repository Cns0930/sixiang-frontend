<template>
    <div class="workWrap">
        <header>材料附件管理</header>
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 20px 0px;">
            <el-tab-pane label="word类型附件" name="word">word类型附件</el-tab-pane>
            <el-tab-pane label="other类型附件" name="other">other类型附件</el-tab-pane>
            </el-tabs>
        </template>
        <el-button @click="openAddWordDialog" type="primary" style="margin-bottom:10px" v-if="activeName === 'word'">上传word附件</el-button>
        <el-button @click="addOtherDialogVisible = true" type="primary" style="margin-bottom:10px" v-if="activeName === 'other'">上传other附件</el-button>
        <!-- word type -->
        <el-table :data="tableDataWord" border v-if="activeName === 'word'">
            <el-table-column prop="fileVersion" label="版本"></el-table-column>
            <el-table-column prop="filePath" label="word文件名" :formatter="fileNameFormatter"></el-table-column>
            <el-table-column prop="operateUser" label="创建者"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="notes" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleDownload(scope.row)" type="primary" :disabled="scope.row.latest === false">下载</el-button>
                        <!-- <el-button type="danger" @click="handleDelete(scope)">删除</el-button> -->
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
            <!--添加字段-->
        <el-dialog title="上传word类型文件" :visible.sync="addWordDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addFormWord">
                <el-form-item label="备注">
                    <el-input v-model="addFormWord.notes"></el-input>
                </el-form-item>
                <el-form-item label="上传word">
                    <el-upload
                        class="upload-demo" 
                        ref="upload" 
                        :action="url" 
                        :limit="2"
                        multiple
                        :with-credentials="true"
                        accept=".docx" 
                        :on-success="upFile"
                        :data="this.addFormWord"
                        :on-remove="handleRemove" 
                        :on-exceed="handleExceed"
                        :auto-upload="false"
                    >
                        <el-button type="primary" @click="add('addFormWord')">添加</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addWordDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="upload()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- other type -->
        <el-table :data="tableDataOther" border v-if="activeName === 'other'">
            <el-table-column prop="fileVersion" label="版本"></el-table-column>
            <el-table-column prop="filePath" label="other文件名" :formatter="fileNameFormatter"></el-table-column>
            <el-table-column prop="operateUser" label="创建者"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="notes" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleEdit(scope)" type="primary" :disabled="scope.row.latest === false">下载</el-button>
                        <!-- <el-button type="danger" @click="handleDelete(scope)">删除</el-button> -->
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
            <!--添加字段-->
        <el-dialog title="上传other类型文件" :visible.sync="addOtherDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addFormOther">
                <el-form-item label="备注">
                    <el-input v-model="addFormOther.notes"></el-input>
                </el-form-item>
                <el-form-item label="上传的文件" required prop="fieldName">
                    <el-input v-model="addFormOther.file"></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addOtherDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="upload">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import { getField, addField, updateField, deleteField, getAllByApprovalItemId, listField, listFieldUnionMaterial } from "@/api/basicInfo/field";
import { listAccessory, downloadFile, uploadFile } from "@/api/basicInfo/accessory"
import dayjs from "dayjs";
export default {
    name: "FieldItem",
    mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "field",
            itemId: this.$route.query.itemId,
            addWordDialogVisible: false,
            addOtherDialogVisible: false,
            tableDataWord: [],
            tableDataOther: [],
            material_change: "",
            pageSize: 10,
            currentPage: 1,
            typeMaterialOptions: [],
            total: 0,
            url: process.env.VUE_APP_BASE_IP + "/superform/additional/uploadWord",
            fileList: [],
            addFormWord: {
                approvalItemId: null,
                notes: "",
                type: null,
                operateUser: null,
            },
            addFormOther: {
                approvalItemId: null,
                notes: "",
                file: [],
                type: null,
                operateUser: null,
            },
            editDialogVisible: false,
            editForm: {
                fielditemId: 0,
                aliasName: "",
                note: "",
                subitemName: "",
            },
            activeName: 'word',
        };
    },
    computed: {
        // upData: function () {
        //     return {
        //         uploadAdditionalMo: JSON.stringify(this.addFormWord)
        //     }
        // }
    },
    async created() {
        // await this.init();
        // this.materialList();
        this.reloadTable();
    },
    methods: {
        // 查询表格
        async reloadTable() {
            console.log("this.itemId:", this.$route.query.itemId)
            let result = await listAccessory({ approvalItemId: this.itemId, type: 'word' });
            if (!result.success) return;
            this.tableDataWord = result.data;
            let res = await listAccessory({ approvalItemId: this.itemId, type: 'other' });
            if (!res.success) return;
            this.tableDataOther = res.data;
        },
        fileNameFormatter(row, column, cellValue, index) {
            let location = 0
            for (let i = 0; i < cellValue.length; i++) {
                if (cellValue[i] === '\\') {
                    location = i;
                }
            }
            return cellValue.substring(location + 1);
        },
        // 切换标签
        handleClick(tab, event) {
            console.log(tab, event);
        },
        openAddWordDialog() {
            this.addFormWord.type = this.activeName;
            this.addFormWord.operateUser = localStorage.getItem("username");
            this.addFormWord.approvalItemId = this.itemId;
            console.log('this.addFormWord');
            console.log(this.addFormWord);
            this.addWordDialogVisible = true;
        },
        // 上传文件
        add(addFormWord) {
            this.addFormWord.type = this.activeName;
            this.addFormWord.operateUser = localStorage.getItem("username");
            this.addFormWord.approvalItemId = this.itemId;
            this.$refs.upload.submit();
        },
        async upload() {
            this.addFormWord.type = this.activeName;
            this.addFormWord.operateUser = localStorage.getItem("username");
            this.addFormWord.approvalItemId = this.itemId;
            console.log('addFormWord');
            console.log(this.addFormWord);
            this.$refs.upload.submit();
        },
        // 成功上传文件
        upFile(res, file) {
            if (res.status == 200) {
                this.$message.success(res);
            }
            // else {
            //     this.$message.warning(res.info);
            //     let _this = this;
            //     setTimeout(function () {
            //         _this.$refs.upload.clearFiles();
            //     }, 1000);
            // }
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`当前只能选择上传2 个文件`);
        },
        //  移除文件
        handleRemove(res, file, fileList) {
            this.$message.warning(`移除当前${res.name}文件，请重新选择文件上传！`);
        },

        // 处理编辑
        async handleDownload(row) {
            console.log('row');
            console.log(row);
            let request = {
                approvalItemId: row.approvalItemId,
                type: row.type
            };
            let res = await downloadFile(request);
            if (res.success) {
                this.$message({ type: "success", message: "下载成功" });
            } else {
                this.$message({ type: "warning", message: "下载失败" });
            }
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