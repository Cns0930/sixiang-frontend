<template>
    <el-container class="zero-class-box">
        <el-header class="one-header-area">
            <div v-for="(item,i) in headerList" :key="i" class="two-header">
                <div class="three-left">
                    <div v-if="item.ruleResult === 'W'">
                        <i class="el-icon-error" style="font-size: 55px; color: #F56C6C;"></i>
                    </div>
                    <div v-else-if="item.ruleResult === 'F'">
                        <i class="el-icon-question" style="font-size: 55px; color: #E6A23C;"></i>
                    </div>
                    <div v-else-if="item.ruleResult === 'R'">
                        <i class="el-icon-success" style="font-size: 55px; color: #67C23A;"></i>
                    </div>
                </div>
                <div class="three-right">
                    <div class="four-up">
                        {{item.title}}
                    </div>
                    <div class="four-down">
                        <span style="font-size: 20px;">{{showNumber(item.ruleResult)}}</span> <span>处</span>
                        <el-button type="text" @click="changeType(item.ruleResult)">查看全部
                        </el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <el-divider></el-divider>
        <el-main class="one-main-area">
            <div v-if="type === 'W'" style="width:100%">
                <div v-for="(item,i) in regulationList.W" :key="i" class="two-item">
                    <div class="three-header-one">
                        <i class="el-icon-error" style="color: #F56C6C;"></i>
                        <span>错误材料:
                            {{item.kvInfoMaterialResults.length >= 1 ? item.kvInfoMaterialResults[0].documentsubDisplayname : ''}}</span>
                    </div>
                    <div class="three-header-two" style="color: #F56C6C;">
                        <div>
                            <span>审批点: {{item.rulePoint}}</span> <span style="position: absolute; left: 55%;">规则编号:
                                {{item.ruleCode}}</span>
                        </div>
                        <div>审批结果: {{item.ruleTips? item.ruleTips[1]: ''}}</div>
                        <el-divider></el-divider>
                    </div>
                    <div class="three-main">
                        <div v-for="(point,index) in item.kvInfoMaterialResults" :key="index" style="marigin: 10px;border: thin #f7f3f3 solid;
    box-shadow: 1px 1px 3px #e2dddd;border-radius: 10px;padding: 10px;">
                            <div>
                                <i class="el-icon-s-order"></i>
                                <span>
                                    {{point.documentsubDisplayname}}
                                </span>
                                <el-popover v-if="point.fieldLocation && point.width && point.height" placement="top"
                                    title="显示图片和标定" width="1000" trigger="click" @show="showImg(point, index)"
                                    @hide="showed = false;">
                                    <div v-if="showed">
                                        <canvas :id="'canvas' + point.index" :width="point.width"
                                            :height="point.height"
                                            style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
                                    </div>
                                    <el-button slot="reference"><i class="el-icon-zoom-in"></i>显示图片</el-button>
                                </el-popover>
                                <div>
                                    <span>{{point.fieldName + ':'}}</span><span style="color: #F56C6C;">{{point.fieldContent}}</span>
                                    <span style="margin-left: 15px">BA标定结果: </span>
                                    <span style="color: #F56C6C;">{{point.resultlabeled}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="three-footer">
                        <h4>相应法条</h4>
                        <div>
                            <div v-for="(lawItem,i) in item.ruleLaw" :key="i" style="font-size: 14px;color: #666;">
                                {{lawItem}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="type === 'F'" style="width:100%">
                <div v-for="(item,i) in regulationList.F" :key="i" class="two-item">
                    <div class="three-header-one">
                        <i class="el-icon-question" style="color: #E6A23C;"></i>
                        <span>待人工审核材料:
                            {{item.kvInfoMaterialResults.length >= 1 ? item.kvInfoMaterialResults[0].documentsubDisplayname : ''}}</span>
                    </div>
                    <div class="three-header-two" style="color: #E6A23C;">
                        <div>
                            <span>审批点: {{item.rulePoint}}</span> <span style="position: absolute; left: 55%;">规则编号:
                                {{item.ruleCode}}</span>
                        </div>
                        <div>审批结果: {{item.ruleTips? item.ruleTips[2] : ''}}</div>
                        <el-divider></el-divider>
                    </div>
                    <div class="three-main">
                        <div v-for="(point,index) in item.kvInfoMaterialResults" :key="index" style="marigin: 10px;border: thin #f7f3f3 solid;
    box-shadow: 1px 1px 3px #e2dddd;border-radius: 10px;padding: 10px;">
                            <div>
                                <i class="el-icon-s-order"></i>
                                <span>
                                    {{point.documentsubDisplayname}}
                                </span>
                                <el-popover v-if="point.fieldLocation && point.width && point.height" placement="top"
                                    title="显示图片和标定" width="1000" trigger="click" @show="showImg(point, index)"
                                    @hide="showed = false;">
                                    <div v-if="showed">
                                        <canvas :id="'canvas' + point.index" :width="point.width"
                                            :height="point.height"
                                            style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
                                    </div>
                                    <el-button slot="reference"><i class="el-icon-zoom-in"></i>显示图片</el-button>
                                </el-popover>
                                <div>
                                    <span>{{point.fieldName + ':'}}</span><span style="color: #E6A23C;">{{point.fieldContent}}</span>
                                    <span style="margin-left: 15px">BA标定结果: </span>
                                    <span style="color: #E6A23C;">{{point.resultlabeled}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="three-footer">
                        <h4>相应法条</h4>
                        <div>
                            <div v-for="(lawItem,i) in item.ruleLaw" :key="i" style="font-size: 14px;color: #666;">
                                {{lawItem}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="type === 'R'" style="width:100%">
                <div v-for="(item,i) in regulationList.R" :key="i" class="two-item">
                    <div class="three-header-one">
                        <i class="el-icon-success" style="color: #67C23A;"></i>
                        <span>材料预审通过:
                            {{item.kvInfoMaterialResults.length >= 1 ? item.kvInfoMaterialResults[0].documentsubDisplayname : ''}}</span>
                    </div>
                    <div class="three-header-two" style="color: #67C23A;">
                        <div>
                            <span>审批点: {{item.rulePoint}}</span> <span style="position: absolute; left: 55%;">规则编号:
                                {{item.ruleCode}}</span>
                        </div>
                        <div>审批结果: {{item.ruleTips ? item.ruleTips[0] : ''}}</div>
                        <el-divider></el-divider>
                    </div>
                    <div class="three-main">
                        <div v-for="(point,index) in item.kvInfoMaterialResults" :key="index" style="marigin: 10px;border: thin #f7f3f3 solid;
    box-shadow: 1px 1px 3px #e2dddd;border-radius: 10px;padding: 10px;">
                            <div>
                                <i class="el-icon-s-order"></i>
                                <span>
                                    {{point.documentsubDisplayname}}
                                </span>
                                <el-popover v-if="point.fieldLocation && point.width && point.height" placement="top"
                                    title="显示图片和标定" width="1000" trigger="click" @show="showImg(point, index)"
                                    @hide="showed = false;">
                                    <div v-if="showed">
                                        <canvas :id="'canvas' + point.index" :width="point.width"
                                            :height="point.height"
                                            style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
                                    </div>
                                    <el-button slot="reference"><i class="el-icon-zoom-in"></i>显示图片</el-button>
                                </el-popover>
                                <div>
                                    <span>{{point.fieldName + ':'}}</span><span style="color: #67C23A;">{{point.fieldContent}}</span>
                                    <span style="margin-left: 15px">BA标定结果: </span>
                                    <span style="color: #67C23A;">{{point.resultlabeled}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="three-footer">
                        <h4>相应法条</h4>
                        <div>
                            <div v-for="(lawItem,i) in item.ruleLaw" :key="i" style="font-size: 14px;color: #666;">
                                {{lawItem}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import { mixin } from "@/mixin/mixin"
// 接口
import { listRuleResult } from "@/api/aipreview/aiDevelopment"
export default {
    name: "Regulation",
    components: {},
    mixins: [mixin],
    data() {
        return {
            // 初始数据
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 头部数据
            headerList: [
                {
                    title: '识别出的错误',
                    number: 0,
                    buttonName: '查看全部',
                    ruleResult: 'W',
                }, {
                    title: '需要人工核对',
                    number: 0,
                    buttonName: '查看全部',
                    ruleResult: 'F',
                }, {
                    title: '智能预审通过',
                    number: 0,
                    buttonName: '查看全部',
                    ruleResult: 'R',
                },
            ],
            // 主体规则数据
            type: 'W',
            regulationList: {},
            showed: false,
        };
    },
    computed: {
        showNumber() {
            return function (type) {
                if (this.regulationList[type]) {
                    return this.regulationList[type].length;
                }
            }
        },
    },
    async created() {
        
    },
    async mounted() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        // 获取规则数据
        await this.getListRuleResult();
    },
    beforeUpdate() {
        // 根据`URL地址捕获当前激活的标签
        // this.nowUrl = this.$route.path;
        // let urlName = this.nowUrl;
        // let lastIndex = urlName.lastIndexOf('/');
        // let name = urlName.slice(lastIndex + 1);
        // this.activeName = name;
    },
    methods: {
        async getListRuleResult() {
            let res = await listRuleResult({ approvalItemId: Number(this.itemId) });
            if (!res.success) return;
            this.regulationList = res.data;
        },
        // 改变主体类型
        changeType(type) {
            this.type = type;
        },
        // 显示标定框图
        async showImg(item, index) {
            this.showed = true;
            console.log('item');
            console.log(item);
            console.log(`#canvas${item.index}`);
            let valueUrl = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${item.fileId}`
            // 画图
            this.$nextTick(() => {
                let canvas = document.querySelector(`#canvas${item.index}`);   // 多图需要动态id
                let ctx = canvas.getContext('2d');

                // 绘制图片对象 ctx.drawImage(图片对象， x位置， y位置)
                let img = new Image();
                img.src = valueUrl;
                console.log('valueUrl');
                console.log(valueUrl);

                img.onload = () => {
                    console.log('img');
                    console.log(img);
                    ctx.drawImage(img, 0, 0);
                    let number = 1;
                    if (item.fieldLocation !== null) {
                        let coordinate = item.fieldLocation;
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
                        ctx.fillText(String(number) + ' - ' + item.fieldName, xText, yText);
                        number += 1;
                    }
                }
            })
        },
        // 销毁canvas
        closeImg(item, index) {
            let canvas = document.getElementById(`canvas${index}`);   // 多图需要动态id
            canvas.parentNode.removeChild(canvas);
            console.log('销毁了');
            console.log(canvas);
            this.showed = false;
        }
    },
};
</script>

<style scoped lang="scss">
.zero-class-box {
    width: 1000px; /*设置div的宽度*/
    min-height: 600px; /*设置div的高度，实际制作网页中可以让高度自适应内容。或者根据内容人工调整高度值*/
    //background-color: #f9c; /*设置背景颜色，帮助制作者查看div的位置，网页制作完成后，可以删除背景颜色*/
    margin: 0px auto; /*设置外边距上下0px，左右auto，即可实现左右居中的效果*/
    border: thin #f7f3f3 solid;
    box-shadow: 1px 1px 3px #e2dddd;
    border-radius: 10px;
    padding: 10px;
    .one-header-area {
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: space-around;
        //background: rgb(250, 243, 211);
        margin: 10px;
        .two-header {
            //background-color: rgb(153, 197, 255);
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-around;
            .three-right {
                font-size: 16px;
                line-height: 26px;
            }
        }
    }
    .one-main-area {
        display: flex;
        flex-flow: column;
        align-items: flex-start;
        justify-content: flex-start;
        //background: rgb(222, 250, 211);
        margin: 10px;
        .two-item {
            width: 100%;
            display: flex;
            flex-flow: column;
            align-items: flex-start;
            justify-content: flex-start;
            // background: rgb(211, 250, 243);
            margin: 20px 0;
            box-shadow: 1px 1px 3px #e2dddd;
            border-top: 5px solid #2196f3;
            .three-header-one {
                width: 100%;
                font-size: 16px;
                font-weight: 700;
                line-height: 40px;
                color: #333;
                background-color: rgb(207, 235, 255);
                padding: 10px;
            }
            .three-header-two {
                width: 100%;
                font-size: 16px;
                line-height: 40px;
                padding: 10px;
            }
            .three-main {
                width: 100%;
                font-size: 16px;
                line-height: 40px;
                display: flex;
                flex-flow: row;
                align-items: flex-start;
                justify-content: flex-start;
                padding: 10px;
                background-color: #ffffff;
            }
            .three-footer {
                width: 100%;
                font-size: 16px;
                line-height: 25px;
                padding: 10px;
            }
        }
    }
}
</style>
