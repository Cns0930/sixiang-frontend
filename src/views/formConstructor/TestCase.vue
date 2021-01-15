<template>
    <div class="workWrap">
        <!-- <header>
            <span class="title">情形子文档</span>
            <el-button type="primary" icon="el-icon-plus" @click="addText(0,tableData.length,tableData)">新增</el-button>
        </header> -->
        <section class="workBox">
            <div class="searchBox">
                <!-- <el-input placeholder="情形名称或子文档名称查询" v-model="subitemNameAndDocumentSubName" clearable style="width: 200px;"
                @keyup.native.enter="search"></el-input>
                <el-button @click="textSearch()">搜索</el-button> -->
                <el-select v-model="approvalSubList" multiple collapse-tags style="width: 300px;"
                    placeholder="请选择情形名称">
                    <el-option v-for="item in approvalSubOptions" :key="item.approvalSubitemId" :label="item.subitemName"
                        :value="item.approvalSubitemId">
                    </el-option>
                </el-select>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%" border
                    :row-style="{height:'60px'}" :header-row-style="{height:'50px'}" tooltip-effect="dark"
                    :default-sort="{ prop: 'createTime', order: 'descending' }">
                    <el-table-column label="序号" type="index" width="70" :index="indexMethod"></el-table-column>
                    <el-table-column prop="subitemName" label="情形名称" width="200" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <el-select v-if="scope.row.flag" v-model="scope.row.approvalSubitemId" placeholder="请选择情形名称"
                                @change="subitemNameChange">
                                <el-option v-for="item in approvalSubList" :key="item.approvalSubitemId"
                                    :label="item.subitemName" :value="item.approvalSubitemId" />
                            </el-select>
                            <span v-else>{{scope.row.subitemName}}</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="globalDocumentSubName" label="需求界面图">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.flag" v-model="scope.row.globalDocumentSubId"
                                placeholder="请选择子文档名称" clearable filterable remote reserve-keyword
                                :remote-method="remoteMethod" :loading="loading" @change="globalDocumentSubNameChange">
                                <el-option v-for="item in approvalSubTextList" :key="item.globalDocumentSubId"
                                    :label="item.globalDocumentSubName" :value="item.globalDocumentSubId" />
                                <div class="text-center"
                                    style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                    <a class="text-normal">
                                        <el-pagination @size-change="handleSizeChangeSelect"
                                            @current-change="handleCurrentChangeSelect"
                                            :current-page="currentPageSelect" :total="totalAim" :page-size="pageSize"
                                            layout="prev, pager, next" />
                                    </a>
                                </div>
                            </el-select>
                            <span v-else>{{scope.row.globalDocumentSubName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="isRequired" label="是否必须" width="200">

                        <template slot-scope="scope">
                            <el-select v-if="scope.row.flag" v-model="scope.row.isRequired" placeholder="请选择是否必须"
                                @change="isRequiredChange">
                                <el-option label="是" :value="Number(1)"></el-option>
                                <el-option label="否" :value="Number(0)"></el-option>
                            </el-select>
                            <span v-else>{{scope.row.isRequired == Number(1)? '是':'否'}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="notes" label="备注"></el-table-column> -->
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable width="240">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="240" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.flag">
                                <el-button size="mini" icon="el-icon-close"
                                    @click="closeText(scope.row,scope.$index, tableData)"></el-button>
                                <el-button size="mini" type="primary" icon="el-icon-check"
                                    @click="saveText(scope.row,scope.$index, tableData)"></el-button>
                            </div>
                            <div v-else>
                                <el-button size="mini" @click="addText(scope.row,scope.$index, tableData)"
                                    style="margin-left: 20px" icon="el-icon-plus">
                                </el-button>
                                <el-button size="mini" type="danger"
                                    @click="handleDelete(scope.row,scope.$index, tableData)" icon="el-icon-minus">
                                </el-button>
                                <el-button size="mini" type="primary" @click="Edit(scope.row,scope.$index, tableData)"
                                    icon="el-icon-edit"></el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount"></el-pagination>
            </div>
        </section>
    </div>
</template>



<script>
import { mixin } from "@/mixin/mixin";
import Vue from "vue";

import { listApprovalSubAll } from "../../api/basicInfo/approvalSub";
import { listTestcase } from "../../api/basicInfo/testcase"

import { listMaterial, getTemplateByMaterialId, copySelectedMaterial, getAllByApprovalItemId } from "../../api/basicInfo/material";
import { listGlobalDcumentSub } from "../../api/basicInfo/publicDocument";
import { listSubitemAndDocumentNew, getApprovalSub, addSubitemAndDocumentNew, deleteSubitemAndDocumentNew, updateSubitemAndDocumentNew } from "../../api/basicInfo/approvalSub";
// import { delete } from 'node_modules/vue/types/umd';
export default {
    name: "ApprovalSubItemText",
    mixins: [mixin],
    data() {
        return {
            // 搜索相关
            approvalSubList: [], // 情形列表
            approvalSubOptions: [],

            // 分页相关
            currentPageSelect: 1,
            pageSize: 10,
            totalAim: 0,

            loading: false,
            type: "ApprovalSubItemText",
            itemId: this.$route.query.itemId,
            singleWindowMaterials: [],
            subitemNameAndDocumentSubName: '',
            tableData: [],

            approvalSubTextList: [], // 子文档列表
            addDialogVisible: false,
            editDialogVisible: false,
            documentAdd: {
            },
            documentEdit: {
            },
            // 可删


            materialInit: {
                documentSeq: '',
            },


            
            selectData: [],
            importDialogVisible: false,
            idd: "",
        };
    },
    computed: {},
    watch: {
        tableData(val) {
        },
    },

    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();

        // 获取情形选择框
        await this.getApprovalSubOptions();

        // 获取测试用例列表
        await this.getTestcaseList();
 

        // await this.search();
        // await this.getApprovalList()
        // await this.getApprovalSubText()
    },

    methods: {
        // 获取情形选择框
        async getApprovalSubOptions() {
            let result = await listApprovalSubAll({ approvalItemId: this.$route.query.itemId })
            this.approvalSubOptions = result.data; 
        },

        // 获取测试用例列表
        async getTestcaseList() {
            let request = {
                approvalItemId: this.$route.query.itemId,
                approvalSubitemIdlist: this.approvalSubList,
                pageNum: this.currentPageSelect,
                pageSize: this.pageSize,
            }
            let result = await listTestcase(request);
            if (!result.success) return;
            this.tableData = result.data.records;
        },




        subitemNameChange(v) {
            console.log(v)
        },
        globalDocumentSubNameChange(v) {
            console.log(v)
        },
        isRequiredChange(v) {
            console.log(v)
        },
        async getList() {
            let result = await listSubitemAndDocumentNew();
            console.log(result)
            if (!result.success) return;
            this.tableData = result.data.records
        },
        getTime(val) {
            console.log(val);
        },
        // 搜索
        async textSearch() {
            await this.search()
        },
        // // 列表无数据时新增
        // addFirst() {
        //     this.tableData.push({
        //         approvalSubitemId: '',
        //         subitemName:'',
        //         globalDocumentSubId: '',
        //         isRequired:'',
        //         flag:true
        //     }); 
        // },
        // 情形列表
        async getApprovalList() {
            this.approvalSubList = []
            let result = await getApprovalSub({ approvalItemId: this.$route.query.itemId });
            console.log(result)
            if (!result.success) return;
            result.data.records.forEach(ele => {
                this.approvalSubList.push(ele.approvalSubitem)
            })

        },
        // 子文档列表
        async getApprovalSubText() {
            this.approvalSubTextList = []
            let result = await listGlobalDcumentSub({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.$route.query.projectId });
            if (!result.success) return;
            this.approvalSubTextList = result.data.records
            this.totalAim = result.data.total
        },
        //远程搜索
        async remoteMethod(query) {
            console.log(query)
            if (query !== '') {
                let result = await listGlobalDcumentSub({ globalDocumentSubNameAndCode: query, pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.$route.query.projectId });
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.approvalSubTextList = result.data.records
                    this.totalAim = result.data.total

                })
            }
        },
        //下拉框带分页
        async handleSizeChangeSelect(size) {
            console.log(size)
            this.pageSize = size;
            await this.getApprovalSubText()
        },
        async handleCurrentChangeSelect(current) {
            console.log(current)
            this.currentPageSelect = current;
            await this.getApprovalSubText()
        },
        // handleSelectionChange(val) {
        //     this.multipleSelection = val;
        // },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: val,
                approvalItemId: this.$route.query.itemId,
            });
            this.tableData = result.data.records;
        },
        async handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: val,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
            });
            this.tableData = result.data.records;
        },
        documentVisible(item) {
            this.documentAdd = item;
            this.addDialogVisible = true;
        },
        async EditdocumentVisible(item) {
            let id = item.documentId;
            item = await getByDocumentId({ documentId: id });
            if (!item.success) return;
            item = item.data;
            this.documentEdit = item;
            console.log('this.documentEdit');
            console.log(this.documentEdit);
            this.editDialogVisible = true;
        },
        // 新增
        async addText(item, index, rows) {
            console.log(item, index, rows)
            if (item == 0) {
                rows.splice(index + 1, 0, {
                    approvalSubitemId: '',
                    subitemName: '',
                    globalDocumentSubId: '',
                    isRequired: '',
                    flag: true
                })
            } else {
                rows.splice(index + 1, 0, {
                    approvalSubitemId: Number(item.approvalSubitemId),
                    subitemName: item.subitemName,
                    globalDocumentSubId: '',
                    isRequired: '',
                    flag: true
                });
            }

        },
        // 删除
        async handleDelete(item, index, rows) {
            console.log(item, index, rows)
            try {
                await this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await deleteSubitemAndDocumentNew({ SubitemAndDocumentNewId: item.id });
            if (!result.success) return;
            await this.search();
        },
        // 修改
        Edit(item, index, rows) {
            this.$set(item, 'flag', true)
            this.$set(item, 'edits', true)
        },

        // 保存
        async saveText(item, index, rows) {
            if (item.edits) {
                delete item.edits
                delete item.flag
                const result = await updateSubitemAndDocumentNew(item)
                console.log(result, 'result')
            } else {
                delete item.flag
                const res = await addSubitemAndDocumentNew(item)
                console.log(res, 'res')
            }

            await this.search();
        },
        // 取消
        closeText(item, index, rows) {
            console.log(item, index, rows, '0000')
            if (item.edits) {
                this.$set(item, 'flag', null)
            } else {
                rows.splice(index, 1)
            }

        },
        //增加文档
        async addDocumentButton() {
            this.documentAdd["approvalItemId"] = this.$route.query.itemId;
            console.log("this.documentAdd ", this.documentAdd);
            const res = await addDocument(this.documentAdd);
            if (!res.success) return;
            this.$message.success('保存成功');
            this.addDialogVisible = false;
            await this.search();
        },

        // 编辑文档
        async editDocument() {
            let res = await updateDocument(this.documentEdit);
            if (!res.success) return;
            this.$message.success('编辑成功');
            this.editDialogVisible = false;
            // this.materialT_item_id = '';
            await this.search();
        },
        // 删除
        async handleDeleteMaterial(v) {
            let param = {
                documentId: v.documentId
            };
            let id = v.documentId;
            console.log('param');
            console.log(param);
            try {
                await this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await delDocument(param);
            if (!result.success) return;
            await this.search();
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
        .title {
            // font-size: 20px;
            margin-right: 20px;
        }
    }
    .workBox {
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
    }
    .searchBox {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background: #fff;
        & > * {
            margin-left: 10px;
        }
    }
    .handle {
        // display: flex;
        // flex-direction: row;
        // justify-content: right;
        // align-items: center;
        margin: 0 70px 15px auto;
        float: right;
    }
    .tableWrap {
        margin-top: 16px;
        margin-left: 10px;
        width: calc(100% - 10px);
        overflow: hidden;
        .workTable {
            width: 100%;
        }
    }
}
</style>
