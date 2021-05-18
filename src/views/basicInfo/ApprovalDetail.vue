<template>
    <div class="workWrap">
        <div>
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

        </div>
        <div class="workHandleBox">
            <header>
                <span class="title">操作</span>
            </header>
            <div class="workHandleBoxContent">
                <div class="handleBox">
                    <p class="title">下载预检开发配置模板</p>
                    <el-button type="primary" icon="el-icon-download" @click="downLoad('/ss/Import/downloadAiZip')">点击下载
                    </el-button>
                </div>
                <div class="handleBox">
                    <p class="title">临时下载迁移前四象1.0需求文件</p>
                    <el-button type="primary" icon="el-icon-download" @click="downLoad('/ss/Import/downloadDemandZip')">
                        点击下载</el-button>
                </div>
                <div v-if="!itemInfo.isPublic" class="handleBox">
                    <p class="title">保存当前事项版本</p>
                    <el-button type="primary" icon="el-icon-upload2" @click="dialogItemConfirmVisible = true;">保存事项
                    </el-button>
                </div>
                <div v-if="!itemInfo.isPublic" class="handleBox">
                    <p class="title">载入其他事项版本</p>
                    <el-button type="primary" icon="el-icon-upload2" @click="downApprovalItem">载入事项
                    </el-button>
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
                    <el-form-item label="办件类型">
                        <el-select v-model="tempItem.sujectType" multiple filterable placeholder="个人/企业"
                            style="width:300px">
                            <el-option :value="Number(0)" label="个人"></el-option>
                            <el-option :value="Number(1)" label="企业"></el-option>
                        </el-select>
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
        <!-- 事项多版本查看导入 -->
        <el-dialog title="版本列表" :visible.sync="dialogVisibleVersion" width="80%" :close-on-click-modal="false">
            <el-table ref="versionTable" v-loading="loadingTable" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)"
                :data="versionList" border style="width: 100%" row-key="id">
                <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column prop="username" label="提交人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                <el-table-column prop="latest" label="是否最新" :formatter="formatBoolean"></el-table-column>
                <el-table-column prop="note" label="备注信息"></el-table-column>
                <el-table-column label="操作" fixed="right" width="200px">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" :loading="scope.row.loadingImport"
                                @click="confirmImport(scope.row)">确认导入</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleVersion = false">
                    关闭
                </el-button>
            </span>
        </el-dialog>
        <!-- Git历史记录列表查看 -->
        <el-dialog title="git记录列表" :visible.sync="dialogGitHistoryVisible" width="80%" :close-on-click-modal="false">
            <el-table ref="gitHistoryTable" :data="gitHistoryList" border style="width: 100%" row-key="id"
                :row-class-name="tableRowClassName">
                <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column prop="creator" label="提交人"></el-table-column>
                <el-table-column label="git链接">
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.gitUrl">{{scope.row.gitUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="itemVersion" label="事项版本"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                <el-table-column prop="note" label="提交备注"></el-table-column>
                <el-table-column prop="delNote" label="删除备注"></el-table-column>
                <el-table-column label="操作" fixed="right" width="200px">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="danger" :disabled="scope.row.isDelete === 1"
                                @click="deleteGitlog(scope.row)">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogGitHistoryVisible = false">
                    关闭
                </el-button>
            </span>
        </el-dialog>
        <!-- 保存事项备注填写框 -->
        <el-dialog title="保存事项" :visible.sync="dialogItemConfirmVisible" width="50%" :close-on-click-modal="false">
            <div class="attribute-content">
                <span>备注填写:</span>
                <el-input type="textarea" v-model="itemNote" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogItemConfirmVisible = false">
                    取消
                </el-button>
                <el-button type="primary" :loading="loadingSaveApprovalItem" @click="saveApprovalItem">
                    确定
                </el-button>
            </span>
        </el-dialog>
        <!-- 提交git备注填写框 -->
        <el-dialog title="提交git" :visible.sync="dialogGitConfirmVisible" width="50%" :close-on-click-modal="false">
            <div class="attribute-content">
                <span>备注填写:</span>
                <el-input type="textarea" v-model="gitNote" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogGitConfirmVisible = false">
                    取消
                </el-button>
                <el-button type="primary" :loading="loadingUptoGit" @click="upToGit">
                    确定
                </el-button>
            </span>
        </el-dialog>
        <!-- 删除git备注填写框 -->
        <el-dialog title="删除git" :visible.sync="dialogGitDeleteVisible" width="50%" :append-to-body="true"
            :close-on-click-modal="false">
            <div class="attribute-content">
                <span>备注填写:</span>
                <el-input type="textarea" v-model="deleteNote" :autosize="{ minRows: 2, maxRows: 6 }"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogGitDeleteVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="deleteGit">
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
import {
    getByApprovalItemId, listApprovalAll, updateApprovalItem, submitItemInfo,
    listVersionItem, obtainVersionItem, addSysVersionItem, listSysGitVersionLog,
    deleteSysGitVersion
} from "@/api/basicInfo/approval"

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
            // 多版本相关
            loadingSaveApprovalItem: false,
            loadingDownApprovalItem: false,
            dialogVisibleVersion: false,
            versionList: [],
            loadingTable: false,

            // 保存提交加备注
            itemNote: '',
            gitNote: '',
            dialogItemConfirmVisible: false,
            dialogGitConfirmVisible: false,
            dialogGitHistoryVisible: false,
            gitHistoryList: [],
            deleteNote: '',
            deleteId: null,
            dialogGitDeleteVisible: false,
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
        console.log('this.itemInfo', this.itemInfo)
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
        async downLoad(url) {
            let res = await axios({
                method: "get",
                url: url,
                params: {
                    approvalItemId: this.itemId,
                    // type: "word",
                },
                responseType: "arraybuffer",
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("没有需要下载的文件");
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
            let approvalRes = await listApprovalAll({ projectId: this.$route.query.projectId });
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
            this.tempItem = _.cloneDeep(this.formInline);
            this.tempItem.approvalItemId = this.tempItem.approvalItemLordId;
            this.extraInfoList = this.tempItem.extraInfoList;
            this.tempItem.sujectType ? this.tempItem.sujectType = this.tempItem.sujectType.split(',').map(Number) : [];
            this.dialogUpdateVisible = true;
        },
        async updateItem() {
            this.tempItem.extraInfo = JSON.stringify(this.extraInfoList);
            this.tempItem.sujectType = this.tempItem.sujectType.toString();
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
            if (this.gitNote === '') {
                this.$message.warning("请填写备注再提交");
                return;
            }
            this.loadingUptoGit = true;
            let res = await submitItemInfo({ approvalItemId: this.itemId, note: this.gitNote });
            if (res.success) {
                this.$message.success('上传配置到Git成功！');
            } else {
                this.$message.warning('上传配置到Git失败！');
            }
            this.loadingUptoGit = false;
            this.dialogGitConfirmVisible = false;
            this.gitNote = '';
        },

        // 多版本相关
        async saveApprovalItem() {
            if (this.itemNote === '') {
                this.$message.warning("请填写备注再提交");
                return;
            }
            this.loadingSaveApprovalItem = true;
            let res = await addSysVersionItem({ approvalItemId: this.itemId, note: this.itemNote });
            if (res.success) {
                this.$message.success('保存当前事项成功！');
            } else {
                this.$message.warning('保存当前事项失败！');
            }
            this.loadingSaveApprovalItem = false;
            this.dialogItemConfirmVisible = false;
            this.itemNote = '';
        },
        async downApprovalItem() {
            let res = await listVersionItem({ approvalItemLordId: this.itemInfo.approvalItemLordId });
            if (!res.success) return;
            this.versionList = res.data;
            this.versionList.forEach((item) => {
                this.$set(item, 'loadingImport', false)
            })
            console.log('versionList', this.versionList);
            this.dialogVisibleVersion = true;
        },
        // 查看git提交信息
        async showGitHistory() {
            let res = await listSysGitVersionLog({ approvalItemId: this.itemId });
            if (!res.success) return;
            this.gitHistoryList = res.data;
            this.dialogGitHistoryVisible = true;
        },
        indexMethod(index) {
            return index + 1;
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
        formatBoolean(row, column, cellValue) {
            let ret = ''  //你想在页面展示的值
            if (cellValue) {
                ret = "最新"  //根据自己的需求设定
            } else {
                ret = "-"
            }
            return ret;
        },
        // 确认导入
        async confirmImport(row) {
            const confirmResult = await this.$confirm('导入将覆盖当前事项已开发的暂存数据，建议先保存当前事项版本数据，确定继续么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            /*如果用户确认打印confirm,如果用户取消显示cancel*/
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消导入!');
            }
            console.log('确认了导入');
            row.loadingImport = true;
            this.loadingTable = true;
            let request = {
                approvalItemLordId: row.approvalItemLordId,
                exImport: true,
                id: row.id
            }
            let res = await obtainVersionItem(request)
            if (res.success) {
                this.$message.success('导入事项数据成功！');
                this.dialogVisibleVersion = false;
            } else {
                this.$message.warning('导入事项数据失败！');
            }
            row.loadingImport = false;
            this.loadingTable = false;
        },
        // 删除git提交记录
        deleteGitlog(row) {
            this.dialogGitDeleteVisible = true;
            this.deleteId = row.id;
        },
        // 确认删除
        async deleteGit() {
            if (this.deleteNote === '') {
                this.$message.warning("请填写备注再提交");
                return;
            }
            let res = await deleteSysGitVersion({ id: this.deleteId, delNote: this.deleteNote });
            if (res.success) {
                this.$message.success('删除记录成功！');
            } else {
                this.$message.warning('删除记录失败！');
            }
            this.dialogGitDeleteVisible = false;
            this.showGitHistory();
            this.deleteNote = '';
        },
        // 改变已删掉的数据的行样式
        tableRowClassName({ row, rowIndex }) {
            if (row) {
                if (row.isDelete === 1) {
                    return 'gray-row'
                } else {
                    return ''
                }
            }
        }
    },

}
</script>

<style>
.el-table .gray-row {
    color:#bdbdbd;
    background:#f3f3f3;
}
</style>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    display: flex;
    // align-items: center;
    flex-direction: row;
    justify-content: flex-start;
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