<template>
    <div class="workWrap">
        <header>
            <span class="title">情形提取规则</span>
            <el-button icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
        </header>
        <div class="workBox">
        <!-- <el-input placeholder="情形名称搜索" v-model="subitemName" clearable style="width: 200px;margin-right:20px"
                @keyup.native.enter="search(subitemName)"></el-input>
            <el-button @click="search(subitemName)" type="primary">搜索</el-button> -->
            <!-- <div class="upload-box" style="float:right">
                <el-upload class="upload-demo" ref="upload" :action="url" :limit="1" :with-credentials="true"
                    :on-success="uploadSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload='true'
                    :before-upload="customUpload">
                    <el-button type="primary" @click="upload()">Excel上传</el-button>
                </el-upload>
            </div>  -->
        </div>

        <!-- 表格 -->
        <div class="tableWrap">
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border v-loading="loadings"
                    element-loading-text="Excel上传中...."
                    element-loading-spinner="el-icon-loading"
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}" :row-style="{height:'40px'}" :header-row-style="{height:'50px'}">

                <el-table-column prop="subitemName" label="情形名称" width="240" show-overflow-tooltip></el-table-column>
                
                <el-table-column prop="subitemInput" label="输入" show-overflow-tooltip :formatter="jsonFormatter"></el-table-column>
                <el-table-column prop="subitemJudgmentWay" label="判断方式" show-overflow-tooltip></el-table-column>
                <el-table-column prop="subitemAdditionalParameter" label="附加参数" show-overflow-tooltip :formatter="jsonFormatter">
                </el-table-column>
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
            <el-pagination @current-change="search()" :current-page.sync="currentPage" :page-size="pagesize"
                layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 新建窗口 -->
        <el-dialog title="新增情形提取规则" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form :model="addForm" ref="addForm" label-width="120px">
                    <el-form-item label="选择情形">
                        <el-select
                                v-model="addForm.approvalSubitemId"
                                placeholder="请选择情形名称"
                                @change="subitemNameChange"
                                style="width:100%"
                            >
                            <el-option
                                v-for="item in approvalSubList"
                                :key="item.approvalSubitemId"
                                :label="item.subitemName"
                                :value="item.approvalSubitemId"
                            />

                            </el-select>
                    </el-form-item>
                    <el-form-item label="判断方式" prop="subitemJudgmentWay">
                        <el-select  v-model="addForm.subitemJudgmentWay" filterable clearable allow-create style="width:100%">
                            <el-option v-for="item in sortList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="输入" class="ruleItem">
                        <div v-for="(item,i) in ruleInputsList" :key="i" class="ruleItems">
                            <el-select
                                v-model="item.value1"
                                placeholder="请选择子文档名称"
                                clearable filterable
                                style="width:45%"
                                remote reserve-keyword :remote-method="remoteMethod" :loading="loading" @change="(val)=>getCheckpoint(val,i)"
                            >
                            <el-option
                                v-for="(item1,i) in approvalSubTextList"
                                :key="i"
                                :label="item1.documentsubDisplayname"
                                :value="item1.documentsubSeq"
                            />
                            </el-select>

                            <el-select
                                v-model="item.value2"
                                placeholder="请选择字段名"
                                @change="subitemNameChanges"
                                style="width:45%"
                                clearable filterable
                                :disabled='approvalSubTextChange'
                                remote reserve-keyword :remote-method="remoteMethods"
                            >
                            <el-option
                                v-for="item2 in checkpointList"
                                :key="item2.fieldId"
                                :label="item2.fieldName"
                                :value="item2.fieldName"
                            />
                            <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                    <a class="text-normal">
                                        <el-pagination @size-change="handleSizeChangeSelects" @current-change="handleCurrentChangeSelects"
                                            :current-page="currentPageSelects" :total="totals"
                                            :page-size="pageSizes"
                                            layout="prev, pager, next"/>
                                    </a>
                                </div>
                            </el-select>
                           <i v-if="ruleInputsList.length>1" style="margin-left:10px;color:red;cursor: pointer;" class="el-icon-delete" @click="deletInputs(i)"></i>
                        </div>
                        <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;" @click="addRuleLawList('inputs')"></i>
                    </el-form-item>
                    <el-form-item label="附加参数" class="ruleItem">
                        <div v-for="(item,i) in ruleArgsList" :key="i" class="ruleItems">
                           <el-input type='textarea' v-model="item.ruleArgs"></el-input>
                           <i v-if="ruleArgsList.length>1" style="margin-left:10px;color:red;cursor: pointer;" class="el-icon-delete" @click="deletArgs(i)"></i>
                        </div>
                        <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;" @click="addRuleLawList('args')"></i>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addForm')">取消</el-button>
                <el-button type="primary" @click="add" :loading="addBtnLoading">确定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑窗口 -->
        <el-dialog title="编辑审批规则" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form :model="editForm" ref="editForm" label-width="120px" >           
                    <el-form-item label="判断方式">
                        <el-select  v-model="editForm.subitemJudgmentWay" filterable clearable allow-create style="width:100%">
                            <el-option v-for="item in sortList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>       
                    <el-form-item label="输入" class="ruleItem">
                        <div v-for="(item,i) in ruleInputsList" :key="i" class="ruleItems">
                            <el-select
                                v-model="item.value1"
                                placeholder="请选择子文档名称"
                                clearable filterable
                                style="width:45%"
                                remote reserve-keyword :remote-method="remoteMethod" :loading="loading" @change="(val)=>getCheckpoint(val,i)"
                            >
                            <el-option
                                v-for="(item1,i) in approvalSubTextList"
                                :key="i"
                                :label="item1.documentsubDisplayname"
                                :value="item1.documentsubSeq"
                            />
                                <!-- <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                    <a class="text-normal">
                                        <el-pagination @size-change="handleSizeChangeSelect" @current-change="handleCurrentChangeSelect"
                                            :current-page="currentPageSelect" :total="totalAim"
                                            :page-size="pageSize"
                                            layout="prev, pager, next"/>
                                    </a>
                                </div> -->
                            </el-select>

                            <el-select
                                v-model="item.value2"
                                placeholder="请选择字段名"
                                @change="subitemNameChanges"
                                style="width:45%"
                                :disabled='approvalSubTextChange'
                                clearable filterable
                                remote reserve-keyword :remote-method="remoteMethods"
                            >
                            <el-option
                                v-for="item2 in checkpointList"
                                :key="item2.fieldId"
                                :label="item2.fieldName"
                                :value="item2.fieldName"
                            />
                            <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                    <a class="text-normal">
                                        <el-pagination @size-change="handleSizeChangeSelects" @current-change="handleCurrentChangeSelects"
                                            :current-page="currentPageSelects" :total="totals"
                                            :page-size="pageSizes"
                                            layout="prev, pager, next"/>
                                    </a>
                                </div>
                            </el-select>
                           <i v-if="ruleInputsList.length>1" style="margin-left:10px;color:red;cursor: pointer;" class="el-icon-delete" @click="deletInputs(i)"></i>
                        </div>
                        <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;" @click="addRuleLawList('inputs')"></i>
                    </el-form-item>
                    <el-form-item label="附加参数" class="ruleItem">
                        <div v-for="(item,i) in ruleArgsList" :key="i" class="ruleItems">
                           <el-input type='textarea' v-model="item.ruleArgs"></el-input>
                           <i v-if="ruleArgsList.length>1" style="margin-left:10px;color:red;cursor: pointer;" class="el-icon-delete" @click="deletArgs(i)"></i>
                        </div>
                        <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;" @click="addRuleLawList('args')"></i>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('editForm')">取消</el-button>
                <el-button type="primary" @click="edit" :loading="editBtnLoading">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import Vue from "vue";
