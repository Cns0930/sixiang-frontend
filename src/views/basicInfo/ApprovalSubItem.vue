<template>
    <div class="workWrap">
        <header>情形管理</header>
        <el-button @click="addDialogVisible = true" type="primary" style="margin-bottom:10px">添加</el-button>
        <el-button @click="handleImport()" type="primary" style="margin-bottom:10px">导入情形</el-button>
        <el-table :data="tableData" border>
            <el-table-column prop="approvalSubitem.subitemName" label="情形"></el-table-column>
            <el-table-column prop="approvalSubitem.aliasName" label="别名"></el-table-column>
            <el-table-column prop="material.materialName" label="所需材料" :formatter="formatterMaterial"></el-table-column>
            <el-table-column prop="approvalSubitem.note" label="备注"></el-table-column>
            <el-table-column prop="approvalSubitem.createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column prop="approvalSubitem.updateTime" label="更新时间" :formatter="timeFormatter"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleMaterialEdit(scope)" type="primary">材料编辑</el-button>
                        <el-button @click="handleEdit(scope)" type="primary">编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePagination">
            <el-pagination  @current-change="handleCurrentChange"
                :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
                :total="total"></el-pagination>
        </div>
        <el-dialog title="添加情形" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addForm">
                <el-form-item label="情形名称">
                    <el-input v-model="addForm.subitemName"></el-input>
                </el-form-item>
                <el-form-item label="情形别名">
                    <el-input v-model="addForm.aliasName"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSubApproval">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑情形所需材料" :visible.sync="editDialogVisibleM" width="50%" :close-on-click-modal="false">
            <el-form label="材料名称">
                    <el-select multiple placeholder="请选择材料名称" v-model="ids">
                        <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName" :value="v.materialId"> </el-option>
                    </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisibleM = false">取 消</el-button>
                <el-button type="primary" @click="editSubMaterial">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑情形" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="editForm">
                <el-form-item label="情形名称" prop="subitemName">
                    <el-input v-model="editForm.subitemName"></el-input>
                </el-form-item>
                <el-form-item label="情形别名">
                    <el-input v-model="editForm.aliasName"></el-input>
                </el-form-item>
              
                <el-form-item label="备注">
                    <el-input v-model="editForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSubApproval">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="导入已有事项的情形" :visible.sync="importDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label="事项名称">
                    <el-select clearable filterable placeholder="请选择事项名称或者输入关键词" v-model="idd" @change="selectOne" style="position:relative" 
                    remote reserve-keyword :remote-method="remoteMethod" :loading="loading"> 
                        <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName" :value="v.approvalItemId"> 
                            
                        </el-option>
                   
                    <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                            <a class="text-normal">
                                <el-pagination @size-change="handleSizeChangeSelect" @current-change="handleCurrentChangeSelect"
                                            :current-page="currentPageSelect" :total="totalAim"
                                            :page-size="pageSize"
                                            layout="prev, pager, next"/>
                            </a>
                            </div> </el-select>
            </el-form>
                
            <el-table :data="tableDataSS" border>
            <el-table-column prop="subitemName" label="情形"></el-table-column>
            <el-table-column prop="aliasName" label="别名"></el-table-column>
        </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="importSubApproval">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import { getApprovalSub, addApprovalSub, updateApprovalSub, deleteApprovalSub, relateMaterial,listApprovalSubAll } from "@/api/basicInfo/approvalSub"
import { getAllByApprovalItemId } from "@/api/basicInfo/field";
import { listApprovalItem,copyApprovalSub } from "@/api/basicInfo/approval";
import dayjs from "dayjs"

