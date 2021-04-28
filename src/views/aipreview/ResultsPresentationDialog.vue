<template>
    <div>
        <el-dialog title="材料列表" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
            <div class="results-presentation-body">
                <div class="body-content">
                    <div v-for="(item, index) in displayData" :key="item.id" class="card-board">
                        <div class="title">
                            <span>{{ item.classif.documentsubDisplayname ? item.classif.documentsubDisplayname : '---未分出类别---'}}</span>
                            <div class="title-info">
                                <span style="font-size: 15px;width: 100px;">是否正确:</span>
                                <span v-if="item.classif.isCorrect"
                                    style="display: flex; justify-content: center;font-size: 20px; color: #67C23A;">
                                    <i class="el-icon-success"></i>
                                </span>
                                <span v-else
                                    style="display: flex; justify-content: center;font-size: 20px; color: #F56C6C;">
                                    <i class="el-icon-error"></i>
                                </span>
                                <el-input v-model="item.classif.note" placeholder="分类备注" style="margin-left: 20px;"
                                    @change="saveClassifyNote(item.classif)">
                                </el-input>
                            </div>
                            <el-popover placement="top" title="显示图片和标定" width="1000" trigger="click"
                                @show="showImg(item, index)" @hide="showed = false;">
                                <div v-if="showed">
                                    <canvas :id="'canvas' + String(index)" :width="rowInfoPic.width"
                                        :height="rowInfoPic.height"
                                        style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
                                </div>
                                <el-button slot="reference">显示图片</el-button>
                            </el-popover>
                        </div>
                        <div v-if="item.documentKvInfoList!== null && item.documentKvInfoList.length" class="docTable">
                            <div class="docTable-title">
                                <span class="el-icon-s-order"></span>
                                字段列表：
                            </div>
                            <el-table ref="docTable" :data="item.documentKvInfoList" tooltip-effect="dark"
                                highlight-current-row border style="width: 100%"
                                :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:800}"
                                :row-style="{fontSize:'15px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                                <el-table-column prop="fieldName" label="字段名称">
                                </el-table-column>
                                <el-table-column prop="fieldContent" label="提取内容">
                                </el-table-column>
                                <el-table-column prop="isCorrect" label="是否与真值一致" width="150">
                                    <template slot-scope="scope">
                                        <div v-if="scope.row.isCorrect"
                                            style="display: flex; justify-content: center;font-size: 20px; color: #67C23A;">
                                            <i class="el-icon-success"></i>
                                        </div>
                                        <div v-else>
                                            <i class="el-icon-error"
                                                style="display: flex; justify-content: center;font-size: 20px; color: #F56C6C;"></i>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="note" label="备注">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.note"
                                            @change="saveNote(scope.row, item.classif.documentId)"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
                <div v-if="!displayData.length">
                    <span>{{ this.nonInfo }}</span>
                </div>
                <div class="result-run">
                    <!-- <el-select v-model="calcMode" clearable>
                        <el-option label="分类" :value="Number(1)"></el-option>
                        <el-option label="提取" :value="Number(3)"></el-option>
                    </el-select> -->
                    <el-button type="plain" @click="downloadInputJson" :loading="loadingLoad">下载input.json</el-button>
                    <el-button type="primary" @click="runObtainExtractResult" :loading="loading">运行结果</el-button>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
// 接口
import { listClassifyAndKvInfo, ObtainExtractResult, updateKvInfoById, updateClassifById } from "@/api/aipreview/aiDevelopment"

