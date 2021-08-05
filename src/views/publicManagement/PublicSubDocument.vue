<template>
    <div class="public-document">
        <header>
            <span class="title">公共二级材料</span>
            <el-button icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </header>
        <div class="filter-box">
            <el-input placeholder="按子文档名称查询" v-model="filterKeyword" clearable style="width: 200px;"
                @keyup.native.enter="searchKey"></el-input>
            <el-input placeholder="归类查询" v-model="categoryFilterKeyword" clearable style="width: 200px;"
                @keyup.native.enter="searchKey"></el-input>

            <el-button @click="searchKey" type="primary">搜索</el-button>
            <div class="upload-box" style="float:right;margin-right:30px">
                <el-upload class="upload-demo" ref="upload" :action="url" :limit="1" :with-credentials="true"
                    :on-success="uploadSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload='true'
                    :before-upload="customUpload">
                    <el-button type="primary" :loading="loadings" @click="upload()">Excel上传</el-button>
                </el-upload>
                <el-button type="text" @click="startDownload">点击下载模板</el-button>
            </div> 

        </div>
        <div class="tableWrap">
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
                <el-table-column prop="pageLocation" label="标准格式下的页码" show-overflow-tooltip width="100">
                </el-table-column>
                <el-table-column prop="catalogDocumentSubName" label="关联全局二级文档" show-overflow-tooltip width="100">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button @click="handleEdit(scope.row)" :disabled="!hasManagePermission">
                                编辑
                            </el-button>
                            <el-button @click="handleDelete(scope.row)" type="danger" :disabled="!hasManagePermission">
                                删除
                            </el-button>
                            <!-- <el-button @click="handleLook(scope.row)" type="primary">
                                查看相关事项
                            </el-button> -->
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
                <el-form :model="addForm" label-width="120px" ref="addForm" :rules="rules">
                    <el-form-item label="子文档名称" prop="globalDocumentSubName">
                        <el-input v-model="addForm.globalDocumentSubName"></el-input>
                    </el-form-item>
                    <el-form-item label="所属材料" prop="globalDocumentId">
                        <el-select placeholder="所属材料" v-model="addForm.globalDocumentId" filterable clearable>
                            <el-option v-for="(v,i) in allGlobalDocuments" :label="v.label" :value="v.value" :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否多页" prop="isMultiplePage">
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
                        <el-input v-model="addForm.globalDocumentSubCode"></el-input><span
                            style="font-size:50%;color:orange"> 非必填, 系统会自动生成</span>
                    </el-form-item>
                    <el-form-item label="标准格式下的页码" prop="pageLocation">
                        <el-input v-model="addForm.pageLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="关联全局二级文档">
                        <el-select placeholder="请选择关联全局二级文档名称" v-model="addForm.catalogDocumentSubId" filterable
                            clearable>
                            <el-option v-for="(v,i) in globalDocumentsSubOption" :label="v.catalogDocumentSubName"
                                :value="v.catalogDocumentSubId" :key="i">
                            </el-option>
                        </el-select>
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
                <el-form :model="editForm" label-width="120px" ref="editForm" :rules="rules">
                    <el-form-item label="子文档名称" prop="globalDocumentSubName">
                        <el-input v-model="editForm.globalDocumentSubName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否多页"  prop="isMultiplePage">
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
                    <el-form-item label="标准格式下的页码" prop="pageLocation">
                        <el-input v-model="editForm.pageLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="关联全局二级文档">
                        <el-select placeholder="请选择关联全局二级文档名称" v-model="editForm.catalogDocumentSubId" filterable
                            clearable>
                            <el-option v-for="(v,i) in globalDocumentsSubOption" :label="v.catalogDocumentSubName"
                                :value="v.catalogDocumentSubId" :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="edit" :loading="editBtnLoading">确定</el-button>
            </span>
        </el-dialog>
        <!-- 查看事项窗口 -->
        <el-dialog :title="lookTitle" :visible.sync="lookDialogVisible" width="60%" :close-on-click-modal="false">
            <div class="filter-box">
                <el-input placeholder="事项名称查询" v-model="itemName" clearable style="width: 200px;"
                    @keyup.native.enter="search"></el-input>
                <el-input placeholder="情形名称查询" v-model="subitemName" clearable style="width: 200px;"
                    @keyup.native.enter="search"></el-input>
                <el-button @click="shixiangList(refresh)" type='primary'>搜索</el-button>
                <el-button style="float:right;margin-bottom:10px" @click="toggleSelection">取消选择</el-button>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTables" class="workTable" :data="lookTableData" style="width: 100%;" border
                    tooltip-effect="dark" @selection-change="handleSelectionChange">>
                    <el-table-column type="selection" width="70"></el-table-column>
                    <el-table-column prop="itemName" label="事项名称">
                    </el-table-column>
                    <el-table-column prop="subitemName" label="情形名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="isRequired" label="是否必须" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.isRequired == Number(1)? '是':'否'}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column  show-overflow-tooltip>
                    </el-table-column> -->
                    <!-- <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable >
                    </el-table-column> -->
                    <!-- <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column> -->
                </el-table>
                <p v-if="lookTableData.length>0" class="tips">选中记录后，请选择子文档名称修改子文档关联</p>
            </div>
            <!-- <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div> -->

            <span slot="footer" class="dialog-footer" v-if="lookTableData.length>0">

                <div style="float:left;margin-left:20px">
                    <el-select v-model="globalDocumentSubId" placeholder="请选择子文档名称" clearable
                        @change="globalDocumentSubNameChange">
                        <el-option v-for="item in approvalSubTextList" :key="item.globalDocumentSubName"
                            :label="item.globalDocumentSubName" :value="item.globalDocumentSubId" />
                    </el-select>
                    <el-button style="margin-left:10px" type="primary" @click="changeText" :loading="editBtnLoading">
                        修改关联文档</el-button>
                </div>
                <el-button @click="lookDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import axios from "axios"