export default {
    name: "ApprovalSubItem",
    mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "subItem",
            itemId: this.$route.query.itemId,
            addDialogVisible: false,
            importDialogVisible: false,
            tableData: [],
            tableDataSS: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            totalAim: 0,
            addForm: {
                aliasName: "",
                note: "",
                subitemName: "",
            },
            editDialogVisible: false,
            editDialogVisibleM: false,
            typeMaterialOptions: [],
            typeSubItemOptions: [],
            currentPageSelect: 1,
            selectData: [],
            tableDataSS: [],
            temp_selected_fields: [],
            loading: false,
            materials: "",
            editForm: {
                approvalSubitemId: 0,
                aliasName: "",
                note: "",
                subitemName: "",
            },
            ids: [],
            idd: "",
        };
    },
    async created() {
        // await this.init();
        this.reloadTable();
    },
    methods: {
        // 查询表格
        async reloadTable() {
            let result = await getApprovalSub({pageNum:this.currentPage,approvalItemId: this.itemId});
            console.log("result:",result);
            if (!result.success) return;
            this.total = result.data.total;
            this.tableData = result.data.records;
        },
        //  切页
        handleCurrentChange(){
            this.reloadTable();
        },
        // 添加
        async addSubApproval() {
            let result = await addApprovalSub({
                "aliasName": this.addForm.aliasName,
                "approvalItemId": this.itemId,
                "note": this.addForm.note,
                "subitemName": this.addForm.subitemName
            })
            if (!result.success) return;
            this.addDialogVisible = false;
            this.reloadTable();
            this.$message({ type: "success", message: "添加成功" })

        },
        //下拉框带分页
        async handleSizeChangeSelect(size){
            this.selectData = [];
            this.pageSize = size;
            let result = await listApprovalItem({pageNum: this.currentPageSelect,pageSize: this.pageSize});
            this.typeSubItemOptions = result.data.records;
        },
        async handleCurrentChangeSelect(current){
            this.selectData = [];
            this.currentPageSelect = current;
            let result = await listApprovalItem({pageNum: this.currentPageSelect,pageSize: this.pageSize});
            this.typeSubItemOptions = result.data.records;
        },
        //远程搜索
        async remoteMethod(query){
            if(query !== ''){
                let result = await listApprovalItem({keyword:query, pageNum: this.currentPageSelect,pageSize: this.pageSize});
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.totalAim = result.data.total;
                    this.typeSubItemOptions = result.data.records;
                    
                })
            }
        },
        //导入情形
        async handleImport(){
            let result = await listApprovalItem({pageNum: this.currentPageSelect,pageSize: this.pageSize});
            this.typeSubItemOptions = result.data.records;
            this.totalAim = result.data.total;
            console.log("resulthhh:",this.typeSubItemOptions);
            this.importDialogVisible = true;
        },
        async importSubApproval() {
            let result = await copyApprovalSub({
                "aimsItemId": this.itemId,
                "sourceItemId": this.idd
            })
            if (!result.success) return;
            this.importDialogVisible = false;
            this.reloadTable();
            this.$message({ type: "success", message: "添加成功" })

        },
        async selectOne(){
            this.tableDataSS = [];
            let result = await listApprovalSubAll({approvalItemId: this.idd});
            if (!result.success) return;
            this.total = result.data.total;
            this.tableDataSS = result.data;
        },
        // 查询当前事项下的所有材料
        async materialList(){
            let result = await getAllByApprovalItemId({approvalItemId: this.itemId});
            console.log("result:",result)
            if (!result.success) return;
            this.typeMaterialOptions = result.data;
        },
        //处理材料编辑
        async handleMaterialEdit(scope){
            // this.materialList();
            let result = await getAllByApprovalItemId({approvalItemId: this.itemId});
            this.approvalSubitem = scope.row.approvalSubitem;
            if(result.data.length == 0){
                this.$message({ type: "warning", message: "该事项还未添加材料" })
            }else{
                if (!result.success) return;
                this.typeMaterialOptions = result.data;
                if(scope.row.material != null){
                    this.ids = scope.row.material.map(v  => v.materialId)
                }else{
                    this.ids = [];
                }
                
                this.editDialogVisibleM = true;
            }
        },
        // 所需材料编辑
        async editSubMaterial() {
            
            let result = await relateMaterial({approvalSubitemId: this.approvalSubitem.approvalSubitemId,materialIds: this.ids});
            if (!result.success) return;
            this.reloadTable();
            this.editDialogVisibleM = false;
        },
        formatterMaterial(row,column){
            var materialNameList = []
            if(row.material != null){
                for(let i = 0;i<row.material.length;i++){
                    if(row.material[i] === null){
                        console.log("111:",row.material[i])
                    }else{
                        materialNameList.push(row.material[i].materialName)
                    }
             }
            }
            
            return materialNameList.join(",");
        },
        // 处理编辑
        handleEdit(scope) {
            this.editForm = _.clone(scope.row.approvalSubitem);
            this.editDialogVisible = true;
        },
        // 编辑
        async editSubApproval() {
            let result = await updateApprovalSub(this.editForm);
            if (!result.success) return;
            this.reloadTable();
            this.editDialogVisible = false;
        },
        // 删除
        async handleDelete(scope) {
            try {
                await this.$confirm("是否删除", "确认删除",);
                let result = await deleteApprovalSub({ approvalSubitemId: scope.row.approvalSubitem.approvalSubitemId });
                if (!result.success) return;
                this.$message({ type: "success", message: "删除成功" })
                this.reloadTable();
            } catch (e) {
                this.$message({ type: "warning", message: "取消删除" })
            }


        }
    }
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
    }
}
</style>