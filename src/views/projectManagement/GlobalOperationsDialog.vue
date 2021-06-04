<template>
    <el-dialog title="全局操作-Dialog" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
        <div class="workHandleBoxContent">
            <div class="handleBox">
                <p class="title">批量下载事项配置</p>
                <el-upload class="upload-demo" ref="upload" action="111" :multiple="true" :limit="50"
                    :with-credentials="true" :auto-upload='true' :before-upload="customUpload">
                    <el-button type="primary" icon="el-icon-upload" class="button" :loading="loading" @click="upLoad()">
                        上传json下载事项配置
                    </el-button>
                </el-upload>
            </div>
            <!-- <div class="handleBox">
                <p class="title">临时下载迁移前四象1.0需求文件</p>
                <el-button type="primary" icon="el-icon-download" @click="downLoad('/ss/Import/downloadDemandZip')">
                    点击下载</el-button>
            </div>
            <div class="handleBox">
                <p class="title">上传事项配置到git</p>
                <el-button type="primary" icon="el-icon-upload2" @click="dialogGitConfirmVisible = true;">点击上传
                </el-button>
            </div>
            <div class="handleBox">
                <p class="title">查看git提交信息</p>
                <el-button type="primary" @click="showGitHistory">点击查看
                </el-button>
            </div>
            <div class="handleBox">
                <p class="title">复用其他版本事项</p>
                <el-button type="primary" @click="showReuseDialog">选取复用
                </el-button>
            </div> -->
        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            dialogVisible: false,
            loading: false,
        }
    },
    methods: {
        async openDialog() {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        // 上传
        upLoad() {
            this.$refs.upload.submit();
        },
        //
        async customUpload(file) {
            console.log('file');
            console.log(file);
            this.loading = true;
            let fd = new FormData();
            fd.append("file", file);
            let Url = process.env.VUE_APP_BASE_IP + '/ss/Import/downloadGitZipBySid';
            console.log({
                method: "post",
                url: Url,
                data: { fd },
                responseType: "arraybuffer",
                timeout: 1000 * 60
            });
            let res = await axios(
                // baseUrl + '/ss/Import/downloadGitZipBySid',
                // fd, { timeout: 1000 * 180 }, {'Content-Type': 'multipart/form-data'},
                {
                    method: "post",
                    url: Url,
                    data: fd ,
                    responseType: "arraybuffer",
                    timeout: 1000 * 60
                }
            );
            console.log('res', res);
            let blob = new Blob([res.data], { type: "application/zip" });
            const a = document.createElement("a");
            // 生成文件路径
            let href = window.URL.createObjectURL(blob);
            // console.log('href')
            // console.log(href)
            a.href = href;
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
            return false;
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workHandleBoxContent {
    display: flex;
    // align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
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