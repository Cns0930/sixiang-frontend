<template>
    <div class="template-manager">
        <div class="op-bar">

            <el-button @click="templateCreateVisible = true"> 新建材料</el-button>
            <el-button @click="loadAllField"> 载入字段</el-button>
            <el-button @click="$router.push('/')"> -> 字段管理</el-button>

        </div>
        <div class="main">

            <!-- template -->
            <div class="computed-field">
                <div v-for="(v,i) in templates" :key="i">
                    <el-button type="text" @click="handleClickTemplate(v,i)" style="width:100px;margin:0;color:orange">
                        {{v.name}}
                    </el-button>
                    <el-button-group>
                        <el-button style="width:45px;" @click="addPage(v,i)" icon="el-icon-plus"></el-button>
                        <el-button style="width:45px;" @click="handleDelete(i)">删除</el-button>
                    </el-button-group>
                    <div style="margin-left:40px;">
                        <div v-for="(page,pageIndex) in v.pages">
                            - <el-button type="text" style="width:50px;margin:0" @click="handleClickPage(page,pageIndex)">{{page.pageNo}} 页
                            </el-button>
                            <el-button-group>
                                <el-button style="width:45px;" @click="savePage(page,pageIndex,v.name)" icon="el-icon-upload2"></el-button>
                                <el-button style="width:45px;" @click="">删除</el-button>
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
                    <el-select v-model="temp_page.orientation" placeholder="">
                        <el-option label="横向" value="landscape" :key=""></el-option>
                        <el-option label="纵向" value="portrait" :key=""></el-option>
                    </el-select>
                    <el-select v-model="temp_page.paddingType" placeholder="">
                        <el-option label="表格" value="table" :key=""></el-option>
                        <el-option label="纯文本" value="text" :key=""></el-option>
                    </el-select>
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

                <inlineEditor v-if="temp_page" :temp_page="temp_page" />
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

import { getTemplate } from '@/api/template/index'
import { getField } from '@/api/superForm/index'

import inlineEditor from "@/views/inlineEtidor/InlineEditor"

export default {
    name: "TemplateManager",
    components: {
        inlineEditor
    },
    data() {
        return {
            templates: [],

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
            const res = await getTemplate({
                itemName: this.$store.state.home.itemName,
            })
            if (!res.success) return;
            this.templates = res.data;
            console.log(this.templates);
        },
        addTemplate() {
            console.log(this.temp_template_name);
            // this.$store.commit("pushTemplate", {
            //     name: this.temp_template_name,
            //     pages: [],
            // })
            // this.templateCreateVisible = false;
            // this.temp_template_name = '';
        },
        addPage(template, index) {
            let length = template.pages?.length || 0;

            let data = { pageNo: length, orientation: "portrait", paddingType: "text" }
            this.$store.commit("pushPage", { index, data })

        },
        savePage(page,pageIndex,templateName){

        },
        handleClickPage(page) {
            this.temp_page = page
        },
        handleDelete(i) {
            this.$store.commit("deleteTemplate", i)
        },
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