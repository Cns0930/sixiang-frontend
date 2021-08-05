<template>
    <div>
        <!-- 样本复用 -->
        <el-dialog title="样本复用" :visible.sync="dialogVisibleReuse" width="50%" :close-on-click-modal="false">
            <div style="margin:10px 0px">
                项目选择:
                <el-select v-model="tempProjectId" placeholder="请选择项目名称" @change="selectProject">
                    <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </div>
            <div>
                事项名称:
                <el-select filterable placeholder="请选择事项名称" v-model="tempItemId" @change="showFileList"
                    style="position:relative">
                    <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                        :value="v.approvalItemId">
                    </el-option>
                </el-select>
            </div>
            <div class="history-navigation" style="margin: 20px">
                <div v-for="file in filePathQueue" :key="file.path" class="textName">
                    <i :class="[file.path === '/' ? 'el-icon-s-home' : 'el-icon-folder']"></i>
                    <span style="cursor: pointer; margin-right: 10px;" @click="goBefore(file)">{{file.name}} / </span>
                </div>
            </div>
            <div class="sampleTable">
                <el-table ref="multipleTableReuse" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:600}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" :selectable="selectEnable">
                    </el-table-column>
                    <el-table-column type="index" label="索引" width="100">
                    </el-table-column>
                    <el-table-column label="文件名">
                        <template slot-scope="scope">
                            <i :class="[scope.row.isdir ? 'el-icon-folder-opened' : 'el-icon-picture-outline']"></i>
                            <el-button type="text" style="font-size: 16px" @click="changeFileTable(scope.row)">
                                {{ scope.row.fileName }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fileSize" label="文件大小">
                    </el-table-column>
                    <el-table-column prop="creator" label="创建者" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmReuse" :loading="loading">复用</el-button>
                <el-button @click="dialogVisibleReuse = false">关闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import axios from 'axios';
// 接口
import {
    listApprovalItemByUser, listProjectAll,
} from "@/api/basicInfo/approval";
import { getFileList, importTag } from "@/api/basicInfo/sample/document"

export default {
    data() {
        return {
            // 文件表格相关
            tableData: [],
            multipleSelection: [],
            filePath: '/',
            filePathQueue: [{ path: '/', name: '根目录', index: 0 }],
            // 样本复用相关
            dialogVisibleReuse: false,
            projectOptions: [],
            typeSubItemOptions: [],
            tempProjectId: '',
            tempItemId: '',
            loading: false
        }
    },
    created() {

    },
    methods: {
        async openDialog() {
            let resultProject = await listProjectAll();
            this.projectOptions = resultProject.data;
            this.dialogVisibleReuse = true;
        },
        closeDialog() {
            this.dialogVisibleReuse = false;
            this.clearTableAndPath();
        },
        async selectProject() {
            this.clearTableAndPath();
            this.tempItemId = '';
            let result = await listApprovalItemByUser({ pageNum: 1, pageSize: 500, projectId: this.tempProjectId });
            this.typeSubItemOptions = result.data.records;
        },
        async showFileList() {
            this.clearTableAndPath();
            if (this.tempItemId) {
                this.getFileListTable();
            }
        },
        async confirmReuse() {
            this.loading = true;
            let idsArray = [];
            this.multipleSelection.forEach(item => {
                idsArray.push(item.id);
            })
            let params = {
                approvalItemId: this.tempItemId,
                ids: idsArray.toString(),
                nowApprovalItemId: this.$route.query.itemId,
            }
            let res = await importTag(params);
            if(!res.success) {
                this.$message.warning('导入失败！');
                this.loading = false;
                return;
            } else {
                this.$message.success('导入成功！');
                this.loading = false;
                this.closeDialog()
                this.$parent.getFileListTable();
            }
        },

        // 文件表格
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTableReuse.toggleRowSelection(row);
                    // this.$refs.multipleTableReuse.setCurrentRow(row);
                });
            } else {
                this.$refs.multipleTableReuse.clearSelection();
                this.$refs.multipleTableReuse.setCurrentRow();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log('multipleSelection', val);
            if (this.multipleSelection.length === 1) {
                this.$refs.multipleTableReuse.setCurrentRow(this.multipleSelection[0]);
            } else {
                this.$refs.multipleTableReuse.setCurrentRow();
            }
        },
        // 禁用图片 禁用多选框函数
        selectEnable(row, rowIndex) {
            if (row.isdir === 1) {
                return true
            }
        },

        // 获取文件列表数据
        async getFileListTable() {
            let result = await getFileList({ approvalItemId: this.tempItemId, dir: this.filePath });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取文件列表信息失败" });
            }
            this.tableData = result.data;
            return;
        },
        // 改变文件目录列表
        async changeFileTable(row) {
            if (!row.isdir) {
                const a = document.createElement("a");
                a.href = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${row.fileId}`
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                return;
            }
            this.filePath = row.filePath;
            if (!this.filePathQueue.find(item => item.path === row.filePath)) {
                this.filePathQueue.push({ path: row.filePath, name: row.fileName, index: this.filePathQueue.length });
            }
            // console.log('this.filePathQueue');
            // console.log(this.filePathQueue);
            this.getFileListTable();
        },
        // 导航回跳
        goBefore(file) {
            // console.log('file');
            // console.log(file);
            this.filePath = file.path;
            this.filePathQueue = this.filePathQueue.filter(i => i.index <= file.index);
            this.getFileListTable();
        },
        // 情况表格
        clearTableAndPath() {
            this.tableData = [];
            this.multipleSelection = [];
            this.filePath = '/';
            this.filePathQueue = [{ path: '/', name: '根目录', index: 0 }];
        }
    }
}
</script>

<style>

</style>