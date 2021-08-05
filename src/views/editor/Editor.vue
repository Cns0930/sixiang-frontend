<template>
    <div class="ckeditor" data-editor='DecoupledDocumentEditor'>
        <button @click="exportHtml">导出html模板</button>
        <button @click="importHtml">导入html模板</button>
        <button @click="exportHtmlWithStyle">导出html带样式</button>
        <button @click="printPreview">打印预览</button>
        <!-- <button @click="convertToPdf">转pdf</button> -->
        <div id="toolbar-container"></div>
        <div class="row-editor">
            <div id="editor">
                <h2>Bilingual Personality Disorder</h2>
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
export default {
    name: "Editor",
    data() {
        return {
            editor: null,
            ifShow: true,
        }
    },
    mounted() {

        CKEditor
            .create(document.querySelector('#editor'), {
                // removePlugins: [ 'PasteFromOffice' ],
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'fontSize',
                        'fontColor',
                        'fontFamily',
                        'fontBackgroundColor',
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
                        10, 12, 14, "default", 18, 20, 22
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
        exportHtml() {
            let html = this.editor.getData();

            this.downloadFile(html, "模板.html")
        },
        exportHtmlWithStyle() {
            let html = this.editor.getData();
            let str = `<html>
                <head>
                    <title>${ document.title}</title>
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
</style>