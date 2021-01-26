<template>
    <div class="workWrap">
        <header>
            <span class="title">样本标定</span>
        </header>
        <div class="workBox">
            <el-row :gutter="30" class="datatrend-body-items">
                <div class="datatrend-body-items-box">
                    <el-col :sm="12" :lg="6">
                        <div class="datatrend-body-item">
                            <div class="ranking-content">
                                <div class="ranking-header">
                                    <div class="ranking-header-left">材料选择</div>
                                </div>
                                <div class="ranking-rows">
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :sm="24" :lg="12">
                        <div class="datatrend-body-item">
                            <div class="ranking-content">
                                <div class="ranking-header">
                                    <div class="ranking-header-left">图片预览</div>
                                </div>
                                <div class="ranking-rows">
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :sm="12" :lg="6">
                        <div class="datatrend-body-item">
                            <div class="ranking-content">
                                <div class="ranking-header">
                                    <div class="ranking-header-left">标定</div>
                                </div>
                                <div class="ranking-rows">
                                </div>
                            </div>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
        <div class="workHandleBox">
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
import { } from "@/api/basicInfo/approval"

export default {
    name: "SampleDemarcate",
    mixins: [mixin],
    data() {
        return {
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            formInline: {
                user: '',
                region: ''
            }
        }
    },
    computed: {
        ...mapGetters({
            // itemInfo: 'itemInfo'
        }),
        ...mapState({
            itemInfo: state => state.home.item
        })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getApprovalDetailInfo();
        // await this.search();
    },
    methods: {
        getApprovalDetailInfo() {
            // Object.assign(this.formInline, this.itemInfo);
            // dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
            this.itemInfo.createTime = dayjs(this.itemInfo.createTime).format("YYYY-MM-DD HH:mm:ss");
            this.itemInfo.updateTime = dayjs(this.itemInfo.updateTime).format("YYYY-MM-DD HH:mm:ss");
            this.formInline = Object.assign({}, this.formInline, this.itemInfo)
            // console.log('this.formInline');
            // console.log(this.formInline);
        },
        async downLoad() {
            let res = await axios({
                method: "get",
                url: "/ss/Import/downloadAiZip",
                params: {
                    approvalItemId: this.itemId,
                    // type: "word",
                },
                responseType: "arraybuffer",
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("该事项下没有AI材料文件");
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
        }

    },

}
</script>

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
            // font-size: 20px;
            margin-right: 20px;
        }
    }
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
                    height: 725px;
                    background: #ffffff;
                    // margin-bottom: 10px;
                    .ranking-content {
                        margin-top: 20px;
                        // background: rgb(169, 240, 240);
                        display: flex;
                        flex-direction: column;
                        // align-items: center;
                        // justify-content: center;
                        width: 90%;
                        height: 360px;
                        color: #7a7a7a;
                        .ranking-header {
                            // background: rgb(169, 240, 240);
                            width: 100%;
                            height: 7%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: flex-start;
                            border-bottom: 2px solid #f0f3f7;
                            .ranking-header-left {
                                margin-left: 5px;
                                margin-bottom: 10px;
                                font-weight: bold;
                                width: 100%;
                                padding-left: 10px;
                                border-left: 4px solid #6389E7;
                            }
                        }
                        .ranking-rows {
                            width: 100%;
                            height: 90%;
                            // overflow-y: scroll;
                            // white-space: nowrap;
                            // background: rgb(243, 225, 240);
                            .ranking-rows-items {
                                display: flex;
                                flex-direction: column;
                                // align-items: center;
                                margin-top: 18px;
                            }
                        }
                    }
                }
            }
        }
    }
    .workHandleBox {
        display: flex;
        // align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        // flex-wrap: wrap;
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