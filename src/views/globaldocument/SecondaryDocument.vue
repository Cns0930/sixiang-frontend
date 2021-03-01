<template>
    <div class="workWrap">
        <header>全局二级文档
        </header>
        <section class="workBox">
            <div class="searchBox">
                <!-- <el-select placeholder="筛选大项" v-model="filterApprovalId" filterable clearable style="width: 200px;">
                    <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName" :value="v.approvalId">
                    </el-option>
                </el-select> -->
                <el-input placeholder="搜索二级文档" v-model="filterKeyword" clearable style="width: 200px;"
                    @change="searchItem">
                </el-input>
                <el-button @click="searchItem">搜索</el-button>
                <div class="handle">
                    <el-button type="primary" @click="handleClickAdd">新增</el-button>
                </div>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    tooltip-effect="dark">
                    <el-table-column label="二级文档名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="handleClickItemDefault(scope.row)" type="text" style="color: orange;">
                                {{scope.row.catalogDocumentSubName}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="catalogDocumentSubNotes" label="备注" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button size="mini" @click="handleShowPoint(scope.$index, scope.row)">
                                    查看信息点
                                </el-button>
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
                                    编辑
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleClose(scope.row)">
                                    删除
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pagesize" @size-change="handleSizeChange"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
                </el-pagination>
            </div>
        </section>

        <section class="dialogBox">
            <!-- 新建窗口 -->
            <el-dialog title="二级文档新增" :visible.sync="dialogAddVisible" width="40%" :close-on-click-modal="false"
                :show-close='false'>
                <div class="attribute-content">
                    <el-form :model='tempItem' ref="tempItem" :inline="false" label-position="left"
                        class="demo-form-inline" :rules="rules">
                        <el-form-item label="二级文档名称" prop="catalogDocumentSubName">
                            <el-input v-model="tempItem.catalogDocumentSubName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="catalogDocumentSubNotes">
                            <el-input v-model="tempItem.catalogDocumentSubNotes">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm">
                        取消
                    </el-button>
                    <el-button type="primary" @click="saveItem">
                        确定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑窗口 -->
            <el-dialog title="二级文档编辑" :visible.sync="dialogUpdateVisible" width="40%" :close-on-click-modal="false">
                <div class="attribute-content">
                    <el-form :model='tempItem' ref="tempItem" :rules="rules" :inline="false" label-position="left"
                        class="demo-form-inline">
                        <el-form-item label="二级文档名称" prop="catalogDocumentSubName">
                            <el-input v-model="tempItem.catalogDocumentSubName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="catalogDocumentSubNotes">
                            <el-input v-model="tempItem.catalogDocumentSubNotes">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUpdateVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="updateItem">
                        确定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 信息点列表窗口 -->
            <el-dialog title="信息点" :visible.sync="dialogPointVisible" width="80%" :close-on-click-modal="false">
                <div class="tableWrap">
                    <el-button type="primary" @click="handleClickAddPoint" style="margin-bottom: 10px">新增信息点</el-button>
                    <el-table class="workTable" :data="tableDataPoint" style="width: 100%;" border
                        tooltip-effect="dark">
                        <el-table-column prop="catalogPointName" label="信息点名称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="300">
                            <template slot-scope="scope">
                                <el-button-group>
                                    <el-button size="mini" @click="handleEditPoint(scope.$index, scope.row)">
                                        编辑
                                    </el-button>
                                    <el-button size="mini" type="danger" @click="handleClosePoint(scope.row)">
                                        删除
                                    </el-button>
                                </el-button-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="tablePagination">
                    <el-pagination @current-change="handleCurrentChangePoint" :current-page.sync="currentPagePoint"
                        :page-size="pagesizePoint" @size-change="handleSizeChangePoint"
                        layout="total, sizes, prev, pager, next, jumper" :total="totalCountPoint">
                    </el-pagination>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogPointVisible = false">
                        关闭
                    </el-button>
                </span>
            </el-dialog>

            <!-- 信息点新增窗口 -->
            <el-dialog title="信息点新增" :visible.sync="dialogPointAdd" width="40%" :close-on-click-modal="false"
                :show-close='false'>
                <div class="attribute-content">
                    <el-form :model='tempItemPoint' ref="tempItemPoint" :inline="false" label-position="left"
                        class="demo-form-inline">
                        <el-form-item label="信息点名称" prop="catalogPointName">
                            <el-input v-model="tempItemPoint.catalogPointName">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetFormPoint">
                        取消
                    </el-button>
                    <el-button type="primary" @click="saveItemPoint">
                        确定
                    </el-button>
                </span>
            </el-dialog>
            <!-- 信息点编辑窗口 -->
            <el-dialog title="信息点编辑" :visible.sync="dialogPointEdit" width="40%" :close-on-click-modal="false">
                <div class="attribute-content">
                    <el-form :model='tempItemPoint' ref="tempItemPoint" :inline="false" label-position="left"
                        class="demo-form-inline">
                        <el-form-item label="信息点名称" prop="catalogPointName">
                            <el-input v-model="tempItemPoint.catalogPointName">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogPointEdit = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="updateItemPoint">
                        确定
                    </el-button>
                </span>
            </el-dialog>
        </section>
    </div>
</template>



<script>

import { mixin } from "@/mixin/mixin"
import Vue from "vue";
import _ from "lodash"

import { mapGetters } from "vuex"

import {
    listCatalogDocumentSubPage,
    addCatalogDocumentSub,
    deleteCatalogDocumentSub,
    updateCatalogDocumentSub
} from "@/api/basicInfo/catalogDocumentSub";

import {
    listCatalogPointById,
    addCatalogPoint,
    updateCatalogPoint,
    deleteCatalogPoint,
} from "@/api/basicInfo/catalogPoint";

export default {
    name: "ApprovalItem",
    mixins: [mixin],
    data() {
        return {
            // 页面信息
            // 筛选
            filterKeyword: "",
            // 表格
            tableData: [],
            // 弹窗
            dialogAddVisible: false,
            dialogUpdateVisible: false,
            tempItem: {},
            currentPage: 1,
            pagesize: 10,
            totalCount: 0,
            rules: {
                catalogDocumentSubName: [
                    { required: true, message: '请输入二级文档名称', trigger: 'blur' }
                ]
            },
            // 信息点
            dialogPointVisible: false,
            tableDataPoint: [],
            dialogPointAdd: false,
            dialogPointEdit: false,
            tempItemPoint: {},
            currentPagePoint: 1,
            pagesizePoint: 10,
            totalCountPoint: 0,
            currentCatalogDocumentSubId: null,
        };
    },
    computed: {
        // ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        // 获取项目信息
        await this.searchItem();
        await this.loadOptions();
        this.resetItemInfo();
    },
    methods: {
        resetItemInfo() {
            let itemInfo = this.$store.state.home.item;
            itemInfo.approvalItemId = null;
            itemInfo.itemName = null;
            itemInfo.itemNo = null;
            this.$store.commit("changeItem", itemInfo);
            sessionStorage.removeItem('itemInfo');
        },
        async handleEdit(index, row) {
            this.tempItem = _.cloneDeep(row);
            this.dialogUpdateVisible = true;
        },
        async handleClickAdd() {
            this.dialogAddVisible = true;
        },
        //新增取消
        resetForm() {
            this.dialogAddVisible = false
            this.$refs.tempItem.resetFields();
        },
        // 新增保存
        async saveItem() {
            this.$refs.tempItem.validate(async (valid) => {
                if (valid) {
                    let res = await addCatalogDocumentSub(this.tempItem);
                    if (res.success) {
                        this.$message.success("新增二级文档成功!");
                        this.tempItem = {};
                        this.dialogAddVisible = false;
                        this.list();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async updateItem() {
            this.$refs.tempItem.validate(async (valid) => {
                if (valid) {
                    let res = await updateCatalogDocumentSub(this.tempItem);
                    if (res.success) {
                        this.$message.success("修改成功!");
                        this.tempItem = {};
                        this.dialogUpdateVisible = false;
                        await this.list();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async loadOptions() {

        },
        async searchItem() {
            this.currentPage = 1;
            await this.list();
        },
        async handleClose(item) {
            try {
                await this.$confirm("是否删除二级文档", "确认删除",);
                let result = await deleteCatalogDocumentSub({ id: item.catalogDocumentSubId });
                if (!result.success) return;
                await this.list();
                this.$message({ type: "success", message: "删除成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消删除" })
            }
        },
        async handleCurrentChange() {
            this.list();
        },
        handleSizeChange(val) {
            this.pagesize = val;
            this.currentPage = 1;
            this.list();
        },
        async list() {
            let params = {
                catalogDocumentSubName: this.filterKeyword,
                pageSize: this.pagesize,
                pageNum: this.currentPage,
            }
            let result = await listCatalogDocumentSubPage(params);
            if (!result.success) return;
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
        },

        // 信息点部分
        async handleShowPoint(index, row) {
            this.dialogPointVisible = true;
            this.currentCatalogDocumentSubId = row.catalogDocumentSubId;
            this.catalogPointlist();
        },
        async catalogPointlist() {
            let params = {
                catalogDocumentSubId: this.currentCatalogDocumentSubId,
                pageSize: this.pagesizePoint,
                pageNum: this.currentPagePoint
            }
            let result = await listCatalogPointById(params);
            if (!result.success) return;
            this.tableDataPoint = result.data.records;
            this.totalCountPoint = result.data.total;
        },
        handleCurrentChangePoint() {
            this.catalogPointlist();
        },
        handleSizeChangePoint(val) {
            this.pagesizePoint = val;
            this.currentPagePoint = 1;
            this.catalogPointlist();
        },
        handleClickAddPoint() {
            this.dialogPointAdd = true;
        },
        resetFormPoint() {
            this.dialogPointAdd = false;
            this.$refs.tempItemPoint.resetFields();
        },
        async saveItemPoint() {
            this.tempItemPoint.catalogDocumentSubId = this.currentCatalogDocumentSubId;
            let res = await addCatalogPoint(this.tempItemPoint);
            if (res.success) {
                this.$message.success("新增信息点成功!");
                this.tempItemPoint = {};
                this.dialogPointAdd = false;
                this.catalogPointlist();
            }
        },
        async updateItemPoint() {
            this.tempItemPoint.catalogDocumentSubId = this.currentCatalogDocumentSubId;
            let res = await updateCatalogPoint(this.tempItemPoint);
            if (res.success) {
                this.$message.success("修改成功!");
                this.tempItemPoint = {};
                this.dialogPointEdit = false;
                this.catalogPointlist();
            }
        },
        handleEditPoint(index, row) {
            this.tempItemPoint = _.cloneDeep(row);
            this.dialogPointEdit = true;
        },
        async handleClosePoint(row) {
            try {
                await this.$confirm("是否删除改信息点", "确认删除",);
                let result = await deleteCatalogPoint({ id : row.catalogPointId  });
                if (!result.success) return;
                await this.catalogPointlist();
                this.$message({ type: "success", message: "删除成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消删除" })
            }
        }
    }
}
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
        .handle {
            margin-top: 1px;
        }
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
