<template>
    <div class="public-document">
        <header>
            <span class="title">公共一级材料</span>
            <el-button icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </header>
        <div class="filter-box">
            <el-input placeholder="按名称查询" v-model="filterKeyword" clearable style="width: 200px;"
                @keyup.native.enter="search"></el-input>
            <el-select placeholder="是否标准文档" v-model="standardFilter" filterable clearable style="width: 200px;">
                <el-option label="标准文档" :value="1"></el-option>
                <el-option label="非标文档" :value="0"></el-option>
            </el-select>
            <el-select placeholder="来源" v-model="sourceFilter" filterable clearable style="width: 200px;">
                <el-option label="现场制作" value="现场制作"></el-option>
                <el-option label="用户自带" value="用户自带"></el-option>
                <el-option label="电子证照" value="电子证照"></el-option>
            </el-select>
            <el-button @click="search" type="primary">搜索</el-button>
        </div>
        <div class="tableWrap">
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">

                <el-table-column prop="globalDocumentCode" label="文档编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentName" label="文档名称" show-overflow-tooltip></el-table-column>
               
                <el-table-column prop="isStandard" label="是否标准文档" :formatter="standardFormatter" show-overflow-tooltip></el-table-column>
                <el-table-column prop="produceSource" label="来源" show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="操作" fixed="right" >
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button  @click="handleEdit(scope.row)" :disabled="!hasManagePermission">
                                编辑
                            </el-button>
                            <el-button  @click="handleDelete(scope.row)" type="danger" :disabled="!hasManagePermission">
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
        <el-dialog title="新增材料信息" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form :model="addForm" label-width="120px" :rules="rules">
                     <el-form-item label="材料名称" prop="globalDocumentName">
                        <el-input v-model="addForm.globalDocumentName" ></el-input>
                    </el-form-item>
                    <el-form-item label="是否标准文档" prop="isStandard">
                         <el-select placeholder="类型" v-model="addForm.isStandard" filterable clearable >
                            <el-option label="标准文档" :value="1"></el-option>
                            <el-option label="非标文档" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select placeholder="来源" v-model="produceSource" filterable clearable multiple>
                            <el-option label="现场制作" value="现场制作"></el-option>
                            <el-option label="用户自带" value="用户自带"></el-option>
                            <el-option label="电子证照" value="电子证照"></el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="材料编码">
                        <el-input v-model="addForm.globalDocumentCode"></el-input><span style="font-size:50%;color:orange"> 非必填, 系统会自动生成</span>
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
                        <el-input v-model="editForm.globalDocumentName" ></el-input>
                    </el-form-item>
                    <el-form-item label="是否标准文档" prop="isStandard">
                         <el-select placeholder="类型" v-model="editForm.isStandard" filterable clearable >
                            <el-option label="标准文档" :value="1"></el-option>
                            <el-option label="非标文档" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select placeholder="来源" v-model="produceSource" filterable clearable multiple>
                            <el-option label="现场制作" value="现场制作"></el-option>
                            <el-option label="用户自带" value="用户自带"></el-option>
                            <el-option label="电子证照" value="电子证照"></el-option>
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
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import { addGlobalDcument, deleteDcument, getByGlobalDcumentId, updateGlobalDcument, listGlobalDcument } from '@/api/basicInfo/publicDocument'
import { mapGetters } from "vuex"
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
            editDialogVisible:false,
            editForm:{},
            editBtnLoading:false,
            // dialog add
            addDialogVisible:false,
            addForm:{},
            addBtnLoading:false,
            
            // 产生来源编辑
            produceSource: [],

            // 表单校验
            rules: {
                globalDocumentName: [{
                    required: true, message:'请输入材料名称', trigger: 'change'
                }],
                isStandard:[{
                    required: true, message:'请选择是否标准文档', trigger: 'change'
                }]
            }
        }
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        this.search();
    },
    methods: {
        async search() {
            let params = {
                globalDocumentName: this.filterKeyword,
                projectId: this.$route.query.projectId,
                isStandard: this.standardFilter,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
                produceSource: this.sourceFilter,
            }
            let result = await listGlobalDcument(params);

            this.tableData = result.data.records;
            this.totalCount = result.data.total
        },
        standardFormatter(row, column, cellValue ){
   
            return cellValue==1?"标准文档":"非标文档"
        },
        async edit(){
            this.editBtnLoading=true;
            let produce = this.produceSource.toString();
            console.log(produce);
            this.editForm.produceSource = produce;
            this.editForm.projectId = this.$route.query.projectId;
            let result= await updateGlobalDcument(this.editForm);
            this.editBtnLoading=false;
            this.editDialogVisible=false;
            this.produceSource = [];
            this.$message({ type: "success", message: "保存成功" })
            this.search();

        },
        handleEdit(row){
            this.editForm = _.pick(row,['globalDocumentCode','globalDocumentName','isStandard','produceSource','globalDocumentId']);
            this.produceSource = this.editForm.produceSource === null ? [] : this.editForm.produceSource.split(',');
            this.editDialogVisible=true;
        },
        async handleDelete(row){
            try{
                await this.$confirm("是否确定删除",)
                let result = await deleteDcument({GlobalDocumentId :row.globalDocumentId});
                if(!result.success){
                    this.$message.error("删除失败")
                }
                this.$message.success("删除成功");
                this.search();
                return;

            }catch (e) {
                return;
            }
          
        
        },
        handleAdd(){
            this.addDialogVisible=true;
        },
        async add(){
            this.addBtnLoading=true;
            let produce = this.produceSource.toString();
            console.log(produce);
            this.addForm.produceSource = produce;
            this.addForm.projectId = this.$route.query.projectId;
            let result = await addGlobalDcument(this.addForm);
            this.addBtnLoading=false;
            
            if(!result.success) return;
            this.$message({ type: "success", message: "添加成功" })
           
            this.addDialogVisible=false;
            this.produceSource = [];
            this.search();
        }
    },

}
</script>

<style scoped lang="scss">
.public-document {
    display: flex;
    flex-direction: column;
    header{
        display:flex;
        align-items: center;
        
        .title{
            font-size: 20px;
            font-weight: 700;
            height: 50px;
            line-height: 50px;
            letter-spacing: 1px;
            margin-right:20px;
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
.form-content{
    width:500px;
    margin:auto;
    .el-input{
        width:200px;
    }
    .el-select{
        width:200px;
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
</style>