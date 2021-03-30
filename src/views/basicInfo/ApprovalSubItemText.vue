<template>
    <div class="workWrap">
        <header>
            <span class="title">二级材料</span>

            <el-button type="primary" icon="el-icon-plus" @click="addText(0,tableData.length,tableData)">新增</el-button>
        </header>
        <section class="workBox">
            <div class="searchBox">
                <!-- <el-input placeholder="按情形名称查询" v-model="approvalName" clearable style="width: 200px"></el-input> -->
                <el-input placeholder="子文档名称/编号查询" v-model="subitemNameAndDocumentSubName" clearable
                    style="width: 200px;" @change="textSearch"></el-input>
                <el-button @click="textSearch">搜索</el-button>
                <!-- <el-button v-if="tableData.length < 1" type="primary" @click="addFirst">新增</el-button> -->
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%" border
                    :row-style="{height:'60px'}" :header-row-style="{height:'50px'}" tooltip-effect="dark">
                    <!-- <el-table-column type="expand">
                        <template slot-scope="scope">
                        </template>
                    </el-table-column> -->
                    <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
                    <!-- <el-table-column prop="subitemName"  label="情形名称" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-select
                                v-if="scope.row.flag"
                                v-model="scope.row.approvalSubitemId"
                                placeholder="请选择情形名称"
                                @change="subitemNameChange"
                            >
                            <el-option
                                v-for="item in approvalSubList"
                                :key="item.approvalSubitemId"
                                :label="item.subitemName"
                                :value="item.approvalSubitemId"
                            />
                            </el-select>
                            <span v-else>{{scope.row.subitemName}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="materialName" label="所属事项一级材料" width="150">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.flag" v-model="scope.row.materialId"
                                placeholder="请选择子一级材料名称" clearable filterable @change="firstMaterialChange(scope.row)">
                                <el-option v-for="item in firstMaterialOption" :key="item.materialId"
                                    :label="item.materialName" :value="item.materialId" />
                            </el-select>
                            <span v-else>{{scope.row.materialName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="globalDocumentSubName" label="公共二级材料名称" width="180">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.flag" v-model="scope.row.globalDocumentSubId"
                                placeholder="请选择子二级材料名称" clearable filterable @change="secondMaterialChange(scope.row)">
                                <el-option v-for="item in secondMaterialOption" :key="item.globalDocumentSubId"
                                    :label="item.globalDocumentSubName" :value="item.globalDocumentSubId" />
                            </el-select>
                            <span v-else>{{scope.row.globalDocumentSubName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="documentsubDisplayname" label="展示材料名称">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.flag" v-model="scope.row.documentsubDisplayname"></el-input>
                            <span v-else>{{scope.row.documentsubDisplayname}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="documentsubSeq" label="事项内子文档编码" width="100">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.flag" v-model="scope.row.documentsubSeq"></el-input>
                            <span v-else>{{scope.row.documentsubSeq}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="globalDocumentSubCode" label="公共子文档编码" width="100"></el-table-column>
                    <el-table-column prop="isRequired" label="是否必须"  width="100">

                        <template slot-scope="scope">
                            <el-select v-if="scope.row.flag" v-model="scope.row.isRequired" placeholder="请选择是否必须"
                                @change="isRequiredChange">
                                <el-option label="是" :value="Number(1)"></el-option>
                                <el-option label="否" :value="Number(0)"></el-option>
                            </el-select>
                            <span v-else-if="scope.row.isRequired == Number(1)">是</span>
                            <span v-else-if="scope.row.isRequired == Number(0)">否</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="requiredDescription" label="是否必须逻辑">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.flag" v-model="scope.row.requiredDescription"></el-input>
                            <span v-else>{{scope.row.requiredDescription}}</span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="displayNotes" label="补充说明信息">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.flag" v-model="scope.row.displayNotes"></el-input>
                            <span v-else>{{scope.row.displayNotes}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="notes" label="备注"></el-table-column> -->
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable width="160">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="160" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.flag">
                                <el-button size="mini" icon="el-icon-close"
                                    @click="closeText(scope.row,scope.$index, tableData)"></el-button>
                                <el-button size="mini" type="primary" icon="el-icon-check"
                                    @click="saveText(scope.row,scope.$index, tableData)"></el-button>
                            </div>
                            <div v-else>
                                <!-- <el-button size="mini" @click="addText(scope.row,scope.$index, tableData)" style="margin-left: 20px" icon="el-icon-plus">
                                </el-button> -->
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
                    :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next"
                    :total="totalCount"></el-pagination>
            </div>
        </section>
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import {mixin} from "@/mixin/mixin"
import Vue from "vue";
import { listMaterial, getTemplateByMaterialId, listGlobalSubAllByMaterial, getAllByApprovalItemId } from "../../api/basicInfo/material";
import { listGlobalDcumentSub, listGlobalDcumentSubByCascade } from "../../api/basicInfo/publicDocument";
import { getApprovalSub, addItemAndDocumentSub, deleItemAndDocumentSub, updateItemAndDocumentSub
} from "../../api/basicInfo/approvalSub";
// import { delete } from 'node_modules/vue/types/umd';
export default {
    name: "ApprovalSubItemText",
    mixins: [basicMixin, mixin],
    data() {
        return {
            loading: false,
            type: "ApprovalSubItemText",
            itemId: this.$route.query.itemId,
            singleWindowMaterials: [],
            subitemNameAndDocumentSubName: '',
            tableData: [],
            approvalSubList: [], // 情形列表
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


            currentPageSelect: 1,
            pageSize: 10,
            totalAim: 0,
            selectData: [],
            importDialogVisible: false,
            idd: "",

            // 一二级材料的关联添加
            firstMaterialOption: [],
            secondMaterialOption: [],
            materialId: '',
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
        await this.search();
        // await this.getApprovalList()
        // await this.getApprovalSubText()
        this.getFirstMaterialOption();
    },

    methods: {
        async getFirstMaterialOption() {
            let res = await getAllByApprovalItemId({approvalItemId: this.itemId});
            if (!res.success) return;
            this.firstMaterialOption = res.data;
        },
        async firstMaterialChange(row) {
            this.secondMaterialOption = [];
            let res = await listGlobalSubAllByMaterial({materialId: row.materialId});
            if (!res.success) return;
            this.secondMaterialOption = res.data;
            row.globalDocumentSubId = '';
        },
        async initSecond(row) {
            this.secondMaterialOption = [];
            let res = await listGlobalSubAllByMaterial({materialId: row.materialId});
            if (!res.success) return;
            this.secondMaterialOption = res.data;
        },
        secondMaterialChange(row) {
            if(row.flagAdd) {
                this.secondMaterialOption.forEach(item => {
                    if (item.globalDocumentSubId === row.globalDocumentSubId) {
                        row.documentsubDisplayname = item.globalDocumentSubName;
                        row.documentsubSeq = item.globalDocumentSubCode;
                    }
                })
            }
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
        // async getApprovalSubText() {
        //     this.approvalSubTextList = []
        //     let result = await listGlobalDcumentSubByCascade({ projectId: this.$route.query.projectId });
        //     if (!result.success) return;
        //     this.approvalSubTextList = result.data
        //     // this.totalAim = result.data.total
        // },
        //远程搜索
        // async remoteMethod(query) {
        //     this.currentPageSelect = 1;
        //     console.log(query)
        //     if (query !== '') {
        //         let result = await listGlobalDcumentSub({ globalDocumentSubNameAndCode: query, projectId: this.$route.query.projectId });
        //         this.loading = true;
        //         setTimeout(() => {
        //             this.loading = false;
        //             this.approvalSubTextList = result.data
        //             // this.totalAim = result.data.total

        //         })
        //     }
        // },
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
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            await this.search();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.search();
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
            this.secondMaterialOption = [];
            if (item == 0) {
                rows.splice(index + 1, 0, {
                    // approvalSubitemId: '',
                    // subitemName:'',
                    // globalDocumentSubId: '',
                    // isRequired:'',
                    globalDocumentSubId: null,
                    documentsubDisplayname: '',
                    documentsubSeq: '',
                    flag: true,
                    flagAdd: true,
                })
            } else {
                rows.splice(index + 1, 0, {
                    // approvalSubitemId: Number(item.approvalSubitemId),
                    // subitemName:item.subitemName,
                    // globalDocumentSubId: '',
                    // isRequired:'',
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
            let result = await deleItemAndDocumentSub({ id: item.id });
            if (!result.success) return;
            await this.search();
        },
        // 修改
        Edit(item, index, rows) {
            if(item.materialId){
                this.initSecond(item)
            }else{
                this.secondMaterialOption = [];
                item.globalDocumentSubId = '';
            }
            this.$set(item, 'flag', true)
            this.$set(item, 'edits', true)
        },

        // 保存
        async saveText(item, index, rows) {
            // console.log('item', item);
            if(!item.globalDocumentSubId || item.globalDocumentSubId === '') {
                this.$message.warning('二级材料名称不能为空');
                return;
            } 
            if(item.isRequired === undefined) {
                this.$message.warning('是否必须不能为空');
                return;
            }
            if (item.edits) {
                // delete item.edits // 删除属性会产生接口请求失败后的页面bug
                // delete item.flag
                let request = {
                    approvalItemId: Number(this.itemId),
                    globalDocumentSubId: item.globalDocumentSubId,
                    isRequired: item.isRequired,
                    id: item.id,
                    requiredDescription: item.requiredDescription,
                    documentsubDisplayname: item.documentsubDisplayname.trim(),
                    displayNotes: item.displayNotes,
                    documentsubSeq: item.documentsubSeq.trim(),
                    materialId: item.materialId
                }
                const result = await updateItemAndDocumentSub(request)
                console.log(result, 'result')
            } else {
                // delete item.flag
                let request = {
                    approvalItemId: Number(this.itemId),
                    globalDocumentSubId: item.globalDocumentSubId,
                    isRequired: item.isRequired,
                    requiredDescription: item.requiredDescription,
                    documentsubDisplayname: item.documentsubDisplayname.trim(),
                    displayNotes: item.displayNotes,
                    documentsubSeq: item.documentsubSeq.trim(),
                    materialId: item.materialId
                }
                const res = await addItemAndDocumentSub(request)
                console.log(res, 'res')
            }

            await this.search();
        },
        // 取消
        async closeText(item, index, rows) {
            if (item.edits) {
                this.$set(item, 'flag', null);
                await this.search();
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
