<template>
    <div class="common-material material">

        <content-card>
            <div slot="content" class="content">
                <div class="ckeditor" data-editor='DecoupledDocumentEditor'>
                    <div class="main">
                        <div class="toolbar " style="margin:0 auto;">
                            <div ref="toolbar" style="width:21cm;margin-left:-12px;" v-show="!collapse"></div>
                            <div class="collapse-bar">
                                <div class="line-btnlike"></div>
                                <div class="btnlike" @click="collapse=!collapse"><i
                                        :class="{'el-icon-arrow-up':!collapse,'el-icon-arrow-down':collapse}"
                                        style="font-size:10px;line-height:10px;"></i></div>
                                <div class="line-btnlike"></div>
                            </div>
                        </div>

                        <div style="height: 100%; overflow-y: auto;" class="mini-scroll container">
                            <div style="width:30cm;margin: 0 auto;color: black;">
                                <div class="row-editor" v-for="(page,index) in doc" :key="index">
                                   
                                    <div class="x mini-scroll"
                                    
                                        :class="{'direction-row':page.orient === 'row','text-padding':page.isTable==0,'table-padding':page.isTable==1} "
                                        :key="page.name+index">

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="material-mask el-loading-mask" style="display:none">
                    <div class="el-loading-spinner">
                        <i class="el-icon-loading"></i>
                        <p class="el-loading-text">拼命加载中</p>
                    </div>
                </div>
            </div>

        </content-card>
        <div class="operate-btn">
            <el-button type="primary" class="big-btn btn-default" @click="goPrev">
                {{index === 0? '返回上一步' : '上一个文档'}}
            </el-button>
            <el-button type="warning" class="big-btn btn-warn" @click="goNext">{{ isLast ? '下一步' : '下一个文档' }}
            </el-button>
        </div>

    </div>
</template>