import {
    addGlobalDcumentSub, delDcumentSub, getByGlobalDcumentSubId, listGlobalDcumentSub, updateGlobalDcumentSub, listGlobalDcument, listSubitemAndDocumentNewNoPage, batchEditDocumentSub
} from '@/api/basicInfo/publicDocument'
import { listCatalogDocumentSub } from '@/api/basicInfo/catalogDocumentSub'
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
            globalDocumentsSubOption: [],
            // dialog look
            lookDialogVisible: false,
            subitemName: '', // 情形
            itemName: '', // 事项
            approvalSubTextList: [], // 子文档列表
            globalDocumentSubId: '',
            refresh: null,
            lookTitle: null,
            lookTableData: [],
            multipleSelection: [],

            // 表单校验
            rules: {
                globalDocumentSubName: [{
                    required: true, message: '请输入子材料名称', trigger: 'change'
                }],
                globalDocumentId: [{
                    required: true, message: '请选择所属材料', trigger: 'change'
                }],
                isMultiplePage: [{
                    required: true, message: '请选择是否多页', trigger: 'change'
                }],
                pageLocation: [{
                    required: false, message: '请填写标准格式下的页码', trigger: 'change'
                },
                {
                    pattern: /^\d+(,\d+)*$/,
                    message: "请填写正确的页码格式，如：1,2,3,4", trigger: "blur"
                }]
            },
            // 上传
            url: process.env.VUE_APP_BASE_IP + "/ss/globalDocumentSubList/DcumentImportData",
            loadings: false,
        }
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        this.search();
        this.getApprovalSubText()
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
            let params = {
                globalDocumentSubNameAndCode: this.filterKeyword,
                projectId: this.$route.query.projectId,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
                category: this.categoryFilterKeyword,

            }
            let result = await listGlobalDcumentSub(params);

            this.tableData = result.data.records;
            this.totalCount = result.data.total
        },
        searchKey() {
            this.currentPage = 1;
            this.search();
        },
        multipageFormatter(row, column, cellValue) {

            return cellValue == 1 ? "是" : "否"
        },
        async handleEdit(row) {
            this.editForm = _.cloneDeep(row);
            this.editDialogVisible = true;
            let res = await listCatalogDocumentSub();
            if (!res.success) return;
            this.globalDocumentsSubOption = res.data;
        },
        async edit() {
            this.$refs.editForm.validate(async (valid) => {
                if (valid) {
                    this.editBtnLoading = true;

                    let result = await updateGlobalDcumentSub(this.editForm);
                    if (!result.success) {
                        this.$message({ type: "error", message: result.data })
                        return;
                    }
                    this.editBtnLoading = false;
                    this.editDialogVisible = false;
                    this.$message({ type: "success", message: "保存成功" })
                    this.search();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        async handleDelete(row) {
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
        // 查看相关事项
        async handleLook(v) {
            this.refresh = v
            this.lookTitle = `⼦⽂档编号：${v.globalDocumentSubCode} \xa0 \xa0 ⼦⽂档名称：${v.globalDocumentSubName}`
            await this.shixiangList(v)
            this.lookDialogVisible = true
        },
        // 事项列表
        async shixiangList(item) {
            let params = {
                globalDocumentSubId: item.globalDocumentSubId,
                itemName: this.itemName,
                subitemName: this.subitemName
            }
            let res = await listSubitemAndDocumentNewNoPage(params)
            this.lookTableData = res.data
        },
        //  checkbox多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 取消选择
        toggleSelection() {
            this.$refs.multipleTables.clearSelection();
        },
        // 
        globalDocumentSubNameChange(v) {
            console.log(v)
        },
        // 子文档列表
        async getApprovalSubText() {
            this.approvalSubTextList = []
            let result = await listGlobalDcumentSub({ projectId: this.$route.query.projectId });
            if (!result.success) return;
            this.approvalSubTextList = result.data.records
        },
        // 修改关联文档
        async changeText() {
            let ids = this.multipleSelection.map(ele => ele.id)
            let params = {
                ids: ids,
                targetGlobalDocumentSubId: this.globalDocumentSubId
            }
            const result = await batchEditDocumentSub(params)
            if (result.success) {
                this.$message.success('修改关联文档成功');
                this.globalDocumentSubId = ''
                await this.shixiangList(this.refresh)
            }
            console.log(result)
        },
        async handleAdd() {
            this.addDialogVisible = true;
            let res = await listCatalogDocumentSub();
            if (!res.success) return;
            this.globalDocumentsSubOption = res.data;
        },
        async add() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addBtnLoading = true;
                    this.addForm.projectId = this.$route.query.projectId;
                    let result = await addGlobalDcumentSub(this.addForm);
                    this.addBtnLoading = false;

                    if (!result.success) return;
                    this.$message({ type: "success", message: "添加成功" })

                    this.addDialogVisible = false;
                    this.search();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 上传文件
        customUpload(file) {
            this.loadings = true;
            let fd = new FormData();
            fd.append("file", file);
            fd.append("projectId", this.$route.query.projectId);
            axios.post(
                this.url,
                fd
            )
                .then(
                    (res) => {
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.loadings = false;
                            this.search();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                            this.loadings = false;
                        }
                    },
                );
            return false;
        },
        upload() {
            this.$refs.upload.submit();
            
        },
        // 成功上传文件
        uploadSuccess(res, file) {
            console.log(res)
            if (res.status == 200) {
                this.$message.success(res);
            }
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`只能选择上传 1 个文件`);
        },
        //  移除文件
        handleRemove(file, fileList) {
        },
        // 下载初始模板
        startDownload() {
            const a = document.createElement("a");
            a.href = 'http://10.0.101.18/template/事项文档目录.xlsx'
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
    .tips {
        text-align: left;
        font-size: 12px;
        color: grey;
        margin-top: 8px;
    }
}
</style>