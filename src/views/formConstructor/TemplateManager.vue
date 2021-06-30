<template>
    <div class="template-manager">
        <div class="op-bar">

            <!-- <el-button @click="templateCreateVisible = true"> 新建材料</el-button> -->
            <el-button @click="loadAllField" :loading="laodingField"> 载入字段</el-button>
            <!-- <el-button @click="$router.push('/')"> -> 字段管理</el-button> -->
            <el-button @click="isListShown = !isListShown">展开/收起侧栏</el-button>
            <span style="display:inline-block">
                <<{{templates.template.docxTemplateName}}>>
            </span>
            <el-button-group>
                <el-button @click="addPage(templates)" icon="el-icon-plus">添加</el-button>
                <!-- <el-button style="width:45px;" @click="handleDelete(i)">删除</el-button> -->
            </el-button-group>
        </div>
        <div class="main">

            <!-- template -->
            <div class="computed-field" v-show="isListShown">
                <div>
                    <!-- <el-button type="text" @click="handleClickTemplate(templates)"
                        style="width:100px;margin:0;color:orange">
                        {{templates.template.docxTemplateName}}
                    </el-button> -->

                    <div style="max-height: 780px;overflow:auto">
                        <div v-for="(page,pageIndex) in renderPages" :key='pageIndex' style="margin-top: 2px;"
                            :class="{'active':temp_page && page.id == temp_page.id}" class="page-card"
                            @click="handleClickPage(page,pageIndex)">

                            <span>{{page.pageNum}} 页</span>

                            <div class="list">
                                保存时间：{{page.updateTime | formatTime}}
                            </div>
                            <div class="list">
                                <el-badge :is-dot="!page.isLast">
                                    输出时间：{{page.outputTime}}
                                </el-badge>
                            </div>
                            <div class="list">
                                <el-select v-model="page.approvalItemAndDocumentsubId" :disabled="!(temp_page && page.id == temp_page.id)" placeholder="请选择二级材料名称">
                                    <el-option v-for="(v,i) in secondaryMaterialOptions" :key="i" :label="v.documentsubDisplayname"
                                        :value="v.id"> </el-option>
                                </el-select>
                            </div>
                            <el-button-group>

                                <el-button style="width:40px;" @click="editPage(page,pageIndex)" icon="el-icon-edit"
                                    :disabled="!temp_page || page.id != temp_page.id" type="primary">
                                </el-button>
                                <el-button style="width:40px;" @click="deletePage(page)" icon="el-icon-delete"
                                    type="danger">
                                </el-button>
                            </el-button-group>
                        </div>
                    </div>
                </div>

            </div>
            <!-- 渲染字段 -->
            <!-- <div class="computed-field">
                <div v-for="(v,i) in baseJSON" :key="i">

                    ({{v.fieldNo}}){{v.label}}：{{v.sample}}

                </div>
                <el-divider v-if="Object.keys(computedJSON).length > 0" />
                <div v-for="(v,i) in computedJSON" :key="i">

                    ({{v.fieldNo}}){{v.label}}:{{v.sample}}

                </div>

            </div> -->
            <!-- <div class="computed-field computed-field-direction">
                <div v-if="temp_page">
                    <el-select v-model="temp_page.orient" placeholder="">
                        <el-option label="横向" value="row" ></el-option>
                        <el-option label="纵向" value="column" ></el-option>
                    </el-select>
                    <el-select v-model="temp_page.isTable" placeholder="">
                        <el-option label="表格" :value="1" ></el-option>
                        <el-option label="纯文本" :value="0" ></el-option>
                    </el-select>
                    
                    <el-input v-model="currentPagenum" placeholder="请输入页码"></el-input>
                    <CodeEditor v-model="temp_page.script"></CodeEditor>
                </div>

            </div> -->
            <!-- 模板制作 -->
            <div class="attribute-content">
                <!-- <div class="row-editor" v-if="temp_page">
                    <div :class="{'page-portrait':temp_page.orientation=='portrait','page-landscape':temp_page.orientation=='landscape','table-padding':temp_page.paddingType=='table','text-padding':temp_page.paddingType=='text'}">
                        <h2 v-pre>{{1_1}}</h2>
                        如果 参数a==参数b
                        <span v-pre>{{#equal 1 1}} 等于{{else}}不等于{{/equal}}</span>
                        <div v-pre>{{#if true}} true{{else}}false{{/if}}</div>
                    </div>
                </div> -->

                <inlineEditor ref="inlineEditor" v-if="temp_page" :temp_page="temp_page"
                    :currentPagenum="currentPagenum" @saveTemplate="saveTemplate" @transferHtml="transferHtml" />
            </div>

        </div>
        <!-- 创建模板弹窗 -->
        <!-- <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                模板名称:<el-input v-model="temp_template_name"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="templateCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplate">确 定</el-button>
            </span>
        </el-dialog> -->

        <el-dialog title="载入字段" :visible.sync="fieldVisible" width="30" :close-on-click-modal="false" postition="fixed">
            <div v-for="(v,i) in baseJSON" :key="i">

                ({{v.fieldNo}}){{v.label}}：{{v.sample}}

            </div>
            <el-divider v-if="Object.keys(computedJSON).length > 0" />
            <div v-for="(v,i) in computedJSON" :key="i">

                ({{v.fieldNo}}){{v.label}}:{{v.sample}}

            </div>
        </el-dialog>

        <!-- 编辑模板弹窗 -->
        <el-dialog title="编辑详情" :visible.sync="templateEditVisible" width="50%" :close-on-click-modal="false">
            <div v-if="temp_page">
                <el-select v-model="temp_page.orient" placeholder="">
                    <el-option label="横向" value="row"></el-option>
                    <el-option label="纵向" value="column"></el-option>
                </el-select>
                <el-select v-model="temp_page.isTable" placeholder="">
                    <el-option label="表格" :value="1"></el-option>
                    <el-option label="纯文本" :value="0"></el-option>
                </el-select>

                <el-input v-model="currentPagenum" placeholder="请输入页码"></el-input>
                <div>
                    <!-- script配置<CodeEditor v-model="temp_page.script"></CodeEditor> -->
                    css配置<CSSEditor v-model="temp_page.contentCss"></CSSEditor>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash"
import { mapState } from "vuex"
import { mergeFieldAttr } from "./util"

import { getSingleTemplate, addTemplate, addEditPage, deletePage, } from '@/api/template/index'
import { getFieldAll } from '@/api/superForm/index'
import { addSysTransferLog, getUptoDateSysTransferLog } from "@/api/item/index";
import defs, { deserializeComputedField, deserializeBaseField } from "../attributeComponents/index"
import inlineEditor from "@/views/inlineEditorComponent/InlineEditor"

import { mixin } from "@/mixin/mixin"
import { CodeEditor, CSSEditor } from "@/views/attributeComponents/defRendererComponents/defRendererComponents"
import { listSubitemAndDocumentNewByTemplateId } from"@/api/basicInfo/approvalSub"
import axios from 'axios';
import dayjs from "dayjs"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)
export default {
    name: "TemplateManager",
    components: {
        inlineEditor, CodeEditor, CSSEditor
    },
    mixins: [mixin],
    data() {
        return {
            itemId: this.$route.query.itemId,
            templates: {
                template: {},
                templatePagesList: [],
            },
            //  每页输出时间 数组
            lastPagesOutputTime: [],

            templateCreateVisible: false,

            // 模板弹窗用
            temp_template_name: "",

            // 临时的 模板对象
            temp_template: null,

            // 临时的页面对象
            temp_page: null,

            // 显示的 field 键值对
            baseJSON: {},

            computedJSON: {},
            // fieldNo 的键值对

            renderJSON: {},

            currentPagenum: null,

            fieldVisible: false,

            templateEditVisible: false,

            isListShown: true,

            baseFields: [],
            computedFields: [],

            defaultCss: ".ck-content p {   margin: 0;   white-space: pre-wrap;   word-break: break-all;   word-wrap: break-word;   overflow-wrap: break-word;}.ck-content .table {   margin: 1em auto;   display: table;}.ck-content .table table {   margin-left: -1.6cm;   width: 16.19cm;   border-collapse: collapse;   border-spacing: 0;   height: 100%;   border: 1px solid black;}#row-table > table {   margin-left: -1.6cm;   width: 26.54cm;   border-collapse: collapse;   border-spacing: 0;   height: 100%;   border: 1px solid black;}.ck-content .table table td,.ck-content .table table th {   min-width: 2em;   padding: 0;   border: 1px solid black;}.ck-content .custom-block-indent-2 {   text-indent: 2em;}.ck-content .custom-block-indent-4 {   text-indent: 4em;}.ck-content .custom-block-indent-6 {   text-indent: 6em;}.ck-content .custom-block-indent-8 {   text-indent: 8em;}.ck-content .custom-block-indent-10 {   text-indent: 10em;}.image {   display: inline-block;}.image img {   width: 7.9cm;}",
            laodingField:false,

            // 关联二级材料
            secondaryMaterialOptions: [],
            // approvalItemAndDocumentsubId: null
        }
    },
    computed: {
        renderPages() {
            return this.templates.templatePagesList.map(page => {
                let outputTimeInfo = this.lastPagesOutputTime.find(v => v.id == page.id)

                let outputTime = outputTimeInfo ? dayjs(outputTimeInfo.time).format("YYYY-MM-DD HH:mm:ss") : ""
                let isLast = dayjs(page.updateTime).isSameOrBefore(dayjs(outputTime))
                return {
                    ...page,
                    outputTime,
                    isLast
                }
            })

        },
    },
    async mounted() {
        await this.init()
        await this.initProject()
        this.getTemplate()
        this.getFieldAll();
        // 获取关联二级材料列表
        this.getSecondaryMaterialOptions();
    },
    filters: {
        formatTime(v) {
            return dayjs(v).format("YYYY-MM-DD HH:mm:ss")
        },

    },
    methods: {
        async getTemplate() {
            if (!this.$route.query.id) return;


            const res = await getSingleTemplate({
                templateId: this.$route.query.id,
            })
            if (!res.success) return;
            this.templates = res.data;

            const updateInfoRes = await Promise.all(
                this.templates.templatePagesList.map(v => getUptoDateSysTransferLog({ approvalItemId: this.itemId, description: "templatePage", templatePagesId: v.id }))
            )
            if (updateInfoRes.some(v => !v.success)) return;
            this.lastPagesOutputTime = updateInfoRes.map(v => v.data).filter(v => !!v).map(v => ({ id: v.templatePagesId, time: v.createTime }))
            console.log(updateInfoRes)


        },
        async getSecondaryMaterialOptions() {
            let res = await listSubitemAndDocumentNewByTemplateId({ approvalItemId: this.itemId, templateId: this.$route.query.id});
            if(!res.success) return;
            this.secondaryMaterialOptions = res.data;
        },
        // async addTemplate() {
        //     if (!this.temp_template_name) return;

        //     const res = await addTemplate({
        //         itemName: this.$store.state.home.item.name,
        //         docxTemplateName: this.temp_template_name,
        //     })

        //     if (!res.success) return;

        //     this.$message.success('新增模板成功');
        //     this.templateCreateVisible = false;
        //     this.temp_template_name = '';

        //     this.getTemplate();
        // },
        addPage(template) {
            // let length = template.pages?.length || 0;
            // let data = { pageNo: length, orientation: "portrait", paddingType: "text" }
            // this.$store.commit("pushPage", { index, data })

            let length = 1;
            if (template.templatePagesList.length > 0) {
                const pageNumArr = template.templatePagesList.map(item => { return item.pageNum });
                length = Math.max(...pageNumArr) + 1;
            }
            template.templatePagesList.push({
                id: null, // 当前页面的id
                approvalItemId: template.template.approvalItemId, // 事项id
                // itemName: template.template.itemName, // 事项名称
                htmlContent: "<p>等待编辑</p>", // html的内容
                templateId: template.template.id, // 所属的父模板的id
                orient: "column", // 方向
                isTable: 0, // 是否表格
                pageNum: length, // 第几页
                templateType: "",
                contentCss: this.defaultCss,
                approvalItemAndDocumentsubId: null,  // 关联的二级材料 
            })
            // this.currentPagenum = length;
        },
        async savePage(page) {
            let res
            if (this.temp_page && this.temp_page.id === page.id) {
                this.$refs.inlineEditor.savePage();
                return;
            } else {

                res = await addEditPage(page);


            }

            if (!res.success) return;

            this.$message.success('保存页面成功');
            this.getTemplate();
        },
        async saveTemplate(html) {
            const res = await addEditPage({
                id: this.temp_page.id,
                approvalItemId: this.temp_page.approvalItemId,
                // itemName: this.temp_page.itemName,
                htmlContent: html,
                templateId: this.temp_page.templateId,
                orient: this.temp_page.orient,
                isTable: this.temp_page.isTable,
                pageNum: this.currentPagenum,
                templateType: this.temp_page.templateType,
                contentCss: this.temp_page.contentCss ? this.temp_page.contentCss : this.defaultCss,
                script: this.temp_page.script,
                approvalItemAndDocumentsubId: this.temp_page.approvalItemAndDocumentsubId,
            })

            if (!res.success) return;
            // 把返回的值放进去
            this.temp_page = res.data;

            this.$message.success('保存页面成功');
            this.getTemplate();
        },
        async transferHtml(html) {
            // 先保存
            const res = await addEditPage({
                id: this.temp_page.id,
                approvalItemId: this.temp_page.approvalItemId,
                // itemName: this.temp_page.itemName,
                htmlContent: html,
                templateId: this.temp_page.templateId,
                orient: this.temp_page.orient,
                isTable: this.temp_page.isTable,
                pageNum: this.currentPagenum,
                templateType: this.temp_page.templateType,
                contentCss: this.temp_page.contentCss ? this.temp_page.contentCss : this.defaultCss,
                script: this.temp_page.script,
            })

            if (!res.success) return;
            // 把返回的值放进去
            this.temp_page = res.data;

            this.$message.success('保存页面成功');


            // 再传输
            let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
            if (serviceBaseUrl.endsWith('/')) {
                serviceBaseUrl = serviceBaseUrl.substring(0, serviceBaseUrl.length - 1)
            }
            console.log(serviceBaseUrl)
            if (serviceBaseUrl == null || serviceBaseUrl == '') {
                this.$message({ type: "error", message: "请先设置超级帮办地址!" });
                return;
            }
            // 材料分页保存到超级帮办
            let params = {
                contentCss: this.temp_page.contentCss,
                fileName: this.templates.template.docxTemplateName,
                html: html,
                name: this.templates.template.documentName,
                orient: this.temp_page.orient,
                pageNum: this.currentPagenum,
                script: this.temp_page.script,
                sid: this.$store.state.home.item.itemNo,
                padding: this.temp_page.isTable == 1 ? "table" : "text",
                // TODO: 拼接htmlPath: /sid/fileName_"page"pageNum.html
                htmlPath: '/' + this.$store.state.home.item.itemNo + '/' + this.templates.template.docxTemplateName + "_page" + this.currentPagenum + ".html",
                // documentSeq: this.templates.template.documentSeq // 不需要传
                html: this.temp_page.htmlContent,
                itemInternalNo: this.$store.state.home.item.itemInternalNo
            }
            console.log(params)
            let result = await axios.post(serviceBaseUrl + "/api/sixiang/saveHtml", params).then(res => res.data);
            console.log(result)
            if (result.code == 200) {
                this.$message({ type: "success", message: "导入成功 请查看数据库" });
            } else {
                this.$message({ type: "error", message: result.message + " " + result.data });
                return;
            }

            // 最后保存传输日志
            let result3 = await addSysTransferLog(
                {
                    templatePagesId: this.temp_page.id,
                    approvalItemId: this.$store.state.home.item.approvalItemId,
                    description: "templatePage",
                    transferData: JSON.stringify({
                        params
                    })
                }
            );

            this.getTemplate();

        },
        async deletePage(page) {
            let message = "确定要删除吗";
            if (confirm(message) == true) {
                const res = await deletePage({
                    templatePageId: page.id,
                })
                if (!res.success) return;
                this.$message.success('删除页面成功');
                this.getTemplate();
            }
        },
        handleClickPage(page) {
            this.temp_page = page;
            // if(!this.temp_page.script){

            //     this.temp_page.script=`function(state,getters){
            //         return 1
            //     }`
            // }
            this.currentPagenum = page.pageNum;
        },
        // handleDelete(i) {
        //     this.$store.commit("deleteTemplate", i)
        // },
        handleClickTemplate(template) {
            this.temp_template = template;
        },
        async loadAllField() {
            this.fieldVisible = true
            await this.getFieldAll();

        },
        async getFieldAll(){
            
            this.laodingField=true
            const result = await getFieldAll({
                approvalItemId: this.$store.state.home.item.approvalItemId,
            })
            this.laodingField=false;
            if (!result.success) return;
            this.baseFields = result.data.filter(v => v.fieldType == 1).map(v => v.object).map(deserializeBaseField)
            this.computedFields = result.data.filter(v => v.fieldType == 2).map(v => v.object).map(deserializeComputedField)
            this.baseJSON = this.baseFields.reduce(mergeFieldAttr, {})
            this.computedJSON = this.computedFields.reduce(mergeFieldAttr, {})
            this.renderJSON = { ..._.mapValues(this.baseJSON), ..._.mapValues(this.computedJSON) }
            
            this.$store.commit("putRenderJSON",this.renderJSON)
        },
        editPage() {
            this.templateEditVisible = true;
            this.temp_page.contentCss ||
                (this.temp_page.contentCss = this.defaultCss);
        },
    }
}
</script>

<style lang="scss" scoped>
.template-manager {
    display: flex;
    flex-direction: column;
    .main {
        display: flex;
        overflow-x: auto;
        // height: calc(100vh - 150px);
        // height: 790px;
        height: 790px;
        overflow-y: auto;
    }
    .el-input {
        width: 400px;
    }
    .el-textarea {
        width: 400px;
    }
}
// .base-field-list {
//     width: 200px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     border: red 1px solid;
// }
.computed-field {
    width: 200px;
    flex: none;
    border: #f3e4e4 1px solid;
    .el-input {
        width: 100%;
    }
    
    text-overflow: ellipsis;
}
.computed-field-direction {
    width: 120px;
    flex: none;
}
.attribute-content {
    width: 1800px;
    flex: none;
    border: #f3e4e4 1px solid;
    // overflow:auto;
    // .attribute {
    //     margin: 4px 0;
    // }
}
// .active {
//     background: rgba(88, 99, 236, 0.1);
// }
.page-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #fff;

    background: #9897e6;
    cursor: pointer;
    color: #fff;

    &:hover {
        background: #7472ef;
    }
    &.active {
        background: #7472ef;
    }
    .list {
        font-size: 12px;
        width: 100%;
        padding-left: 10px;
    }
    & > * {
        margin: 4px 0;
    }
}
</style>