<template>
    <div class="template-manager">
        <div class="op-bar">

            <!-- <el-button @click="templateCreateVisible = true"> 新建材料</el-button> -->
            <el-button @click="loadAllField"> 载入字段</el-button>
            <el-button @click="$router.push('/')"> -> 字段管理</el-button>
            <el-button @click="isListShown=false" v-show="isListShown">收起侧栏</el-button>
            <el-button @click="isListShown=true" v-show="!isListShown">展开侧栏</el-button>

        </div>
        <div class="main">

            <!-- template -->
            <div class="computed-field" v-show="isListShown">
                <div style="margin-top: 10px;">
                    <el-button type="text" @click="handleClickTemplate(templates)"
                        style="width:100px;margin:0;color:orange">
                        {{templates.template.docxTemplateName}}
                    </el-button>
                    <el-button-group>
                        <el-button style="width:45px;" @click="addPage(templates)" icon="el-icon-plus"></el-button>
                        <!-- <el-button style="width:45px;" @click="handleDelete(i)">删除</el-button> -->
                    </el-button-group>
                    <div style="margin-left:40px;">
                        <div v-for="(page,pageIndex) in templates.templatePagesList" style="margin-top: 2px;" :class="{'active':temp_page && page.id == temp_page.id}">
                            - <el-button type="text" style="width:50px;margin:0"
                                @click="handleClickPage(page,pageIndex)">{{page.pageNum}} 页
                            </el-button>
                            <el-button-group>
                                <el-button style="width:40px;" @click="savePage(page,pageIndex)" icon="el-icon-upload2"
                                :disabled="!temp_page || page.id != temp_page.id">
                                </el-button>
                                <el-button style="width:40px;" @click="editPage(page,pageIndex)" icon="el-icon-edit"
                                :disabled="!temp_page || page.id != temp_page.id">
                                </el-button>
                                <el-button style="width:40px;" @click="deletePage(page)" icon="el-icon-delete"></el-button>
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
                    :currentPagenum="currentPagenum" @saveTemplate="saveTemplate" @transferHtml="transferHtml"/>
            </div>

        </div>
        <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                模板名称:<el-input v-model="temp_template_name"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="templateCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplate">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="载入字段" :visible.sync="fieldVisible" width="30" :close-on-click-modal="false" 
        postition="fixed">
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
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash"
import { mapState } from "vuex"
import { mergeFieldAttr } from "./util"

import { getSingleTemplate, addTemplate, addEditPage, deletePage } from '@/api/template/index'
import { getField } from '@/api/superForm/index'
import defs, { deserializeComputedField, deserializeBaseField } from "../attributeComponents/index"
import inlineEditor from "@/views/inlineEditorComponent/InlineEditor"

import {mixin} from "@/mixin/mixin"
import {CodeEditor} from "@/views/attributeComponents/defRendererComponents/defRendererComponents"

export default {
    name: "TemplateManager",
    components: {
        inlineEditor,CodeEditor
    },
    mixins:[mixin],
    data() {
        return {
            templates: {
                template: {},
                templatePagesList: [],
            },

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

            templateEditVisible:false,

            isListShown:true,

        }
    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            // templates: state => state.fieldModel.templates,
        })
    },
    mounted() {
        this.init()
        this.getTemplate()
    },
    methods: {
        async getTemplate() {
            if (!this.$route.query.id) return;
            const res = await getSingleTemplate({
                templateId: this.$route.query.id,
            })
            if (!res.success) return;
            this.templates = res.data;
        },
        async addTemplate() {
            if (!this.temp_template_name) return;

            const res = await addTemplate({
                itemName: this.$store.state.home.item.name,
                docxTemplateName: this.temp_template_name,
            })

            if (!res.success) return;

            this.$message.success('新增模板成功');
            this.templateCreateVisible = false;
            this.temp_template_name = '';

            this.getTemplate();
        },
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
                itemId: template.template.itemId, // 事项id
                itemName: template.template.itemName, // 事项名称
                htmlContent: "<p>等待编辑</p>", // html的内容
                templateId: template.template.id, // 所属的父模板的id
                orient: "column", // 方向
                isTable: 0, // 是否表格
                pageNum: length, // 第几页
                templateType: "",
                contentCss: "",
            })
            // this.currentPagenum = length;
        },
        async savePage(page, pageIndex) {
            let res
            if (this.temp_page && this.temp_page.id === page.id) {
                 res = await this.$refs.inlineEditor.savePage();
            } else {

                res = await addEditPage(page);


            }
            if (!res.success) return;

            this.$message.success('保存页面成功');
            this.getTemplate();
        },
        async saveTemplate(html){
            const res = await addEditPage({
                id: this.temp_page.id,
                itemId: this.temp_page.itemId,
                itemName: this.temp_page.itemName,
                htmlContent: html,
                templateId: this.temp_page.templateId,
                orient: this.temp_page.orient,
                isTable: this.temp_page.isTable,
                pageNum: this.currentPagenum,
                templateType: this.temp_page.templateType,
                contentCss: this.temp_page.contentCss,
                script:this.temp_page.script,
            })

            if (!res.success) return;
            // 把返回的值放进去
            this.temp_page = res.data;

            this.$message.success('保存页面成功');
            this.getTemplate();
        },
        async transferHtml(html){
            // TODO: 导出页面到帮办
            let params = {
                contentCss: this.temp_page.contentCss,
                fileName: this.templates.template.docxTemplateName,
                html: html,
                name: this.templates.template.documentName,
                orient: this.temp_page.orient,
                pageNum: this.currentPagenum,
                script: this.temp_page.script,
                sid: this.$store.state.home.item.sid,
                padding: this.temp_page.isTable == 1? "table": "text",
                documentSeq: this.templates.template.documentSeq
            }
            console.log(params)
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
            if(!this.temp_page.script){
                
                this.temp_page.script=`function(state,getters){
                    return 1
                }`
            }
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
            const result = await getField({
                itemName: this.$store.state.home.item.name,
            })
            if (!result.success) return;
            this.$store.commit("putBaseFields", result.data.filter(v => v.fieldType == 1).map(v => v.object).map(deserializeBaseField))
            this.$store.commit("putComputedFields", result.data.filter(v => v.fieldType == 2).map(v => v.object).map(deserializeComputedField))
            this.baseJSON = this.baseFields.reduce(mergeFieldAttr, {})
            this.computedJSON = this.computedFields.reduce(mergeFieldAttr, {})
            // this.renderJSON = { ..._.mapValues(this.baseJSON), ..._.mapValues(this.computedJSON) }

        },
        editPage(){
            this.templateEditVisible = true;
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
        height: calc(100vh - 108px);
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
    border: green 1px solid;
    .el-input {
        width: 100%;
    }
    overflow : hidden;
    text-overflow : ellipsis;
}
.computed-field-direction {
    width: 120px;
    flex: none;
}
.attribute-content {
    width: 1800px;
    flex: none;
    border: blue 1px solid;
    // overflow:auto;
    // .attribute {
    //     margin: 4px 0;
    // }
}
.active{
    background:rgba(88,99,236,0.1)
}
</style>