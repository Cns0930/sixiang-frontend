<template>
    <div class="public-document">
        <header>
            <span class="title">材料子文档</span>
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
            </el-select>
            <el-button @click="search" type="primary">搜索</el-button>
        </div>
        <div>
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">

                <el-table-column prop="globalDocumentSubId" label="材料id" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentSubCode" label="子文档编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentSubName" label="子文档名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentType" label="材料类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="isMultiplePage" label="是否多页" :formatter="multipageFormatter" show-overflow-tooltip></el-table-column>
                <el-table-column prop="subType" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="category" label="类别" show-overflow-tooltip></el-table-column>
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
                <el-form  label-width="120px" >
                     <el-form-item label="材料名称">
                        <el-input v-model="addForm.globalDocumentName" ></el-input>
                    </el-form-item>
                    <el-form-item label="是否标准文档">
                         <el-select placeholder="类型" v-model="addForm.isStandard" filterable clearable >
                            <el-option label="标准文档" :value="1"></el-option>
                            <el-option label="非标文档" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select placeholder="来源" v-model="addForm.produceSource" filterable clearable >
                            <el-option label="现场制作" value="现场制作"></el-option>
                            <el-option label="用户自带" value="用户自带"></el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="材料编码">
                        <el-input v-model="addForm.globalDocumentCode"></el-input>
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
                <el-form  label-width="120px" >
                     <el-form-item label="材料名称">
                        <el-input v-model="editForm.globalDocumentName" ></el-input>
                    </el-form-item>
                    <el-form-item label="是否标准文档">
                         <el-select placeholder="类型" v-model="editForm.isStandard" filterable clearable >
                            <el-option label="标准文档" :value="1"></el-option>
                            <el-option label="非标文档" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-select placeholder="来源" v-model="editForm.produceSource" filterable clearable >
                            <el-option label="现场制作" value="现场制作"></el-option>
                            <el-option label="用户自带" value="用户自带"></el-option>
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
import { addGlobalDcument, deleteDcument, getByGlobalDcumentId, updateGlobalDcument, listGlobalDcument,addGlobalDcumentSub,delDcumentSub,getByGlobalDcumentSubId,
listGlobalDcumentSub , } from '@/api/basicInfo/publicDocument'

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

        }
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        this.search();
    },
    methods: {
        async search() {
            let params = {
                globalDocumentSubName: this.filterKeyword,
               
                pageNum: this.currentPage,
                pageSize: this.pagesize,
               
            }
            let result = await listGlobalDcumentSub(params);

            this.tableData = result.data.records;
            this.totalCount = result.data.total
        },
        multipageFormatter(row, column, cellValue ){
   
            return cellValue==1?"是":"否"
        },
        async edit(){
            this.editBtnLoading=true;
            
            let result= await updateGlobalDcument(this.editForm);
            this.editBtnLoading=false;
            this.editDialogVisible=false;
            this.search();

        },
        handleEdit(row){
            this.editForm = _.pick(row,['globalDocumentCode','globalDocumentName','isStandard','produceSource','globalDocumentId']);
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
            let result = await addGlobalDcument(this.addForm);
            this.addBtnLoading=false;
            
            if(!result.success) return;
           
            this.addDialogVisible=false;
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
            font-size:20px;
            margin-right:20px;
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
</style>