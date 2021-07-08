<template>
    <div class="setting-box">
        <div class="searchBox">
            <el-input placeholder="按字段名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
            </el-input>
            <el-button @click="search">搜索</el-button>
            <el-button @click="load">Load</el-button>
            <el-button @click="save">Save</el-button>
        </div>
        <div class="workBox">
            <div class="app-container handsontable-container">
                <el-switch v-model="autoSave" active-color="#13ce66" inactive-color="#ff4949" @change="autoChange">
                </el-switch>
                <span style="margin-left: 20px">{{exampleConsole}}</span>
                <div id="tableField" />
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next" :total="totalCount"></el-pagination>
            </div>
        </div>
    </div>
</template>


<script>
import Handsontable from 'handsontable'
import axios from 'axios'
import {
    listFieldConfig, updateFieldConfig
} from "@/api/questionnaire/questionConfig.js"
export default {
    name: 'HandsontableField',
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
            exampleConsole: 'Click "Load" to load data from server',
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
                this.exampleConsole = 'Load error';
                return
            }
            this.tableDataField = res.data.records
            this.totalCount = res.data.total
            this.setHotTable()
            this.hot.loadData(this.tableDataField);
            this.exampleConsole = 'Data loaded';
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
                }
                return objData
            });
            console.log('changedData')
            console.log(changedData)
            let res = await updateFieldConfig(changedData);
            if (!res.success) {
                this.$message.warning('保存配置数据失败')
                this.exampleConsole = 'Save error';
                return
            } else {
                this.exampleConsole = 'Data saved';
            }
        },
        autoChange() {
            if (this.autoSave) {
                this.exampleConsole = 'Changes will be autosaved';
            } else {
                this.exampleConsole = 'Changes will not be autosaved';
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
                // dataSchema: {
                //     a: null,
                //     b: null,
                //     c: null,
                //     d: null,
                //     e: null,
                //     f: null
                // },
                colHeaders: ['字段id(read-only)', '所属材料名一级拼二级', '字段名', '是否清楚字段是否必填',
                    '是否清楚字段含义', '字段值来源', '前端字段输入类型', '是否清楚校验规则', '是否清楚可以勾选多个',
                    '是否清楚下拉枚举值', '已知的枚举值(英文,隔开)', '是否清楚可以选择多个', '相关图片(read-only)'],
                columns: [
                    {
                        data: 'fieldId',
                        type: 'numeric',
                        editor: false
                    },
                    {
                        data: 'materialName'
                    },
                    {
                        data: 'fieldName'
                    },
                    {
                        data: 'qnrIsRequired',
                        type: 'checkbox',
                        // checkedTemplate: 1,
                        // uncheckedTemplate: 0
                    },
                    {
                        data: 'qnrFieldMeaning',
                        type: 'checkbox'
                    },
                    {
                        data: 'valueSource',
                        editor: 'select',
                        selectOptions: ['企业数据', '默认值', '系统日期', '前端字段']
                    },
                    {
                        data: 'qnrComponentType',
                        editor: 'select',
                        selectOptions: ['勾选', '下拉选择', '日期范围', '文本输入框', '否']
                    },
                    {
                        data: 'qnrFrontValidation',
                        type: 'checkbox'
                    },
                    {
                        data: 'qnrCheckMultiple',
                        type: 'checkbox'
                    },
                    {
                        data: 'qnrOptionsValue',
                        type: 'checkbox'
                    },
                    {
                        data: 'qnrOptionsValueDetail',
                    },
                    {
                        data: 'qnrSelectMultiple',
                        type: 'checkbox'
                    },
                    {
                        data: 'fieldQnrPics',
                    },
                ],
                afterChange: (change, source) => {
                    if (source === 'loadData') {
                        return; //don't save this change
                    }
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
    margin-top: 20px;
    box-sizing: border-box;
    .sampleTable {
        margin: 20px;
    }
}
</style>