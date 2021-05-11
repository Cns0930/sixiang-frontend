<template>
    <div>
        <el-dialog title="签章引导" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
            <div class="workBox">
                <el-row :gutter="30" class="datatrend-body-items">
                    <div class="datatrend-body-items-box">
                        <el-col :sm="24" :lg="15">
                            <div class="datatrend-body-item-mid">
                                <div class="case-content">
                                    <div class="case-header">
                                        <div class="case-header-left">图片预览</div>
                                    </div>
                                    <div class="case-rows">
                                        <div v-if="flag === 1" class="vueCropper">
                                            <vueCropper ref="cropper" :img="valueUrl" :autoCrop="true" dragMode="crop"
                                                :outputSize="Number(1)" :canMove="false" :full="true" :fixedBox="false"
                                                :canScale="false" autoCropWidth="100" autoCropHeight="100"></vueCropper>
                                        </div>
                                        <div v-else-if="flag === 2"></div>
                                        <div v-else>
                                            <canvas id="canvas" :width="row.width" :height="row.height"
                                                style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :xs="24" :lg="9">
                            <div class="datatrend-body-item">
                                <div class="case-content">
                                    <div class="case-header">
                                        <div class="case-header-left">签章引导标注</div>
                                    </div>
                                    <div class="case-rows">
                                        <div class="up">
                                            <span>
                                                <el-button size="medium" type="primary" @click="addSignature()">
                                                    新增签章引导
                                                </el-button>
                                                <el-popover placement="bottom" title="注释" width="200" trigger="click"
                                                    content="如果遇到左边图片显示不出的情况，是图片兼容性问题，可以将该图片用画图等软件原样'另存为'一下重新上传。">
                                                    <el-button slot="reference" type="text" size="medium" round><i
                                                            class="el-icon-info" style="font-size: 18px;" />
                                                    </el-button>
                                                </el-popover>
                                            </span>
                                        </div>
                                        <div class="mid">
                                            <div v-for="(item, index) in signatureListData" :key="item.id"
                                                style="margin-bottom: 20px; border-bottom:thick dotted #409EFF;"
                                                :class="{'editing': item.rowflag === 1 || item.rowflag === 2}">
                                                <div>
                                                    <span
                                                        :class="{'redcolor': index === 0, 'orangecolor': index === 1, 'greencolor': index === 2, 'graycolor': index > 2}"
                                                        class="ranking-rows-lines-left">
                                                        <span style="margin: 4px auto auto 7px;">{{ index + 1 }}</span>
                                                    </span>
                                                    <span class="headline">
                                                        {{ item.signatureName }}
                                                    </span>
                                                    <span v-if="item.rowflag === 1 || item.rowflag === 2"
                                                        style="margin-right: 12px;">
                                                        <el-button size="mini" type="primary"
                                                            @click="saveSignature(item)">
                                                            保存
                                                        </el-button>
                                                        <el-button size="mini" type="primary"
                                                            @click="cancelSignature(item)">
                                                            取消
                                                        </el-button>
                                                    </span>
                                                    <el-button v-else size="mini" type="primary"
                                                        @click="editSignature(item)">
                                                        编辑
                                                    </el-button>
                                                    <el-button size="mini" type="danger" @click="deleteSignature(item)">
                                                        删除
                                                    </el-button>
                                                </div>
                                                <div>
                                                    <div>
                                                        <span>名称:</span>
                                                        <el-input placeholder="名称" v-model="item.signatureName"
                                                            :disabled="!item.rowflag" style="width: 280px">
                                                        </el-input>
                                                    </div>
                                                    <div>
                                                        <span>类型:</span>
                                                        <el-select placeholder="类型" v-model="item.signatureType"
                                                            :disabled="!item.rowflag" style="width: 280px">
                                                            <el-option value="签字" label="签字" />
                                                            <el-option value="盖章" label="盖章" />
                                                        </el-select>
                                                    </div>
                                                    <div>
                                                        <span>座标:</span>
                                                        <el-button size="medium" type="plain"
                                                            @click="addSignatureLocation(item)"
                                                            :disabled="!item.rowflag">
                                                            框入座标
                                                        </el-button>
                                                    </div>
                                                    <div class="signatureLocation">
                                                        <div>
                                                            <span>顶点座标座标:</span>
                                                            <el-input placeholder="左边画框获取, 左上顶点座标"
                                                                v-model="item.signatureLocation.zuobiao" disabled
                                                                style="width: 240px">
                                                            </el-input>
                                                        </div>
                                                        <div>
                                                            <span>框长:</span>
                                                            <el-input placeholder="截图框长度"
                                                                v-model="item.signatureLocation.length" disabled
                                                                style="width: 240px"></el-input>
                                                        </div>
                                                        <div>
                                                            <span>框宽:</span>
                                                            <el-input placeholder="截图框宽度"
                                                                v-model="item.signatureLocation.width" disabled
                                                                style="width: 240px"></el-input>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span>生成逻辑:</span>
                                                        <CodeEditor v-model="item.signatureProduce" ref="codeEditorAdd"
                                                            :disabled="!item.rowflag" style="width: 280px">
                                                        </CodeEditor>
                                                    </div>
                                                    <div>
                                                        <span>提示语:</span>
                                                        <el-input placeholder="文本" v-model="item.signatureTips"
                                                            :disabled="!item.rowflag" style="width: 280px">
                                                        </el-input>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="down">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </div>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import { CodeEditor } from "@/views/attributeComponents/defRendererComponents/defRendererComponents";

