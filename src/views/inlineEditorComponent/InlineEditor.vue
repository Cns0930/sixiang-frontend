<template>
    <div class="body">
        <div class="ckeditor" data-editor="DecoupledDocumentEditor">
            <div style="margin-bottom:10px">
                <button @click="getHtmlToAce">在线获取html</button>
                <el-divider direction="vertical" content-position="center"></el-divider>
                <button @click="setHtmlToEditor">在线html->富文本编辑器</button>
                <el-divider direction="vertical" content-position="center"></el-divider>
                <!-- 当前页
                <input v-model="page" style="width:30px" />-->
                <button @click="savePage">当前页保存</button>
                <!-- <button @click="loadPage">当前页加载</button>
                <button @click="exportHtmlFromAce">从code编辑器导出html</button>-->
                <el-divider direction="vertical" content-position="center"></el-divider>
                <button @click="openEditor">全屏打开代码编辑器</button>

                <el-divider direction="vertical" content-position="center"></el-divider> <button @click="transfer" :disabled="backend.includes('4141')">保存并输出html到超级帮办</button>
            </div>

            <div class="main">
                <div style="width:30cm">
                    <!-- <div ref="toolbar" style="position:fixed;top:32px;z-index:30"></div> -->
                    <div ref="toolbar" style="width: 100%;"></div>

                    <div>
                        <!-- 纵向 -->
                        <div class="row-editor">
                            <div
                                class="x"
                                :class="{
                            'page-portrait': temp_page.orient=='column',
                            'page-landscape': temp_page.orient=='row',
                            'table-padding': temp_page.isTable==1,
                            'text-padding': temp_page.isTable==0
                        }"
                            ></div>
                        </div>

                        <!-- 横向 -->
                        <!-- <div class="row-editor">
                    <div class="x" style="width: 29.7cm;height:21cm;padding: 2.54cm 1.17cm"></div>
                        </div>-->
                    </div>
                </div>

                <div
                    ref="container"
                    style="width:100%;height:720px;top:0px;position:relative;margin-top:0px"
                ></div>
            </div>

            <!-- <iframe id="print-data-container" tabindex="-1" :class="ifShow?'iframe-show':'iframe-off'"></iframe> -->
        </div>
        <el-dialog class="monaco" :fullscreen="true" :visible.sync="dialogVisible" :before-close="syncCode">
            <div ref="dialog_container" style="width:100%;height:800px"></div>
        </el-dialog>
    </div>
</template>

<script>
import CKEditor from "@/assets/js/ckeditor.js";
import contentCss from "@/assets/js/contentStyle.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import renderjson from "@/assets/render.json"
import Handlebars from "@/utils/handlebarsHelper";

import axios from "axios";

import { addEditPage } from "@/api/template/index";

