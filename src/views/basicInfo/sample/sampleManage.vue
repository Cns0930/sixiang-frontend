<template>
    <div class="workWrap">
        <header>
            <span class="title">样本管理</span>
        </header>
        <div class="workHandleBox">
            <el-upload class="upload-demo" ref="upload" :action="urlImg" :multiple="true" :limit="50" :with-credentials="true"
                :on-success="uploadSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload='true'
                :before-upload="customUpload">
                <el-button type="primary" icon="el-icon-upload" class="button" :loading="loadings" @click="upload()">上传</el-button>
            </el-upload>
            <el-upload class="upload-demo" ref="uploadZip" :action="urlZip" :limit="1" :with-credentials="true"
                :on-success="uploadSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload='true'
                :before-upload="customUploadZip">
                <el-button type="plain" icon="el-icon-upload2" class="button" :loading="loadingZip" @click="upLoadZip">压缩包上传</el-button>
            </el-upload>
            <el-button type="plain" icon="el-icon-upload2" class="button" @click="upLoadZip">压缩包上传</el-button>
            <el-button type="plain" icon="el-icon-upload2" class="button" @click="upLoadAI">AI2.0导入</el-button>
            <el-button type="plain" icon="el-icon-download" class="button" @click="downLoad">下载</el-button>
            <el-button type="plain" icon="el-icon-edit" class="button" @click="reName">重命名</el-button>
            <el-button type="danger" icon="el-icon-delete" class="button" @click="deleteDcument">删除</el-button>
        </div>
        <div class="workBox">
            <div class="history-navigation">
                <div v-for="file in filePathQueue" :key="file.path">
                    <i :class="[file.path === '/' ? 'el-icon-s-home' : 'el-icon-folder']"></i>
                    <span style="cursor: pointer; margin-right: 10px;" @click="goBefore(file)">{{file.name}} / </span>
                </div>
            </div>
            <div class="sampleTable">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'17px',fontWeight:800}"
                    :row-style="{fontSize:'15px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" label="索引" width="55">
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
                    <el-table-column prop="createTime" label="创建时间" :formatter="formatter" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                    <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button> -->
                    <el-button @click="toggleSelection()">取消选择</el-button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import Vue from "vue";
import { mixin } from "@/mixin/mixin"
import { mapGetters, mapState } from "vuex"
import state from '@/vuex/home/state';
import dayjs from "dayjs";
// 接口
// import { getByApprovalItemId } from "@/api/basicInfo/approval"
import { getFileList, } from "@/api/basicInfo/sample/document"

export default {
    name: "SampleManage",
    mixins: [mixin],
    data() {
        return {
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            tableData: [],
            multipleSelection: [],
            filePath: '/',
            filePathQueue: [{ path: '/', name: '根目录', index: 0 }],
            // 上传下载相关
            loadings: false,
            loadingZip: false,
            urlImg: process.env.VUE_APP_BASE_IP + '/docInfo/uploadImg',
            urlZip: process.env.VUE_APP_BASE_IP + '/docInfo/upload'
        }
    },
    computed: {
        ...mapGetters({
            // itemInfo: 'itemInfo'
        }),
        ...mapState({
            itemInfo: state => state.home.item
        })
        // formInline() {
        //     let form =  Object.assign(this.formInline, this.itemInfo);
        //     return form;
        // }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getFileListTable();
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                    // this.$refs.multipleTable.setCurrentRow(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.setCurrentRow();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log('multipleSelection', val);
            if (this.multipleSelection.length === 1) {
                this.$refs.multipleTable.setCurrentRow(this.multipleSelection[0]);
            } else {
                this.$refs.multipleTable.setCurrentRow();
            }
        },

        // 获取文件列表数据
        async getFileListTable() {
            let result = await getFileList({ approvalItemId: this.itemId, dir: this.filePath });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取文件列表信息失败" });
            }
            this.tableData = result.data;
            return;
        },
        formatter(row) {
            // console.log('row, column');
            // console.log(row, column);
            return dayjs(row.createTime).format("YYYY-MM-DD HH:mm:ss");
        },
        // 改变文件目录列表
        changeFileTable(row) {
            if (!row.isdir) return;
            this.filePath = row.filePath;
            this.filePathQueue.push({ path: row.filePath, name: row.fileName, index: this.filePathQueue.length });
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
        // 成功上传文件
        uploadSuccess(res, file) {
            console.log(res)
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
        // 单个或批量上传图片文件IMG
        customUpload(file) {
            this.loadings = true
            let fd = new FormData();
            fd.append("files", file);
            fd.append("basePath", this.filePath);
            fd.append("approvalItemId", this.itemId);
            axios.post(
                this.urlImg,
                fd
            )
                .then(
                    (res) => {
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.loadings = false;
                            this.getFileListTable();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                            this.loadings = false;
                            this.getFileListTable();
                        }
                    },
                );
            return false;
        },
        // 单个上传压缩包文件Zip
        customUploadZip(file) {
            console.log('file');
            console.log(file);
            this.loadingZip = true;
            let fd = new FormData();
            fd.append("docZipFile", file);
            fd.append("basePath", this.filePath);
            fd.append("approvalItemId", this.itemId);
            axios.post(
                this.urlZip,
                fd
            )
                .then(
                    (res) => {
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.loadingZip = false;
                            this.getFileListTable();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                            this.loadingZip = false;
                            this.getFileListTable();
                        }
                    },
                );
            return false;
        },
        // 图片上传，支持批量
        upLoad() {
            this.$refs.upload.submit();
        },
        upLoadZip() {
            this.$refs.uploadZip.submit();
        },
        upLoadAI() {

        },
        reName() {

        },
        deleteDcument() {

        },
        // 下载 支持压缩包和单个图片文件的下载
        async downLoad() {
            if (!this.multipleSelection.length) {
                this.$message.warning("请先选择要下载的样本文件");
                return;
            }
            const idsArray = this.multipleSelection.map(item => item.id);
            console.log('idsArray', idsArray);
            const idsString = idsArray.toString();
            console.log('idsString', idsString);
            let res = await axios({
                method: "get",
                url: "/docInfo/downloadDocFile",
                params: {
                    approvalItemId: this.itemId,
                    ids: idsString
                },
                responseType: "arraybuffer",
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("该事项下没有样本文件");
                return;
            }
            let blob = new Blob([res.data], { type: "application/zip" });
            const a = document.createElement("a");
            // 生成文件路径
            let href = window.URL.createObjectURL(blob);
            a.href = href;
            console.log('res');
            console.log(res);
            // let _fileName = _res.headers['Content-disposition'].split(';')[1].split('=')[1].split('.')[0]
            let _fileName = res.headers["content-disposition"]
                .split(";")[1]
                .split("=")[1];
            // 文件名中有中文 则对文件名进行转码
            a.download = decodeURIComponent(_fileName);
            // 利用a标签做下载
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(href);
        },

    },

}
</script>

<style>

</style>

<style scoped lang="scss">
@import "../../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
        .title {
            margin-right: 20px;
        }
    }
    .workBox {
        width: 100%;
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
        .history-navigation {
            margin-left: 20px;
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: flex-start;
        }
        .sampleTable {
            margin: 20px;
        }
    }
    .workHandleBox {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
        margin: 30px;
        .button {
            margin-right: 12px;
        }
        // background: rgb(219, 237, 238);
        .handleBox {
            width: 300px;
            margin: 20px;
            padding: 10px;
            display: flex;
            // background: rgb(250, 218, 218);
            align-items: center;
            flex-direction: column;
            justify-content: center;
            .title {
                margin: 20px;
            }
        }
    }
}
</style>