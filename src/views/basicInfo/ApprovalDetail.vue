<template>
    <div class="workWrap">
        <header>
            <span class="title">事项详情</span>
        </header>
        <div class="workBox">
            <el-form :inline="true" :model="formInline" class="formStyle demo-form" label-width="100px" label-position="left">
                <el-form-item label="事项名称：">
                    <div class="formItem"><span>{{ formInline.itemName }}</span></div>
                </el-form-item>
                <el-form-item label="事项编号：">
                    <div class="formItem"><span>{{ formInline.itemNo }}</span></div>
                </el-form-item>
                <el-form-item label="创建者：">
                    <div class="formItem"><span>{{ formInline.createBy }}</span></div>
                </el-form-item>
                <el-form-item label="内部编号：">
                    <div class="formItem"><span>{{ formInline.itemInternalNo }}</span></div>
                </el-form-item>
                
                <el-form-item label="事项类型：">
                    <div class="formItem"><span>{{ formInline.itemType }}</span></div>
                </el-form-item>
                <el-form-item label="创建时间：">
                    <div class="formItem"><span>{{ formInline.createTime }}</span></div>
                </el-form-item>
                <el-form-item label="更新时间：">
                    <div class="formItem"><span>{{ formInline.updateTime }}</span></div>
                </el-form-item>
                <el-form-item>
                </el-form-item>
            </el-form>
        </div>
        <div class="workHandleBox">
            <header>
                <span class="title">操作</span>
            </header>
            <div class="handleBox">
                <p class="title">下载配置开发模板</p>
                <el-button type="primary" icon="el-icon-download" @click="downLoad">点击下载</el-button>
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
import { getByApprovalItemId } from "@/api/basicInfo/approval"

export default {
    name: "ApprovalDetail",
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
        // formInline() {
        //     let form =  Object.assign(this.formInline, this.itemInfo);
        //     return form;
        // }
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
@import "../../assets/css/global.scss";
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
        // border: 1px solid green;
        width: 70%;
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
        .formStyle {
            margin-left: 40px;
            font-size: 20px;
            // background: rgb(222, 226, 255);
            .formItem {
                margin-right: 500px;
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
    .searchBox {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        background: #fff;
        & > * {
            margin-left: 10px;
        }
    }
    .handle {
        // display: flex;
        // flex-direction: row;
        // justify-content: right;
        // align-items: center;
        margin: 0 70px 15px auto;
        float: right;
    }
    .tableWrap {
        margin-top: 16px;
        margin-left: 10px;
        width: calc(100% - 10px);
        overflow: hidden;
        .workTable {
            width: 100%;
        }
    }
    /deep/ .el-form-item.ruleItem.el-form-item--mini .el-form-item__content {
        display: flex;
        align-items: center;
        // justify-content: space-between;
        flex-wrap: wrap;
    }
    .ruleItems {
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 10px;
        margin-bottom: 5px;
    }
}
</style>