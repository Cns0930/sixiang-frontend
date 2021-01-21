<template>
    <div class="workWrap">
        <header>材料附件管理</header>
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 20px 0px;">
            <el-tab-pane label="模板类型附件" name="word">模板类型附件</el-tab-pane>
            <el-tab-pane label="其他类型附件" name="other">其他类型附件</el-tab-pane>
            </el-tabs>
        </template>
        <el-button @click="addWordDialogVisible = true" type="primary" style="margin-bottom:10px" v-if="activeName === 'word'">上传模板附件</el-button>
        <el-button @click="addOtherDialogVisible = true" type="primary" style="margin-bottom:10px" v-if="activeName === 'other'">上传其他附件</el-button>
        <!-- word type -->
        <el-table :data="tableDataWord" border v-if="activeName === 'word'">
            <el-table-column prop="fileVersion" label="版本"></el-table-column>
            <el-table-column prop="filePath" label="模板文件Name" :formatter="fileNameFormatter"></el-table-column>
            <el-table-column prop="operateUser" label="创建者"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="notes" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleDownload(scope.row)" type="primary" :disabled="scope.row.latest === false">下载</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
            <!--添加字段-->
        <el-dialog title="上传word类型文件" :visible.sync="addWordDialogVisible" width="50%" :close-on-click-modal="false" v-if="activeName === 'word'">

            <el-form label-width="80px" :model="addFormWord">
                <el-form-item label="备注">
                    <el-input v-model="addFormWord.notes"></el-input>
                </el-form-item>
                <el-form-item label="上传模板">
                    <el-upload
                        class="upload-demo" 
                        ref="upload" 
                        :action="url" 
                        :limit="1"
                        accept=".zip, .rar"
                        :with-credentials="true"
                        :on-success="upFile"
                        :data="this.addFormWord"
                        :on-remove="handleRemove" 
                        :on-exceed="handleExceed"
                        :auto-upload="false"
                        :before-upload="customUpload"
                    >
                        <el-button type="primary">添加</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传压缩包文件</div>
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
            <el-table-column prop="filePath" label="其他文件Name" :formatter="fileNameFormatter"></el-table-column>
            <el-table-column prop="operateUser" label="创建者"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="notes" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleDownload(scope.row)" type="primary" :disabled="scope.row.latest === false">下载</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
            <!--添加字段-->
        <el-dialog title="上传other类型文件" :visible.sync="addOtherDialogVisible" width="50%" :close-on-click-modal="false" v-if="activeName === 'other'">
            <el-form label-width="80px" :model="addFormWord">
                <el-form-item label="备注">
                    <el-input v-model="addFormWord.notes"></el-input>
                </el-form-item>
                <el-form-item label="上传其他">
                    <el-upload
                        class="upload-demo" 
                        ref="upload" 
                        :action="url" 
                        :limit="1"
                        accept=".zip, .rar"
                        :with-credentials="true"
                        :on-success="upFile"
                        :data="this.addFormWord"
                        :on-remove="handleRemove" 
                        :on-exceed="handleExceed"
                        :auto-upload="false"
                        :before-upload="customUpload"
                    >
                        <el-button type="primary">添加</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传压缩包文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addOtherDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="upload()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {mixin} from "@/mixin/mixin"
import { getField, addField, updateField, deleteField, getAllByApprovalItemId, listField, listFieldUnionMaterial } from "@/api/basicInfo/field";
import { listAccessory, downloadFile, uploadFile } from "@/api/basicInfo/accessory"
import dayjs from "dayjs";
import axios from "axios";
export default {
    name: "FieldItem",
    mixins: [mixin],
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
        // 获取项目信息
        await this.initProject();
        await this.init();
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
            let location = cellValue.lastIndexOf("\/");
            return cellValue.substring(location + 1);
        },
        // 切换标签
        handleClick(tab, event) {
            this.reloadTable();
            this.addFormWord = {
                approvalItemId: null,
                notes: "",
                type: null,
                operateUser: null,
            };
            this.$refs.upload.clearFiles();
        },
        // 上传文件
        customUpload(file) {
            let fd = new FormData();
            fd.append("file", file);
            fd.append("approvalItemId", this.itemId)
            fd.append("notes", this.addFormWord.notes)
            fd.append("type", this.activeName)
            fd.append("operateUser", localStorage.getItem("username"))
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
                        if (res.data.data === 'SUCCESS') {
                            this.$message.success('上传成功');
                            this.reloadTable();
                            this.$refs.upload.clearFiles();
                            this.addWordDialogVisible = false;
                            this.addOtherDialogVisible = false
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                        }
                    },
                );
            return false;
        },
        upload() {
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
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`只能选择上传 1 个文件`);
        },
        //  移除文件
        handleRemove(file, fileList) {
        },

        // 进行下载
        async handleDownload(row) {
            await axios({ method: 'get', url: "/superform/additional/downloadWord", params: { approvalItemId: row.approvalItemId, type: row.type }, responseType: 'arraybuffer' }).then((_res) => {
                let blob = new Blob([_res.data], { type: 'application/zip' });
                const a = document.createElement('a')
                // 生成文件路径
                let href = window.URL.createObjectURL(blob)
                a.href = href
                // let _fileName = _res.headers['Content-disposition'].split(';')[1].split('=')[1].split('.')[0]
                let _fileName = _res.headers['content-disposition'].split(';')[1].split('=')[1]
                // 文件名中有中文 则对文件名进行转码
                a.download = decodeURIComponent(_fileName)
                // 利用a标签做下载
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(href)
            })
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