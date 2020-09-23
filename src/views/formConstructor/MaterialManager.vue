<template>
    <div class="material-manager">
        
        <div class="op-bar">
            <el-button @click="openAddDialog"> 新建材料</el-button>
            <el-button @click="getTemplate">载入材料</el-button>
            <el-button @click="downAllPages">下载所有材料文件</el-button>
        </div>

        <div class="main">
        <!-- 模板列表 -->
        <div class="material-list">
            <div v-for="(v,i) in templates" :key="i" class="material-item">
                <el-button type="text" style="color: orange;" @click="goTemplatemanager(v.template.id)">{{ v.template.docxTemplateName }}</el-button>
                <el-button @click="openDetail(v)">编辑</el-button>
                <el-button @click="deleteTemplate(v.template.id)">删除</el-button>
                <el-button @click="transferTemplate(v)">保存到超级帮办</el-button>
            </div>
        </div>

        <!-- 模板编辑 -->
        <div class="material-detail" v-if="temp_template">
            <div>
            <el-button type="primary" @click="saveTemplate">保存修改</el-button>
            </div>
            <!-- 模板名称(必填)<el-input v-model="temp_template.docxTemplateName"></el-input>
            材料中文名(必填)<el-input v-model="temp_template.documentName"></el-input>
            材料序号(必填)<el-input v-model="temp_template.documentSeq"></el-input> -->
            备注<el-input type="textarea" :autosize="{ minRows: 1, maxRows: 15}" v-model="temp_template.notes"></el-input>
            page配置<CodeEditor v-model="temp_template.script"></CodeEditor>

        </div>
        </div>
        <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="50%" :close-on-click-modal="false">
             <div class="tableWrap">
                <el-table
                    ref="multipleTable"
                    class="workTable"
                    :data="tableData"
                    style="width: 95%;"
                    border
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="approvalItemId"
                        label="审批事项编号"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column> -->
                    <el-table-column prop="docxTemplateName" label="超级帮办word模板命名" width="160"></el-table-column>
                    <el-table-column prop="materialCode" label="材料编码" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="materialName" label="材料名称" width="160"></el-table-column>
                    <el-table-column prop="materialStatus" label="材料状态" width="80"></el-table-column>
                    <el-table-column prop="documentSeq" label="文档编号" width="80"></el-table-column>
                    <el-table-column prop="note" label="备注" width="100"></el-table-column>
                    <el-table-column prop="proDocId" label="proDocId" width="100"></el-table-column>
                    <el-table-column prop="produceSource" label="产生来源" width="100"></el-table-column>
                    <el-table-column prop="descriptionInfo" label="其他说明信息（调研填写）"  width="180"></el-table-column>
                </el-table>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="templateCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplateBatch">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import { getTemplate, addTemplate, deleteTemplate, getSingleTemplate, GetAddTable, batchSave } from '@/api/template/index'
import { getById } from "@/api/item/index";
import { mixin } from "@/mixin/mixin"
import axios from 'axios';

