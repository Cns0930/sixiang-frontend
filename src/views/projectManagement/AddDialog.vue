<template>
    <div class="dialog-content">
        <el-dialog title="提示: 退出窗口会重置操作" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose">
            <div class="btn-list">
                <el-upload class="upload-demo" accept=".zip" multiple action="1" :before-remove="()=>false"
                    :file-list="fileList" :auto-upload="true" :http-request="change">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传.zip文件</div>
                </el-upload>
                <el-button type="primary" @click="download()" style="margin-left:200px">下载所选</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center">
                </el-table-column>
                <el-table-column prop="projectName" label="项目名称" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="事项名称" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="fileName" label="文件名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="saveUserName" label="提交用户" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="commitLog" label="提交备注" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel()">取 消</el-button>
                <el-button type="primary" @click="sure()">完成并退出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import {
    apiGetItemListByUploadZip, apidelectFileByPath,
} from "../../api/basicInfo/approval";
import { batchDownload } from "@/utils/download.js"

export default {
    name: 'AddDialog',
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            fileList: [],
            multipleSelection: []
        }
    },
    created() {
    },
    methods: {
        handleClose() {
            this.sure()
        },
        cancel() {
            this.sure()
        },
        async change(e) {
            const form = new FormData();
            form.append("file", e.file);
            const result = await apiGetItemListByUploadZip(form);
            if (result.code === 200) {
                if (result.data.length === 0) {
                    return
                }
                const newArr = this.ArrayToHeavy([...result.data, ...this.tableData]);
                this.tableData = newArr;
            } else {
                this.$message.error(result.msg)
            }
        },
        ArrayToHeavy(arr) {
            let result = [];
            let obj = {};
            for (let i = 0; i < arr.length; i++) {
                if (!obj[arr[i].fileName]) {
                    result.push(arr[i]);
                    obj[arr[i].fileName] = true;
                }
            }
            return result
        },
        async sure() {
            const arr = this.tableData.map(item => {
                return item.filePath
            })
            const result = await apidelectFileByPath(arr);
            if (result.code === 200) {
                this.dialogVisible = false;
                this.fileList = [];
            } else {
                this.$message.error(result.msg)
            }
        },
        handleSelectionChange(e) {
            this.multipleSelection = e;
        },
        async download() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning("你还没有选择要下载的文件")
                return
            };
            batchDownload(this.multipleSelection)
        }
    }
}
</script>

<style scoped lang="scss">
.dialog-content {
    .btn-list {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
    }
}
</style>