import renderedHtml from "@/assets/result";
import { mergeFieldAttr } from "../formConstructor/util";
import { mapState } from "vuex";
import _ from "lodash";
import * as monaco from "monaco-editor";
import { saveStep } from '@/api/step';
import { getFieldAll } from "@/api/superForm/index";
import {
    deserializeTableData
} from "../attributeComponents/index";
export default {
    name: "InlineEditor",
    props: ["temp_page", "currentPagenum"],
    data() {
        return {
            backend: process.env.VUE_APP_BASE_IP,
            editor: null,
            ifShow: false,
            page: "0",
            // ace:null,
            monacoEditor: null,
            dialogVisible: false,
            dialogEditor: null,
            // beautify:null,
            baseFields:[],
            computedFields:[],
        };
    },
    watch: {
        // temp_page: {
        //     handler(val, oldVal) {
        //         // if (val.id !== oldVal.id || val.templateOrientation !== oldVal.templateOrientation || val.templatePadding !== oldVal.templatePadding) {
        //         //     this.initEditor();
        //         // }
        //         console.log(val,oldVal)
        //         this.initEditor();
        //     },
        //     deep: true,
        // },
        'temp_page.id'(){this.initEditor()},
        'temp_page.isTable'(){this.initEditor()},
        'temp_page.orient'(){this.initEditor()},
    },
    computed: {
        // ...mapState({
        //     baseFields: (state) => state.fieldModel.baseFields,
        //     computedFields: (state) => state.fieldModel.computedFields,
        //     // templates: state => state.fieldModel.templates,
        // }),
        renderjson() {
            // let baseJSON = this.baseFields.reduce(mergeFieldAttr, {});
            // let computedJSON = this.computedFields.reduce(mergeFieldAttr, {});
            let renderJSON=this.$store.state.fieldModel.renderJSON;
            
            return {
                ..._.mapValues(renderJSON, "sample"),
                _repeatNo:0,
            };
        },
    },
    mounted() {
        // 初始化monaco
        monaco.editor.defineTheme("myTheme", {
            base: "vs",
            inherit: true,
            rules: [{ background: "EDF9FA" }],
            // colors: { 'editor.lineHighlightBackground': '#0000FF20' }
        });
        monaco.editor.setTheme("myTheme");

        this.monacoEditor = monaco.editor.create(this.$refs.container, {
            value: ["<p>等待编辑</p>"].join("\n"),
            language: "html",
            // features: [],
            // minimap: {
            //     enabled: true,
            // },
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: "line", // 光标样式
            automaticLayout: false, // 自动布局
            glyphMargin: true, // 字形边缘
            useTabStops: false,
            fontSize: 16, // 字体大小
            autoIndent: true, //自动布局
            wordWrap: 'on', // 自动换行
        });

        this.initEditor();
    },
    methods: {
        async openEditor() {
            this.dialogVisible = true;
            // 初始化弹窗monaco
            if (this.dialogEditor == null) {
                await this.$nextTick(() => {
                    this.dialogEditor = monaco.editor.create(
                        this.$refs.dialog_container,
                        {
                            value: ["<p>等待编辑</p>"].join("\n"),
                            language: "html",
                            // features: [],
                            // minimap: {
                            //     enabled: true,
                            // },
                            selectOnLineNumbers: true,
                            roundedSelection: false,
                            cursorStyle: "line", // 光标样式
                            automaticLayout: false, // 自动布局F
                            glyphMargin: true, // 字形边缘
                            useTabStops: false,
                            fontSize: 14, // 字体大小
                            autoIndent: true, //自动布局
                            wordWrap: 'on', // 自动换行
                        }
                    );
                });
            }
            // 数据同步过来
            this.dialogEditor.setModel(this.monacoEditor.getModel());
            // this.dialogEditor.setValue(this.monacoEditor.getValue()); 
        },
        syncCode(done){
            this.monacoEditor.setModel(this.dialogEditor.getModel());
            // this.monacoEditor.setValue(this.dialogEditor.getValue());
            done();
        },
        async initEditor() {
            if (this.editor) {
                await this.editor.destroy();
                this.editor = null;
            }

            let sourceEl = Array.from(document.querySelectorAll(".x")).reduce(
                (result, item, i) => {
                    result[i] = item;
                    return result;
                },
                {}
            );
            console.log('sourceEl', sourceEl);
            CKEditor.create(sourceEl, {
                lineHeight: {
                    // specify your otions in the lineHeight config object. Default values are [ 0, 0.5, 1, 1.5, 2 ]
                    options: [
                        "0.5",
                        "1",
                        "1.1",
                        "1.2",
                        "1.3",
                        "1.4",
                        "1.5",
                        "1.6",
                        "1.7",
                        "1.8",
                        "1.9",
                        "2.0",
                        "2.1",
                        "2.2",
                        "2.3",
                        "2.4",
                        "2.5",
                        "2.6",
                        "2.7",
                        "2.8",
                        "2.9",
                        "3.0",
                        "3.1",
                        "3.2",
                        "3.3",
                        "3.4",
                        "3.5",
                        "3.6",
                    ],
                },
                // removePlugins: [ 'PasteFromOffice' ],
                toolbar: {
                    items: [
                        "heading",
                        "|",
                        "fontSize",
                        "fontColor",
                        "fontFamily",
                        "fontBackgroundColor",
                        "lineHeight",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "highlight",
                        "|",
                        "alignment",
                        "|",
                        "numberedList",
                        "bulletedList",
                        "|",
                        "indent",
                        "outdent",
                        "|",
                        "todoList",
                        "link",
                        "blockQuote",
                        "imageUpload",
                        "insertTable",
                        "mediaEmbed",
                        "|",
                        "undo",
                        "redo",
                        "horizontalLine",
                        "pageBreak",
                        "specialCharacters",
                        "removeFormat",
                    ],
                },
                language: "zh-cn",
                image: {
                    toolbar: [
                        "imageTextAlternative",
                        "imageStyle:full",
                        "imageStyle:side",
                    ],
                },
                indentBlock: {
                    classes: [
                        "custom-block-indent-1", // First step - smallest indentation.
                        "custom-block-indent-2",
                        "custom-block-indent-3",
                        "custom-block-indent-4",
                        "custom-block-indent-5",
                        "custom-block-indent-6",
                        "custom-block-indent-7",
                        "custom-block-indent-8",
                    ],
                },
                fontFamily: {
                    options: [
                        "default",
                        "微软雅黑",
                        "仿宋",
                        "黑体",
                        "宋体",
                        "Wingdings 2",
                    ],
                    supportAllValues: true,
                },
                fontSize: {
                    options: [
                        10,
                        12,
                        14,
                        18.67,
                        16,
                        16.5,
                        17,
                        17.2,
                        17.5,
                        "default",
                        18,
                        20,
                        22,
                    ],
                    supportAllValues: true,
                },
                table: {
                    contentToolbar: [
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "tableCellProperties",
                        "tableProperties",
                    ],
                },
                licenseKey: "",
            })
                .then((editor) => {
                    window.editor = editor;
                    this.editor = editor;
                    const toolbarContainer = this.$refs.toolbar;

                    toolbarContainer.innerHTML = "";

                    toolbarContainer.appendChild(
                        editor.ui.view.toolbar.element
                    );

                    editor.editing.view.change((writer) => {
                        let roots = writer.document.roots;

                        for (let root of roots) {
                            writer.removeClass(
                                "ck-editor__editable_inline",
                                root
                            );
                            // writer.removeClass( 'ck-content', root );
                        }
                    });

                    this.monacoEditor.setValue(this.temp_page.htmlContent);
                    // beautify.beautify(this.ace.session);
                    this.setHtmlToEditor();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        exportHtml() {
            let html = this.editor.model.document
                .getRootNames()
                .map((v) => editor.getData({ rootName: v }))
                .join("");

            this.downloadFile(html, "模板.html");
        },
        exportHtmlWithStyle() {
            let html = this.editor.model.document
                .getRootNames()
                .map((v) => editor.getData({ rootName: v }))
                .join("");
            let str = `<html>
                <head>
                    <title>${document.title}</title>
                    <style>@page{size:A4}</style>
                    ${contentCss}
                </head>
                <body style="margin:0">
                <div class="ck-content">
                    ${html}
                </div>
                </body>
            </html>`;
            this.downloadFile(str, "样式.html");
        },
        getHtmlWithStyle() {
            let html = this.editor.model.document
                .getRootNames()
                .map((v) => editor.getData({ rootName: v }))
                .join("");
            let str = `<html>
                <head>
                    <title>${document.title}</title>
                    <style>@page{size:A4}</style>
                    ${contentCss}
                </head>
                <body style="margin:0">
                <div class="ck-content">
                    ${html}
                </div>
                </body>
            </html>`;
            return str;
        },
        importHtml() {
            let page = prompt("输入页数", "0");
            if (!page) return;
            let html = prompt("粘贴html", "");
            if (html != null && html != "") {
                this.editor.data.set({ [page]: html });
            } else {
                alert("未输入");
            }
        },
        // importHtmlThenRender() {
        //     let page = prompt("输入页数", "0");
        //     if (!page) return;
        //     let html = prompt("粘贴html", "");
        //     if (html != null && html != "") {
        //         let template = Handlebars.compile(html);
        //         let result = template(this.renderjson);
        //         this.editor.data.set({ [page]: result });
        //     } else {
        //         alert("未输入");
        //     }
        // },
        downloadFile(string, filename) {
            var a = document.createElement("a");
            a.download = filename;
            a.style.display = "none";

            var blob = new Blob([string], { type: "text/html" });
            // var blob = new Blob(string);
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        getHtmlToAce() {
            let html = this.editor.model.document
                .getRootNames()
                .map((v) => editor.getData({ rootName: v }))
                .join("");
            this.monacoEditor.setValue(html);
            this.monacoEditor.trigger("", "editor.action.formatDocument");
        },
        // beautifyHtml() {
        //     // beautify.beautify(this.ace.session);
        // },
        setHtmlToEditor() {
            let html = this.monacoEditor.getValue();
            let template = Handlebars.compile(html);
            
            console.log(this.renderjson);
            try{
                let result = template(this.renderjson);
                this.editor.data.set({ [this.page]: result });
            }catch(e){
                console.warn("编译错误",e)
                this.editor.data.set({ [this.page]: html });
            }
            
        },
        async savePage() {
            const html = this.monacoEditor.getValue();
            this.$emit("saveTemplate", html);
        },
        loadPage() {
            let html = localStorage.getItem([this.page]);
            this.editor.data.set({ [this.page]: html });
        },
        exportHtmlFromAce() {
            let html = this.monacoEditor.getValue();

            this.downloadFile(html, "code模板.html");
        },
        async transfer(){
            const html = this.monacoEditor.getValue();
            // // 保存
            // await this.$emit("saveTemplate", html);
            // 保存并传输
            await this.$emit("transferHtml", html);
        },
        async initRender(){
            let result = await getFieldAll({ approvalItemId: this.$store.state.home.item.approvalItemId});
            if (!result.success) return;
            let tableData = result.data.map(v => ({ id: v.id, fieldType: v.fieldType, fieldName: v.fieldName,
                remark: v.remark,
                children: v.children, ...v.object })).map(deserializeTableData);
            this.baseFields = 
                tableData.filter(v => v.fieldType == 1);
            this.computedFields = 
                tableData.filter(v => v.fieldType == 2);
        }
    },
};
</script>

<style scoped lang="scss">
// .x {
//     width: 21cm;
//     height: 29.7cm;
//     margin: 10px 0;
// }
.page-portrait {
    width: 21cm;
    height: 29.7cm;
    margin-top: 10px;
    &.table-padding {
        padding: 2.54cm 1.5cm;
    }
    &.text-padding {
        padding: 2.54cm 3.18cm;
    }
}

.page-landscape {
    width: 29.7cm;
    height: 21cm;
    margin-top: 10px;
    padding: 2.54cm 1.17cm;
}
.iframe-off {
    position: absolute;
    width: 100px;
    height: 100px;
    margin: 10px;
    border: 0;
    padding: 0;
    white-space: nowrap;
    clip-path: inset(100%);
    clip: rect(0 0 0 0);
    overflow: hidden;
}
.iframe-show {
    width: 21cm;
    min-height: 29.7cm;
}
.ckeditor {
    padding: 10px;
    background-color: #f2f2f2;
    width: 1800px;
}
.main {
    display: flex;
}
</style>