<template>
    <div class="workWrap">
        <header>
            <span class="title">样本管理</span>
        </header>
        <div class="workHandleBox">
            <el-upload class="upload-demo" ref="upload" :action="urlImg" :multiple="true" :limit="50"
                :with-credentials="true" :on-success="uploadSuccess" :on-remove="handleRemove" :on-exceed="handleExceed"
                :auto-upload='true' :before-upload="customUpload">
                <el-button type="primary" icon="el-icon-upload" class="button" :loading="loadings" @click="upload()">上传
                </el-button>
            </el-upload>
            <el-upload class="upload-demo" ref="uploadZip" :action="urlZip" :limit="1" :with-credentials="true"
                :on-success="uploadSuccess" :on-error="uploadError" :on-remove="handleRemove" :on-exceed="handleExceed"
                :auto-upload='true' :before-upload="customUploadZip">
                <el-button type="plain" icon="el-icon-upload2" class="button" :loading="loadingZip" @click="upLoadZip">
                    压缩包上传</el-button>
            </el-upload>
            <el-button type="plain" icon="el-icon-upload2" class="button" disabled @click="upLoadAI">AI2.0导入</el-button>
            <el-button type="plain" icon="el-icon-download" class="button" :loading="loadingDownFile"
                :disabled="multipleSelection.length === 0" @click="downLoad">下载</el-button>
            <el-button type="plain" icon="el-icon-edit" class="button" :disabled="multipleSelection.length !== 1"
                @click="reName">重命名</el-button>
            <el-button type="danger" icon="el-icon-delete" class="button" :disabled="multipleSelection.length === 0"
                @click="deleteDcument">删除</el-button>
        </div>
        <div class="workBox">
            <div class="history-navigation">
                <div v-for="file in filePathQueue" :key="file.path" class="textName">
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
                    <el-table-column label="标定">
                        <template slot-scope="scope">
                            <el-button v-show="scope.row.isdir" type="text" style="font-size: 16px"
                                @click="goCaseDem(scope.row)">标定</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                    <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button> -->
                    <el-button @click="toggleSelection()">取消选择</el-button>
                </div>
            </div>
        </div>
        <!-- rename弹窗 -->
        <el-dialog title="重命名文件" :visible.sync="dialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="文件名称：">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="重命名提示：" style="background: #EAF0FF; height: 60px; border-radius: 10px">
                    <span>修改文件名不会改变文件属性，如重命名 1.png 为 1.jpg ，源文件属性仍为 png 文件</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>

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
import { getFileList, deleteDoc, modifyFileName } from "@/api/basicInfo/sample/document"

export default {
    name: "SampleManage",
    mixins: [mixin],
    data() {
        return {
            // 初始参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 文件表格相关
            tableData: [],
            multipleSelection: [],
            filePath: '/',
            filePathQueue: [{ path: '/', name: '根目录', index: 0 }],
            // 上传下载相关
            loadings: false,
            loadingZip: false,
            loadingDownFile: false,
            urlImg: process.env.VUE_APP_BASE_IP + '/docInfo/uploadImg',
            urlZip: process.env.VUE_APP_BASE_IP + '/docInfo/upload',
            // 编辑名字
            dialogVisible: false,
            form: {
                name: ''
            },
            // 预览图片相关
            imgInfo: []
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
        uploadError(err) {
            console.log(err);
            this.$message.error(err);
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
            try {
                axios.post(
                    this.urlZip,
                    fd, { timeout: 1000 * 180 }
                ).then(
                    (res) => {
                        console.log('rescode', res.code);
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
                ).catch(error => {
                    this.loadingZip = false;
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        //   console.log(error.response.data);
                        //   console.log(error.response.status);
                        //   console.log(error.response.headers);
                        this.$message.warning('哦no，不知道后端的开发又搞了什么乱子！');
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        //   console.log(error.request);
                        this.$message.warning('你用的2g网络么，现在都5g时代了！');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        //   console.log('Error', error.message);
                        this.$message.warning('哦no，不知道后端的开发又搞了什么乱子！');
                    }
                    // console.log(error.config);
                });
            } catch (error) {
            }
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
        // 编辑文件名
        reName() {
            this.form.name = this.multipleSelection[0].fileName;
            this.dialogVisible = true;
        },
        async confirmEdit() {
            const docId = this.multipleSelection[0].id;
            console.log('docId');
            console.log(docId);
            let result = await modifyFileName({ docId: docId, newName: this.form.name });
            if (!result.success) return;
            this.dialogVisible = false;
            await this.getFileListTable();
        },
        async deleteDcument() {
            const idsArray = this.multipleSelection.map(item => item.id);
            const confirmResult = await this.$confirm('该操作不可撤销，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            /*如果用户确认打印confirm,如果用户取消显示cancel*/
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除!');
            }
            console.log('确认了删除');
            let request = {
                approvalId: this.itemId,
                ids: idsArray
            }
            let result = await deleteDoc(request);
            if (result.success) {
                this.$message.success('删除成功');
            }
            await this.getFileListTable();

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
            this.loadingDownFile = true;
            let res;
            try {
                res = await axios({
                    method: "get",
                    url: "/docInfo/downloadDocFile",
                    params: {
                        approvalItemId: this.itemId,
                        ids: idsString
                    },
                    responseType: "arraybuffer",
                    timeout: 1000 * 180
                });
            } catch (error) {
                this.loadingDownFile = false;
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    //   console.log(error.response.data);
                    //   console.log(error.response.status);
                    //   console.log(error.response.headers);
                    this.$message.warning('哦no，不知道后端的开发又搞了什么乱子！');
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    //   console.log(error.request);
                    this.$message.warning('你用的2g网络么，现在都5g时代了！');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    //   console.log('Error', error.message);
                    this.$message.warning('哦no，不知道后端的开发又搞了什么乱子！');
                }
            }
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
            this.loadingDownFile = false;
        },
        // 跳转到样本标定
        goCaseDem(row) {
            console.log('row');
            console.log(row);
            this.filePathQueue.push({ path: row.filePath, name: row.fileName, index: this.filePathQueue.length });
            this.$router.push({
                path: "/basic/sampleDemarcate",
                query: {
                    itemId: this.itemId,
                    projectId: this.projectId,
                    filePath: row.filePath,
                    filePathQueue: JSON.stringify(this.filePathQueue)
                },
            });
        }

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
            .textName:hover {
                color: #f5527a;
            }
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