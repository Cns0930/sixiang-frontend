<template>
    <div class="public-document">
        <header>
            <span class="title">提取点管理</span>
            <el-button icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </header>
        <div class="filter-box">
            <el-select
                v-model="globalDocumentSubName"
                placeholder="请选择子文档名称"
                clearable filterable
                remote reserve-keyword :remote-method="remoteMethod" :loading="loading"
            >
            <el-option
                v-for="item in approvalSubTextList"
                :key="item.globalDocumentSubId"
                :label="item.globalDocumentSubName"
                :value="item.globalDocumentSubName"
            />
            <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                <a class="text-normal">
                    <el-pagination @size-change="handleSizeChangeSelect" @current-change="handleCurrentChangeSelect"
                        :current-page="currentPageSelect" :total="totalAim"
                        :page-size="pageSize"
                        layout="prev, pager, next"/>
                </a>
            </div>
        </el-select>
        <el-input placeholder="按字段名查询" v-model="checkpointName" clearable style="width: 200px;"
                @keyup.native.enter="search"></el-input>
        <el-input placeholder="按字段别名查询" v-model="aliasName" clearable style="width: 200px;"
        @keyup.native.enter="search"></el-input>
            <el-button @click="search" type="primary">搜索</el-button>
            <div class="upload-box" style="float:right">
                <el-upload class="upload-demo" ref="upload" :action="url" :limit="1" :with-credentials="true"
                    :on-success="uploadSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload='true'
                    :before-upload="customUpload">
                    <el-button type="primary" @click="upload()">Excel上传</el-button>
                </el-upload>
            </div> 
        </div>

        <!-- 表格 -->
        <div class="tableWrap">
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border v-loading="loadings"
                    element-loading-text="Excel上传中...."
                    element-loading-spinner="el-icon-loading"
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}" :row-style="{height:'40px'}" :header-row-style="{height:'50px'}">

                <el-table-column prop="globalDocumentSubName" label="所属子文档" show-overflow-tooltip></el-table-column>
                <el-table-column prop="checkpointName" label="字段名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="aliasName" label="字段别名" show-overflow-tooltip></el-table-column>
               
                <el-table-column prop="isMultiplePage" label="是否多页" width="100">
                    <template slot-scope="scope">
                       {{scope.row.isMultiplePage == 1? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column prop="isScreenshot" label="是否为截图" width="100">
                    <template slot-scope="scope">
                       {{scope.row.isScreenshot == 1? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column prop="screenshotInfo" label="截图信息" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sort" label="4W分类" show-overflow-tooltip width="100"></el-table-column>
                <el-table-column prop="classify" label="4W归类" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip :formatter="timeFormatter" sortable></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip :formatter="timeFormatter" sortable></el-table-column>  
                <el-table-column label="操作" fixed="right" width="180">
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
        <el-dialog title="新增提取点" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form  label-width="120px" >
                    <el-form-item label="所属子文档">
                        <el-select
                                v-model="addForm.globalDocumentSubId"
                                placeholder="请选择子文档名称"
                                clearable filterable
                                remote reserve-keyword :remote-method="remoteMethod" :loading="loading"
                            >
                            <el-option
                                v-for="item in approvalSubTextList"
                                :key="item.globalDocumentSubId"
                                :label="item.globalDocumentSubName"
                                :value="item.globalDocumentSubId"
                            />
                            <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                <a class="text-normal">
                                    <el-pagination @size-change="handleSizeChangeSelect" @current-change="handleCurrentChangeSelect"
                                        :current-page="currentPageSelect" :total="totalAim"
                                        :page-size="pageSize"
                                        layout="prev, pager, next"/>
                                </a>
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字段名">
                        <el-input style="width:79%" v-model="addForm.checkpointName" type='textarea'></el-input>
                    </el-form-item>
                    <el-form-item label="字段别名">
                        <el-input style="width:79%" v-model="addForm.aliasName" type='textarea' ></el-input>
                    </el-form-item>
                    <el-form-item label="是否多页">
                         <el-select v-model="addForm.isMultiplePage" filterable clearable >
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否为截图">
                        <el-select  v-model="addForm.isScreenshot" filterable clearable >
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                   <el-form-item label="截图信息">
                        <el-input v-model="addForm.screenshotInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="4W分类">
                        <el-select  v-model="addForm.sort" filterable clearable >
                            <el-option v-for="item in sortList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="4W归类">
                        <el-input v-model="addForm.classify" ></el-input>
                    </el-form-item>
                   
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="add" :loading="addBtnLoading">确定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑窗口 -->
        <el-dialog title="编辑提取点" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form  label-width="120px" >
                    <el-form-item label="所属子文档">
                        <el-select
                                v-model="editForm.globalDocumentSubId"
                                placeholder="请选择子文档名称"
                                clearable filterable
                                remote reserve-keyword :remote-method="remoteMethod" :loading="loading"
                            >
                            <el-option
                                v-for="item in approvalSubTextList"
                                :key="item.globalDocumentSubId"
                                :label="item.globalDocumentSubName"
                                :value="item.globalDocumentSubId"
                            />
                            <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                <a class="text-normal">
                                    <el-pagination @size-change="handleSizeChangeSelect" @current-change="handleCurrentChangeSelect"
                                        :current-page="currentPageSelect" :total="totalAim"
                                        :page-size="pageSize"
                                        layout="prev, pager, next"/>
                                </a>
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字段名">
                        <el-input style="width:79%" v-model="editForm.checkpointName" type='textarea'></el-input>
                    </el-form-item>
                    <el-form-item label="字段别名">
                        <el-input style="width:79%" v-model="editForm.aliasName" type='textarea' ></el-input>
                    </el-form-item>
                    <el-form-item label="是否多页">
                         <el-select v-model="editForm.isMultiplePage" filterable clearable >
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否为截图">
                        <el-select  v-model="editForm.isScreenshot" filterable clearable >
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="截图信息">
                        <el-input v-model="editForm.screenshotInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="4W分类">
                        <el-select  v-model="editForm.sort" filterable clearable >
                            <el-option v-for="item in sortList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="4W归类">
                        <el-input v-model="editForm.classify"></el-input>
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
import axios from 'axios'
import { mixin } from "@/mixin/mixin"
import {listGlobalDcumentSub} from '@/api/basicInfo/publicDocument'
import { listGlobalCheckpoint, addGlobalCheckpoint, getByGlobalCheckpointId, updateGlobalCheckpoint, deleteGlobalCheckpoint } from '@/api/basicInfo/examination'
import { mapGetters } from "vuex"
export default {
    name: "Examination",
    mixins: [mixin],
    data() {
        return {
            tableData: [],
            url: process.env.VUE_APP_BASE_IP + "/ss/Import/globalCheckpointImportData",
            /* 筛选条件 */
            // 名称模糊查询
            globalDocumentSubName:'',
            checkpointName:'',
            aliasName: "",
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
            sortList:['WHAT','WHEN','WHO','WHERE','SIGN'],
            addForm:{},
            addBtnLoading:false,
            approvalSubTextList:[],
            currentPageSelect: 1,
            pageSize: 10,
            totalAim:0,
            loading:false,
            loadings:false,
        }
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        await this.search();
        await this.getApprovalSubText()
    },
    methods: {
        async search() {
            let params = {
                globalDocumentSubName:this.globalDocumentSubName,
                checkpointName:this.checkpointName,
                aliasName: this.aliasName,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
            }
            let result = await listGlobalCheckpoint(params);

            this.tableData = result.data.records;
            this.totalCount = result.data.total
        },
        // 子文档列表
        async getApprovalSubText() {
            this.approvalSubTextList = []
            let result = await listGlobalDcumentSub({pageNum: this.currentPageSelect,pageSize: this.pageSize});
            if (!result.success) return;
            this.approvalSubTextList = result.data.records
            this.totalAim = result.data.total
        },
        //远程搜索
        async remoteMethod(query){
            console.log(query)
            if(query !== ''){
                let result = await listGlobalDcumentSub({globalDocumentSubNameAndCode:query, pageNum: this.currentPageSelect,pageSize: this.pageSize});
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.approvalSubTextList = result.data.records
                    this.totalAim = result.data.total
                    
                })
            }
        },
        // 子文档列表 搜索+分页
        //下拉框带分页
        async handleSizeChangeSelect(size){
            console.log(size)
            this.pageSize = size;
            await this.getApprovalSubText()
        },
        async handleCurrentChangeSelect(current){
            console.log(current)
            this.currentPageSelect = current;
            await this.getApprovalSubText()
        },
        async edit(){
            this.editBtnLoading=true;
            
            let result= await updateGlobalCheckpoint(this.editForm);
            if(!result.success) return;
            this.$message.success('编辑成功')
            this.editBtnLoading=false;
            this.editDialogVisible=false;
            this.search();

        },
        async handleEdit(row){
            let res = await getByGlobalCheckpointId({checkpointId:row.checkpointId })
            console.log(res)
            this.editForm = res.data;
            this.editDialogVisible=true;
        },
        async handleDelete(row){
            try{
                await this.$confirm("是否确定删除",'提示')
                let result = await deleteGlobalCheckpoint({checkpointId :row.checkpointId});
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
            let result = await addGlobalCheckpoint(this.addForm);
            this.addBtnLoading=false;
            
            if(!result.success) return;
            this.$message.success('新增成功')
            this.addDialogVisible=false;
            this.search();
        },
        // 上传文件
        customUpload(file) {
            this.loadings = true
            let fd = new FormData();
            fd.append("file", file);
            axios.post(
                this.url,
                fd
            )
                .then(
                    (res) => {
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.loadings = false
                        } else {
                            this.$message.warning('上传失败,请重新上传');
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
        width:300px;
    }
    .el-select{
        width:300px;
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