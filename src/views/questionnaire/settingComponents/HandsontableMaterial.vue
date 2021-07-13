<template>
    <div class="setting-box">
        <div class="searchBox">
            <el-input placeholder="按材料名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
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
                <div id="tableMaterial" />
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
    listMaterialConfig, updateMaterialConfig
} from "@/api/questionnaire/questionConfig.js"
export default {
    name: 'HandsontableMaterial',
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
            tableDataMaterial: [],
            // handsontable
            hot: null,
            exampleConsole: 'Click "Load" to load data from server',
            autoSave: false,
        }
    },
    async created() {
        await this.getMaterialSettingList();
    },
    mounted() {
    },
    methods: {
        // 分页
        async handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.currentPage = 1;
            await this.getMaterialSettingList();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.getMaterialSettingList();
        },
        // 搜索
        search() {
            this.currentPage = 1;
            this.getMaterialSettingList();
        },

        async getMaterialSettingList() {
            let params = {
                approvalItemId: this.itemId,
                keyword: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            let res = await listMaterialConfig(params);
            if (!res.success) {
                this.$message.warning('加载配置数据失败')
                this.exampleConsole = 'Load error';
                return
            }
            this.tableDataMaterial = res.data.records
            this.totalCount = res.data.total
            // this.tableDataMaterial.push({
            //     materialId: 666,
            //     materialName: '测试图片显示',
            //     qnrIsRequired: true,
            //     qnrProduceSource: true,
            //     ssMaterialQnrPic: `<img src="https://handsontable.com/docs/images/examples/professional-javascript-developers-nicholas-zakas.jpg"  alt="上海鲜花港 - 郁金香" />`,
            // })
            // this.tableDataMaterial.push({
            //     materialId: 666,
            //     materialName: '测试图片显示',
            //     qnrIsRequired: true,
            //     qnrProduceSource: true,
            //     ssMaterialQnrPic: `<img src="https://handsontable.com/docs/images/examples/professional-javascript-developers-nicholas-zakas.jpg"  alt="上海鲜花港 - 郁金香" />`,
            // })
            console.log('this.tableDataMaterial')
            console.log(this.tableDataMaterial)
            this.setHotTable()
            this.hot.loadData(this.tableDataMaterial);
            this.exampleConsole = 'Data loaded';
        },
        // load
        load() {
            this.getMaterialSettingList();
        },
        // save
        async save() {
            let saveData = this.hot.getData();
            console.log('saveData')
            console.log(saveData)
            let changedData = saveData.map(item => {
                let objData = {
                    materialId: item[0],
                    materialName: item[1],
                    qnrIsRequired: item[2],
                    qnrProduceSource: item[3]
                }
                return objData
            });
            console.log('changedData')
            console.log(changedData)
            let res = await updateMaterialConfig(changedData);
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
            this.hot = new Handsontable(document.getElementById('tableMaterial'), {
                width: '100%',
                height: 500,
                stretchH: 'all',
                className: 'htCenter',
                // rowHeaders: true,
                data: [],
                manualColumnResize: true,
                colWidths: [20,,20,20],
                colHeaders: true,
                // dataSchema: {
                //     a: null,
                //     b: null,
                //     c: null,
                //     d: null,
                //     e: null,
                //     f: null
                // },
                colHeaders: ['材料id(read-only)', '材料名', '是否清楚材料是否必须上传', '是否清楚产生方式', '相关图片(read-only)'],
                columns: [
                    {
                        data: 'materialId',
                        type: 'numeric',
                        editor: false
                    },
                    {
                        data: 'materialName'
                    },
                    {
                        data: 'qnrIsRequired',
                        type: 'checkbox',
                        // checkedTemplate: 1,
                        // uncheckedTemplate: 0
                    },
                    {
                        data: 'qnrProduceSource',
                        type: 'checkbox'
                    },
                    {
                        data: 'ssMaterialQnrPic',
                        renderer: "html",
                        editor: false
                    }
                ],
                afterChange: (change, source) => {
                    console.log('change cell')
                    console.log(change)
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