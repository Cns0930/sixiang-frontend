<template>
    <div class="main">
        <div class="mainBox">
            <el-button type="primary" plain style="margin-bottom: 10px" @click="saveMaterialTemplate">保存材料模板</el-button>
            <el-button type="primary" plain style="margin-bottom: 10px" @click="saveMaterialTemplateAndExport">保存并输出材料字段</el-button>
            <div style="width:30cm">
                <!-- <div ref="toolbar" style="position:fixed;top:32px;z-index:30"></div> -->
                <div ref="toolbar" style="width: 70%;"></div>

                <div>
                    <!-- 纵向 -->
                    <div class="row-editor">
                        <div class="x" :class="{
                            'page-portrait': true,
                            'page-landscape': false,
                            'table-padding': false,
                            'text-padding': true
                        }"></div>
                    </div>

                    <!-- 横向 -->
                    <!-- <div class="row-editor">
                    <div class="x" style="width: 29.7cm;height:21cm;padding: 2.54cm 1.17cm"></div>
                        </div>-->
                </div>
                <div ref="container" style="width: 29.7cm;height:720px;top:0px;position:relative;margin-top:0px"></div>
            </div>
        
        </div>

    </div>
</template>

<script>
import CKEditor from '@/assets/js/ckeditor.js';
import contentCss from "@/assets/js/contentStyle.js"
import html2canvas from 'html2canvas'
import Handlebars from "@/utils/handlebarsHelper";
import _ from "lodash";
import { mergeFieldAttr } from "../formConstructor/util";
import jsPDF from 'jspdf'
import { getByMaterialId, updateMaterial, ssFieldImportData } from '@/api/basicInfo/material'
export default {
    name: "OnlineDocumentEditor",
    data() {
        return {
            materialId: this.$route.query.materialId,
            editor: null,
            ifShow: true,
            myEditor: null,
            isListShown: true,
            sourceEl: [],
            DecoupledEditor: null,
            page: "0",
            htmlTemplate: null,
            baseFields:[],
            computedFields:[],
            // temp_page: {
            //     isTable: 0,
            //     orient: "column",
            //     pageNum: 1,
            // },

            // 可删
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

            templateEditVisible: false,

            isListShown: true,

        }
    },
    computed: {
        renderjson() {
            let baseJSON = this.baseFields.reduce(mergeFieldAttr, {});
            let computedJSON = this.computedFields.reduce(mergeFieldAttr, {});

            return {
                ..._.mapValues(baseJSON, "sample"),
                ..._.mapValues(computedJSON, "sample"),
                _repeatNo: 0,
            };
        },
    },
    created() {
        
    },
    async mounted() {
        await this.init();
        this.initEditor();
    },
    methods: {
        async init() {
            // console.log('materialId', this.materialId);
            let result = await getByMaterialId({ materialId: this.materialId });
            if (!result.success) {
                return;
            }
            this.htmlTemplate = result.data.docxTemplateHtml;
            // console.log('this.htmlTemplate INIT');
            // console.log(this.htmlTemplate);
            // this.htmlTemplate = Handlebars.compile(this.htmlTemplate);
            // console.log('this.htmlTemplate TWO');
            // console.log(this.htmlTemplate);
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

                    // this.monacoEditor.setValue(this.temp_page.htmlContent);
                    // beautify.beautify(this.ace.session);
                    // this.setHtmlToEditor();
                    // console.log('this.htmlTemplate');
                    // console.log(this.htmlTemplate);
                    editor.data.set({ 0:this.htmlTemplate });
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        // setHtmlToEditor() {
        //     try {
        //         let result = this.htmlTemplate(this.renderjson);
        //         this.editor.data.set({ [this.page]: result });
        //     } catch (e) {
        //         console.warn("编译错误", e)
        //         this.editor.data.set({ [this.page]: html });
        //     }
        // },
        async saveMaterialTemplate() {
            let html = this.editor.model.document
                .getRootNames()
                .map((v) => editor.getData({ rootName: v }))
                .join("");
            let request = {
                materialId: this.materialId,
                docxTemplateHtml : html,
            }
            // console.log('request');
            // console.log(request);
            let result = await updateMaterial(request);
            if (!result.success) {
                this.$message.warning('保存材料模板失败');
                return;
            } else {
                this.$message.success('保存材料模板成功');
                await this.init();
                this.initEditor();
            }
        },
        async saveMaterialTemplateAndExport() {
            let html = this.editor.model.document
                .getRootNames()
                .map((v) => editor.getData({ rootName: v }))
                .join("");
            let request = {
                materialId: this.materialId,
                docxTemplateHtml : html,
            }
            // console.log('request');
            // console.log(request);
            let result = await updateMaterial(request);
            if (!result.success) {
                this.$message.warning('保存材料模板失败');
                return;
            } else {
                this.$message.success('保存材料模板成功');
                let res = await ssFieldImportData({ approvalItemId: this.$route.query.itemId, materialId: this.materialId});
                if (!res.success) {
                    this.$message.warning('输出材料字段失败');
                    return;
                } else {
                    this.$message.success('保存并输出材料字段成功');
                }
                await this.init();
                this.initEditor();
            }
        }
    }
}
</script>

<style scoped lang="scss">
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
    width: 45%;
    .toolbar-container {
        height: 500px;
        width: 80%;
        #firstname {
            height: 500px;
            width: 80%;
        }
    }
}
</style>