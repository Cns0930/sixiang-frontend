<template>
    <div class="setting-box">
        <div class="searchBox">
            <el-input placeholder="按字段名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
            </el-input>
            <el-button @click="search">搜索</el-button>
            <el-button @click="load">载入数据</el-button>
            <el-button @click="save">保存数据</el-button>
            <el-button @click="uploadImg">配置上传图片</el-button>
            <div style="margin-left: 15%">
                <span>提示：</span><br />
                <span>1. "已知的枚举值" 请务必用英文逗号隔开</span><br />
                <span>2. "是否确认签字盖章的对象" 如果不清楚，请向你的上级确认，请勿随便选答案</span>
            </div>
        </div>
        <div class="workBox">
            <div class="app-container handsontable-container">
                <el-switch v-model="autoSave" active-color="#13ce66" inactive-color="#ff4949" @change="autoChange">
                </el-switch>
                <span style="margin-left: 20px">{{exampleConsole}}</span>
                <!-- handsontable -->
                <div id="tableField" />
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="totalCount"></el-pagination>
            </div>
        </div>
        <!-- 配置图片的弹框 -->
        <ImgFieldSettingDialog ref="imgSetting" />
    </div>
</template>


<script>
import Handsontable from 'handsontable'
import axios from 'axios'
import VueCompositionAPI from '@vue/composition-api'
import { ref } from "@vue/composition-api";
import ImgFieldSettingDialog from "./ImgFieldSettingDialog.vue"
// 接口
import {
    listFieldConfig, updateFieldConfig, listFieldConfigNoPage
} from "@/api/questionnaire/questionConfig.js"
export default {
    name: 'HandsontableField',
    components: { ImgFieldSettingDialog },
    setup() {
        const imgSetting = ref(null);
        return {
            imgSetting,
        }
    },
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            // 搜索区域
            serchType: '',
            keyWord: '',
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            tableDataField: [],
            // handsontable
            hot: null,
            exampleConsole: '点击载入以加载数据',
            autoSave: false,
        }
    },
    async created() {
        await this.getFieldSettingList();
    },
    mounted() {
    },
    methods: {
        // 分页
        async handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.currentPage = 1;
            await this.getFieldSettingList();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.getFieldSettingList();
        },
        // 搜索
        search() {
            this.currentPage = 1;
            this.getFieldSettingList();
        },

        async getFieldSettingList() {
            let params = {
                approvalItemId: this.itemId,
                keyword: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            let res = await listFieldConfig(params);
            if (!res.success) {
                this.$message.warning('加载配置数据失败')
                this.exampleConsole = '加载配置数据失败';
                return
            }
            this.tableDataField = res.data.records
            this.tableDataField.forEach(item => {
                item.pictureHtml = ''
                item.fieldQnrPics.forEach(pic => {
                    item.pictureHtml += `<img src="${pic.picUrl}" height="100" width="100"  alt="配置预览图" />`
                })
            })
            this.totalCount = res.data.total
            this.setHotTable()
            this.hot.loadData(this.tableDataField);
            this.exampleConsole = '数据已加载，实时保存未开启';
        },
        // load
        load() {
            this.getFieldSettingList();
        },
        // save
        async save() {
            let saveData = this.hot.getData();
            console.log('saveData')
            console.log(saveData)
            let changedData = saveData.map(item => {
                let objData = {
                    fieldId: item[0],
                    materialName: item[1],
                    fieldName: item[2],
                    qnrIsRequired: item[3],
                    qnrFieldMeaning: item[4],
                    valueSource: item[5],
                    qnrComponentType: item[6],
                    qnrFrontValidation: item[7],
                    qnrCheckMultiple: item[8],
                    qnrOptionsValue: item[9],
                    qnrOptionsValueDetail: item[10],
                    qnrSelectMultiple: item[11],
                    qnrSignatureSubject: item[12]
                }
                return objData
            });
            console.log('changedData')
            console.log(changedData)
            let res = await updateFieldConfig(changedData);
            if (!res.success) {
                this.$message.warning('保存配置数据失败')
                this.exampleConsole = '保存失败';
                return
            } else {
                this.exampleConsole = '数据保存成功';
                this.$emit('changeFieldBackConfirm', false)
            }
        },
        // 配置图片
        async uploadImg() {
            this.imgSetting && this.imgSetting.openDialog();
            this.imgSetting.dialogType = 'field';
            // 获取下拉选项
            let res = await listFieldConfigNoPage({ approvalItemId: this.itemId })
            if (res.success) {
                this.imgSetting.settingOptions = res.data
            }
        },
        autoChange() {
            if (this.autoSave) {
                this.exampleConsole = '实时保存已开启';
            } else {
                this.exampleConsole = '实时保存未开启，请注意及时保存数据';
            }
        },
        // 自动保存
        autoChangeSave(change) {
            this.exampleConsole = 'Autosaving (' + change.length + ' ' + 'cell' + (change.length > 1 ? 's' : '') + ')';
            this.save();
        },
        // 渲染
        setHotTable() {
            this.hot = new Handsontable(document.getElementById('tableField'), {
                width: '100%',
                height: 500,
                stretchH: 'all',
                className: 'htCenter',
                // rowHeaders: true,
                data: [],
                manualColumnResize: true,
                colWidths: [20],
                colHeaders: true,
                // columnHeaderHeight: 200,
                // dataSchema: {
                //     a: null,
                //     b: null,
                //     c: null,
                //     d: null,
                //     e: null,
                //     f: null
                // },
                colHeaders: ['字段id(read-only)', '所属二级材料名', '字段名', '是否清楚字段是否必填',
                    '是否清楚字段含义', '字段值来源', '前端字段输入类型', '是否清楚校验规则', '是否清楚可以勾选多个',
                    '是否清楚下拉枚举值', '已知的枚举值(英文,隔开)', '是否清楚可以选择多个', '是否确认签字盖章的对象', '相关图片(read-only)'],
                columns: [
                    {
                        data: 'fieldId',
                        type: 'numeric',
                        editor: false,
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'documentsubDisplayname',
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'fieldName',
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrIsRequired',
                        editor: 'select',
                        selectOptions: ['是', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrFieldMeaning',
                        editor: 'select',
                        selectOptions: ['是', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'valueSource',
                        editor: 'select',
                        selectOptions: ['企业数据', '默认值', '系统日期', '前端字段', '签字盖章'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrComponentType',
                        editor: 'select',
                        selectOptions: ['勾选', '下拉选择', '日期范围', '文本输入框', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrFrontValidation',
                        editor: 'select',
                        selectOptions: ['是', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrCheckMultiple',
                        editor: 'select',
                        selectOptions: ['是', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrOptionsValue',
                        editor: 'select',
                        selectOptions: ['是', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrOptionsValueDetail',
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrSelectMultiple',
                        editor: 'select',
                        selectOptions: ['是', '否'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'qnrSignatureSubject',
                        editor: 'select',
                        selectOptions: ['个人', '企业', '企业+个人'],
                        className: "htCenter htMiddle"
                    },
                    {
                        data: 'pictureHtml',
                        renderer: "html",
                        editor: false,
                        className: "htCenter htMiddle"
                    },
                ],
                afterChange: (change, source) => {
                    if (source === 'loadData') {
                        return; //don't save this change
                    }
                    this.$emit('changeFieldBackConfirm', true)
                    if (!this.autoSave) {
                        return;
                    }
                    this.autoChangeSave(change)
                    // clearTimeout(autosaveNotification);
                    // ajax('scripts/json/save.json', 'GET', JSON.stringify({ data: change }), function (data) {
                    //     this.exampleConsole = 'Autosaved (' + change.length + ' ' + 'cell' + (change.length > 1 ? 's' : '') + ')';
                    //     autosaveNotification = setTimeout(function () {
                    //         this.exampleConsole = 'Changes will be autosaved';
                    //     }, 500);
                    // });
                },
                // contextMenu: {
                //     items: {
                //         row_above: {
                //             name: '上方插入一行'
                //         },
                //         row_below: {
                //             name: '下方插入一行'
                //         },
                //         remove_row: {
                //             name: '删除行'
                //         }
                //     }
                // },
                licenseKey: 'non-commercial-and-evaluation',
            })
        }
    }
}
</script>
<style>

</style>
<style src="../../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style scoped lang="scss">
@import "../../../assets/css/global.scss";
.searchBox {
    margin-left: 20px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
}
.workBox {
    width: 100%;
    height: calc(100% - 50px);
    padding: 6px 12px 12px 12px;
    margin-top: 10px;
    box-sizing: border-box;
    .sampleTable {
        margin: 20px;
    }
}
</style>