<script>
import ContentCard from '../components/ContentCard'
import CKEditor from '@/assets/js/ckeditor';
import _ from "lodash";
// import { GetDocHtmlTempApi } from '@/api/ANew/index'
import { GetDocHtmlTempApi } from "@/api/template/index"
import Handlebars from "@/utils/handlebarsHelper"
import { mapGetters, mapState } from "vuex"
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
export default {
    name: 'CommonMaterial',
    components: { ContentCard },
    props: ["config"],
    mixins:[CommonMixin],
    data() {
        return {
            editor: null,

            collapse: true,
            // index: 0,
            docList: [],
        }
    },
    watch: {
        doc(newVal, oldVal) {
            this.init();
        }
    },
    computed: {
        ...mapGetters(['sid']),
        ...mapState({
            // item_code: state => state.ANew.item_code,
            index:state=>state.ANew.docIndex,
        }),
        doc() {
            return this.docList[this.index]
        },

        templateObj() {
            return _.mapValues(this.itemState, "value")
        },
        isLast() {
            return this.index == this.docList.length - 1
        }
    },
    async created() {
        let result = await Promise.all(this.config.map(fileName => GetDocHtmlTempApi({ sid: this.$store.state.home.item.itemNo, docxTemplateName:fileName, pageNum: 0 })));
        this.docList = result.map(v => v.data);
        let getterFiledNos = Object.keys(this.getters).filter(fieldNo => fieldNo.startsWith(`${this.item_code}/`))
        let getters = getterFiledNos.reduce((result, fieldNo) => {
            let pureFiledNo =fieldNo.replace(`${this.item_code}/`,"")
            result[pureFiledNo] = this.getters[fieldNo]
            return result
        }, {})
        console.log("替换属性:")
        console.log({ ...this.templateObj, ...getters })

        let repeat = function (arr, num) {
            return Array.from({ length: num }).map((v,i) => arr.map(n=>({pageNum:n,_repeatNo:i}))).flat();
        }

        this.docList = this.docList.map(doc => {
            if (doc.length < 1) {
                console.warn("文档页数为0");
                return;
            }
            doc.forEach(page=>{page.originHtmlContent=page.htmlContent})
            try {
                 let fn
                if(!doc[0].script || !doc[0].script.trim()){
                    fn = function(){
                        return doc.map(page=>page.pageNum)
                    }
                }else{
                    fn = eval(`(${doc[0].script})`)
                }
                
                
                let pageArray = fn(this.itemState, this.itemGetters).flat().map(v=>{
                    if(typeof v !="object"){
                        return {pageNum:v}
                    }
                    return v;
                }).map(pageInfo => {
                   
                    let page = doc.find(v => v.pageNum == pageInfo.pageNum);
                    if (!page) {
                        console.warn(`找不到pageNum：${pageInfo.pageNum}`)
                        return { htmlContent: "" };
                    }
                    page = _.cloneDeep(page)
                    try {
                        
                        let template = Handlebars.compile(page.originHtmlContent);
                       
                        page.htmlContent = template({ ...this.templateObj, ...getters ,_repeatNo: pageInfo._repeatNo})
                         
                    } catch (e) {
                        console.warn(`模板编译错误：${page.pageNum}`, e);
                        page.htmlContent = "模板错误"
                    }


                    return page
                });

                return pageArray

            } catch (e) {
                console.warn(`script错误：${doc[0].script}`, e);
                return []
            }

        });
        this.$store.commit("putDocList",this.docList);
        this.$store.commit("putAllFieldNo",this.templateObj)
    },
    methods: {
        async beforeEnter() {

        },
        async initCKEdit() {
            if (this.editor) {
               
                await this.editor.destroy();
                this.editor = null;
               
            }

            let sourceEl = Array.from(document.querySelectorAll(".x")).reduce((result, item, i) => {
                result[i] = item;
                return result
            }, {})
            if (!sourceEl || sourceEl.length === 0) {
                // this.loading = false;
                return
            }
            CKEditor
                .create(sourceEl, {
                    lineHeight: { // specify your otions in the lineHeight config object. Default values are [ 0, 0.5, 1, 1.5, 2 ]
                        options: ["0.5", "1", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6","2.7","2.8","2.9","3.0","3.1","3.2","3.3","3.4","3.5","3.6"]
                    },

                    // removePlugins: [ 'PasteFromOffice' ],
                    toolbar: {
                        items: [

                            'fontSize',
                            'fontColor',
                            'fontFamily',
                            'fontBackgroundColor',
                            'lineHeight',
                            '|',
                            'bold',
                            'italic',
                            'underline',

                            'highlight',
                            '|',
                            'alignment',
                            'indent',
                            'outdent',
                            '|',
                            'insertTable',
                            'undo',
                            'redo',
                            'horizontalLine',
                            'removeFormat'
                        ],

                    },
                    language: 'zh-cn',
                    fontFamily: {
                        options: [
                            'default',
                            '微软雅黑',
                            '仿宋',
                            '黑体',
                            '宋体',
                            "Wingdings 2"
                        ],

                    },
                    fontSize: {
                        options: [
                            10, 12, 14, 18.67, 16, 16.5, 17, 17.2, 17.5, "default", 18, 20, 22
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
                    indentBlock: {
                        classes: [
                            'custom-block-indent-1',
                            'custom-block-indent-2',
                            'custom-block-indent-3',
                            'custom-block-indent-4',
                            'custom-block-indent-5',
                            'custom-block-indent-6',
                            'custom-block-indent-7',
                            'custom-block-indent-8',
                            'custom-block-indent-10',
                            'custom-block-indent-12',
                        ]
                    },
                    shouldToolbarGroupWhenFull: false,
                    // autosave: {
                    //     save(editor) {
                    //         console.log(editor)
                    //         // return saveData(editor.getData());
                    //     }
                    // },

                    licenseKey: '',
                })
                .then(async editor => {
                    window.editor = editor;
                    this.editor = editor;
                    const toolbarContainer = this.$refs.toolbar
                    toolbarContainer.innerHTML = ''
                    toolbarContainer.appendChild(editor.ui.view.toolbar.element);
                    editor.editing.view.change(writer => {
                        let roots = writer.document.roots
                        for (let root of roots) {
                            writer.removeClass('ck-editor__editable_inline', root);
                            // writer.removeClass( 'ck-content', root );
                        }
                    });

                    // editor.data.set({ "0": this.doc[0].html })

                    // document.querySelector(".material-mask").style.display = "none";

                    // await new Promise(resolve => {
                    //     setTimeout(() => { resolve() }, 0)
                    // })

                    // this.doc.slice(1).forEach((v, i) => {
                    //     editor.data.set({ [i + 1]: v.html })
                    // })



                    this.doc.forEach((v, i) => {
                        editor.data.set({ [i]: v.htmlContent })
                    })
                    document.querySelector(".material-mask").style.display = "none";

                    editor.model.document.on('change:data', (eventInfo, batch) => {

                        window.eventInfo = eventInfo;
                        window.batch = batch;
                        batch.operations.forEach(operation => {
                            let rootName
                            if (["changeAttribute", "addAttribute", "removeAttribute"].includes(operation.type)) {
                                rootName = operation.range.start.root.rootName
                            }
                            if (operation.type == "insert") {
                                rootName = operation.position.root.rootName
                            }
                            if (operation.type == "remove") {
                                rootName = operation.sourcePosition.root.rootName
                            }
                            if (rootName) {
                                this.saveChange(rootName)
                            }
                        })

                    });


                })
                .catch(error => {
                    console.log(error);
                });
        },
        saveChange: _.debounce(function (rootName) {
            this.$set(this.doc[rootName], "html", this.editor.data.get({ rootName }))
        }, 500),
        async init() {
           
            //初始化滚动条
            let dom = document.querySelector('.container')
            dom.scrollTop = 0
            
            
            // 加载mask
            document.querySelector(".material-mask").style.display = "block";
            // 通过接口 获取 html模板 ，参数 this.htmlTemplateName
            await new Promise(resolve => {
                setTimeout(() => { resolve() }, 50)
            })
            // await this.$nextTick()
            this.initCKEdit()
        },
        goNext() {
            if (!this.isLast) {
                this.$store.commit("addDocIndex");
                return;
            }
            this.$emit('goNext')
        },
        goPrev() {
            if(this.index!=0){
                this.$store.commit("minusDocIndex");
                return;
            }
            this.$emit('goPrev')
        },
    }
}
</script>

<style scoped lang="scss">
.content {
    position: relative;

    color: #000 !important;
    overflow: hidden;
    height: 100%;
    .material-mask {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.6);
    }
    // 全文本的padding
    .text-padding {
        padding: 2.54cm 3.18cm;
    }
    //有表格的padding
    .table-padding {
        padding: 2.54cm 1.5cm;
    }
    .text {
        margin: 0 auto;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
        color: black;
    }

    .comment {
        width: 200px;
        flex-shrink: 0;
        margin-left: auto;
        border-left: 1px solid rgba(255, 255, 255, 0.5);
    }

    .x {
        width: 21cm;
        height: 29.7cm;
        margin: 10px 0;
        background-color: white;
        overflow-y: scroll;
        overflow-y: overlay;
    }

    .direction-row {
        width: 29.7cm;
        height: 21cm;
        padding: 2.54cm 1.17cm;
    }

    .ckeditor {
        overflow: hidden;
        height: 100%;
    }

    .main {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100%;

        .toolbar {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
}

.content-block {
    max-height: calc(100% - 20px);
}
.collapse-bar {
    margin-left: -12px;
    height: 16px;
    width: 21cm;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: rgb(239, 239, 239);
}
.line-btnlike {
    background: rgba(255, 245, 245, 0.78);
    border: 1px solid hsl(0, 1%, 50%);
    flex: 1 1 0%;
    height: 10px;
}

.btnlike {
    height: 10px;
    background: #fff;

    width: 80px;
    display: flex;
    justify-content: space-around;
    cursor: pointer;
    &:hover {
        background: #cac2c2;
    }
}
</style>