import { CodeEditor } from "@/views/attributeComponents/defRendererComponents/defRendererComponents"
export default {
    name: "MaterialManager",
    mixins: [mixin],
    components: { CodeEditor },
    data() {
        return {
            templates: [],

            templateCreateVisible: false,

            temp_template_name: '',
            temp_document_seq: '',
            temp_document_name: '',

            temp_template: null,
            tableData: [],
            multipleSelection: [],
            hasSelectList: [],
        }
    },
    async mounted() {
        await this.init();
        await this.getTemplate();
    },
    methods: {
        async getTemplate() {
            this.hasSelectList = [];
            const res = await getTemplate({
                approvalItemId: this.$store.state.home.item.approvalItemId,
            });
            if (!res.success) return;
            this.templates = res.data;
            this.templates.forEach(item => {
                this.hasSelectList.push(item.template.materialId);
            })
            // console.log('this.hasSelectList');
            // console.log(this.hasSelectList);
        },

        async openAddDialog() {
            const res = await GetAddTable({
                approvalItemId: this.$store.state.home.item.approvalItemId,
            })
            if (!res.success) {
                this.$message.warning('获取新增表格信息失败');
                return;
            }
            this.tableData = res.data;
            this.$nextTick(() => {
                this.tableData.forEach(row => {
                    if (this.hasSelectList.indexOf(row.materialId) >= 0) {
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                })
            })
            this.templateCreateVisible = true;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        async addTemplateBatch() {
            let requestBatch = [];
            this.multipleSelection.forEach(item => {
                let requestBatchItem = {};
                // requestBatchItem.id = item.approvalItemId;
                requestBatchItem.materialId = item.materialId;
                requestBatchItem.notes = '';
                requestBatchItem.script = '';
                if (this.hasSelectList.indexOf(requestBatchItem.materialId) < 0) {
                    requestBatch.push(requestBatchItem);
                }
            })
            console.log('requestBatch');
            console.log(requestBatch);
            const res = await batchSave(requestBatch);
            if (!res.success) {
                this.$message.warning('批量新增失败');
                return;
            }
            this.$message.success('新增模板成功');
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

                this.$message.success('删除模板成功');
                this.getTemplate();
            }
        },

        goTemplatemanager(id) {
            this.$router.push({
                path: '/templatemanager',
                query: {
                    itemId: this.$store.state.home.item.approvalItemId,
                    id: id,
                },
            });
        },
        openDetail(v) {
            console.log('v');
            console.log(v);
            this.temp_template = v.template;
            this.temp_template.script || (this.temp_template.script = "")
        },
        async saveTemplate() {
            console.log(this.temp_template)
            let result1 = await addTemplate(this.temp_template);
            if (!result1.success) return;

            this.$message.success('保存模板成功');
        },
        async transferTemplate(v) {
            // TODO: 材料保存到超级帮办
            let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
            if (serviceBaseUrl.endsWith('/')) {
                serviceBaseUrl = serviceBaseUrl.substring(0, serviceBaseUrl.length - 1)
            }
            console.log(serviceBaseUrl)
            if (serviceBaseUrl == null || serviceBaseUrl == '') {
                this.$message({ type: "error", message: "请先设置超级帮办地址!" });
                return;
            }

            let params = {
                documentName: v.template.materialName,
                documentSeq: v.template.documentSeq,
                docxTemplateName: v.template.docxTemplateName,
                notes: v.template.notes,
                sid: this.$store.state.home.item.itemNo,
                script: v.template.script,
            }
            console.log(params)

            // 先输出材料
            let result1 = await axios.post(serviceBaseUrl + "/api/sixiang/saveTemplate", params).then(res => res.data);
            console.log(result1)
            if (result1.code == 200) {
                this.$message({ type: "success", message: "材料导入成功 请查看数据库" });
            } else {
                this.$message({ type: "error", message: result1.message + " " + result1.data });
            }
            // 获取材料下的所有分页 并输出
            let pageRes = await getSingleTemplate({
                templateId: v.template.id,
            })
            if (pageRes.success) {
                let data = pageRes.data;
                let pagelist = data.templatePagesList;
                for (let i in pagelist) {
                    let detail = pagelist[i];
                    let para = {
                        contentCss: detail.contentCss,
                        fileName: v.template.docxTemplateName,
                        name: v.template.materialName,
                        orient: detail.orient,
                        pageNum: detail.pageNum,
                        script: detail.script,
                        sid: this.$store.state.home.item.itemNo,
                        padding: detail.isTable == 1 ? "table" : "text",
                        htmlPath: '/' + this.$store.state.home.item.itemNo + '/' + v.template.docxTemplateName + "_page" + detail.pageNum + ".html"
                    }
                    console.log(para)
                    let result2 = await axios.post(serviceBaseUrl + "/api/sixiang/saveHtml", para).then(res => res.data);
                    console.log(result2)
                    if (result2.code == 200) {
                        this.$message({ type: "success", message: "页面" + detail.pageNum + "导入成功 请查看数据库" });
                    } else {
                        this.$message({ type: "error", message: result2.message + " " + result2.data });
                    }
                }
            }

        },
        async downAllPages() {
            let downRequest = { approvalItemId: this.$store.state.home.item.id };
            await axios.post("/superform/template-pages/downloadAllPages", downRequest, { responseType: 'arraybuffer' })
                .then(response => {
                    let blob = new Blob([response.data], { type: 'application/zip' })
                    let url = window.URL.createObjectURL(blob)
                    // url.pathname = this.$store.state.home.item.sid +".zip";
                    window.location.href = url
                }).catch(error => this.$message.error(error))
        }
    }
}
</script>

<style lang="scss" scoped>
.material-manager {
    padding: 20px;
    .op-bar {
        padding-left: 20px;
    }
    .main {
        display: flex;
        flex-direction: row;
        .material-list {
            width: 500px;
            margin-top: 10px;
            padding: 20px;
            border: 1px solid green;
            .material-item {
                margin-bottom: 10px;
            }
        }
        .material-detail {
            border: 1px solid blue;
            width: 600px;
            margin-top: 10px;
        }
    }
}
</style>
