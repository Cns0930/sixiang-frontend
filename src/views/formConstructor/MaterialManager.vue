<template>
    <div class="material-manager">
        <div class="op-bar">
            <el-button @click="openAddDialog"> 新建模板</el-button>
            <el-button @click="getTemplate">载入模板</el-button>
            <el-button @click="copeAllTemplates">复制其他事项全部模板</el-button>
            <el-button @click="downAllPages">下载所有开发后页面</el-button>
            <el-button @click="handleDownload" type="primary">下载最新word模板</el-button>

            <el-badge :is-dot="!isLast">
                <el-button @click="transferAllTemplates" :disabled="backend.includes('4141')">批量保存到超级帮办</el-button>
            </el-badge>

        </div>

        <div class="main">
            <!-- 模板列表 -->
            <div class="material-list">
                <el-table :data="templates" border>
                    <el-table-column label="word模板名称">
                        <template slot-scope="scope">
                            <el-button type="text" style="color: orange"
                                @click="goTemplatemanager(scope.row.template.id)">
                                {{ scope.row.template.docxTemplateName }}</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column prop="template.materialName" label="材料名称"></el-table-column>
                    <el-table-column prop="template.templateName" label="模板名称(自取)"></el-table-column>
                    <el-table-column prop="template.produceSource" label="产生方式"></el-table-column>
                    <el-table-column label="操作" width="150px">
                        <template slot-scope="scope">
                            <el-button @click="openDetail(scope.row)">编辑</el-button>
                            <el-button @click="deleteTemplate(scope.row.template.id)">删除</el-button>
                            <!-- <el-button @click="transferTemplate(scope.row)"
                        >保存到超级帮办</el-button
                    > -->
                        </template>
                    </el-table-column>

                </el-table>

                <!-- <div v-for="(v, i) in templates" :key="i" class="material-item">
                    <el-button
                        type="text"
                        style="color: orange"
                        @click="goTemplatemanager(v.template.id)"
                        >{{ v.template.docxTemplateName }}</el-button
                    >
                    <el-button @click="openDetail(v)">编辑</el-button>
                    <el-button @click="deleteTemplate(v.template.id)"
                        >删除</el-button
                    >
                    <el-button @click="transferTemplate(v)"
                        >保存到超级帮办</el-button
                    >
                </div> -->
            </div>

            <!-- 模板编辑 -->
            <div class="material-detail" v-if="temp_template">
                <div>
                    <el-button type="primary" @click="saveTemplate">保存修改</el-button>
                </div>
                <div>{{ temp_template.docxTemplateName }}:</div>
                <!-- 模板名称(必填)<el-input v-model="temp_template.docxTemplateName"></el-input>
            材料中文名(必填)<el-input v-model="temp_template.documentName"></el-input>
            材料序号(必填)<el-input v-model="temp_template.documentSeq"></el-input> -->
                <div>
                    备注<el-input type="textarea" :autosize="{ minRows: 1, maxRows: 15 }" v-model="temp_template.notes">
                    </el-input>
                </div>
                <div>
                    page配置<CodeEditor ref="scriptEditor" v-model="temp_template.script"></CodeEditor>
                </div>
                <div>
                    产生方式配置<CodeEditor ref="producescriptEditor" v-model="temp_template.produceScript"></CodeEditor>
                </div>
                <div>
                    关联一级材料
                    <el-select v-model="temp_template.materialId" filterable
                        placeholder="请选择一级材料" style="width: 100%">
                        <el-option v-for="item in materialList" :key="item.materialId"
                            :label="item.materialName" :value="item.materialId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    word模板名称
                    <el-input v-model="temp_template.docxTemplateName"></el-input>
                </div>
                <div>
                    模板名称(自取)
                    <el-input v-model="temp_template.templateName"></el-input>
                </div>
            </div>
        </div>
        <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="70%" :close-on-click-modal="false">
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 95%" border
                    tooltip-effect="dark" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="approvalItemId"
                        label="审批事项编号"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column> -->
                    <el-table-column prop="docxTemplateName" label="超级帮办word模板命名">
                        <template slot-scope="scopeD">
                            <el-input v-if="scopeD.row.flag" placeholder="word模板名称"
                                v-model="scopeD.row.docxTemplateName">
                            </el-input>
                            <span v-else>{{scopeD.row.docxTemplateName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="templateName" label="模板名称(自取)" width="120">
                        <template slot-scope="scopeD">
                            <el-input v-if="scopeD.row.flag" placeholder="word模板名称" v-model="scopeD.row.templateName">
                            </el-input>
                            <span v-else>{{scopeD.row.templateName}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="materialCode" label="材料编码" width="100" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="materialName" label="材料展示名称"></el-table-column>
                    <!-- <el-table-column prop="materialStatus" label="材料状态" width="80"></el-table-column> -->
                    <el-table-column prop="documentSeq" label="文档编号" width="80"></el-table-column>
                    <el-table-column prop="note" label="备注" width="80" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="proDocId" label="proDocId" width="100"></el-table-column> -->
                    <el-table-column prop="produceSource" label="产生来源" width="100" :filters="produceSourceFilters"
                        :filter-method="filterHandler"></el-table-column>
                    <!-- <el-table-column prop="descriptionInfo" label="其他说明信息（调研填写）" width="180" show-overflow-tooltip></el-table-column> -->
                    <el-table-column label="操作" fixed="right" width="80">
                        <template slot-scope="scope">
                            <div v-if="scope.row.flag">
                                <el-button size="mini" type="primary" icon="el-icon-check" @click="saveText(scope.row)">
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button size="mini" type="primary" @click="Edit(scope.row)" icon="el-icon-edit">
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="clearFilter">清除筛选</el-button>
                <el-button @click="templateCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplateBatch">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 复制其他事项全部模板 -->
        <el-dialog title="复制其他事项全部模板" :visible.sync="copeTemplatesVisible" width="50%" :close-on-click-modal="false">
            <div style="margin:10px 0px">
                项目选择:
                <el-select v-model="chosedProjectId" @change="selectProject">
                    <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </div>
            <div>
                事项名称:
                <el-select clearable filterable placeholder="请选择事项名称" v-model="chosedItemId" @change="selectOne"
                    style="position:relative" remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                        :value="v.approvalItemId">

                    </el-option>

                    <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                        <a class="text-normal">
                            <el-pagination @size-change="handleSizeChangeSelect"
                                @current-change="handleCurrentChangeSelect" :current-page="currentPageSelect"
                                :total="totalAim" :page-size="pageSize" layout="prev, pager, next" />
                        </a>
                    </div>
                </el-select>
            </div>
            <div style="margin: 8px 0">模板预览: </div>
            <div class="material-list">
                <el-table :data="templatesCopyFrom" border>
                    <el-table-column prop="template.docxTemplateName" label="word模板名称">
                    </el-table-column>
                    <el-table-column prop="template.materialName" label="材料名称"></el-table-column>
                    <el-table-column prop="template.templateName" label="模板名称(自取)"></el-table-column>
                    <el-table-column prop="template.produceSource" label="产生方式"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="copeTemplatesVisible = false">取 消</el-button>
                <el-button type="primary" @click="copyIn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getTemplate,
    addTemplate,
    deleteTemplate,
    getSingleTemplate,
    GetAddTable,
    batchSave,
    listPreTemplatesByApprovalItemId
} from "@/api/template/index";
import { addSysTransferLog, getUptoDateSysTransferLog, } from "@/api/item/index";
import { getSaveMaxTimeTemplateBatch } from "@/api/template/index";
import { listApprovalItemByUser, listProjectAll } from "@/api/basicInfo/approval";
import { copyMaterialByItemId, getAllByApprovalItemId } from "@/api/basicInfo/material";
import { mixin } from "@/mixin/mixin";
import axios from "axios";
import { mapState } from "vuex"
import { CodeEditor } from "@/views/attributeComponents/defRendererComponents/defRendererComponents";

import dayjs from "dayjs"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

export default {
    name: "MaterialManager",
    mixins: [mixin],
    components: { CodeEditor },
    data() {
        return {
            // itemId: this.$route.query.itemId,
            backend: process.env.VUE_APP_BASE_IP,
            templates: [],

            templateCreateVisible: false,

            temp_template_name: "",
            temp_document_seq: "",
            temp_document_name: "",
            temp_pro_doc_id: "",

            temp_template: null,
            hasSelectList: [],
            // 是否需要输出到超级帮办
            isLast: true,
            // 新建材料的表格
            tableData: [],
            multipleSelection: [],
            produceSourceFilters: [],
            // 复制其他事项全部模板
            copeTemplatesVisible: false,
            projectOptions: [],
            typeSubItemOptions: [],
            chosedProjectId: null,
            chosedItemId: null,
            currentPageSelect: 1,
            loading: false,
            templatesCopyFrom: [],
            pageSize: 15,
            totalAim: 0,
            // 编辑模板
            materialList: [],
        };
    },
    computed: {
        ...mapState({
            itemId: state => state.home.item.approvalItemId,
        })
    },
    async mounted() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getTemplate();
        this.getLastUpdateInfo();
        await this.getMaterialList();
    },
    methods: {
        async getMaterialList() {
            let result = await getAllByApprovalItemId({approvalItemId: this.itemId});
            if(!result.success) return;
            this.materialList = result.data;
        },
        //复制其他事项全部模板
        async copeAllTemplates() {
            let resultProject = await listProjectAll();
            this.projectOptions = resultProject.data;
            this.copeTemplatesVisible = true;
        },
        async selectProject() {
            this.chosedItemId = '';
            this.templatesCopyFrom = [];
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.chosedProjectId });
            this.typeSubItemOptions = result.data.records;
            this.totalAim = result.data.total;
        },
        async selectOne() {
            if (this.chosedItemId !== '') {
                const res = await getTemplate({approvalItemId: this.chosedItemId});
                if (!res.success) return;
                this.templatesCopyFrom = res.data;
            } else {
                this.templatesCopyFrom = [];
            }
            
        },
        //下拉框带分页
        async handleSizeChangeSelect(size) {
            this.selectData = [];
            this.pageSize = size;
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.chosedProjectId });
            this.typeSubItemOptions = result.data.records;
        },
        async handleCurrentChangeSelect(current) {
            this.selectData = [];
            this.currentPageSelect = current;
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.chosedProjectId });
            this.typeSubItemOptions = result.data.records;
        },
        //远程搜索
        async remoteMethod(query) {
            this.currentPageSelect = 1;
            let result = await listApprovalItemByUser({ keyword: query, pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.chosedProjectId });
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.totalAim = result.data.total;
                this.typeSubItemOptions = result.data.records;
            })

        },
        async copyIn() {
            try {
                await this.$confirm('是否导入该事项全部模板和分页（包括对应一级材料；不设去重逻辑，请自行处理重复）?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            const request = {
                aimsApprovalItemId: this.itemId,
                approvalItemId: this.chosedItemId
            }
            const res = await copyMaterialByItemId(request);
            if (!res.success) {
                this.$message.warning('导入失败');
                return;
            }
            this.$message.warning('导入成功');
            this.copeTemplatesVisible = false;
            this.getTemplate();
        },
        async getTemplate() {
            this.hasSelectList = [];
            const res = await getTemplate({
                approvalItemId: this.$store.state.home.item.approvalItemId,
            });
            if (!res.success) return;
            this.templates = res.data;
            this.templates.forEach((item) => {
                this.hasSelectList.push(item.template.materialId);
            });
            // console.log('this.hasSelectList');
            // console.log(this.hasSelectList);
        },
        // 比对 最新的更新 和 最新的输出
        async getLastUpdateInfo() {
            let res = await Promise.all([

                getSaveMaxTimeTemplateBatch({ approvalItemId: this.itemId }),
                getUptoDateSysTransferLog({ approvalItemId: this.itemId, description: "templateBatch" }),
            ])
            if (!res[0].success || !res[1].success) return;
            let maxUpdateTime = res[0].data.maxUpdateTime;
            let maxOutputTime = res[1].data ? res[1].data.createTime : "";
            this.isLast = dayjs(maxUpdateTime).isSameOrBefore(dayjs(maxOutputTime));


        },
        async openAddDialog() {
            const res = await listPreTemplatesByApprovalItemId({
                approvalItemId: this.$store.state.home.item.approvalItemId,
            });
            if (!res.success) {
                this.$message.warning("获取新增表格信息失败");
                return;
            }
            this.tableData = res.data;
            this.tableData.forEach((item) => {
                let flag = true;
                for (let i = 0; i < this.produceSourceFilters.length; i++) {
                    if (this.produceSourceFilters[i].value === item.produceSource) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    this.produceSourceFilters.push({ text: item.produceSource, value: item.produceSource });
                }
            })
            // this.$nextTick(() => {
            //     this.tableData.forEach((row) => {
            //         if (this.hasSelectList.indexOf(row.materialId) >= 0) {
            //             this.$refs.multipleTable.toggleRowSelection(row, true);
            //         }
            //     });
            // });
            this.templateCreateVisible = true;
        },
        filterHandler(value, row, column) {
            const property = column['property'];
            return row[property] === value;
        },
        clearFilter() {
            this.$refs.multipleTable.clearFilter();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        Edit(item) {
            this.$set(item, 'flag', true);
        },
        saveText(item) {
            this.$set(item, 'flag', null);
        },
        async addTemplateBatch() {
            let requestBatch = [];
            this.multipleSelection.forEach((item) => {
                let requestBatchItem = {};
                // requestBatchItem.id = item.approvalItemId;
                requestBatchItem.materialId = item.materialId;
                requestBatchItem.notes = "";
                requestBatchItem.script = "";
                requestBatchItem.materialTemplateId = item.materialTemplateId;
                requestBatchItem.docxTemplateName = item.docxTemplateName;
                requestBatchItem.templateName = item.templateName;
                requestBatch.push(requestBatchItem);
                // if ( this.hasSelectList.indexOf(requestBatchItem.materialId) < 0) {
                //     requestBatch.push(requestBatchItem);
                // }
            });
            console.log("requestBatch");
            console.log(requestBatch);
            const res = await batchSave(requestBatch);
            if (!res.success) {
                this.$message.warning("批量新增失败");
                return;
            }
            this.$message.success(`新增模板成功,新增 ${requestBatch.length} 条`);
            this.templateCreateVisible = false;
            // this.temp_template_name = '';

            this.getTemplate();
        },

        async deleteTemplate(id) {
            let message = "确定要删除吗";
            if (confirm(message) == true) {
                const res = await deleteTemplate({
                    templateId: id,
                });

                if (!res.success) return;

                this.$message.success("删除模板成功");
                this.getTemplate();
            }
        },

        goTemplatemanager(id) {
            this.$router.push({
                path: "/templatemanager",
                query: {
                    itemId: this.$store.state.home.item.approvalItemId,
                    id: id,
                    projectId: this.$route.query.projectId
                },
            });
        },
        openDetail(v) {
            if (this.temp_template) {
                this.$refs.scriptEditor.open = false;
                this.$refs.producescriptEditor.open = false;
            }
            this.temp_template = v.template;
            this.temp_template.script ||
                (this.temp_template.script = "");
            this.temp_template.produceScript ||
                (this.temp_template.produceScript = "");
        },
        async saveTemplate() {
            console.log(this.temp_template);
            let result1 = await addTemplate(this.temp_template);
            if (!result1.success) return;

            this.$message.success("保存模板成功");
            this.getTemplate();
        },
        // async transferTemplate(v) {
        //     // 材料保存到超级帮办
        //     let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
        //     if (serviceBaseUrl.endsWith("/")) {
        //         serviceBaseUrl = serviceBaseUrl.substring(
        //             0,
        //             serviceBaseUrl.length - 1
        //         );
        //     }
        //     console.log(serviceBaseUrl);
        //     if (serviceBaseUrl == null || serviceBaseUrl == "") {
        //         this.$message({
        //             type: "error",
        //             message: "请先设置超级帮办地址!",
        //         });
        //         return;
        //     }

        //     let params = {
        //         documentName: v.template.materialName,
        //         documentSeq: v.template.documentSeq,
        //         docxTemplateName: v.template.docxTemplateName,
        //         notes: v.template.notes,
        //         sid: this.$store.state.home.item.itemNo,
        //         script: v.template.script,
        //         proDocId: v.template.proDocId,
        //     };
        //     console.log(params);

        //     // 先输出材料
        //     let result1 = await axios
        //         .post(serviceBaseUrl + "/api/sixiang/saveTemplate", params)
        //         .then((res) => res.data);
        //     console.log(result1);
        //     if (result1.code == 200) {
        //         this.$message({
        //             type: "success",
        //             message: "材料导入成功 请查看数据库",
        //         });
        //     } else {
        //         this.$message({
        //             type: "error",
        //             message: result1.message + " " + result1.data,
        //         });
        //     }
        //     // 获取材料下的所有分页 并输出
        //     let pageRes = await getSingleTemplate({
        //         templateId: v.template.id,
        //     });
        //     if (pageRes.success) {
        //         let data = pageRes.data;
        //         let pagelist = data.templatePagesList;
        //         for (let i in pagelist) {
        //             let detail = pagelist[i];
        //             let para = {
        //                 contentCss: detail.contentCss,
        //                 fileName: v.template.docxTemplateName,
        //                 name: v.template.materialName,
        //                 orient: detail.orient,
        //                 pageNum: detail.pageNum,
        //                 script: detail.script,
        //                 sid: this.$store.state.home.item.itemNo,
        //                 padding: detail.isTable == 1 ? "table" : "text",
        //                 htmlPath:
        //                     "/" +
        //                     this.$store.state.home.item.itemNo +
        //                     "/" +
        //                     v.template.docxTemplateName +
        //                     "_page" +
        //                     detail.pageNum +
        //                     ".html",
        //                 html: detail.htmlContent,
        //             };
        //             console.log(para);
        //             let result2 = await axios
        //                 .post(serviceBaseUrl + "/api/sixiang/saveHtml", para)
        //                 .then((res) => res.data);
        //             console.log(result2);
        //             if (result2.code == 200) {
        //                 this.$message({
        //                     type: "success",
        //                     message:
        //                         "页面" +
        //                         detail.pageNum +
        //                         "导入成功 请查看数据库",
        //                 });
        //             } else {
        //                 this.$message({
        //                     type: "error",
        //                     message: result2.message + " " + result2.data,
        //                 });
        //             }
        //         }
        //     }
        // },
        async downAllPages() {
            let downRequest = {
                approvalItemId: this.$store.state.home.item.approvalItemId,
            };
            await axios
                .post(
                    "/superform/template-pages/downloadAllPages",
                    downRequest,
                    { responseType: "arraybuffer" }
                )
                .then((response) => {
                    let blob = new Blob([response.data], {
                        type: "application/zip",
                    });
                    let url = window.URL.createObjectURL(blob);
                    // url.pathname = this.$store.state.home.item.sid +".zip";
                    window.location.href = url;
                })
                .catch((error) => this.$message.error(error));
        },
        // 下载最新word模板
        async handleDownload() {
            let res = await axios({
                method: "get",
                url: "/superform/additional/downloadWord",
                params: {
                    approvalItemId: this.$store.state.home.item.approvalItemId,
                    type: "word",
                },
                responseType: "arraybuffer",
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("该事项下没有模板文件");
                return;
            }
            let blob = new Blob([res.data], { type: "application/zip" });
            const a = document.createElement("a");
            // 生成文件路径
            let href = window.URL.createObjectURL(blob);
            a.href = href;
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
        // TODO: 批量
        async transferAllTemplates() {
            let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
            if (serviceBaseUrl.endsWith("/")) {
                serviceBaseUrl = serviceBaseUrl.substring(
                    0,
                    serviceBaseUrl.length - 1
                );
            }
            console.log(serviceBaseUrl);
            if (serviceBaseUrl == null || serviceBaseUrl == "") {
                this.$message({
                    type: "error",
                    message: "请先设置超级帮办地址!",
                });
                return;
            }
            const res = await getTemplate({
                approvalItemId: this.$store.state.home.item.approvalItemId,
            });
            if (!res.success) return;

            if (res.data.length == 0) {
                this.$message({
                    type: "warning",
                    message: "无材料可输出",
                });
                return;
            }

            let templateBatchRequest = [];
            let htmlBatchRequest = [];

            // 先批量保存材料
            res.data.forEach((v) => {
                templateBatchRequest.push({
                    documentName: v.template.materialName,
                    documentSeq: v.template.documentSeq,
                    docxTemplateName: v.template.docxTemplateName,
                    notes: v.template.notes,
                    sid: this.$store.state.home.item.itemNo,
                    script: v.template.script,
                    proDocId: v.template.proDocId,
                    itemInternalNo: this.$store.state.home.item.itemInternalNo
                });
                let pagelist = v.templatePagesList;
                for (let i in pagelist) {
                    let detail = pagelist[i];
                    htmlBatchRequest.push({
                        contentCss: detail.contentCss,
                        fileName: v.template.docxTemplateName,
                        name: v.template.materialName,
                        orient: detail.orient,
                        pageNum: detail.pageNum,
                        script: detail.script,
                        sid: this.$store.state.home.item.itemNo,
                        itemInternalNo: this.$store.state.home.item.itemInternalNo,
                        padding: detail.isTable == 1 ? "table" : "text",
                        htmlPath:
                            "/" +
                            this.$store.state.home.item.itemNo +
                            "/" +
                            v.template.docxTemplateName +
                            "_page" +
                            detail.pageNum +
                            ".html",
                        html: detail.htmlContent,
                    });
                }
            });
            let result1 = await axios
                .post(
                    serviceBaseUrl + "/api/sixiang/saveTemplateBatch",
                    templateBatchRequest
                )
                .then((res) => res.data);
            if (result1.code == 200) {
                this.$message({
                    type: "success",
                    message: "材料批量导入成功 请查看数据库",
                });
            } else {
                this.$message({
                    type: "error",
                    message: result1.message + " " + result1.data,
                });
            }

            // 再批量保存材料页面
            let result2 = await axios
                .post(
                    serviceBaseUrl + "/api/sixiang/saveHtmlBatch",
                    htmlBatchRequest
                )
                .then((res) => res.data);
            console.log(result2);
            if (result2.code == 200) {
                this.$message({
                    type: "success",
                    message: "页面批量导入成功 请查看数据库",
                });
            } else {
                this.$message({
                    type: "error",
                    message: result2.message + " " + result2.data,
                });
                return;
            }

            // 保存传输日志
            let result3 = await addSysTransferLog(
                {
                    approvalItemId: this.$store.state.home.item.approvalItemId,
                    description: "templateBatch",
                    transferData: JSON.stringify({
                        templateBatchRequest: templateBatchRequest,
                        htmlBatchRequest: htmlBatchRequest
                    })
                }
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.material-manager {
    padding: 20px;
    .op-bar {
        padding-left: 20px;
    }
    .main {
        display: flex;
        flex-direction: column;
        .material-list {
            width: 1100px;
            margin-top: 10px;
            padding: 5px;
            border: 1px solid green;
            .material-item {
                margin-bottom: 10px;
            }
        }
        .material-detail {
            border: 1px solid blue;
            width: 1100px;
            margin-top: 10px;
            padding: 10px;
        }
    }
}
</style>
