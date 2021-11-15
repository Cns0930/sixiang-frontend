<template>
    <div class="workWrap">
        <div>
            <header>
                <span class="title">事项详情</span>
            </header>
            <div class="handleBox">
                <el-button type="primary" icon="el-icon-edit" style="margin-left: 20px" @click="edit">编辑基本信息</el-button>
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
                    <el-button :disabled="itemInfo.itemStage === '验收'" type="primary" icon="el-icon-upload2"
                        @click="dialogItemConfirmVisible = true;">保存事项
                    </el-button>
                </div>
                <div v-if="!itemInfo.isPublic" class="handleBox">
                    <p class="title">载入其他事项版本</p>
                    <el-button type="primary" icon="el-icon-upload2" @click="downApprovalItem">载入事项
                    </el-button>
                </div>
                <div class="handleBox" v-btn>
                    <p class="title">上传事项配置到git</p>
                    <el-button :disabled="itemInfo.itemStage === '验收'" type="primary" icon="el-icon-upload2"
                        @click="dialogGitConfirmVisible = true;">点击上传
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
                </div>
            </div>
        </div>

        <div class="extraHandleBox">
            <header>
                <span class="title">文字信息</span>
            </header>
            <div class="handleBox">
                <el-button type="primary" icon="el-icon-edit" style="margin-left: 20px" @click="dialogExtrasVisible=true">配置文字信息</el-button>
            </div>
            <div class="workBox">
                <el-form :inline="true" :model="extrasInline" class="formStyle demo-form" label-width="100px"
                    label-position="left">
                    <el-form-item label="办事指南：">
                        <div class="formItem"><span>{{ extrasInline.manual }}</span></div>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!-- 事项编辑弹窗 -->
        <EditItemInfoDialog ref="editDialog" @changeDetil="updateEdit" />
        <!-- 事项多版本查看导入 -->
        <el-dialog title="版本列表" :visible.sync="dialogVisibleVersion" width="80%" :close-on-click-modal="false">
            <div>
                <h3 style="color:#606266">当前事项数据来源:</h3>
                <i v-if="itemInfo.versionInfo" class="itemInfo-text">提交人：<i
                        class="itemInfo-text-in">{{ itemInfo.versionInfo.userName }}</i> </i>
                <i v-if="itemInfo.versionInfo" class="itemInfo-text">版本号：<i
                        class="itemInfo-text-in">{{ itemInfo.versionInfo.version }}</i> </i>
            </div>
            <div style="margin:10px 0px">
                <el-input placeholder="按版本号或者用户名查询" v-model="versionorUserName" clearable
                    style="width: 200px;margin-right:10px" @change="searchVersion"></el-input>
                <el-button icon="el-icon-search" @change="searchVersion"></el-button>
            </div>
            <el-table ref="versionTable" v-loading="loadingTable" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)"
                :data="versionList" border style="width: 100%" row-key="id">
                <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column prop="username" label="提交人"></el-table-column>
                <el-table-column label="git链接" width="200">
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.gitUrl">{{scope.row.gitUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                <el-table-column prop="latest" label="是否最新" :formatter="formatBoolean"></el-table-column>
                <el-table-column prop="note" label="备注信息"></el-table-column>
                <el-table-column label="操作" fixed="right" width="200px">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" :loading="scope.row.loadingImport"
                                @click="confirmImport(scope.row)">确认导入</el-button>
                            <el-button type="primary" @click="showVersionHistory(scope.row)">溯源版本</el-button>
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
        <!-- 多版本溯源查看导入 -->
        <el-dialog title="溯源版本列表" :visible.sync="versionHistoryDialogVisible" width="70%" :close-on-click-modal="false">
            <el-table ref="versionTable" v-loading="loadingTable" element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)"
                :data="versionHistoryTableData" border style="width: 100%" row-key="id">
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
                <el-button @click="versionHistoryDialogVisible = false">
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
                <el-table-column label="git链接" width="200">
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.gitUrl">{{scope.row.gitUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="git压缩包下载">
                    <template slot-scope="scope">
                        <a :href="scope.row.downloadUrl">点击下载</a>
                    </template>
                </el-table-column>
                <el-table-column prop="itemVersion" label="事项版本"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                <el-table-column prop="note" label="提交备注"></el-table-column>
                <el-table-column prop="delNote" label="删除备注"></el-table-column>
                <el-table-column label="操作" fixed="right" width="100px">
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
            <!-- <div style="margin-top: 20px">
                <span>本次修改主要所属阶段：</span>
                <el-select v-model="saveStep" placeholder="阶段" style="width:400px">
                    <el-option v-for="item in stepOptions" :key="item.value" :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
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
            <div style="margin-top: 20px">
                <span>对应九宫版本：</span>
                <el-select v-model="machineId" filterable clearable placeholder="地址+说明+版本" style="width:400px">
                    <el-option v-for="item in addressOptions" :key="item.id"
                        :label="'地址:' + item.superformIpPort + ' 说明:' + item.displayNotes + ' 版本:' + item.version"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <!-- <div style="margin-top: 20px">
                <span>本次修改主要所属阶段：</span>
                <el-select v-model="pushStep" placeholder="阶段" style="width:400px">
                    <el-option v-for="item in stepOptions" :key="item.value" :value="item.value">
                    </el-option>
                </el-select>
            </div> -->
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
        <!-- 复用 -->
        <el-dialog title="复用其他事项数据" :visible.sync="reuseDialogVisible" width="50%" :close-on-click-modal="false">
            <div style="margin:10px 0px">
                项目选择:
                <el-select v-model="tempProjectId" placeholder="请选择项目名称" @change="selectProject">
                    <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </div>
            <div>
                事项名称:
                <el-select filterable clearable placeholder="请选择事项名称" v-model="tempItemId" @change="showVersionList"
                    style="position:relative; margin-bottom: 20px;">
                    <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                        :value="v.approvalItemLordId">
                    </el-option>
                </el-select>
            </div>
            <div class="sampleTable">
                <el-table ref="versionTable" v-loading="loadingReuse" element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)"
                    :data="reuseTableData" border style="width: 100%" row-key="id">
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
                                    @click="affirmReuse(scope.row)">复用</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="reuseDialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <el-dialog title="事项文字信息配置" :visible.sync="dialogExtrasVisible" width="50%" :close-on-click-modal="false"
        :before-close="closeExtraDialog">
            <div class="attribute-content">
                <el-form :model="extrasInline" :inline="false" label-position="left"
                    class="demo-form-inline">
                    <el-form-item label="办事指南" prop="manual">
                        <!-- <TEXTEditor v-model="extrasInline.manual" ref="editorManual"
                            style="width: 380px">
                        </TEXTEditor> -->
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入内容"
                            v-model="extrasInline.manual">
                        </el-input>
                    </el-form-item>
                    </el-form>
                </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeExtraDialog">
                    取消
                </el-button>
                <el-button type="primary" @click="editExtras">
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
import VueCompositionAPI from '@vue/composition-api'
import { ref } from "@vue/composition-api";
// 组件
import EditItemInfoDialog from "./basicInfoComponents/EditItemInfoDialog"
// 接口
import {
    getByApprovalItemId, submitItemInfo,
    listVersionItem, obtainVersionItem, addSysVersionItem, listSysGitVersionLog,
    deleteSysGitVersion, listMachines, listHistoryRecord,
    getExtras, editExtras
} from "@/api/basicInfo/approval"
import {
    listApprovalItem, listProjectAll, copyVersionItem
} from "@/api/basicInfo/approval";
export default {
    name: "ApprovalDetail",
    mixins: [mixin],
    components: { EditItemInfoDialog },
    setup() {
        const editDialog = ref(null);
        return {
            editDialog,
        }
    },
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
            versionorUserName: '',
            //    溯源
            versionHistoryTableData: [],
            versionHistoryDialogVisible: false,

            // 保存提交加备注
            itemNote: '',
            gitNote: '',
            dialogItemConfirmVisible: false,
            dialogGitConfirmVisible: false,
            machineId: null,
            addressOptions: [],
            dialogGitHistoryVisible: false,
            gitHistoryList: [],
            deleteNote: '',
            deleteId: null,
            dialogGitDeleteVisible: false,
            // 复用事项
            reuseDialogVisible: false,
            loadingReuse: false,
            tempProjectId: null,
            projectOptions: [],
            tempItemId: null,
            typeSubItemOptions: [],
            reuseTableData: [],
            // 阶段统计
            stepOptions: [
                { value: '初步调研' },
                { value: '基于问卷补充信息' },
                { value: '帮办开发' },
                { value: '预检开发' },
                { value: '自测' },
                { value: 'bug处理' },
            ],
            saveStep: '',
            pushStep: '',
            extrasInline: {
            },
            dialogExtrasVisible: false,
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
        console.log('this.itemInfo', this.itemInfo)
    },
    async mounted() {
        await this.getOptions();
        await this.getExtraMap();
    },
    methods: {
        async getOptions() {
            let { success, data } = await listMachines();
            if (!success) return;
            this.addressOptions = data;
        },
        getApprovalDetailInfo() {
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
        },
        async getExtraMap(){
            console.log("111")
            let res = await getExtras({approvalItemId: this.itemId})
            if(res.success){
                this.extrasInline = res.data;
            }
        },
        async editExtras(){
            let res = await editExtras({approvalItemId: this.itemId, extrasMap: this.extrasInline});
            if (res.success) {
                this.$message.success('修改成功');
                this.dialogExtrasVisible = false;
            } else {
                this.$message.warning('修改失败');
            }
        },
        async closeExtraDialog(){
            await this.getExtraMap();
            this.dialogExtrasVisible=false;
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
        async edit() {
            this.formInline.sujectType ? this.formInline.sujectType = this.formInline.sujectType.split(',').map(Number) : [];
            this.tempItem = _.cloneDeep(this.formInline);
            this.editDialog && this.editDialog.openDialog();
            this.editDialog.tempItem = this.tempItem
        },
        // 页面更新编辑结果
        async updateEdit() {
            let result = await getByApprovalItemId({ approvalItemId: this.itemId });
            if (!result.success) {
                this.$message({ type: "warning", message: "事项信息更新失败" });
                return;
            }
            this.$store.commit("changeItem", result.data);
            this.getApprovalDetailInfo();
        },
        // 上传事项配置到git
        async upToGit() {
            if (this.gitNote === '') {
                this.$message.warning("请填写备注再提交");
                return;
            }
            if (!this.machineId) {
                this.$message.warning("请选择九宫地址再提交");
                return;
            }
            // if (this.pushStep === '') {
            //     this.$message.warning("请选择阶段再提交");
            //     return;
            // }
            this.loadingUptoGit = true;
            let res = await submitItemInfo({ approvalItemId: this.itemId, note: this.gitNote, machineId: this.machineId });
            if (res.success) {
                this.$message.success('上传配置到Git成功！');
            } else {
                this.$message.warning('上传配置到Git失败！');
            }
            this.loadingUptoGit = false;
            this.dialogGitConfirmVisible = false;
            this.gitNote = '';
            this.pushStep = '';
        },

        // 多版本相关
        async saveApprovalItem() {
            if (this.itemNote === '') {
                this.$message.warning("请填写备注再提交");
                return;
            }
            // if (this.saveStep === '') {
            //     this.$message.warning("请选择阶段再提交");
            //     return;
            // }
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
            this.saveStep = '';
        },
        downApprovalItem() {
            this.searchVersion();
            this.dialogVisibleVersion = true;
        },
        async searchVersion() {
            let res = await listVersionItem({ approvalItemLordId: this.itemInfo.approvalItemLordId, versionorUserName: this.versionorUserName });
            if (!res.success) return;
            this.versionList = res.data;
            this.versionList.forEach((item) => {
                this.$set(item, 'loadingImport', false)
            })
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
                await this.getExtraMap();
            } else {
                this.$message.warning('导入事项数据失败！');
            }
            row.loadingImport = false;
            this.loadingTable = false;
            // 重新加载事项详情信息更新versionInfo //this.init();
            let result = await getByApprovalItemId({ approvalItemId: this.$route.query.itemId });
            if (!result.success) {
                this.$message({ type: "warning", message: "更新事项信息失败" });
                return;
            }
            this.versionHistoryDialogVisible = false
            this.$store.commit("changeItem", result.data);
        },
        // 查看溯源版本
        async showVersionHistory(row) {
            console.log('row')
            console.log(row)
            let res = await listHistoryRecord({ versionItemId: row.id })
            if (!res.success) return
            this.versionHistoryTableData = res.data
            this.versionHistoryDialogVisible = true
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
        },
        // 复用事项
        async showReuseDialog() {
            let resultProject = await listProjectAll();
            this.projectOptions = resultProject.data;
            this.reuseDialogVisible = true
        },
        // 确认复用
        async affirmReuse(row) {
            console.log('row')
            console.log(row)
            row.loadingResuseRow = true;
            this.loadingReuse = true;
            let params = {
                approvalItemLordId: this.itemInfo.approvalItemLordId,
                id: row.id,
            }
            let res = await copyVersionItem(params);
            if (!res.success) {
                this.$message.warning('导入失败！');
                row.loadingResuseRow = false;
                this.loadingReuse = false;
                return;
            } else {
                this.$message.success('导入成功！');
                row.loadingResuseRow = false;
                this.loadingReuse = false;
                this.reuseTableData = [];
                this.tempItemId = null;
                this.tempProjectId = null,
                    this.reuseDialogVisible = false
            }
        },
        async selectProject() {
            this.reuseTableData = [];
            this.tempItemId = '';
            let result = await listApprovalItem({ pageNum: 1, pageSize: 500, projectId: this.tempProjectId });
            this.typeSubItemOptions = result.data.records;
        },
        async showVersionList() {
            this.reuseTableData = [];
            if (this.tempItemId) {
                let res = await listVersionItem({ approvalItemLordId: this.tempItemId });
                if (!res.success) return;
                this.reuseTableData = res.data;
                this.reuseTableData.forEach((item) => {
                    this.$set(item, 'loadingResuseRow', false)
                })
            }
        },
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
            margin-left: 30px;
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
    .extraHandleBox {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
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
    // 版本来源区域样式
    .itemInfo-text {
        font-size: 14px;
    }
    .itemInfo-text-in {
        margin-right: 8px;
        color: #f5588a;
        font-weight: bold;
        font-size: 14px;
    }
}
</style>