export default {
    name: "ResultsPresentationDialog",
    data() {
        return {
            dialogVisible: false,
            approvalItemId: null,
            checkpointIds: [],
            sortconfigIds: [],
            picId: [],
            calcMode: 1,
            displayData: [],
            nonInfo: '暂无历史信息填写的配置信息对应的分类或者提取结果的内容, 请先运行一次配置数据',
            loading: false,
            picListInfo: [],
            valueUrl: '',
            rowInfoPic: {},
            showed: false,
            loadingLoad: false,
        }
    },
    created() {

    },
    methods: {
        openDialog() {
            this.getListClassifyAndKvInfo();
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        async getListClassifyAndKvInfo() {
            let params = {
                approvalItemId: this.approvalItemId,
                checkpointIds: this.checkpointIds,
                sortconfigIds: this.sortconfigIds,
                picId: this.picId,
                calcMode: this.calcMode,
            }
            console.log('params');
            console.log(params);
            let result = await listClassifyAndKvInfo(params);
            if (!result.success) return;
            this.displayData = result.data;
        },
        async runObtainExtractResult() {
            this.loading = true;
            let params = {
                approvalItemId: this.approvalItemId,
                checkpointIds: this.checkpointIds,
                sortconfigIds: this.sortconfigIds,
                picId: this.picId,
                calcMode: this.calcMode,
            }
            console.log('params');
            console.log(params);
            let result = await ObtainExtractResult(params);
            if (!result.success) {
                this.$message.warning('运行失败！')
                this.loading = false;
                return;
            }
            this.loading = false;
            this.displayData = result.data;
        },
        async saveNote(row, docId) {
            let params = {
                ...row,
                documentId: docId
            }
            let res = await updateKvInfoById(params);
            if (!res.success) {
                this.$message.warning('备注保存失败')
            } else {
                this.$message.success('备注保存成功')
            }
        },
        // 保存分类备注
        async saveClassifyNote(item) {
            let res = await updateClassifById(item);
            if (!res.success) {
                this.$message.warning('分类备注保存失败')
            } else {
                this.$message.success('分类备注保存成功')
            }
        },
        async showImg(item, index) {
            // console.log('this.picListInfo');
            // console.log(this.picListInfo);
            this.showed = true;
            console.log('item');
            console.log(item);
            this.rowInfoPic = this.picListInfo.find(row => row.id === item.classif.documentId);
            // console.log('this.rowInfoPic');
            // console.log(this.rowInfoPic);
            this.valueUrl = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${item.classif.fileId}`
            // 画图
            this.$nextTick(() => {
                let canvas = document.querySelector(`#canvas${index}`);   // 多图需要动态id
                let ctx = canvas.getContext('2d');

                // 绘制图片对象 ctx.drawImage(图片对象， x位置， y位置)
                let img = new Image();
                img.src = this.valueUrl;
                console.log('this.valueUrl');
                console.log(this.valueUrl);

                img.onload = () => {
                    console.log('img');
                    console.log(img);
                    ctx.drawImage(img, 0, 0);
                    let number = 1;
                    console.log('item.documentKvInfoList');
                    console.log(item.documentKvInfoList);
                    if (item.documentKvInfoList !== null) {
                        item.documentKvInfoList.forEach(pic => {
                            if (pic.fieldLocation !== null) {
                                let coordinate = pic.fieldLocation;
                                let x = coordinate[0][1];
                                let y = coordinate[0][0];
                                let width = coordinate[1][1] - x;
                                let height = coordinate[1][0] - y;
                                let xText = coordinate[0][1] + 10;
                                let yText = coordinate[1][0] + 45;
                                console.log(x, y, width, height);
                                ctx.rect(x, y, width, height);
                                ctx.strokeStyle = 'salmon';
                                ctx.lineWidth = 5;
                                ctx.stroke();
                                ctx.font = "50px 微软雅黑";
                                ctx.shadowBlur = 10;
                                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                                ctx.shadowOffsetX = 5;
                                ctx.shadowOffsetY = 5;
                                ctx.fillStyle = 'red';
                                ctx.fillText(String(number) + ' - ' + pic.fieldName, xText, yText);
                                number += 1;
                            }
                        })
                    }
                }
            })
        },
        // 下载input.json
        async downloadInputJson() {
            this.loadingLoad = true;
            let res
            try {
                res = await axios({
                    method: "post",
                    url: "/ai/aiCheckpoint/getInputJson",
                    data: {
                        approvalItemId: this.approvalItemId,
                        checkpointIds: this.checkpointIds,
                        sortconfigIds: this.sortconfigIds,
                        picId: this.picId,
                        calcMode: this.calcMode,
                    },
                    responseType: "arraybuffer",
                    timeout: 1000 * 60
                });
            } catch (error) {
                this.loadingLoad = false;
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
            // if (res.data.byteLength === 0) {
            //     this.$message.warning("该事项下没有样本文件");
            //     return;
            // }
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
            this.loadingLoad = false;
        }
    }
}
</script>

<style>
.el-popover{
    max-height: 600px;
    overflow: auto;
}
</style>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.results-presentation-body {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-items: center;
    background: #fcfcfc;
    .body-content {
        width: 100%;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        .card-board {
            border: thin #f7f3f3 solid;
            box-shadow: 1px 1px 3px #e2dddd;
            border-radius: 10px;
            padding: 20px;
            margin: 20px;
            width: 94%;
            font-size: 20px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            background: #fff;
            .title {
                width: 98%;
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: space-between;
                margin: 10px;
                border-left: 4px solid #6389e7;
                padding-left: 10px;
                padding-right: 20px;
                .title-info {
                    width: 50%;
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    justify-content: space-between;
                }
            }
            .docTable {
                .docTable-title {
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                width: 95%;
            }
        }
    }
    .result-run {
        width: 90%;
        display: flex;
        flex-flow: row;
        align-items: flex-end;
        justify-content: flex-end;
    }
}
</style>