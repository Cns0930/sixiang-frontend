<template>
    <div>
        <el-dialog title="材料列表" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
            <div class="results-presentation-body">
                <div class="body-content">
                    <div v-for="(item, index) in displayData" :key="item.id" class="card-board">
                        <div class="title">
                            <span>{{ item.classif.documentsubDisplayname }}</span>
                            <el-popover placement="top" title="显示图片和标定" width="1000" trigger="click"
                                @show="showImg(item, index)">
                                <canvas :id="'canvas' + String(index)" :width="rowInfoPic.width" :height="rowInfoPic.height"
                                    style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
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
                                <el-table-column prop="isCorrect" label="是否与真值一致">
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
// 接口
import { listClassifyAndKvInfo, ObtainExtractResult, updateKvInfoById } from "@/api/aipreview/aiDevelopment"

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
        async showImg(item, index) {
            // console.log('this.picListInfo');
            // console.log(this.picListInfo);
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
                    if(item.documentKvInfoList !== null) {
                        item.documentKvInfoList.forEach(pic => {
                        if (pic.fieldLocation !== null) {
                            let coordinate = pic.fieldLocation;
                            let x = coordinate[0][1];
                            let y = coordinate[0][0];
                            let width = coordinate[1][1] - x;
                            let height = coordinate[1][0] - y;
                            let xText = coordinate[1][1] + 40;
                            let yText = coordinate[1][0] - 10;
                            console.log(x, y, width, height);
                            ctx.rect(x, y, width, height);
                            ctx.strokeStyle = 'salmon';
                            ctx.lineWidth = 5;
                            ctx.stroke();
                            ctx.font = "60px 微软雅黑";
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                            ctx.shadowOffsetX = 5;
                            ctx.shadowOffsetY = 5;
                            ctx.strokeText(String(number) +' - '+ pic.fieldName, xText, yText);
                            number += 1;
                        }
                    })
                    }
                }
            })
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