<template>
    <div class="template-manager">
        <div class="op-bar">

            <!-- <el-button @click="templateCreateVisible = true"> 新建材料</el-button> -->
            <el-button @click="loadAllField"> 载入字段</el-button>
            <el-button @click="$router.push('/')"> -> 字段管理</el-button>

        </div>
        <div class="main">

            <!-- template -->
            <div class="computed-field">
                <div style="margin-top: 10px;">
                    <el-button type="text" @click="handleClickTemplate(templates)" style="width:100px;margin:0;color:orange">
                        {{templates.template.templateName}}
                    </el-button>
                    <el-button-group>
                        <el-button style="width:45px;" @click="addPage(templates)" icon="el-icon-plus"></el-button>
                        <!-- <el-button style="width:45px;" @click="handleDelete(i)">删除</el-button> -->
                    </el-button-group>
                    <div style="margin-left:40px;">
                        <div v-for="(page,pageIndex) in templates.templatePagesList" style="margin-top: 2px;">
                            - <el-button type="text" style="width:50px;margin:0" @click="handleClickPage(page,pageIndex)">{{page.templatePagenum}} 页
                            </el-button>
                            <el-button-group>
                                <el-button style="width:45px;" @click="savePage(page,pageIndex)" icon="el-icon-upload2"></el-button>
                                <el-button style="width:45px;" @click="deletePage(page)">删除</el-button>
                            </el-button-group>
                        </div>
                    </div>
                </div>

            </div>
            <!-- 渲染字段 -->
            <div class="computed-field">
                <div v-for="(v,i) in baseJSON" :key="i">

                    ({{v.fieldNo}}){{v.label}}：{{v.sample}}

                </div>
                <el-divider v-if="Object.keys(computedJSON).length > 0" />
                <div v-for="(v,i) in computedJSON" :key="i">

                    ({{v.fieldNo}}){{v.label}}:{{v.sample}}

                </div>

            </div>
            <div class="computed-field computed-field-direction">
                <div v-if="temp_page">
                    <el-select v-model="temp_page.templateOrientation" placeholder="">
                        <el-option label="横向" value="landscape" :key=""></el-option>
                        <el-option label="纵向" value="portrait" :key=""></el-option>
                    </el-select>
                    <el-select v-model="temp_page.templatePadding" placeholder="">
                        <el-option label="表格" value="table" :key=""></el-option>
                        <el-option label="纯文本" value="text" :key=""></el-option>
                    </el-select>
                    <el-input v-model="temp_page.templatePagenum" placeholder="请输入页码"></el-input>
                </div>

            </div>
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

                <inlineEditor ref="inlineEditor" v-if="temp_page" :temp_page="temp_page" @updateTemplate="getTemplate" />
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
    </div>
</template>

<script>
import _ from "lodash"
import { mapState } from "vuex"
import { mergeFieldAttr } from "./util"

import { getSingleTemplate, addTemplate, addEditPage, deletePage } from '@/api/template/index'
import { getField } from '@/api/superForm/index'

import inlineEditor from "@/views/inlineEtidor/InlineEditor"

export default {
    name: "TemplateManager",
    components: {
        inlineEditor
    },
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
            
            renderJSON: {}

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
                itemName: this.$store.state.home.itemName,
                templateName: this.temp_template_name,
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
                const pageNumArr = template.templatePagesList.map(item => { return item.templatePagenum });
                length = Math.max(...pageNumArr) + 1;
            }
            template.templatePagesList.push({
                id: null, // 当前页面的id
                itemId: template.template.itemId, // 事项id
                itemName: template.template.itemName, // 事项名称
                templateContent: "<p>等待编辑</p>", // html的内容
                templateId: template.template.id, // 所属的父模板的id
                templateOrientation: "portrait", // 方向
                templatePadding: "text", // 边距
                templatePagenum: length, // 第几页
                templateType: "",
                templateWordCss: "",
            })
        },
        async savePage(page,pageIndex){
            if (this.temp_page && this.temp_page.id === page.id) {
                this.$refs.inlineEditor.savePage();
            } else {
                const res = await addEditPage(page);

                if (!res.success) return;

                this.$message.success('保存页面成功');
                this.$emit('updateTemplate');
            }
        },
        async deletePage(page) {
            const res = await deletePage({
                templatePageId: page.id,
            })
            if (!res.success) return;
            this.$message.success('删除页面成功');
            this.getTemplate();
        },
        handleClickPage(page) {
            this.temp_page = page;
        },
        // handleDelete(i) {
        //     this.$store.commit("deleteTemplate", i)
        // },
        handleClickTemplate(template) {
            this.temp_template = template;
        },
        async loadAllField() {
            // this.baseJSON = this.baseFields.reduce(mergeFieldAttr, {})
            // this.computedJSON = this.computedFields.reduce(mergeFieldAttr, {})
            // this.renderJSON = { ..._.mapValues(this.baseJSON), ..._.mapValues(this.computedJSON) }
            const res = await getField({
                itemName: this.$store.state.home.itemName,
            })
            if (!res.success) return;
            this.baseJSON = res.data;
        }
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
        height: calc(100vh - 28px);
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
    .el-input{
        width: 100%;
    }
}
.computed-field-direction{
    width: 120px;
    flex: none;
}
.attribute-content {
    width: 1700px;
    flex: none;
    border: blue 1px solid;
    // overflow:auto;
    // .attribute {
    //     margin: 4px 0;
    // }
}
</style>