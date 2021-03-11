<template>
    <div class="workWrap">
        <header>
            <span class="title">事项详情</span>
        </header>
        <div class="handleBox">
            <el-button type="primary" icon="el-icon-edit" style="margin-left: 20px" @click="edit">编辑事项</el-button>
        </div>
        <div class="workBox">
            <el-form :inline="true" :model="formInline" class="formStyle demo-form" label-width="100px"
                label-position="left">
                <el-form-item label="大项名称：">
                    <div class="formItem"><span>{{ formInline.approvalName }}</span></div>
                </el-form-item>
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
                <el-form-item label="补充业务信息描述(键-值)：">
                    <div v-for="(item,i) in formInline.extraInfoList" :key="i">
                        <div>
                            <span>{{item.keyValue + ' - ' + item.labelValue}}</span>
                        </div>
                    </div>
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
            <div class="workHandleBoxContent">
                <div class="handleBox">
                    <p class="title">下载配置开发模板</p>
                    <el-button type="primary" icon="el-icon-download" @click="downLoad">点击下载</el-button>
                </div>
                <div class="handleBox">
                    <p class="title">上传事项配置到git</p>
                    <el-button type="primary" icon="el-icon-upload2" :loading="loadingUptoGit" @click="upToGit">点击上传</el-button>
                </div>
            </div>
        </div>
        <!-- 事项编辑弹窗 -->
        <el-dialog title="事项属性填写" :visible.sync="dialogUpdateVisible" width="50%" :close-on-click-modal="false">
            <div class="attribute-content">
                <el-form :model="tempItem" ref="tempItem" :inline="false" label-position="left"
                    class="demo-form-inline">
                    <el-form-item label="大项" prop="approvalId">
                        <el-select v-model="tempItem.approvalId" filterable>
                            <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName"
                                :value="v.approvalId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="事项编号" prop="itemNo">
                        <el-input v-model="tempItem.itemNo">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="事项名称" prop="itemName">
                        <el-input v-model="tempItem.itemName">
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item label="补充业务信息描述" prop="extraInfo">
                        <el-input v-model="tempItem.extraInfo">
                        </el-input>
                    </el-form-item> -->
                    <el-form-item label="补充业务信息描述" class="ruleItem">
                        <div v-for="(item,i) in extraInfoList" :key="i" class="ruleItems">
                            <el-input v-model="item.keyValue" placeholder="请填入业务信息key值" clearable style="width:45%">
                            </el-input>
                            <el-input v-model="item.labelValue" placeholder="请填入业务信息value值" style="width:45%" clearable>
                            </el-input>
                            <i v-if="extraInfoList.length>1" style="margin-left:10px;color:red;cursor: pointer;"
                                class="el-icon-delete" @click="deletInputs(i)"></i>
                        </div>
                        <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                            @click="addExtraInfoList()"></i>
                    </el-form-item>
                    <el-form-item label="事项类型(如新增/变更)" prop="itemType">
                        <el-input v-model="tempItem.itemType">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="tempItem.sort">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="updateItem">
                    确定
                </el-button>
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
import _ from "lodash"
// 接口
import { getByApprovalItemId, listApprovalAll, updateApprovalItem, submitItemInfo } from "@/api/basicInfo/approval"

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
            },
            showExtraInfoList: [],
            // 编辑事项相关
            dialogUpdateVisible: false,
            tempItem: {},
            approvalOptions: [],
            extraInfoList: [{
                keyValue: '',
                labelValue: '',
            }],
            // 上传下载相关
            loadingUptoGit: false,
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
            if (this.itemInfo.extraInfo) {
                this.itemInfo.extraInfoList = JSON.parse(this.itemInfo.extraInfo);
            } else {
                this.itemInfo.extraInfoList = [{
                    keyValue: '',
                    labelValue: '',
                }];
            }
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
        },
        // 编辑事项相关
        addExtraInfoList() {
            this.extraInfoList.push({
                keyValue: '',
                labelValue: '',
            })
        },
        deletInputs(i) {
            this.extraInfoList.splice(i, 1);
        },
        async edit() {
            // 获取选项
            let approvalRes = await listApprovalAll();
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
            this.tempItem = _.cloneDeep(this.formInline);
            this.extraInfoList = this.tempItem.extraInfoList;
            this.dialogUpdateVisible = true;
        },
        async updateItem() {
            this.tempItem.extraInfo = JSON.stringify(this.extraInfoList);
            let res = await updateApprovalItem(this.tempItem);
            if (res.success) {
                this.$message.success("事项修改成功!");
                this.dialogUpdateVisible = false;
                let result = await getByApprovalItemId({ approvalItemId: this.itemId });
                if (!result.success) {
                    this.$message({ type: "warning", message: "事项信息更新失败" });
                    return;
                }
                this.$store.commit("changeItem", result.data);
                this.getApprovalDetailInfo();
            } else {
                this.$message.success("事项修改失败!");
            }
        },
        // 上传事项配置到git
        async upToGit() {
            this.loadingUptoGit = true;
            let res = await submitItemInfo({approvalItemId: this.itemId});
            if(res.success) {
                this.$message.success('上传配置到Git成功！');
            } else {
                this.$message.warning('上传配置到Git失败！');
            }
            this.loadingUptoGit = false;
        },
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
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            // background: rgb(222, 226, 255);
            // .formItem {
            //     margin-right: 700px;
            // }
        }
    }
    .workHandleBox {
        display: flex;
        // align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        // flex-wrap: wrap;
        // background: rgb(219, 237, 238);
        .workHandleBoxContent {
            display: flex;
            // align-items: center;
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