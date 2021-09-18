<template>
    <div class="main-points">
        <el-dialog title="预览自备材料审查要点" :visible.sync="dialogVisible" width="1200px">
            <el-select v-model="params.subitemIdList" multiple placeholder="请选择" style="margin-bottom: 10px"
                @change="check()" clearable>
                <el-option v-for="(item, i) in listApproval" :key="i" :label="item.subitemName"
                    :value="item.approvalSubitemId">
                </el-option>
            </el-select>
            <div class="content">
                <div class="left">
                    <div class="title">
                        <span>审批要点说明</span>
                    </div>
                    <div class="left-list">
                        <div class="item" v-for="(item, index) in list" :key="index">
                            <div class="one-item" @click="toImgItem( item, index)"
                                :class="materialName === item.material.materialName?'active':''">
                                <span>{{index+1}}. </span><span>{{item.material.materialName }}</span>
                            </div>
                            <div class="two-content">
                                <div class="two-item" v-for="(ele, index) in item.ruleList" :key="index">
                                    <span class="index-content">{{index+1}}</span><span>{{ele.rulePoint}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="title">
                        <span>
                            示例图
                        </span>
                    </div>
                    <div class="right-list">
                        <div class="right-center">
                            <canvas id="myCanvas" width="200" height="100"></canvas>
                        </div>
                        <div class="right-bottom">
                            <div class="left-png" @click="toLeft()">

                            </div>
                            <div class="page-num-content">
                                <span>{{leftRight+1}}</span> /
                                <span>
                                    {{figureList.length}}
                                </span>
                            </div>
                            <div class="right-png" @click="toRight()">

                            </div>
                            <!-- <div class="narrow-png">
                            </div>
                            <div class="enlarge-png" @click="toBig()">

                            </div> -->
                            <el-button type="primary" class="btn" @click="again()">重新跑提取</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { api_listSelfMaterialRule, api_getMaterialFigure, api_extractMaterialFigure } from "@/api/basicInfo/material.js";
import { CanvasBox } from "@/utils/canvas";
export default {
    name: 'MainPointsDialog',
    props: ["itemId", "listApproval"],
    data() {
        return {
            dialogVisible: false,
            list: [],
            params: {
                approvalItemId: this.itemId,
                subitemIdList: [],
            },
            canvasBox: null,
            leftRight: 0,
            figureList: [],
            materialName: "",
            indexNum: 1,
        }
    },
    created() {
    },
    methods: {
        check() {
            this.init()
        },
        async init() {
            const result = await api_listSelfMaterialRule(this.params);
            if (result.code === 200) {
                this.list = result.data;
                console.log(this.list, '---');
                if (this.list.length !== 0) {
                    this.toImgItem(this.list[0], 0);
                }
            } else {
                this.$message.error(result.msg)
            }
        },
        async getImageInfo(e) {
            let img = "";
            let arr = [];
            if (e) {
                img = process.env.VUE_APP_BASE_IP + `/ss/MaterialAndFigure/getMaterialFigure?figureId=${e}`;
                // console.log(this.figureList, this.leftRight, '-----')
                this.figureList[this.leftRight].kvInfo !== null && this.figureList[this.leftRight].kvInfo.forEach((element, index) => {
                    const ib = this.findIndex1(element.approval_point_id);
                    element.document_and_field.forEach((ele, index) => {
                        ele.rule_filter_value_info.forEach((item, i) => {
                            let info = {};
                            info.index = ib;
                            info.locations = [item.field_location];
                            arr.push(info)
                        })
                    })
                })
            }
            console.log(arr, "arr")
            this.canvasBox = new CanvasBox("#myCanvas", img, [], arr)
            await this.canvasBox.renderImg();
        },
        findIndex1(e) {
            let i = null;
            this.list[this.indexNum].ruleList.forEach((item, index) => {
                if (item.ruleCode == e) {
                    i = index;
                }

            })
            return i + 1;
        },
        toImgItem(ele, index) {
            this.indexNum = index;
            this.leftRight = 0;
            this.figureList = ele.figureList;
            this.materialName = ele.material.materialName;
            ele.figureList.length === 0 ? this.getImageInfo("") : this.getImageInfo(ele.figureList[this.leftRight].id);
        },
        async again() {
            const result = await api_extractMaterialFigure({ approvalItemId: this.itemId });
            if (result.code === 200) {
                this.$message.success("提取成功")
            } else {
                this.$message.error(result.msg)
            }
        },
        toLeft() {
            if (this.leftRight < 1) return
            if ((this.leftRight) <= this.figureList.length) {
                this.leftRight = this.leftRight - 1;
                this.getImageInfo(this.figureList[this.leftRight].id);
            }
        },
        toRight() {
            if ((this.leftRight + 2) <= this.figureList.length) {
                this.leftRight = this.leftRight + 1;
                this.getImageInfo(this.figureList[this.leftRight].id);
                // this.getImageInfo()
            }
        },
        toBig() {
        }
    }

}
</script>

<style lang="scss" scoped>
.main-points {
    /deep/.el-dialog__body {
        padding: 10px;
        max-height: none;
    }
    .content {
        display: flex;
        height: 548px;
        .left {
            width: 413px;
            .title {
                height: 50px;
                background: #f4f0e7;
                padding-left: 25px;
                > span {
                    display: inline-block;
                    line-height: 50px;
                    font-weight: 600;
                    text-align: left;
                    color: #333333;
                }
            }
            .left-list {
                // height: 524px;
                width: 100%;
                line-height: 46px;
                font-weight: 600;
                text-align: left;
                color: #333333;
                overflow-y: scroll;
                .one-item {
                    background: #eeeeee;
                    padding-left: 25px;
                    cursor: pointer;
                }
                .active {
                    opacity: 1;
                    background: linear-gradient(
                        90deg,
                        #e3c895,
                        #d9ba8a 25%,
                        #b9906a
                    );
                    color: #ffffff;
                }
                .two-content {
                    width: 100%;
                    padding: 0px 25px;
                }
                .two-item {
                    width: 100%;
                    height: 22px;
                    font-size: 16px;
                    font-weight: 400;
                    text-align: left;
                    color: #333333;
                    line-height: 22px;
                    margin-bottom: 12px;
                    margin-top: 10px;

                    .index-content {
                        border: 1px solid #333333;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        line-height: 20px;
                        display: inline-block;
                        text-align: center;
                    }
                }
            }
        }
        .right {
            width: 766px;
            height: 548px;
            .title {
                background: #f4f0e7;
                width: 100%;
                text-align: center;
                > span {
                    font-weight: 600;
                    color: #333333;
                    line-height: 50px;
                }
            }
            .right-list {
                width: 100%;
                height: 498px;
            }
            .right-center {
                height: calc(100% - 40px);
                background: #e5e5e5;
                overflow-y: scroll;
            }
            .right-bottom {
                width: 765px;
                height: 40px;
                background: #757575;
                position: relative;
                .page-num-content {
                    width: 60px;
                    position: absolute;
                    left: 267px + 26px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 40px;
                    padding-left: 13px;
                }
                .left-png {
                    width: 26px;
                    height: 26px;
                    background-image: url("../../../assets/img/1.png");
                    background-size: 26px 26px;
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 7px;
                    left: 267px;
                }
                .right-png {
                    width: 26px;
                    height: 26px;
                    background-image: url("../../../assets/img/1.png");
                    background-size: 26px 26px;
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 7px;
                    left: 353px;
                    transform: rotate(180deg);
                }
                .narrow-png {
                    width: 20px;
                    height: 20px;
                    background: url("../../../assets/img/2.png") 100% no-repeat;
                    position: absolute;
                    top: 10px;
                    right: 306px;
                }
                .enlarge-png {
                    width: 20px;
                    height: 20px;
                    background: url("../../../assets/img/3.png") 100% no-repeat;
                    position: absolute;
                    top: 10px;
                    right: 266px;
                }
                .btn {
                    position: absolute;
                    right: 150px;
                    top: 8px;
                }
            }
        }
    }
}
</style>
