<template>
    <div class="public-document">
        <header>
            <span class="title">材料子文档</span>
            <el-button icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </header>
        <div class="filter-box">
            <el-input placeholder="按子文档名称查询" v-model="filterKeyword" clearable style="width: 200px;"
                @keyup.native.enter="search"></el-input>
            <el-input placeholder="归类查询" v-model="categoryFilterKeyword" clearable style="width: 200px;"
                @keyup.native.enter="search"></el-input>

            <el-button @click="search" type="primary">搜索</el-button>
        </div>
        <div>
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">

                <el-table-column prop="globalDocumentName" label="材料名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentSubCode" label="子文档编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentSubName" label="子文档名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="description" label="标记(唯一字段)" show-overflow-tooltip></el-table-column>
                <el-table-column prop="isMultiplePage" label="是否多页" :formatter="multipageFormatter"
                    show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="subType" label="类型" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="category" label="归类" show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="handleEdit(scope.row)" :disabled="!hasManagePermission">
                                编辑
                            </el-button>
                            <el-button @click="handleDelete(scope.row)" type="danger" :disabled="!hasManagePermission">
                                删除
                            </el-button>

                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tablePagination">
            <el-pagination @current-change="search" :current-page.sync="currentPage" :page-size="pagesize"
                layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 新建窗口 -->
        <el-dialog title="新增子文档" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form label-width="120px">
                    <el-form-item label="子文档名称">
                        <el-input v-model="addForm.globalDocumentSubName"></el-input>
                    </el-form-item>
                    <el-form-item label="所属材料">
                        <el-select placeholder="所属材料" v-model="addForm.globalDocumentId" filterable clearable>
                            <el-option v-for="v,i in allGlobalDocuments" :label="v.label" :value="v.value" :key="i">
                            </el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否多页">
                        <el-select placeholder="类型" v-model="addForm.isMultiplePage" filterable clearable>
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标记(唯一字段)">
                        <el-input v-model="addForm.description"></el-input>
                    </el-form-item>

                    <el-form-item label="归类">
                        <el-input v-model="addForm.category"></el-input>
                    </el-form-item>
                    <el-form-item label="子文档编号">
                        <el-input v-model="addForm.globalDocumentSubCode"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="add" :loading="addBtnLoading">确定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑窗口 -->
        <el-dialog title="编辑子文档" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form label-width="120px">
                    <el-form-item label="材料名称">
                        <el-input v-model="editForm.globalDocumentSubName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否多页">
                        <el-select placeholder="类型" v-model="editForm.isMultiplePage" filterable clearable>
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标记(唯一字段)">
                        <el-input v-model="editForm.description"></el-input>
                    </el-form-item>

                    <el-form-item label="归类">
                        <el-input v-model="editForm.category"></el-input>
                    </el-form-item>
                    <el-form-item label="子文档编号">
                        <el-input v-model="editForm.globalDocumentSubCode"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="edit" :loading="editBtnLoading">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import {
    addGlobalDcumentSub, delDcumentSub, getByGlobalDcumentSubId, listGlobalDcumentSub, updateGlobalDcumentSub, listGlobalDcument
} from '@/api/basicInfo/publicDocument'

import { mapGetters } from "vuex"
export default {
    name: "PublicSubDocument",
    mixins: [mixin],
    data() {
        return {
            tableData: [],
            /* 筛选条件 */
            // 名称模糊查询
            filterKeyword: "",
            // 类型查询
            categoryFilterKeyword: "",


            // 分页
            currentPage: 1,
            pagesize: 15,
            totalCount: 0,
            // dialog edit
            editDialogVisible: false,
            editForm: {},
            editBtnLoading: false,
            // dialog add
            addDialogVisible: false,
            addForm: {},
            addBtnLoading: false,
            allGlobalDocuments: [],

        }
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        this.search();
        let result = await listGlobalDcument({
            pageNum: 1,
            pageSize: 99999,
        });
        if (!result.success){
            this.$message.error("获取材料失败");
            return;
        }
        this.allGlobalDocuments = result.data.records.map(v=>({label:v.globalDocumentName,value:v.globalDocumentId}));
    },
    methods: {
        async search() {
            let params = {
                globalDocumentSubName: this.filterKeyword,

                pageNum: this.currentPage,
                pageSize: this.pagesize,
                category: this.categoryFilterKeyword,

            }
            let result = await listGlobalDcumentSub(params);

            this.tableData = result.data.records;
            this.totalCount = result.data.total
        },
        multipageFormatter(row, column, cellValue) {

            return cellValue == 1 ? "是" : "否"
        },
        handleEdit(row) {
            this.editForm = _.pick(row, ['globalDocumentSubName', 'isMultiplePage', 'description', 'category', 'globalDocumentSubCode', 'globalDocumentSubId', 'globalDocumentId']);
            this.editDialogVisible = true;
        },
        async edit() {
            this.editBtnLoading = true;

            let result = await updateGlobalDcumentSub(this.editForm);
            this.editBtnLoading = false;
            this.editDialogVisible = false;
            this.search();

        },

        async handleDelete(row) {
            try {
                await this.$confirm("是否确定删除",)
                let result = await delDcumentSub({ globalDocumentSubId: row.globalDocumentSubId });
                if (!result.success) {
                    this.$message.error("删除失败")
                }
                this.$message.success("删除成功");
                this.search();
                return;

            } catch (e) {
                return;
            }


        },
        handleAdd() {
            this.addDialogVisible = true;
        },
        async add() {
            this.addBtnLoading = true;
            let result = await addGlobalDcumentSub(this.addForm);
            this.addBtnLoading = false;

            if (!result.success) return;

            this.addDialogVisible = false;
            this.search();
        }
    },

}
</script>

<style scoped lang="scss">
.public-document {
    display: flex;
    flex-direction: column;
    header {
        display: flex;
        align-items: center;
        .title {
            font-size: 20px;
            margin-right: 20px;
        }
    }
    & > * {
        margin: 4px 0;
    }
}
.filter-box {
    & > *:not(:first-child) {
        margin-left: 10px;
    }
}
.form-content {
    width: 500px;
    margin: auto;
    .el-input {
        width: 200px;
    }
    .el-select {
        width: 200px;
    }
}
</style>