// 接口
import {
    getMaterialFigureSignature, deleteMaterialFigureSignature, addMaterialFigureSignature, updateMaterialFigureSignature
} from '../../../api/basicInfo/material';

export default {
    components: { VueCropper, CodeEditor },
    data() {
        return {
            row: {},
            valueUrl: '',
            dialogVisible: false,
            flag: 0, // 出canvas框图 0， vue-cropper 1
            signatureListData: [],
        }
    },
    methods: {
        async openDialog() {
            this.dialogVisible = true;
            await this.$nextTick();
            console.log('row', this.row);
            this.valueUrl = this.row.imgUrl;
            await this.getSignature();
            this.showRectangles();
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        // 获取签章标注信息
        async getSignature() {
            let res = await getMaterialFigureSignature({ figureId: this.row.id });
            if (!res.success) return;
            this.signatureListData = res.data;
        },
        // 添加签章
        addSignature() {
            let isHaveAddRow = 0;
            this.signatureListData.forEach(item => {
                if (item.rowflag === 1) {
                    isHaveAddRow = 1
                };
            })
            if (isHaveAddRow) {
                this.$message.warning('请保存后再继续新增')
                return;
            }
            this.signatureListData.splice(this.signatureListData.length, 0, {
                materialFigureId: this.row.id,
                signatureLocation: {
                    zuobiao: '',
                    length: 0,
                    width: 0,
                },
                signatureName: '',
                signatureProduce: "",
                signatureTips: "",
                signatureType: "",
                rowflag: 1,
            })
            console.log('this.signatureListData');
            console.log(this.signatureListData);
            this.flag = 1;
        },
        addSignatureLocation(row) {
            console.log(row);
            // console.log(this.$refs.cropper);
            // console.log('获取图片基于容器的坐标点');
            // console.log(this.$refs.cropper.getImgAxis());
            // console.log('获取截图框基于容器的坐标点');
            // console.log(this.$refs.cropper.getCropAxis());

            let imgAxis = this.$refs.cropper.getImgAxis(); // 获取图片基于容器的坐标点
            let cropAxis = this.$refs.cropper.getCropAxis(); // 获取截图框基于容器的坐标点
            let zoom = this.row.width / (imgAxis.x2 - imgAxis.x1); // 真实图片放大系数
            // coordinate = [[cropAxis.x1-imgAxis.x1, cropAxis.y1-imgAxis.y1], [cropAxis.x2-imgAxis.x1, cropAxis.y2-imgAxis.y1]]  // 正常座标系 [[x1, y1], [x2, y2]] 左上座标和右下座标
            // 反人类座标系 [[y1, x1], [y2, x2]] 左上座标和右下座标
            // let coordinateNew = [[cropAxis.x1-imgAxis.x1, cropAxis.y1-imgAxis.y1], [cropAxis.x2-imgAxis.x1, cropAxis.y2-imgAxis.y1]];  // 正常座标系 [[x1, y1], [x2, y2]] 左上座标和右下座标
            // let coordinateNewRatio = [[(cropAxis.x1-imgAxis.x1)/(imgAxis.x2 - imgAxis.x1), (cropAxis.y1-imgAxis.y1)/(imgAxis.y2 - imgAxis.y1)], [(cropAxis.x2-imgAxis.x1)/(imgAxis.x2 - imgAxis.x1), (cropAxis.y2-imgAxis.y1)/(imgAxis.y2 - imgAxis.y1)]];
            let coordinateNewPix = {
                coordinate: [Math.round((cropAxis.x1 - imgAxis.x1) * zoom), Math.round((cropAxis.y1 - imgAxis.y1) * zoom)],
                width: Math.round((cropAxis.x2 - cropAxis.x1) * zoom),
                height: Math.round((cropAxis.y2 - cropAxis.y1) * zoom),
            }
            // 比例座标
            console.log('座标,像素为单位,一个顶点+框宽高');
            console.log(coordinateNewPix);
            // console.log('比例座标');
            // console.log(coordinateNewRatio);
            row.signatureLocation.zuobiao = JSON.stringify(coordinateNewPix.coordinate);
            row.signatureLocation.length = coordinateNewPix.width;
            row.signatureLocation.width = coordinateNewPix.height;
        },
        // 编辑签章
        editSignature(row) {
            row.rowflag = 2;
            this.flag = 1;
        },
        // 取消编辑或保存
        async cancelSignature(item) {
            this.flag = 0;
            this.getSignature();
            this.showRectangles();
        },
        // 保存签章
        async saveSignature(row) {
            console.log('保存');
            console.log(row);
            if (row.signatureTips === '' || row.signatureLocation.zuobiao === '') {
                this.$message.warning('保存前请填入座标和提示语！');
                return;
            }
            if (row.rowflag === 1) {
                let res = await addMaterialFigureSignature(row);
                if (!res.success) {
                    this.$message.warning('新增签章失败');
                    return;
                }
                this.getSignature();
            } else {
                let resEdit = await updateMaterialFigureSignature(row);
                if (!resEdit.success) {
                    this.$message.warning('编辑签章失败');
                    return;
                }
                this.getSignature();
            }
            this.flag = 0;
            this.showRectangles();
        },
        // 删除签章
        async deleteSignature(item) {
            try {
                await this.$confirm('是否确定删除该签章?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await deleteMaterialFigureSignature({ materialAndFigureSignatureId: item.materialAndFigureSignatureId });
            if (!result.success) return;
            this.$message.success('删除成功');
            await this.getSignature();
            this.flag = 2;
            await this.$nextTick();
            this.flag = 0;
            this.showRectangles();
        },
        // 显示or关闭坐标框
        showRectangles() {
            this.$nextTick(() => {
                let canvas = document.querySelector("#canvas");
                let ctx = canvas.getContext('2d');

                // 绘制图片对象 ctx.drawImage(图片对象， x位置， y位置)
                let img = new Image();
                img.src = this.valueUrl;

                img.onload = () => {
                    console.log('img');
                    console.log(img);
                    ctx.clearRect(0,0,canvas.width,canvas.height); // 清空画布
                    ctx.drawImage(img, 0, 0);
                    let number = 1;
                    this.signatureListData.forEach(item => {
                        if (item.signatureLocation.zuobiao !== null) {
                            let coordinate = JSON.parse(item.signatureLocation.zuobiao);
                            let x = coordinate[0];
                            let y = coordinate[1];
                            let width = item.signatureLocation.length;
                            let height = item.signatureLocation.width;
                            let xText = x + 20;
                            let yText = y + height + 45;
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
                            ctx.fillText(String(number) + '、 ' + item.signatureName, xText, yText);
                            number += 1;
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/global.scss";
.workBox {
    width: 100%;
    height: calc(100% - 50px);
    padding: 6px 12px 12px 12px;
    box-sizing: border-box;
    background: #fff;
    .datatrend-body-items {
        width: 100%;
        padding-bottom: 25px;
        .datatrend-body-items-box {
            // margin: 25px 20px 25px 30px;
            .datatrend-body-item {
                border: thin #f7f3f3 solid;
                box-shadow: 1px 1px 3px #e2dddd;
                border-radius: 10px;
                display: flex;
                flex-flow: row;
                align-items: flex-start;
                justify-content: center;
                width: 100%;
                height: 1000px;
                background: #ffffff;
                // margin-bottom: 10px;
                .case-content {
                    margin-top: 20px;
                    // background: rgb(169, 240, 240);
                    display: flex;
                    flex-direction: column;
                    // align-items: center;
                    // justify-content: center;
                    width: 95%;
                    height: 100%;
                    color: #7a7a7a;
                    .case-header {
                        // background: rgb(169, 240, 240);
                        width: 100%;
                        height: 3.8%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        border-bottom: 2px solid #f0f3f7;
                        .case-header-left {
                            font-size: 18px;
                            margin-left: 12px;
                            margin-bottom: 10px;
                            font-weight: bold;
                            width: 100%;
                            padding-left: 10px;
                            border-left: 4px solid #6389e7;
                        }
                    }
                    .case-rows {
                        width: 100%;
                        height: 90%;
                        overflow-y: auto;
                        white-space: nowrap;
                        // background: rgb(245, 240, 244);
                        display: flex;
                        flex-direction: column;
                        margin-top: 18px;
                        .up {
                            // background: rgb(247, 173, 232);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                        }
                        .mid {
                            // 编辑中
                            .editing {
                                border: thin #f7f3f3 solid;
                                // box-shadow: 1px 1px 3px #e2dddd;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                                    0 6px 20px 0 rgba(0, 0, 0, 0.19);
                            }
                            // 序号
                            .ranking-rows-lines-left {
                                // display: flex;
                                // align-items: center;
                                margin: 12px;
                                width: 23px;
                                height: 23px;
                                // -moz-border-radius: 60px;
                                // -webkit-border-radius: 60px;
                                border-radius: 60px;
                            }
                            .redcolor {
                                color: #ffffff;
                                background: #e93b6d;
                            }
                            .orangecolor {
                                color: #ffffff;
                                background: #eaa710;
                            }
                            .greencolor {
                                color: #ffffff;
                                background: #bfea80;
                            }
                            .graycolor {
                                color: #000000;
                                background: #eeeeee;
                            }
                            div {
                                margin: 5px;
                                span {
                                    width: 100px;
                                    display: inline-block;
                                    font-size: 16px;
                                    // background: rgb(247, 173, 232);
                                }
                            }
                            .signatureLocation {
                                width: 400px;
                                border: 2px dashed #6389e7;
                            }
                        }
                    }
                }
            }
            .datatrend-body-item-mid {
                border: thin #f7f3f3 solid;
                box-shadow: 1px 1px 3px #e2dddd;
                border-radius: 10px;
                display: flex;
                flex-flow: row;
                align-items: flex-start;
                justify-content: center;
                width: 100%;
                height: 1000px;
                // background: #f57979;
                // margin-bottom: 10px;
                .case-content {
                    margin-top: 20px;
                    // background: rgb(169, 240, 240);
                    display: flex;
                    flex-direction: column;
                    // align-items: center;
                    // justify-content: center;
                    width: 98%;
                    height: 100%;
                    color: #7a7a7a;
                    .case-header {
                        // background: rgb(169, 240, 240);
                        width: 100%;
                        height: 3.8%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        border-bottom: 2px solid #f0f3f7;
                        .case-header-left {
                            // background: rgb(189, 240, 169);
                            margin-left: 15px;
                            margin-bottom: 10px;
                            font-weight: bold;
                            font-size: 18px;
                            padding-left: 10px;
                            border-left: 4px solid #6389e7;
                        }
                        .case-header-right {
                            // background: rgb(169, 240, 240);
                            float: right;
                            margin-left: 50%;
                            margin-bottom: 10px;
                            font-weight: bold;
                            width: 200px;
                            padding-left: 10px;
                        }
                    }
                    .case-rows {
                        width: 100%;
                        height: 90%;
                        // background: rgb(195, 241, 169);
                        overflow-y: auto;
                        white-space: nowrap;
                        display: flex;
                        flex-direction: column;
                        // align-items: center;
                        margin-top: 18px;
                        span {
                            margin-left: 20px;
                        }
                        .vueCropper {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>