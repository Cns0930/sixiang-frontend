<template>
    <div class="public-document">
        <header>
            <span class="title">公共一级材料</span>
            <el-button icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </header>
        <div class="filter-box">
            <el-input placeholder="按名称查询" v-model="params.globalDocumentName" clearable style="width: 200px;"
                @keyup.native.enter="search"></el-input>
            <el-select placeholder="是否标准文档" v-model="params.isStandard" filterable clearable style="width: 200px;">
                <el-option label="标准文档" :value="1"></el-option>
                <el-option label="非标文档" :value="0"></el-option>
            </el-select>
            <el-select placeholder="来源" v-model="params.produceSource" filterable clearable style="width: 200px;">
                <el-option label="现场制作" value="现场制作"></el-option>
                <el-option label="用户自带" value="用户自带"></el-option>
                <el-option label="电子证照" value="电子证照"></el-option>
                <el-option label="电子材料" value="电子材料"></el-option>
            </el-select>
            <el-button @click="search" type="primary">搜索</el-button>
        </div>
        <div class="tableWrap">
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <div>
                            <div class="flex">
                                <span>对应公共二级</span>
                                <el-button style="margin-left:20px" type="primary" @click="toAddDialog(scope.row)">
                                    新增
                                </el-button>
                            </div>
                            <el-table :data="scope.row.documentSubList" border>
                                <el-table-column prop="globalDocumentName" label="材料名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="globalDocumentSubCode" label="子文档编号" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="globalDocumentSubName" label="子文档名称" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="description" label="标记(唯一字段)" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="isMultiplePage" label="是否多页" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{ scope.row.isMultiplePage ===1 ? "是" : "否" }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="category" label="归类" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="pageLocation" label="标准格式下的页码" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="catalogDocumentSubName" label="关联全局二级文档" show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatterTwo"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column prop="" label="操作" width="250px">
                                    <template slot-scope="scope">
                                        <el-button type="primary" :disabled="!hasManagePermission"
                                            @click="toedit(scope.row)">
                                            编辑
                                        </el-button>
                                        <el-button @click="toDelete(scope.row)" type="danger"
                                            :disabled="!hasManagePermission">
                                            删除
                                        </el-button>
                                        <el-button type="primary" @click="toInfo(scope.row)">
                                            对应样本信息
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="globalDocumentCode" label="文档编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.globalDocumentList.globalDocumentCode}}
                    </template>
                </el-table-column>
                <el-table-column prop="globalDocumentName" label="文档名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.globalDocumentList.globalDocumentName}}
                    </template>
                </el-table-column>
                <el-table-column prop="isStandard" label="是否标准文档" :formatter="standardFormatter" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="produceSource" label="来源" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.globalDocumentList.produceSource}}
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="handleEdit(scope.row.globalDocumentList)"
                                :disabled="!hasManagePermission">
                                编辑
                            </el-button>
                            <el-button @click="handleDelete(scope.row.globalDocumentList)" type="danger"
                                :disabled="!hasManagePermission">
                                删除
                            </el-button>
                            <el-button @click="toTransfer(scope.row.globalDocumentList)">转移材料</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tablePagination">
            <el-pagination @current-change="search" :current-page.sync="params.pageNum" :page-size="params.pagesize"
                layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 新建窗口 -->
        <el-dialog title="新增材料信息" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form :model="addForm" label-width="120px" :rules="rules">
                    <el-form-item label="材料名称" prop="globalDocumentName">
                        <el-input v-model="addForm.globalDocumentName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否标准文档" prop="isStandard">
                        <el-select placeholder="类型" v-model="addForm.isStandard" filterable clearable>
                            <el-option label="标准文档" :value="1"></el-option>
                            <el-option label="非标文档" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select placeholder="来源" v-model="produceSource" filterable clearable multiple>
                            <el-option label="现场制作" value="现场制作"></el-option>
                            <el-option label="用户自带" value="用户自带"></el-option>
                            <el-option label="电子证照" value="电子证照"></el-option>
                            <el-option label="电子材料" value="电子材料"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="材料编码">
                        <el-input v-model="addForm.globalDocumentCode"></el-input><span
                            style="font-size:50%;color:orange"> 非必填, 系统会自动生成</span>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="add" :loading="addBtnLoading">确定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑窗口 -->
        <el-dialog title="编辑材料信息" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form :model="editForm" label-width="120px" :rules="rules">
                    <el-form-item label="材料名称" prop="globalDocumentName">
                        <el-input v-model="editForm.globalDocumentName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否标准文档" prop="isStandard">
                        <el-select placeholder="类型" v-model="editForm.isStandard" filterable clearable>
                            <el-option label="标准文档" :value="1"></el-option>
                            <el-option label="非标文档" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select placeholder="来源" v-model="produceSource" filterable clearable multiple>
                            <el-option label="现场制作" value="现场制作"></el-option>
                            <el-option label="用户自带" value="用户自带"></el-option>
                            <el-option label="电子证照" value="电子证照"></el-option>
                            <el-option label="电子材料" value="电子材料"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="材料编码">
                        <el-input v-model="editForm.globalDocumentCode"></el-input>
                    </el-form-item>

                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="edit" :loading="editBtnLoading">确定</el-button>
            </span>
        </el-dialog>

        <!-- fen -->
        <div>
            <el-dialog title="样本信息" :visible.sync="dialogVisible" width="50%">
                <div style="margin-bottom: 10px">
                    <el-input placeholder="请输入事项二级材料名称" v-model="gloparams.documentsubDisplayname" style="width: 200px"
                        clearable></el-input>
                    <el-button @click="getListDocumentInfoBy()" style="margin-left: 10px">搜索</el-button>
                    <el-button @click="download()" :disabled="multipleSelection.length === 0">下载</el-button>
                </div>
                <el-table ref="globalDocument" :data="globalDocumentList" style="width: 100%" border max-height="400"
                    @selection-change="handleSelectionChange" :row-key="getRowKeys">
                    <el-table-column type="selection" width="50" :reserve-selection='true'>
                    </el-table-column>
                    <el-table-column prop="globalDocumentSubName" label="公共二级材料名称">
                    </el-table-column>
                    <el-table-column prop="itemName" label="事项名称">
                    </el-table-column>
                    <el-table-column prop="documentsubDisplayname" label="事项二级材料名称">
                    </el-table-column>
                    <el-table-column prop="address" label="样本图片">
                        <template slot-scope="scope">
                            <div class="demo-image__preview">
                                <el-image style="width: 100px; height: 100px" :src="scope.row.fileUrl"
                                    :preview-src-list="[scope.row.fileUrl]">
                                </el-image>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="用户名">
                    </el-table-column>
                    <el-table-column prop="filePath" label="样本路径">
                    </el-table-column>
                </el-table>
                <Pagination v-show="globalDocumentTotal>0" :total="globalDocumentTotal" :page.sync="gloparams.pageNum"
                    :limit.sync="gloparams.pageSize" style="float:right" @pagination="getListDocumentInfoBy()" />
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <AddMaterialDialog ref="addDialog" :allGlobalDocuments="allGlobalDocuments" @update="search"
            :globalDocumentId="globalDocumentId">
        </AddMaterialDialog>
        <EditMateralDialog ref="editDialog" @update="search()"></EditMateralDialog>
        <Transfer ref="transferDialog" :primaryMaterialList="primaryMaterialList" @update="search()"></Transfer>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import { addGlobalDcument, deleteDcument, getByGlobalDcumentId, updateGlobalDcument, listGlobalDcument, api_AndSubDocument, api_ListDocumentInfoBySubDocument, delDcumentSub, ape_listTransferSubDocument, api_listGlobalDcumentAll } from '@/api/basicInfo/publicDocument'
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import AddMaterialDialog from "./components/AddMaterialDialog.vue";
import EditMateralDialog from "./components/EditMateralDialog.vue";
import Pagination from "@/components/Pagintion.vue";
import Transfer from "./components/Transfer.vue"
import { singleDownload } from "@/utils/download.js";
export default {
    name: "PublicDocument",
    mixins: [mixin],
    data() {
        return {
            tableData: [],
            /* 筛选条件 */
            // 名称模糊查询
            filterKeyword: "",
            // 类型查询
            standardFilter: "",
            // 来源查询
            sourceFilter: "",

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

            // 产生来源编辑
            produceSource: [],

            // 表单校验
            rules: {
                globalDocumentName: [{
                    required: true, message: '请输入材料名称', trigger: 'change'
                }],
                isStandard: [{
                    required: true, message: '请选择是否标准文档', trigger: 'change'
                }]
            },
            params: {
                // 公共一级材料名称
                globalDocumentName: "",
                // 是否标准文档
                isStandard: "",
                // 生产来源
                produceSource: "",
                // 项目id
                projectId: "",
                pageNum: 1,
                pageSize: 10
            },
            dialogVisible: false,
            allGlobalDocuments: [],
            globalDocumentList: [],
            globalDocumentTotal: 0,
            gloparams: {
                documentsubDisplayname: "",
                globalDocumentSubId: "",
                pageNum: 1,
                pagesize: 10
            },
            multipleSelection: [],
            primaryMaterialList: [],
            globalDocumentId: null
        }
    },
    components: {
        AddMaterialDialog,
        Pagination,
        EditMateralDialog,
        Transfer,
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        this.search();
        let result = await listGlobalDcument({
            projectId: this.$route.query.projectId,
            pageNum: 1,
            pageSize: 99999,
        });
        if (!result.success) {
            this.$message.error("获取材料失败");
            return;
        }
        this.allGlobalDocuments = result.data.records.map(v => ({ label: v.globalDocumentName, value: v.globalDocumentId }));
    },
    methods: {
        async search() {
            // let params = {
            //     globalDocumentName: this.filterKeyword,
            //     projectId: this.$route.query.projectId,
            //     isStandard: this.standardFilter,
            //     pageNum: this.currentPage,
            //     pageSize: this.pagesize,
            //     produceSource: this.sourceFilter,
            // }
            let result = await api_AndSubDocument(this.params);

            this.tableData = result.data.records;
            this.totalCount = result.data.total
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(row.globalDocumentList.updateTime).format("YYYY-MM-DD HH:mm:ss")
        },
        timeFormatterTwo(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
        standardFormatter(row, column, cellValue) {
            return row.globalDocumentList.isStandard == 1 ? "标准文档" : "非标文档"
        },
        async edit() {
            this.editBtnLoading = true;
            let produce = this.produceSource.toString();
            console.log(produce);
            this.editForm.produceSource = produce;
            this.editForm.projectId = this.$route.query.projectId;
            let result = await updateGlobalDcument(this.editForm);
            this.editBtnLoading = false;
            this.editDialogVisible = false;
            this.produceSource = [];
            this.$message({ type: "success", message: "保存成功" })
            this.search();

        },
        handleEdit(row) {
            this.editForm = _.pick(row, ['globalDocumentCode', 'globalDocumentName', 'isStandard', 'produceSource', 'globalDocumentId']);
            this.produceSource = this.editForm.produceSource === null ? [] : this.editForm.produceSource.split(',');
            this.editDialogVisible = true;
        },
        async handleDelete(row) {
            try {
                await this.$confirm("是否确定删除",)
                let result = await deleteDcument({ GlobalDocumentId: row.globalDocumentId });
                if (!result.success) {
                    this.$message.warning("删除失败");
                } else {
                    this.$message.success("删除成功");
                }
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
            let produce = this.produceSource.toString();
            console.log(produce);
            this.addForm.produceSource = produce;
            this.addForm.projectId = this.$route.query.projectId;
            let result = await addGlobalDcument(this.addForm);
            this.addBtnLoading = false;

            if (!result.success) return;
            this.$message({ type: "success", message: "添加成功" })

            this.addDialogVisible = false;
            this.produceSource = [];
            this.search();
        },
        async toDelete(row) {
            try {
                await this.$confirm("是否确定删除",)
                let result = await delDcumentSub({ globalDocumentSubId: row.globalDocumentSubId });
                if (!result.success) {
                    this.$message.warning("删除失败");
                } else {
                    this.$message.success("删除成功");
                }
                this.search();
                return;
            } catch (e) {
                return;
            }

        },
        toedit(row) {
            this.$refs.editDialog.handleEdit()
            this.$refs.editDialog.editForm = _.cloneDeep(row);
            this.$refs.editDialog.editDialogVisible = true;
        },
        toAddDialog(e) {
            this.globalDocumentId = e.globalDocumentId;
            this.$refs.addDialog.handleEdit()
            this.$refs.addDialog.addDialogVisible = true;
            this.$refs.addDialog.addForm.catalogDocumentSubId = e.globalDocumentList.globalDocumentId;
        },
        toInfo(e) {
            this.gloparams.globalDocumentSubId = e.globalDocumentSubId;
            this.gloparams.pageNum = 1;
            this.gloparams.pagesize = 10;
            this.dialogVisible = true;
            this.getListDocumentInfoBy();
            this.$nextTick(() => {
                this.$refs.globalDocument.clearSelection();
            })
        },
        async getListDocumentInfoBy() {
            const result = await api_ListDocumentInfoBySubDocument(this.gloparams);
            if (result.code === 200) {
                this.globalDocumentList = result.data && result.data.records;
                this.globalDocumentTotal = result.data && result.data.total;
            } else {
                this.$message.error(result.msg)
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async download() {
            const resut = this.multipleSelection.map(item => {
                return item.documentId.toString()
            })
            singleDownload({ ids: resut.toString() }, "/docInfo/downloadDocFile")
        },
        async toTransfer(e) {
            const params = {
                projectId: e.projectId,
            };
            const result = await api_listGlobalDcumentAll(params);
            if (result.code === 200) {
                this.primaryMaterialList = result.data;
            } else {
                this.$message.error(result.msg)
            }
            this.$refs.transferDialog.transferParams.aimsGlobalDocumentId = "";
            this.$refs.transferDialog.tableData = [];
            this.$refs.transferDialog.transferParams.sourceGlobalDocumentId = e.globalDocumentId;
            this.$refs.transferDialog.dialogVisible = true;
        },
        getRowKeys(e) {
            return e.documentId;
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
            font-weight: 700;
            height: 50px;
            line-height: 50px;
            letter-spacing: 1px;
            margin-right: 20px;
        }
    }
    & > * {
        margin: 8px 0;
    }
}
.filter-box {
    padding-left: 20px;
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
.tableWrap {
    // margin-top: 16px;
    margin-left: 20px;
    width: calc(100% - 20px);
    overflow: hidden;
    .workTable {
        width: 100%;
    }
}
.flex {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
</style>