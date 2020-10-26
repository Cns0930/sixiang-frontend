<template>
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
                    <div v-for="(page,pageIndex) in templates.templatePagesList" :key='pageIndex'
                        style="margin-top: 2px;" :class="{'active':temp_page && page.id == temp_page.id}">
                        - <el-button type="text" style="width:50px;margin:0" @click="handleClickPage(page,pageIndex)">
                            {{page.pageNum}} 页
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

            <inlineEditor ref="inlineEditor" v-if="temp_page" :temp_page="temp_page" :currentPagenum="currentPagenum"
                @saveTemplate="saveTemplate" @transferHtml="transferHtml" />
        </div>
        <div class="ckeditor" data-editor='DecoupledDocumentEditor'>
            <!-- <button @click="exportHtml">导出html模板</button>
            <button @click="importHtml">导入html模板</button>
            <button @click="exportHtmlWithStyle">导出html带样式</button>
            <button @click="printPreview">打印预览</button> -->
            <!-- <button @click="convertToPdf">转pdf</button> -->
            <div id="toolbar-container"></div>
            <div class="row-editor">
                <div id="editor">
                    <h2>Bilingual Personality Disorder</h2>
                </div>
            </div>
            <iframe id="print-data-container" tabindex="-1" :class="ifShow?'iframe-show':'iframe-off'"></iframe>
        </div>

    </div>
</template>

<script>
import CKEditor from '@/assets/js/ckeditor.js';
import contentCss from "@/assets/js/contentStyle.js"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { getByMaterialId, updateMaterial } from '@/api/basicInfo/material'
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

            templateEditVisible:false,

            isListShown:true,

            baseFields:[],
            computedFields:[],

        }
    },
    mounted() {
        this.init();
        // this.getTemplate();

        let myEditor = CKEditor.create(document.querySelector( '#editor' ), 
        {
                initialData: '<h2>Initial data</h2><p>Foo bar.</p>',
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
            .then(editor => {
                console.log(editor)
                window.editor = editor;
                this.editor = editor;
                const toolbarContainer = document.querySelector('#toolbar-container');

                toolbarContainer.appendChild(editor.ui.view.toolbar.element);

                // 监听事件

                editor.plugins.get('PasteFromOffice').on("change:isEnabled", (d) => {
                    console.log(d)
                })
                console.log(editor.plugins.get('PasteFromOffice'))

            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
        async init() {
            console.log('materialId', this.materialId);
            let result = await getByMaterialId({materialId: this.materialId});
            if(!result.success) {
                return;
            }
        },
        exportHtml() {
            let html = this.editor.getData();

            this.downloadFile(html, "模板.html")
        },
        exportHtmlWithStyle() {
            let html = this.editor.getData();
            let str = `<html>
                <head>
                    <title>${document.title}</title>
                    ${contentCss}
                </head>
                <body style="margin:0">
                <div class="ck-content">
                    ${html}
                </div>
                </body>
            </html>`
            this.downloadFile(str, "样式.html")
        },
        importHtml() {
            let html = prompt("粘贴html", "");
            if (html != null && html != "") {
                this.editor.setData(html)
            } else {
                alert("未输入")
            }
        },
        downloadFile(string, filename) {
            var a = document.createElement('a');
            a.download = filename;
            a.style.display = 'none';

            var blob = new Blob([string], { type: 'text/html' });
            // var blob = new Blob(string);
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        },
        /* eslint-disable*/
        printPreview() {
            const iframeElement = document.querySelector('#print-data-container');
            let html = this.editor.getData()

            iframeElement.srcdoc = `<html>
                <head>
                    <title>${document.title}</title>
                    ${contentCss}
                </head>
                <body style="margin:0">
                <div class="ck-content">
                    ${html}
                    <script>
                        window.addEventListener( \'DOMContentLoaded\', () => { window.print(); } );
                    <\/script>
                </div>
                </body>
            </html>`

        },
        convertToPdf() {

            html2canvas(document.querySelector('#editor'), {
                scale: 2,

            }).then(canvas => {
                //  document.body.appendChild(canvas);
                console.log(canvas)
                var contentWidth = canvas.width
                var contentHeight = canvas.height
                // 一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 592.28 * 841.89
                // 未生成pdf的html页面高度
                var leftHeight = contentHeight
                // pdf页面偏移
                var position = 0
                // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28
                var imgHeight = 592.28 / contentWidth * contentHeight
                var pageData = canvas.toDataURL('image/jpeg', 1.0)

                var pdf = new jsPDF('', 'pt', 'a4')
                // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                // 当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        // 避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage()
                        }
                    }
                }
                // 导出pdf文件命名
                pdf.save('report_pdf_' + new Date().getTime() + '.pdf')

            })
        }


    }
}
</script>

<style scoped lang="scss">
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
}
</style>