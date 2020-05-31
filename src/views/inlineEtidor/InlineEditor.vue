<template>
    <div class="ckeditor" data-editor='DecoupledDocumentEditor'>
        <div style="margin-bottom:40px">
            <button @click="exportHtml">导出html模板</button>
            <button @click="importHtml">导入html模板</button>
            <button @click="exportHtmlWithStyle">导出html带样式</button>
            <button @click="printPreview">打印预览</button>
            <button @click="renderTpl">模板渲染</button>
            <button @click="importHtmlThenRender">模板导入同时渲染</button>
            <button @click="downloadDocx">生成word</button>|||
            <button @click="getHtmlToAce">在线获取html</button>
            <button @click="setHtmlToEditor">在线html->富文本编辑器</button>|||
            当前页<input v-model="page"/>
            <button @click="savePage">当前页保存</button>
             <button @click="loadPage">当前页加载</button>
        </div>

        <!-- <button @click="convertToPdf">转pdf</button> -->
        <div class="main">
        <div style="width:30cm">
            <div ref="toolbar" style="position:fixed;top:32px;z-index:30"></div>
            <div style="">
                <div class="row-editor">
                    <div class="x" style="padding: 2.54cm 1.60cm">
                        <h2 v-pre>{{1_1}}</h2>
                        如果 参数a==参数b
                        <span v-pre>{{#equal 1 1}} 等于{{else}}不等于{{/equal}}</span>
                        <div v-pre>{{#if true}} true{{else}}false{{/if}}</div>
                    </div>

                </div>
                <div class="row-editor">
                    <div class="x">
                    </div>
                </div>
                <div class="row-editor">
                    <div class="x" style="width: 29.7cm;height:21cm;padding: 2.54cm 1.17cm">

                    </div>

                </div>
            </div>
        </div>
        <div id="ace" style="flex:1;height:500px;top:30px;position:relative;margin-top:30px">
            
        </div>
        </div>
        <iframe id="print-data-container" tabindex="-1" :class="ifShow?'iframe-show':'iframe-off'"></iframe>
    </div>
</template>

<script>
import CKEditor from '@/assets/js/ckeditor.js';
import contentCss from "@/assets/js/contentStyle.js"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import renderjson from "@/assets/render.json"
import Handlebars from "@/utils/handlebarsHelper"

import axios from "axios"
export default {
    name: "InlineEditor",
    data() {
        return {
            editor: null,
            ifShow: false,
            page: "0",
            ace:null,
            beautify:null,
        }
    },
    mounted() {
        let sourceEl = Array.from(document.querySelectorAll(".x")).reduce((result, item, i) => { result[i] = item; return result }, {})

        CKEditor
            .create(sourceEl, {

                lineHeight: { // specify your otions in the lineHeight config object. Default values are [ 0, 0.5, 1, 1.5, 2 ]
                    options: ["0.5", "1", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6",]
                },
                // removePlugins: [ 'PasteFromOffice' ],
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'fontSize',
                        'fontColor',
                        'fontFamily',
                        'fontBackgroundColor',
                        'lineHeight',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'highlight',
                        '|',
                        'alignment',
                        '|',
                        'numberedList',
                        'bulletedList',
                        '|',
                        'indent',
                        'outdent',
                        '|',
                        'todoList',
                        'link',
                        'blockQuote',
                        'imageUpload',
                        'insertTable',
                        'mediaEmbed',
                        '|',
                        'undo',
                        'redo',
                        'horizontalLine',
                        'pageBreak',
                        'specialCharacters',
                        'removeFormat'
                    ]
                },
                language: 'zh-cn',
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'imageStyle:full',
                        'imageStyle:side'
                    ]
                },
                fontFamily: {
                    options: [
                        'default',
                        '微软雅黑',
                        '仿宋',
                        '黑体',
                        '宋体'
                    ],
                    supportAllValues: true
                },
                fontSize: {
                    options: [
                        10, 12, 14, 18.67, 16, "default", 18, 20, 22
                    ],
                    supportAllValues: true
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableCellProperties',
                        'tableProperties'
                    ]
                },
                licenseKey: '',

            })
            .then(editor => {

                window.editor = editor;
                this.editor = editor;
                const toolbarContainer = this.$refs.toolbar

                toolbarContainer.appendChild(editor.ui.view.toolbar.element);



                editor.editing.view.change(writer => {

                    let roots = writer.document.roots


                    for (let root of roots) {
                        writer.removeClass('ck-editor__editable_inline', root);
                        // writer.removeClass( 'ck-content', root );
                    }


                });
            })
            .catch(error => {
                console.log(error);
            });
    
             // 渲染 ace
             this.beautify = ace.require("ace/ext/beautify");
                 this.ace = ace.edit("ace");

              
                    this.ace.setTheme("ace/theme/monokai");
                    this.ace.session.setMode("ace/mode/html");
                    this.ace.setOption("wrap", "free")
                    
               
    },
    methods: {
        exportHtml() {
            let html = this.editor.model.document.getRootNames().map(v => editor.getData({ rootName: v })).join("");

            this.downloadFile(html, "模板.html")
        },
        exportHtmlWithStyle() {
            let html = this.editor.model.document.getRootNames().map(v => editor.getData({ rootName: v })).join("");
            let str = `<html>
                <head>
                    <title>${ document.title}</title>
                    <style>@page{size:A4}</style>
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
        getHtmlWithStyle() {
            let html = this.editor.model.document.getRootNames().map(v => editor.getData({ rootName: v })).join("");
            let str = `<html>
                <head>
                    <title>${ document.title}</title>
                    <style>@page{size:A4}</style>
                    ${contentCss}
                </head>
                <body style="margin:0">
                <div class="ck-content">
                    ${html}
                </div>
                </body>
            </html>`
            return str;
        },
        importHtml() {
            let page = prompt("输入页数", "0");
            if (!page) return;
            let html = prompt("粘贴html", "");
            if (html != null && html != "") {
                this.editor.data.set({ [page]: html })
            } else {
                alert("未输入")
            }
        },
        importHtmlThenRender() {
            let page = prompt("输入页数", "0");
            if (!page) return;
            let html = prompt("粘贴html", "");
            if (html != null && html != "") {
                let template = Handlebars.compile(html);
                let result = template(renderjson);
                this.editor.data.set({ [page]: result })


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
            let html = this.editor.model.document.getRootNames().map(v => editor.getData({ rootName: v })).join(`<div style="page-break-before:always;"></div>`)

            iframeElement.srcdoc = `<html>
                <head>
                    <title>${ document.title}</title>
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
        },
        renderTpl() {
            let template = Handlebars.compile(this.editor.getData({ rootName: this.page }));
            Handlebars.registerHelper("addCIndex", function (index, options) {
                let opt = ["零、", "一、", "二、", "三、"]
                return opt[parseInt(index) + 1];
            });
            let result = template(renderjson);
            this.editor.data.set({ [this.page]: result })
        },

        async downloadDocx() {
            let result = await axios.post("http://192.168.3.88:5001/api/selfservice/html2Doc", {
                name: "test",
                fileName: "test.docx",
                pages: [
                    {
                        html: this.getHtmlWithStyle(),
                        strict: true,
                        nextPageOrient: "portrait",
                    }
                ]
            }).then(res => res.data)

            if (result.code == 200) {

                window.open(`http://192.168.3.88:5001/api/selfservice/getHtmlDoc?filePath=${result.data}`)
            }
        },
        getHtmlToAce(){
            let html=  this.editor.model.document.getRootNames().map(v => editor.getData({ rootName: v })).join("");
            this.ace.setValue(html)
            this.beautify.beautify(this.ace.session);
        },
        setHtmlToEditor(){
            let html = this.ace.getValue();
             let template = Handlebars.compile(html);
                let result = template(renderjson);
                this.editor.data.set({ [this.page]: result })

        },
        savePage(){
            let html=  this. editor.getData({ rootName: this.page });
            localStorage.setItem([this.page],html);
            alert("保存到localStorage");
        },
        loadPage(){
            let html=localStorage.getItem([this.page]);
            this. editor.data.set({  [this.page]:html });
        }


    }
}
</script>

<style scoped lang="scss">
.x {
    width: 21cm;
    height: 29.7cm;
    margin: 10px 0;
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
    background-color: #f2f2f2;

}
.main{
    display:flex;
}
</style>