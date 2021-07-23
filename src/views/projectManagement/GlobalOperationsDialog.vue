<template>
    <el-dialog title="全局操作-Dialog" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false" @closed="closedFn">
        <div class="workHandleBoxContent">
            <!-- <div class="handleBox">
                <p class="title">批量下载事项配置</p>
                <el-upload class="upload-demo" ref="upload" action="111" :multiple="true" :limit="50"
                    :with-credentials="true" :auto-upload='true' :before-upload="customUpload">
                    <el-button type="primary" icon="el-icon-upload" class="button" :loading="loading" @click="upLoad()">
                        上传json下载事项配置
                    </el-button>
                </el-upload>
            </div> -->
            <div class="block">
                <span class="demonstration">请选择事项: </span>
                <el-cascader v-model="idList" placeholder="试试搜索：项目名称/阶段/事项名称" :options="approvalItemOptions"
                    :props="{ multiple: true }" filterable clearable style="width: 500px">
                </el-cascader>
                <el-button type="primary" :loading="loading" @click="downLoad('/ss/Import/downloadGitZipByLordId')"
                    style="margin-left: 20px">下载</el-button>
            </div>
            <div class="block">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="60">
                    </el-table-column>
                    <el-table-column prop="projectName" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="itemName" label="事项名称">
                    </el-table-column>
                    <el-table-column prop="developer" label="开发负责人">
                    </el-table-column>
                    <el-table-column prop="itemStage" label="事项阶段">
                    </el-table-column>
                    <el-table-column prop="commitLog" label="说明">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios'
import {
    listApprovalItemByStage, gitZipchecklistByLordId
} from "@/api/basicInfo/approval";
export default {
    data() {
        return {
            dialogVisible: false,
            loading: false,
            approvalItemOptions: [],
            idList: [],
            tableData: [],
        }
    },
    methods: {
        async openDialog() {
            this.dialogVisible = true;
            let res = await listApprovalItemByStage()
            if (!res.success) return
            this.approvalItemOptions = res.data;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        closedFn() {
            this.idList = []
            this.tableData = []
        },
        // 下载 Post接口方法
        async downLoad(url) {
            if (!this.idList.length) {
                this.$message.warning('请先选择事项')
                return
            }
            this.loading = true;
            let newIdList = this.idList.map(item => { return Number(item[2]) })
            console.log('newIdList');
            console.log(newIdList)
            let res = await axios({
                method: "post",
                url: url,
                data: {
                    idList: newIdList,
                },
                timeout: 1000 * 60,
                responseType: "arraybuffer",
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("没有需要下载的文件");
                this.loading = false;
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
            this.loading = false;
            this.getTableData(newIdList);
        },
        async getTableData(ids) {
            let res = await gitZipchecklistByLordId({ idList: ids })
            if (!res.success) return
            this.tableData = res.data
        },
        indexMethod(index) {
            return index + 1;
        },
        // 上传
        // upLoad() {
        //     this.$refs.upload.submit();
        // },
        // async customUpload(file) {
        //     console.log('file');
        //     console.log(file);
        //     this.loading = true;
        //     let fd = new FormData();
        //     fd.append("file", file);
        //     let Url = process.env.VUE_APP_BASE_IP + '/ss/Import/downloadGitZipBySid';
        //     console.log({
        //         method: "post",
        //         url: Url,
        //         data: { fd },
        //         responseType: "arraybuffer",
        //         timeout: 1000 * 60
        //     });
        //     let res = await axios(
        //         // baseUrl + '/ss/Import/downloadGitZipBySid',
        //         // fd, { timeout: 1000 * 180 }, {'Content-Type': 'multipart/form-data'},
        //         {
        //             method: "post",
        //             url: Url,
        //             data: fd,
        //             responseType: "arraybuffer",
        //             timeout: 1000 * 60
        //         }
        //     );
        //     console.log('res', res);
        //     let blob = new Blob([res.data], { type: "application/zip" });
        //     const a = document.createElement("a");
        //     // 生成文件路径
        //     let href = window.URL.createObjectURL(blob);
        //     // console.log('href')
        //     // console.log(href)
        //     a.href = href;
        //     // let _fileName = _res.headers['Content-disposition'].split(';')[1].split('=')[1].split('.')[0]
        //     let _fileName = res.headers["content-disposition"]
        //         .split(";")[1]
        //         .split("=")[1];
        //     // 文件名中有中文 则对文件名进行转码
        //     a.download = decodeURIComponent(_fileName);
        //     // 利用a标签做下载
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);
        //     window.URL.revokeObjectURL(href);
        //     this.loading = false;
        //     return false;
        // },
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workHandleBoxContent {
    display: flex;
    // align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .block {
        width: 95%;
        margin: 20px;
    }
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
</style>