import {mixin} from "@/mixin/mixin"
// import { listGlobalCheckpoint} from '@/api/basicInfo/examination'
import {listCheckpoint} from '@/api/basicInfo/field';
import { getApprovalSub, addApprovalSubitemSubkey, deleteApprovalSubitemSubkey, updateApprovalSubitemSubkey
,listApprovalSubitemSubkey, getByApprovalSubitemSubkeyId, listApprovalSubAll} from "../../api/basicInfo/approvalSub";
import { listDocumentSubByItemId } from '@/api/basicInfo/ApprovalRules'
import { mapGetters } from "vuex"
export default {
    name: "ApprovalSubItemRule",
    mixins: [mixin],
    data() {
        return {
            tableData: [],
            itemId: this.$route.query.itemId,
            url: process.env.VUE_APP_BASE_IP + "/ss/Import/globalRuleImportData",
            /* 筛选条件 */
            // 名称模糊查询
            subitemName: "",

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
            // 分页
            currentPageSelects: 1,
            pageSizes: 15,
            totals: 0,
            sortList:['字符串比较','完全一致','字符串1包含字符串2','暂不支持','日期是否填写','是否填写','身份证在有效期内','数字完全一致','经营期限比较'],
            addForm:{
                ruleCode:'',
                ruleTrigger:'',
                rulePoint:'',
                ruleTips:'',
                ruleTipsForUser:'',
                ruleDesc:"",
                ruleType:'',

            },
            ruleInputsList:[{
                value1:'',
                value2:'',
            }],
            approvalSubTextChange:true,
            //依据
            ruleLawList:[{
                ruleLaw:''
            }],
            //附加
            ruleArgsList:[{
                ruleArgs:''
            }],
            addApprovalSub:[],//所选情形
            approvalSubList:[],//情形列表
            checkpointList:[], // 字段名
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
        // 获取项目信息
        await this.initItemAndProject();
        await this.getSubitemRules()
        await this.getApprovalSubText()
        await this.getApprovalList()
    },
    methods: {
        
        resetForm(val) {
            this.$refs[val].resetFields()
            this.addDialogVisible = false
            // this.$refs.editForm.resetFields()
            this.editDialogVisible = false
            this.resetForms()
        },
        // 情形列表
        async getApprovalList() {
            let result = await listApprovalSubAll({approvalItemId: this.$route.query.itemId});
            console.log(result)
            if (!result.success) return;
            this.approvalSubList=result.data;   
        },
        
        // 增加
        addRuleLawList(val) {
            if (val == 'law') {
               this.ruleLawList.push({ruleLaw:''})
            }
            if(val == 'args') {
                this.ruleArgsList.push({ruleArgs:''})
            }
            if(val == 'inputs') {
                this.ruleInputsList.push({
                value1:'',
                value2:'',
            })
            }
           
        },
        // 删除
        deletAdd(i) {
        this.ruleLawList.splice(i, 1);
        },
        deletArgs(i) {
        this.ruleArgsList.splice(i, 1);
        },
        deletInputs(i) {
        this.ruleInputsList.splice(i, 1);
        },
        // 字段名
        async getCheckpoint(val,i) {
            this.checkpointList = []
            console.log(val)
            this.filterKey = val
            let params = {
                documentsubSeq:val,
                approvalItemId: this.$route.query.itemId,
                pageNum: this.currentPageSelects,
                pageSize: this.pageSizes,
            }
            let result = await listCheckpoint(params);
            if(!result.success) return
            this.checkpointList = result.data.records;
            this.totals = result.data.total
            this.approvalSubTextChange = false
        },
        subitemNameChanges(val) {
           console.log(val)
        },
        //远程搜索
        async remoteMethods(query){
            console.log(query)
            if(query !== ''){
                let result = await listCheckpoint({fieldName:query, approvalItemId: this.$route.query.itemId, pageNum: this.currentPageSelects,pageSize: this.pageSizes});
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.checkpointList = result.data.records;
                    this.totals = result.data.total
                    
                })
            }
        },
        subitemNameChange(val) {
        //    this.remoteMethod(val)
        },
        // 子文档列表 搜索+分页
        //下拉框带分页
        async handleSizeChangeSelects(size){
            // console.log(size)
            this.pageSizes = size;
            await this.getCheckpoint(this.filterKey)
        },
        async handleCurrentChangeSelects(current){
            // console.log(current)
            this.currentPageSelects = current;
            await this.getCheckpoint(this.filterKey)
        },
        // 获取情形提取规则数据
        async getSubitemRules() {
            // this.approvalSubTextList = []
            let result = await listApprovalSubitemSubkey({approvalItemId:this.itemId});
            if (!result.success) return;
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
        },
        // 子文档列表
        async getApprovalSubText() {
            // this.approvalSubTextList = []
            let result = await listDocumentSubByItemId({approvalItemId:this.itemId});
            if (!result.success) return;

            this.approvalSubTextList = result.data
            console.log(this.approvalSubTextList)
            // this.totalAim = result.data.total
        },
        //远程搜索
        async remoteMethod(query){
            console.log(query)
            if(query !== ''){
                let result = await listDocumentSubByItemId({approvalItemId:this.itemId});
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.approvalSubTextList = result.data
                    // this.totalAim = result.data.total
                    
                })
            }
        },
        // 子文档列表 搜索+分页
        //下拉框带分页
        // async handleSizeChangeSelect(size){
        //     console.log(size)
        //     this.pageSize = size;
        //     await this.getApprovalSubText()
        // },
        // async handleCurrentChangeSelect(current){
        //     console.log(current)
        //     this.currentPageSelect = current;
        //     await this.getApprovalSubText()
        // },
        async edit(){
            this.editBtnLoading=true;
            let ruleInputs = this.ruleInputsList.map(v=>({'材料编号':v.value1,'字段名':v.value2}))
            this.editForm.subitemInput = ruleInputs
            this.editForm.subitemAdditionalParameter = this.ruleArgsList.map(e=>e.ruleArgs)

            let result= await updateApprovalSubitemSubkey(this.editForm);
            if(!result.success) return;
            this.$message.success('编辑成功')
            this.editBtnLoading=false;
            this.editDialogVisible=false; 
            this.$refs.editForm.resetFields()
            this.resetForms()
            this.getSubitemRules();

        },
        async handleEdit(row){
            let res = await getByApprovalSubitemSubkeyId({id :row.id })
            // let result = await listSubitemNameByRuleId({RuleId :row.ruleId })
            console.log(res)
            // console.log(this.approvalSubList,'111')
            // console.log(result)
            this.editForm = res.data;
            if(Array.isArray(this.editForm.subitemInput)) {this.ruleInputsList = this.editForm.subitemInput.map(e=>({value1:e.材料编号,value2:e.字段名}))} 
            if(Array.isArray(this.editForm.subitemAdditionalParameter)) {this.ruleArgsList = this.editForm.subitemAdditionalParameter.map(e=>({ruleArgs:e}))}
            this.editDialogVisible=true;
            this.checkpointList = []
            this.approvalSubTextChange = true
        },
        async handleDelete(row){
            try{
                await this.$confirm("是否确定删除",'提示')
                let result = await deleteApprovalSubitemSubkey({id :row.id});
                if(!result.success){
                    this.$message.error("删除失败")
                }
                this.$message.success("删除成功");
                this.getSubitemRules();
                return;

            }catch (e) {
                return;
            }
          
        
        },
        // 取消，关闭
        resetForms() {
            this.checkpointList = []
            this.ruleInputsList=[{ value1:'', value2:'',}],
            //依据
            this.ruleLawList=[{ruleLaw:''}],
            //附加
            this.ruleArgsList=[{ruleArgs:''}]
            this.approvalSubTextChange = true
        },
        handleAdd(){
            this.addDialogVisible=true;
            this.checkpointList = []
        },
        async add(){
            let ruleInputs = this.ruleInputsList.map(v=>({'材料编号':v.value1,'字段名':v.value2}))
            this.addForm.subitemInput = ruleInputs
            this.addForm.subitemAdditionalParameter = this.ruleArgsList.map(e=>e.ruleArgs)
            this.addForm.approvalItemId = this.itemId
            let result = await addApprovalSubitemSubkey(this.addForm);
            if(!result.success) return
            this.$message.success('新增情形提取规则成功')
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.resetForms()
            this.getSubitemRules();
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
        /deep/ .el-form-item.ruleItem.el-form-item--mini .el-form-item__content{
            display: flex;
            align-items: center;
            // justify-content: space-between;
            flex-wrap: wrap;
        }
        .ruleItems{  
            width: 95%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-right: 10px;
            margin-bottom: 5px;
            
        }

}
</style>