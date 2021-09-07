<template>
    <div class="workWrap">
        <header>情形管理</header>
        <el-button @click="addDialogVisible = true" type="primary" style="margin-bottom:10px">添加</el-button>
        <el-button @click="handleImport()" type="primary" style="margin-bottom:10px">导入情形</el-button>
        <!-- <el-switch v-model="isExpand" active-text="列表展开" inactive-text="列表收起" active-color="#13ce66"
            inactive-color="#ff4949" @change="changeExpand"></el-switch> -->
        <el-table :data="tableData" border :row-style="{height:'60px'}" :header-row-style="{height:'50px'}"
            :default-expand-all="isExpand">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <div class="title-box">
                        <span style="margin-right: 20px">关联一级材料</span>
                        <el-switch v-model="scope.row.materialShow" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                        <el-button type="primary" style="margin-left: 20px"
                            @click="addText(0,scope.row.material.length,scope.row.material)">+新增</el-button>
                    </div>
                    <el-table v-if="scope.row.materialShow" :data="scope.row.material" border
                        style="width: calc(100% - 47px)" class="sub-table">
                        <el-table-column prop="materialName" label="事项一级材料" show-overflow-tooltip>
                            <template slot-scope="scopeM">
                                <el-select v-if="scopeM.row.flag" v-model="scopeM.row.materialId" placeholder="请选择材料名称">
                                    <el-option v-for="item in bangBanOptions" :key="item.materialId"
                                        :label="item.materialName" :value="item.materialId" />
                                </el-select>
                                <span v-else>{{scopeM.row.materialName}}</span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="templateName" label="模板名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="docxTemplateName" label="超级帮办模板名称" show-overflow-tooltip>
                        </el-table-column> -->
                        <el-table-column prop="documentSeq" label="文档序号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="descriptionInfo" label="材料产生逻辑" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="subAndMaterialDescriptionInfo" label="逻辑描述" show-overflow-tooltip>
                            <template slot-scope="scopeD">
                                <el-input v-if="scopeD.row.flag" placeholder="逻辑描述"
                                    v-model="scopeD.row.subAndMaterialDescriptionInfo" clearable>
                                </el-input>
                                <span v-else>{{scopeD.row.subAndMaterialDescriptionInfo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="uploadDescription" label="是否必需上传逻辑说明" show-overflow-tooltip>
                            <template slot-scope="scopeD">
                                <el-input v-if="scopeD.row.flag"
                                    type="textarea" :rows="2" placeholder="逻辑说明"
                                    v-model="scopeD.row.uploadDescription" clearable>
                                </el-input>
                                <span v-else>{{scopeD.row.uploadDescription}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scopeHandle">
                                <div v-if="scopeHandle.row.flag">
                                    <el-button size="mini" icon="el-icon-close"
                                        @click="closeText(scopeHandle.row, scopeHandle.$index, scope.row.material)">
                                    </el-button>
                                    <el-button size="mini" type="primary" icon="el-icon-check"
                                        @click="saveText(scopeHandle.row,scopeHandle.$index, scope.row.material, scope.row.subitem.approvalSubitemId)">
                                    </el-button>
                                </div>
                                <div v-else>
                                    <!-- <el-button size="mini" @click="addText(scope.row,scope.$index, tableData)"
                                        style="margin-left: 20px" icon="el-icon-plus">
                                    </el-button> -->
                                    <el-button size="mini" type="danger"
                                        @click="handleDeleteMaterial(scopeHandle.row, scopeHandle.$index, scope.row.material)"
                                        icon="el-icon-minus">
                                    </el-button>
                                    <el-button size="mini" type="primary"
                                        @click="Edit(scopeHandle.row,scopeHandle.$index, scope.row.material)"
                                        icon="el-icon-edit">
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="title-box">
                        <span style="margin-right: 20px">关联二级材料</span>
                        <el-switch v-model="scope.row.documentShow" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                        <el-button type="primary" style="margin-left: 20px"
                            @click="addTextAI(0, scope.row.documentSub.length, scope.row.documentSub)">+新增</el-button>
                    </div>
                    <el-table v-if="scope.row.documentShow" :data="scope.row.documentSub" border
                        style="width: calc(100% - 47px)" class="sub-table">
                        <el-table-column prop="documentsubDisplayname" label="事项二级材料" show-overflow-tooltip>
                            <template slot-scope="scopeM">
                                <el-select v-if="scopeM.row.flagAI" v-model="scopeM.row.approvalItemAndDocumentsubId"
                                    placeholder="请选择材料名称">
                                    <el-option v-for="item in AIMOptions" :key="item.id"
                                        :label="item.documentsubDisplayname" :value="item.id" />
                                </el-select>
                                <span v-else>{{scopeM.row.documentsubDisplayname}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="isRequired" label="是否必须" show-overflow-tooltip>
                            <template slot-scope="scopeR">
                                <el-select v-if="scopeR.row.flagAI" v-model="scopeR.row.isRequired"
                                    placeholder="请选择是否必须">
                                    <el-option label="是" :value="Number(1)"></el-option>
                                    <el-option label="否" :value="Number(0)"></el-option>
                                </el-select>
                                <span v-else>{{scopeR.row.isRequired == Number(1)? '是':'否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requiredDescription" label="是否必需上传逻辑说明" show-overflow-tooltip>
                            <template slot-scope="scopeD">
                                <el-input v-if="scopeD.row.flagAI"
                                    type="textarea" :rows="2" placeholder="逻辑说明"
                                    v-model="scopeD.row.requiredDescription" clearable>
                                </el-input>
                                <span v-else>{{scopeD.row.requiredDescription}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scopeHandle">
                                <div v-if="scopeHandle.row.flagAI">
                                    <el-button size="mini" icon="el-icon-close"
                                        @click="closeTextAI(scopeHandle.row, scopeHandle.$index, scope.row.documentSub)">
                                    </el-button>
                                    <el-button size="mini" type="primary" icon="el-icon-check"
                                        @click="saveTextAI(scopeHandle.row,scopeHandle.$index, scope.row.documentSub, scope.row.subitem.approvalSubitemId)">
                                    </el-button>
                                </div>
                                <div v-else>
                                    <!-- <el-button size="mini" @click="addText(scope.row,scope.$index, tableData)"
                                        style="margin-left: 20px" icon="el-icon-plus">
                                    </el-button> -->
                                    <el-button size="mini" type="danger"
                                        @click="handleDeleteMaterialAI(scopeHandle.row, scopeHandle.$index, scope.row.documentSub)"
                                        icon="el-icon-minus">
                                    </el-button>
                                    <el-button size="mini" type="primary"
                                        @click="EditAI(scopeHandle.row,scopeHandle.$index, scope.row.documentSub)"
                                        icon="el-icon-edit">
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column prop="subitem.subitemName" label="情形" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subitem.aliasName" label="别名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subitem.materialName" label="所需材料" :formatter="formatterMaterial"
                show-overflow-tooltip></el-table-column>
            <el-table-column prop="subitem.note" label="备注" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subitem.createTime" label="创建时间" :formatter="timeFormatter" width="160">
            </el-table-column>
            <el-table-column prop="subitem.updateTime" label="更新时间" :formatter="timeFormatter" width="160">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <!-- <el-button @click="handleMaterialEdit(scope)" type="primary">材料编辑</el-button> -->
                        <el-button @click="handleEdit(scope)" type="primary">编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
                layout="total, prev, pager, next" :total="total"></el-pagination>
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
        <!-- <el-dialog title="编辑情形所需材料" :visible.sync="editDialogVisibleM" width="50%" :close-on-click-modal="false">
            <el-form label="材料名称">
                <el-select multiple placeholder="请选择材料名称" v-model="ids">
                    <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                        :value="v.materialId"> </el-option>
                </el-select>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisibleM = false">取 消</el-button>
                <el-button type="primary" @click="editSubMaterial">确 定</el-button>
            </span>
        </el-dialog> -->
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
                <el-select v-model="temp_page_projectId" placeholder="请选择项目名称" @change="selectProject"
                    style="position:relative;margin: 10px 20px 10px 0px">
                    <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
                <el-select clearable filterable placeholder="请选择事项名称或者输入关键词" v-model="idd" @change="selectOne"
                    style="position:relative;margin: 10px 0px" remote reserve-keyword :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                        :value="v.approvalItemId">
                    </el-option>

                    <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                        <a class="text-normal">
                            <el-pagination @size-change="handleSizeChangeSelect"
                                @current-change="handleCurrentChangeSelect" :current-page="currentPageSelect"
                                :total="totalAim" :page-size="pageSize" layout="prev, pager, next" />
                        </a>
                    </div>
                </el-select>
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
        <!-- 关联帮办、AI相关dialog -->
        <!-- <el-dialog title="添加关联帮办材料" :visible.sync="addRelateMaterialDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="80px" :model="addRelateMaterialForm">
                <div class="">
                    <span>帮办材料:</span>
                    <el-select v-model="addRelateMaterialForm.materialId" placeholder="请选择材料名称"
                    style="position:relative;margin: 10px 20px 10px 0px">
                        <el-option v-for="item in bangBanOptions" :key="item.materialId" :label="item.materialName"
                            :value="item.materialId">
                        </el-option>
                    </el-select>
                    <span>逻辑描述:</span>
                    <span><el-input v-model="addRelateMaterialForm.descriptionInfo"></el-input></span>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRelateMaterialDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRelateMaterial">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>
import {mixin} from "@/mixin/mixin";
import { getApprovalSub, 
    addApprovalSub, updateApprovalSub, deleteApprovalSub, relateMaterial, listApprovalSubAll, listApprovalSubAndMaterial,
    updateSubitemAndMaterial, deleteSubitemAndMaterial, addSubitemAndMaterial, addSubitemAndDocumentNew, deleteSubitemAndDocumentNew,
    updateSubitemAndDocumentNew
} from "@/api/basicInfo/approvalSub"
import { getAllByApprovalItemId } from "@/api/basicInfo/field";
import { listApprovalItemByUser, copyApprovalSub, listProjectAll } from "@/api/basicInfo/approval";
import { listDocumentSubByItemId } from '@/api/basicInfo/ApprovalRules';
import dayjs from "dayjs"

export default {
    name: "ApprovalSubItem",
    mixins: [mixin],
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
                subitemName: ""
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
            // 导入字段
            projectId: null,
            temp_page_projectId: null,
            projectOptions: [],
            // 关联材料相关
            expands: [],
            addRelateMaterialDialogVisible: false,
            addRelateMaterialForm: {
                approvalSubitemId: '',
                subitemAndMaterialList: []
            },
            bangBanOptions: [],
            isExpand: true,
            // AI材料关联
            AIMOptions: [],
            flagCount: 0,
        };
    },
    computed: {
        // isExpanded() {
        //     return this.isExpand;
        // }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        this.reloadTable();
        this.getBangBanOptions();
        this.getAIMOptions();
    },
    methods: {
        // 查询表格
        async reloadTable() {
            let result = await listApprovalSubAndMaterial({ pageNum: this.currentPage, approvalItemId: this.itemId });

            if (!result.success) return;
            this.total = result.data.total;
            result.data.records.forEach(item => {
                // if (!item.hasOwnProperty('materialShow')) {
                    this.$set(item, "materialShow", true);
                // }
                // if (!item.hasOwnProperty('documentShow')) {
                    this.$set(item, "documentShow", true);
                // }     
            });
            this.tableData = result.data.records;
            this.flagCount = 0; 
        },
        //  切页
        handleCurrentChange() {
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
        async handleSizeChangeSelect(size) {
            this.selectData = [];
            this.pageSize = size;
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.temp_page_projectId });
            this.typeSubItemOptions = result.data.records;
        },
        async handleCurrentChangeSelect(current) {
            this.selectData = [];
            this.currentPageSelect = current;
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.temp_page_projectId });
            this.typeSubItemOptions = result.data.records;
        },
        //远程搜索
        async remoteMethod(query) {
            if (query !== '') {
                let result = await listApprovalItemByUser({ keyword: query, pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.temp_page_projectId });
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    this.totalAim = result.data.total;
                    this.typeSubItemOptions = result.data.records;

                })
            }
        },
        //导入情形
        async handleImport() {
            // let result = await listApprovalItem({pageNum: this.currentPageSelect,pageSize: this.pageSize,projectId: this.$route.query.projectId,});
            // this.typeSubItemOptions = result.data.records;
            // this.totalAim = result.data.total;
            let resultProject = await listProjectAll();
            this.projectOptions = resultProject.data;

            this.importDialogVisible = true;
        },
        async selectProject() {
            this.idd = '';
            this.tableDataSS = [];
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.temp_page_projectId });
            this.typeSubItemOptions = result.data.records;
            this.totalAim = result.data.total;
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
        async selectOne() {
            this.tableDataSS = [];
            let result = await listApprovalSubAll({ approvalItemId: this.idd });
            if (!result.success) return;
            this.total = result.data.total;
            this.tableDataSS = result.data;
        },
        // 查询当前事项下的所有材料
        async materialList() {
            let result = await getAllByApprovalItemId({ approvalItemId: this.itemId });

            if (!result.success) return;
            this.typeMaterialOptions = result.data;
        },
        //处理材料编辑
        async handleMaterialEdit(scope) {
            // this.materialList();
            let result = await getAllByApprovalItemId({ approvalItemId: this.itemId });
            this.approvalSubitem = scope.row.approvalSubitem;
            if (result.data.length == 0) {
                this.$message({ type: "warning", message: "该事项还未添加材料" })
            } else {
                if (!result.success) return;
                this.typeMaterialOptions = result.data;
                if (scope.row.material != null) {
                    console.log(scope.row.material)
                    this.ids = scope.row.material
                        .filter(v => v != null)
                        .map(v => v.materialId)
                } else {
                    this.ids = [];
                }

                this.editDialogVisibleM = true;
            }
        },
        // 所需材料编辑
        // async editSubMaterial() {

        //     let result = await relateMaterial({ approvalSubitemId: this.approvalSubitem.approvalSubitemId, materialIds: this.ids });
        //     if (!result.success) return;
        //     this.reloadTable();
        //     this.editDialogVisibleM = false;
        // },
        formatterMaterial(row, column) {
            var materialNameList = []
            if (row.material != null) {
                for (let i = 0; i < row.material.length; i++) {
                    if (row.material[i] === null) {
                        console.log("111:", row.material[i])
                    } else {
                        materialNameList.push(row.material[i].materialName)
                    }
                }
            }

            return materialNameList.join(",");
        },
        // 处理编辑
        handleEdit(scope) {
            console.log('scope.row.subitem');
            console.log(scope.row.subitem);
            this.editForm = _.clone(scope.row.subitem);
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
                let result = await deleteApprovalSub({ approvalSubitemId: scope.row.subitem.approvalSubitemId });
                if (!result.success) return;
                this.$message({ type: "success", message: "删除成功" })
                this.reloadTable();
            } catch (e) {
                this.$message({ type: "warning", message: "取消删除" })
            }
        },

        // 关联帮办材料相关
        // async openBangban(scope) {
        //     this.addRelateMaterialDialogVisible = true;
        //     let result = await getAllByApprovalItemId({ approvalItemId: this.itemId });

        //     if (!result.success) return;
        //     this.bangBanOptions = result.data;
        // },
        // 获取帮办材料下拉框选项
        async getBangBanOptions() {
            let result = await getAllByApprovalItemId({ approvalItemId: this.itemId });
            if (!result.success) return;
            this.bangBanOptions = result.data;
        },
        // 列表开关
        async changeExpand() {
            console.log(this.isExpand);
            // await this.reloadTable();
        },
        // 新增
        async addText(item, index, rows) {
            if(this.checkFlagCount()){
                this.$message({ type: "warning", message: "不能同时编辑多条数据，请先保存" })
                return;
            }
            this.flagCount++;
            console.log(item, index, rows)
            if (item == 0) {
                rows.splice(index + 1, 0, {
                    // approvalSubitemId: '',
                    // subitemName: '',
                    // globalDocumentSubId: '',
                    // isRequired: '',
                    flag: true
                })
            } else {
                rows.splice(index + 1, 0, {
                    // approvalSubitemId: Number(item.approvalSubitemId),
                    // subitemName: item.subitemName,
                    // globalDocumentSubId: '',
                    // isRequired: '',
                    flag: true
                });
            }
        },
        // 取消
        async closeText(item, index, rows) {
            console.log(item, index, rows, '0000')
            if (item.edits) {
                this.$set(item, 'flag', null)
            } else {
                rows.splice(index, 1)
            }
            await this.reloadTable();
        },
        // 保存
        async saveText(item, index, rows, approvalSubitemId) {
            if (item.edits) {
                delete item.edits
                delete item.flag
                let request = {
                    approvalItemId: Number(this.itemId),
                    approvalSubitemId: approvalSubitemId,
                    id: item.id,
                    subAndMaterialDescriptionInfo: item.subAndMaterialDescriptionInfo,
                    materialId: item.materialId,
                    uploadDescription: item.uploadDescription
                }
                const result = await updateSubitemAndMaterial(request)
                console.log(result, 'result')
            } else {
                delete item.flag
                let request = {
                    approvalItemId: Number(this.itemId),
                    approvalSubitemId: approvalSubitemId,
                    subAndMaterialDescriptionInfo: item.subAndMaterialDescriptionInfo,
                    materialId: item.materialId,
                    uploadDescription: item.uploadDescription

                }
                const res = await addSubitemAndMaterial(request)
                console.log(res, 'res')
            }
            // this.isExpand = true;
            await this.reloadTable();
            // this.isExpand = true;
        },
        // 修改
        Edit(item, index, rows) {
            if(this.checkFlagCount()){
                this.$message({ type: "warning", message: "不能同时编辑多条数据，请先保存" })
                return;
            }
            this.flagCount++;
            this.$set(item, 'flag', true)
            this.$set(item, 'edits', true)
        },
        // 删除
        async handleDeleteMaterial(item, index, rows) {
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
            let result = await deleteSubitemAndMaterial({ id: item.id });
            if (!result.success) return;
            await this.reloadTable();
        },

        // 关联AI材料相关addTextAI
        // 获取下拉框数据
        async getAIMOptions() {
            let result = await listDocumentSubByItemId({ approvalItemId: this.itemId });
            if (!result.success) return;
            this.AIMOptions = result.data;
        },
        // 新增
        async addTextAI(item, index, rows) {
            if(this.checkFlagCount()){
                this.$message({ type: "warning", message: "不能同时编辑多条数据，请先保存" })
                return;
            }
            this.flagCount++;
            console.log(item, index, rows)
            if (item == 0) {
                rows.splice(index + 1, 0, {
                    // approvalSubitemId: '',
                    // subitemName: '',
                    // globalDocumentSubId: '',
                    // isRequired: '',
                    flagAI: true
                })
            } else {
                rows.splice(index + 1, 0, {
                    // approvalSubitemId: Number(item.approvalSubitemId),
                    // subitemName: item.subitemName,
                    // globalDocumentSubId: '',
                    // isRequired: '',
                    flagAI: true
                });
            }
        },
        // 取消
        async closeTextAI(item, index, rows) {
            console.log(item, index, rows, '0000')
            if (item.editsAI) {
                this.$set(item, 'flagAI', null)
            } else {
                rows.splice(index, 1)
            }
            await this.reloadTable();
        },
        // 保存
        async saveTextAI(item, index, rows, approvalSubitemId) {
            console.log(item)
            if (item.editsAI) {
                delete item.edits
                delete item.flag
                let request = {
                    approvalSubitemId: approvalSubitemId,
                    id: item.id,
                    // globalDocumentSubId: item.globalDocumentSubId,
                    approvalItemAndDocumentsubId: item.approvalItemAndDocumentsubId,
                    isRequired: item.isRequired,
                    requiredDescription: item.requiredDescription
                }
                const result = await updateSubitemAndDocumentNew(request)
                console.log(result, 'result')
            } else {
                delete item.flag
                let request = {
                    approvalItemId: Number(this.itemId),
                    approvalSubitemId: approvalSubitemId,
                    // globalDocumentSubId: item.globalDocumentSubId,
                    approvalItemAndDocumentsubId: item.approvalItemAndDocumentsubId,
                    isRequired: item.isRequired,
                    requiredDescription: item.requiredDescription
                }
                const res = await addSubitemAndDocumentNew(request)
                console.log(res, 'res')
            }
            // this.isExpand = true;
            await this.reloadTable();
            // this.isExpand = true;
        },
        // 修改
        EditAI(item, index, rows) {
            if(this.checkFlagCount()){
                this.$message({ type: "warning", message: "不能同时编辑多条数据，请先保存或取消" })
                return;
            }
            this.flagCount++;
            this.$set(item, 'flagAI', true)
            this.$set(item, 'editsAI', true)
        },
        // 删除
        async handleDeleteMaterialAI(item, index, rows) {
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
            let result = await deleteSubitemAndDocumentNew({ SubitemAndDocumentNewId: item.id });
            if (!result.success) return;
            await this.reloadTable();
        },
        checkFlagCount(){
            if(this.flagCount >= 1){
                return true;
            }
            return false;
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
    .title-box {
        font-size: 16px;
        font-weight: bold;
        line-height: 40px;
        letter-spacing: 1px;
    }
}
</style>