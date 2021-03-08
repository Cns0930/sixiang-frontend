<template>
    <div class="form-constructor">
        <div class="op-bar">
            <div class="left-bar">
                <el-button @click="handleAddBaseField">创建字段模型</el-button>
                <!-- <el-button @click="handleAddComputedField">创建合成字段模型</el-button> -->

                <!-- <el-button @click="$router.push('/templatemanager')"> -> 模板管理</el-button> -->

                <el-button @click="load">载入字段</el-button>
                <el-button @click="handlePreview">预览全字段</el-button>
            </div>

            <div class="right-bar">
                <el-button @click="handleSelect">导入自选字段</el-button>
                <el-button @click="handleImportPublic">导入公共字段</el-button>
                <!-- <el-button :disabled="itemId==-1" @click="handleManagePublic">管理公共字段</el-button> -->
            </div>
            
        </div>
        <div class="searchBox">
            <div class="left">
                <el-input placeholder="筛选字段名称或者字段编号" v-model="valueF" clearable style="width:240px"></el-input>
                <el-select v-model="temp_type_search" clearable filterable placeholder="筛选组件类型" style="width:240px">
                    <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value" ></el-option>
                </el-select>
                
                <el-select v-model="field_type" placeholder="筛选字段类型" clearable >
                        <el-option label="基本字段" value="1"></el-option>
                        <el-option label="合成字段" value="2"></el-option>
                    </el-select>
                <el-button @click="fieldSearch()">搜索</el-button>
                </div>
                <div class="right">
                <el-pagination 
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[15, 30, 50, 100, 200, 300]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next"
                    :total="totalCount"
                ></el-pagination>
                </div>
        </div>
        <div class="main">                       
            <!-- 字段表格 -->
            <div class="fields-table" style="width: 100%;padding:10px 60px">
                <!-- <draggable @start="drag=true" @end="drag=false"> -->
                <el-table :data="tableData" border style="width: 100%" row-key="id" :row-style="{height:'40px'}" :header-row-style="{height:'50px'}"
                    :tree-props="{children: 'list', hasChildren: 'hasChildren'}" default-expand-all :height="tableHeight">
                    <el-table-column fixed prop="fieldNo" label="fieldNo" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="fieldName" label="字段名称" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="label" label="label" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="type" label="组件名" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="fieldType" label="类型" :formatter="formatFieldType" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="validationInfo" label="前端验证信息" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="descriptionInfo" label="字段描述信息" show-overflow-tooltip> </el-table-column>
                    <el-table-column prop="remark" label="备注" show-overflow-tooltip width="150"> </el-table-column>
                    <el-table-column fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleClickFieldDY(scope.row);" type="text" size="small"> 需求编辑</el-button>
                            <el-button @click="handleClickField(scope.row);" type="text" size="small"> 编辑</el-button>
                            <el-button @click="handleClickChangeType(scope);" type="text" size="small">更改组件类型
                            </el-button>
                            <el-button v-if="scope.row.isList" @click="handleClickAddChild(scope.row);" type="text" size="small">添加子项
                            </el-button>
                            <el-button v-if="scope.row.fieldType==3" @click="handleClickChildToParent(scope.row);" type="text" size="small">转为基本字段
                            </el-button>
                            <el-button @click="handleDeleteField(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                 <!-- </draggable> -->
                <div class="tablePagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 15, 30, 50, 100, 200, 300]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount"
                    ></el-pagination>
                </div>
            </div>
        </div>
        
        <!-- 编辑 -->
        <el-dialog title="字段组件属性填写" :visible.sync="editDialogVisible" width="80%" :close-on-click-modal="false" >
            <div class="attribute-content">
                <div v-if="temp_field_info">
                    <div class="attribute">字段说明信息: {{temp_field_info.descriptionInfo}}</div>
                    <div class="attribute">前端验证信息: {{temp_field_info.validationInfo}}</div>
                </div>
                <el-divider></el-divider>

                <div v-if="temp_fieldObj && editDialogVisible">
                    <div class="attribute">
                        <span class="attribute-key">fieldNo</span>
                        <el-input class="attribute-value" v-model="temp_fieldObj.fieldNo"></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">label</span>
                        <el-input class="attribute-value" v-model="temp_fieldObj.label"></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">备注(以此为准)</span>
                        <el-input class="attribute-value" v-model="temp_fieldObj.remark"></el-input>
                    </div>
                    <div class="attribute" v-for="(v,i) in temp_fieldObj.componentDefs" :key="i">
                        <span class="attribute-key">{{v.label || i}} </span>
                        <component class="attribute-value" :is="v.renderTemplateName" v-model="v.value"
                            v-bind="v.attributes" :key="temp_fieldObj.fieldNo+v.renderTemplateName"></component>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSaveField(temp_fieldObj);editDialogVisible = false">确 定
                </el-button>
            </span>
        </el-dialog>
        <!-- 调研人员编辑 -->
        <el-dialog title="字段组件属性填写" :visible.sync="editDialogVisibleDY" width="80%" :close-on-click-modal="false" >
            <div class="attribute-content">
                <div v-if="temp_fieldObj">
                    <div class="attribute">
                        <span class="attribute-key">fieldNo</span>
                        <el-input v-model="temp_fieldObj.fieldNo"></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">fieldName</span>
                        <el-input v-model="temp_fieldObj.fieldName"></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">label</span>
                        <el-input v-model="temp_fieldObj.label"></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">字段描述信息</span>
                        <el-input type="textarea" v-model="temp_fieldObj.descriptionInfo" autosize></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">前端信息验证</span>
                        <el-input type="textarea" v-model="temp_fieldObj.validationInfo" autosize></el-input>
                    </div>
                   <!-- <div class="attribute" v-for="(v,i) in temp_fieldObj.componentDefs" :key="i">
                        <span class="attribute-key">{{v.label || i}} </span>
                        <component class="attribute-value" :is="v.renderTemplateName" v-model="v.value"
                            v-bind="v.attributes" :key="temp_fieldObj.fieldNo+v.renderTemplateName"></component>
                    </div> -->
                    <!-- 关联审批点 -->
                    <!-- <div class="attribute">
                        <span class="attribute-key">关联材料审批点</span>
                        <el-cascader placeholder="选择材料审批点" :options="basicFieldOptions" filterable v-model="temp_relate_fieldId" clearable></el-cascader>
                    </div> -->

                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisibleDY = false">取 消</el-button>
                <el-button type="primary" @click="handleSaveFieldReseacher(temp_fieldObj)">确 定
                </el-button>
            </span>
        </el-dialog>

        <!-- 创建基本字段 -->
        <el-dialog title="创建基本字段" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false">
            <div>
                字段前端标签(label):
                <el-input v-model="temp_label" @change="changeLable"></el-input>
            </div>
            <div>
                字段编号(fieldNo):
                <el-input v-model="temp_fieldNo"></el-input>
            </div>
            <div>
                字段名称(fieldName):
                <el-input v-model="temp_fieldName"></el-input>
            </div>
            <div>
                <el-select v-model="temp_type" filterable>
                    <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFieldConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建子项字段 -->
        <el-dialog title="创建子项字段" :visible.sync="dialogChildVisible" width="600px" :close-on-click-modal="false">
            <div>
                字段前端标签(label):
                <el-input v-model="temp_label" @change="changeLable"></el-input>
            </div>
            <div>
                字段编号(fieldNo):
                <el-input v-model="temp_fieldNo"></el-input>
            </div>
            <div>
                字段名称(fieldName):
                <el-input v-model="temp_fieldName"></el-input>
            </div>
            <div>
                <el-select v-model="temp_type" filterable>
                    <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogChildVisible = false">取 消</el-button>
                <el-button type="primary" @click="addChildFieldConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建合成字段 -->
        <!-- <el-dialog title="创建合成字段" :visible.sync="dialogComputedVisible" width="50%" :close-on-click-modal="false">
            <div>
                fieldNo:
                <el-input v-model="temp_computed_fieldNo"></el-input>
            </div>
            <div>
                名称（中文）:
                <el-input v-model="temp_computed_label"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogComputedVisible = false">取 消</el-button>
                <el-button type="primary" @click="addComputedFieldConfirm">确 定</el-button>
            </span>
        </el-dialog> -->
        <!-- 更改组件类型 -->
        <el-dialog title="更改组件类型" :visible.sync="dialogChangeTypeVisible" width="50%" :close-on-click-modal="false">

            <el-select v-model="temp_change_type">
                <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogChangeTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeTypeConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入自选字段 -->
        <el-dialog title="导入自选字段" :visible.sync="dialogSelectVisible" width="80%" :close-on-click-modal="false">

            <el-input style="width: 240px;margin: 10px; 10px" placeholder="输入关键词（不限事项字段）" clearable v-model="generalKeyword" @change="searchField"></el-input>
            <el-input style="width: 240px;margin: 10px; 10px" placeholder="输入关键词（事项名称）" clearable v-model="itemKeyword" @change="searchField"></el-input>
            <el-input style="width: 240px;margin: 10px; 10px" placeholder="输入关键词（fieldNo/label）" clearable v-model="fieldKeyword" @change="searchField"></el-input>
            <el-button icon="el-icon-search" circle @click="searchField"></el-button>

            <el-table ref="checkTable" :data="searchResult" border style="width: 100%" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column prop="projectName" label="项目名称" width="160"></el-table-column>
                <el-table-column prop="itemName" label="事项名称" width="200"></el-table-column>
                <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                <el-table-column prop="label" label="label" width="240"></el-table-column>
                <el-table-column prop="fieldComponentName" label="组件名" width="160"></el-table-column>
                <el-table-column type="selection" reserve-selection label="选择">
                </el-table-column>
            </el-table>

            <el-pagination style="margin: 40px auto 30px 500px;" background layout="total, sizes, prev, pager, next" 
            :page-size="searchPageSize" 
            :current-page="searchCurrentPage" :total="searchTotal" @current-change="tablePageChange"
            @size-change="handleSearchSizeChange" 
            :page-sizes="[10, 15, 30, 50, 100, 200, 300]"
            >
            </el-pagination>

            <p>已选中{{temp_selected_fields.length}}个字段</p>

            <el-button type="primary" @click="forkSelected">确认导入</el-button>
            <el-button type="text" @click="clearSelected">清除所有选择</el-button>

        </el-dialog>

        <!-- 导入公共字段 -->
        <el-dialog title="导入公共字段" :visible.sync="dialogPublicVisible" width="80%" :close-on-click-modal="false">
            <el-select v-model="publicApprovalItemId" clearable style="width: 200px;">
                    <el-option v-for="(v,i) in publicApprovalItemList" :key="i" :label="v.itemName" :value="v.approvalItemId" placeholder="选择需要的公共事项"></el-option>
                </el-select>

           <el-input style="width: 240px;margin: 10px; 10px" placeholder="输入关键词（fieldNo/label）" clearable v-model="fieldKeyword" @change="searchPublicField"></el-input>
            <el-button icon="el-icon-search" circle @click="searchPublicField"></el-button>

            <el-table ref="checkTable1" :data="searchPublicResult" border style="width: 100%" row-key="id" @selection-change="handlePublicSelectionChange">
                <el-table-column prop="itemName" label="事项名称" width="160"></el-table-column>
                <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                <el-table-column prop="label" label="label" width="240"></el-table-column>
                <el-table-column prop="fieldComponentName" label="组件名" width="160"></el-table-column>
                <el-table-column type="selection" reserve-selection label="选择">
                </el-table-column>
            </el-table>

            <el-pagination style="margin: 40px auto 30px 500px;" background layout="total, sizes, prev, pager, next" 
            :page-size="publicPagesize" 
            :current-page="publicCurrentpage" :total="publicTotal" @current-change="publicPageChange"
            @size-change="handlePublicSizeChange" 
            :page-sizes="[10, 15, 30, 50, 100, 200, 300]"
            >
            </el-pagination>

            <p>已选中{{selected_public_fields.length}}个字段</p>

            <el-button type="primary" @click="forkPublic">确认导入</el-button>
            <el-button type="text" @click="clearPublic">清除所有选择</el-button>

        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import Sortable from 'sortablejs'
import defs, {
    deserializeComputedField,
    deserializeBaseField,
    deserializeTableData,
} from "../attributeComponents/index";
import { getById } from "@/api/item/index";
import { mapState } from "vuex";
import _ from "lodash";
import defRenderers from "@/views/attributeComponents/defRendererComponents/index";
import { getField, saveOne, deleteOne, getFieldById,searchFields,forkSelectedFields, getFieldAll,
 searchPublic, forkPublic, childToParent } from "@/api/superForm/index";
import { listMaterialFieldLayer } from "@/api/basicInfo/field";
import { listPublicApprovalItem } from "../../api/basicInfo/approval";
import { functionReviverEventRuntime, convertDefToConfigEventRuntime, functionReviverRuntime } from "./util"
import { log } from 'handlebars';
import { mixin } from "@/mixin/mixin"
var pinyin = require("pinyin");
export default {
    name: "FormConstructor",
    components: {
        ...defRenderers,
        draggable,
    },
    mixins: [mixin],
    data() {
        return {
            defRenderers,
            tableHeight:500,
            pageSize: 30,
            // 添加 fieldNo 的dialog 用
            dialogVisible: false,
            editDialogVisible: false,
            typeOptions: defs.map(v => ({ value: v.value, label: v.label })),
            temp_fieldNo: "",
            temp_type: "",
            temp_label: "",
            temp_fieldName: "",
            // 添加 合成fieldNo的dialog 用
            dialogComputedVisible: false,
            temp_computed_fieldNo: "",
            temp_computed_label: "",
            // 属性填写用
            temp_fieldObj: null,
            // 更改组件类型
            temp_change_type: "",
            dialogChangeTypeVisible: false,
            // 子项属性填写用
            dialogChildVisible: false,
            temp_parent: null,
            // 搜索字段导入用
            dialogSelectVisible: false,
            generalKeyword: "",
            itemKeyword: "",
            valueF: "",
            temp_type_search: "",
            editDialogVisibleDY: false,
            field_type: "",
            fieldKeyword: "",
            searchResult: [],
            currentPage: 1,
            searchCurrentPage: 1,
            searchPageSize: 15,
            searchTotal: 0,
            pagesize: 15,
            totalCount: 0,
            temp_selected_fields: [],
            // 展示用
            temp_field_info: null,
            // 关联审批点
            // basicFieldOptions: [],
            // temp_relate_fieldId: null,
            // 公共字段
            dialogPublicVisible: false,
            searchPublicResult: [],
            selected_public_fields: [],
            publicPagesize: 15,
            publicCurrentpage: 1,
            publicTotal: 0,
            publicApprovalItemId: null,
            publicKeyword: "",
            publicApprovalItemList: []
        };
    },
    computed: {
        ...mapState({
            // baseFields: state => state.fieldModel.baseFields,
            // computedFields: state => state.fieldModel.computedFields,
            itemId: state => state.home.item.approvalItemId,
            tableData: state => state.fieldModel.tableData,
            roles: state => state.config.roles,

        })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.load();
        await this.getTableHeight()
        
    },
    //挂载window.onresize事件
    mounted() {
        let _this = this
        window.onresize = () => {
            if (_this.resizeFlag) {
            clearTimeout(_this.resizeFlag)
            }
            _this.resizeFlag = setTimeout(() => {
            _this.getTableHeight()
            _this.resizeFlag = null
            }, 100)
        }
        this.rowDrop();
    },
    // 注销window.onresize事件
    beforeRouteLeave(to, from, next) {
        //离开组件的时候触发
        window.onresize = null
        next()
    },
    methods: {
        // 行拖拽
            rowDrop () {
               // 此时找到的元素是要拖拽元素的父容器
                const tbody = document.querySelector('.el-table__body-wrapper tbody');
                console.log(tbody)
                const _this = this;
                Sortable.create(tbody, {
           //  指定父元素下可被拖拽的子元素
                  draggable: ".el-table__row",
                   onEnd ({ newIndex, oldIndex }) {
                        const currRow = _this.tableData.splice(oldIndex, 1)[0];
                        _this.tableData.splice(newIndex, 0, currRow);
                    }
                });
            },
        // 创建 基本字段
        handleAddBaseField() {
            this.dialogVisible = true;
        },
        changeLable() {
            this.temp_fieldNo = pinyin(this.temp_label, {
                style: pinyin.STYLE_NORMAL, // 设置拼音风格
                heteronym: false
            }).join('');
        },
        // 创建计算字段
        handleAddComputedField() {
            this.dialogComputedVisible = true;
        },
        // 改变类型
        handleClickChangeType(scope) {

            this.temp_change_type = scope.row.type
            this.temp_fieldObj = scope.row;
            this.dialogChangeTypeVisible = true;
        },
        indexMethod(index) {
            return (this.currentPage - 1) * this.pagesize + (index + 1);
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pagesize = val;
            this.currentPage = 1;
            this.load();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.load();
        },
        //条件查询
        async fieldSearch(){
            this.currentPage = 1;
            this.load();
        },
        // 判断按钮是否可用 
        handleDisabledDY(){
            if(this.roles.includes("admin") || this.roles.includes("researcher")){
                return false;
            }else{
                return true;
            }
        },
        handleDisabledKF(){
            if(this.roles.includes("admin") || this.roles.includes("developer")){
                return false;
            }else{
                return true;
            }
        },
        // 添加子项
        handleClickAddChild(row) {
            this.temp_parent = row;
            this.dialogChildVisible = true;
        },
        // 确定添加子项
        async addChildFieldConfirm() {
            const pattern = /^[0-9a-zA-Z_]{1,}$/;
            if (!pattern.test(this.temp_fieldNo)) {
                this.$message({type:"warning",message:"fieldNo只能包含字母、数字、下划线"})
                return;
            }
            if(this.temp_fieldNo.startsWith('$')){
                this.$message({type:"warning",message:"fieldNo不能以$开头"})
                return;
            }
            let ComponentDefClass = defs.find(v => v.value == this.temp_type)?.componentDef
            let v = {
                fieldNo: this.temp_fieldNo.trim(),
                type: this.temp_type,
                label: this.temp_label,
                fieldComponentName: this.temp_type,
                fieldType: 3,
                componentDefs: new ComponentDefClass()
            };

            let param = {
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: v.fieldComponentName,
                fieldName: this.temp_fieldName, 
                fieldType: 3,
                object: v,
                approvalItemId: this.itemId,
                parentId: this.temp_parent.id
            }

            let result = await saveOne(param);

            if (!result.success) return;

            this.$message({ type: "success", message: "保存成功" });
            this.load();

            this.dialogChildVisible = false;
        },
        //  确定 改变类型
        async changeTypeConfirm() {
            let def = defs.find(v => v.value == this.temp_change_type);
            let ComponentDefClass = def.componentDef
            let isList = !!def.isList;

            // 不可修改类型时给出提示
            if (this.temp_change_type == "computed" || this.temp_change_type == "checkpoint") {
                if (this.temp_fieldObj.children != null || this.temp_fieldObj.fieldType == 3) {
                    this.$message({ type: "warning", message: "父项/子项不可修改为合成类型" });
                    return
                }
            }

            this.temp_fieldObj =
                (this.temp_change_type == "computed" || this.temp_change_type == "checkpoint")?
                    {
                        id: this.temp_fieldObj.id,
                        fieldNo: this.temp_fieldObj.fieldNo,
                        fieldName: this.temp_fieldObj.fieldName,
                        descriptionInfo: this.temp_fieldObj.descriptionInfo,
                        validationInfo: this.temp_fieldObj.validation_info,
                        type: this.temp_change_type,
                        label: this.temp_fieldObj.label,
                        fieldType: 2,
                        fieldComponentName: this.temp_change_type,
                        componentDefs: new ComponentDefClass()
                    } : {
                        id: this.temp_fieldObj.id,
                        fieldNo: this.temp_fieldObj.fieldNo,
                        fieldName: this.temp_fieldObj.fieldName,
                        descriptionInfo: this.temp_fieldObj.descriptionInfo,
                        validationInfo: this.temp_fieldObj.validation_info,
                        type: this.temp_change_type,
                        label: this.temp_fieldObj.label,
                        fieldComponentName: this.temp_change_type,
                        fieldType: this.temp_fieldObj.fieldType == 3 ? 3 : 1,
                        isList,
                        componentDefs: new ComponentDefClass()
                    }

            await this.handleSaveField(this.temp_fieldObj)
            this.dialogChangeTypeVisible = false;
        },
        // 确定添加字段
        async addFieldConfirm() {
            const pattern = /^[0-9a-zA-Z_]{1,}$/;
            if (!pattern.test(this.temp_fieldNo)) {
                this.$message({type:"warning",message:"fieldNo只能包含字母、数字、下划线"})
                return;
            }
            
            if(this.temp_fieldNo.startsWith('$')){
                this.$message({type:"warning",message:"fieldNo不能以$开头"})
                return;
            }
            console.log("defs:",defs)
            let def = defs.find(v => v.value == this.temp_type);
            console.log("def:",def)
            let ComponentDefClass = def.componentDef
            let fieldType = (this.temp_type == "computed" || this.temp_type == "checkpoint") ? 2 : 1;
            let isList = !!def.isList;

            let v = {
                fieldNo: this.temp_fieldNo.trim(),
                type: this.temp_type,
                label: this.temp_label,
                fieldComponentName: this.temp_type,
                fieldType,
                isList,
                componentDefs: new ComponentDefClass()
            };
            let param = {
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: fieldType==1?v.componentDefs?.type?.value:v.fieldComponentName,
                fieldName: this.temp_fieldName,
                approvalItemId: this.itemId,
                fieldType,
                object: v,
            }
            if(this.roles.includes("admin") || this.roles.includes("developer")){
                param.createRole = "developer";
            }else{
                param.createRole = "researcher";
            }
            let result = await saveOne(param);

            if (!result.success) return;

            this.$message({ type: "success", message: "保存成功" });
            this.load();

            this.dialogVisible = false;
        },
        // 确定添加计算字段
        async addComputedFieldConfirm() {
            let ComponentDefClass = defs.find(v => v.value == "computed")?.componentDef

            let v = {
                fieldNo: this.temp_computed_fieldNo,
                type: this.temp_type,
                label: this.temp_computed_label,
                fieldType: 2,
                componentDefs: new ComponentDefClass()
            };
            let param = {
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: v.componentDefs?.type?.value,
                approvalItemId: this.itemId,
                fieldType: 2,
                object: v
            }
            if(this.roles.includes("admin") || this.roles.includes("developer")){
                param.createRole = "developer";
            }else{
                param.createRole = "researcher";
            }
          
            let result = await saveOne(param);

            if (!result.success) return;

            this.$message({ type: "success", message: "保存成功" });
            this.load();

            this.dialogComputedVisible = false;
        },
        // 点击 fieldNo
        async handleClickField(fieldObj) {

            let result = await getFieldById({id:fieldObj.id});
           
            if(!result.success) return;

            // 处理调研备注信息的展示
            this.temp_field_info = {descriptionInfo: result.data.descriptionInfo, validationInfo: result.data.validationInfo};

            let newFieldObj = deserializeTableData({ id: result.data.id, fieldType: result.data.fieldType, remark: result.data.remark,
            children:  result.data.children, ... result.data.object }); 
            this.temp_fieldObj = newFieldObj;
            delete this.temp_fieldObj.list;
            this.editDialogVisible = true;
        },
        //调研人员的 点击 fieldNo
        async handleClickFieldDY(fieldObj) {
            let result = await getFieldById({id:fieldObj.id});
           
            if(!result.success) return;
            let newFieldObj = deserializeTableData({ 
                id: result.data.id, 
                fieldType: result.data.fieldType,
                fieldName: result.data.fieldName,
                descriptionInfo: result.data.descriptionInfo,
                validationInfo: result.data.validationInfo, 
                children: result.data.children, 
                ... result.data.object 
            }); 
            this.temp_fieldObj = newFieldObj;
            delete this.temp_fieldObj.list;
            this.editDialogVisibleDY = true;
        },
        // 删除 fieldNo
        async handleDeleteBaseField(v, i) {
            let param = {
                fieldId: v.id
            };
         
            let result = await deleteOne(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" });
            // this.$store.commit("deleteBaseField", i);
        },
        // 删除 computed fieldNo
        async handleDeleteComputedField(v, i) {
            let param = {
                fieldId: v.id
            };
       
            let result = await deleteOne(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" });
            // this.$store.commit("deleteComputedField", i);
        },

        // 重新定义删除
        async handleDeleteField(v) {
            try {
                await this.$confirm('确定删除? 步骤页面-调研中也会删除相应的配置', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let param = {
                fieldId: v.id
            };
    
            let result = await deleteOne(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" });
            this.load();
        },

        //  预览
        async handlePreview() {
            let result = await getFieldAll({ approvalItemId: this.itemId});
            if (!result.success) return;
            let tableData = result.data.map(v => ({ id: v.id, fieldType: v.fieldType, fieldName: v.fieldName,
                remark: v.remark,
                children: v.children, ...v.object })).map(deserializeTableData);
            let baseFields =  tableData.filter(v => v.fieldType == 1);
            let computedFields = tableData.filter(v => v.fieldType == 2);
            let module = {
                namespaced:true,
                state: {},
                getters: {}
            };
            let itemState= convertDefToConfigEventRuntime(baseFields, "meta");
    
            module.state=itemState;

            let itemGetters = computedFields.reduce((result, item) => {
                // let attrObj = _.mapValues(item.componentDefs, (o) => this.parseFunction(o.value));
                if (!item.componentDefs.getter) {
                    console.log(item.componentDefs)
                }
                result[item.fieldNo] = functionReviverRuntime(item.componentDefs.getter.value, item.fieldNo);

                return result;
            }, {});
           
            module.getters = itemGetters
            let gettersList = Object.keys(itemGetters)
            this.$store.commit("putGettersList", gettersList)
            if (this.$store.hasModule("run")) {
                this.$store.unregisterModule("run");
            }

            this.$store.registerModule("run", module);
             
             // 对state中的计算属性进行处理
            

            this.$router.push("/preview");
        },
        // 单个保存 属于调研的不用传
        async handleSaveField(v) {
            console.log(v)
            //情形默认选中则添加value
            if(v.type && v.type === "qingxingCheckbox") {
                v.componentDefs.options.value.forEach(m => {
                    if(m.chosen) {
                        if(!v.componentDefs.value.value.includes(m.value)) {
                            v.componentDefs.value.value.push(m.value)
                        }
                    } else {
                        v.componentDefs.value.value = v.componentDefs.value.value.filter(v => v != m.value)
                    }
                })
            }
            let vsimple = _.cloneDeep(v)
            delete vsimple.descriptionInfo
            delete vsimple.validationInfo
            let param = {
                id: v.id,
                fieldNo: v.fieldNo,
                fieldName: v.fieldName,
                label: v.label.trim(),
                fieldComponentName: (v.fieldType == 2)?v.fieldComponentName : v.componentDefs?.type?.value,
                fieldType: v.fieldType,
                object: vsimple,
                remark: v.remark
            };
            console.log(param)
            let result = await saveOne(param);

            if (!result.success) return;
            v.id = result.data.id;
            this.$message({ type: "success", message: "保存成功" });
            this.load();
        },
        // 调研编辑的保存 有些字段不用改
        async handleSaveFieldReseacher(v){
            let vsimple = _.cloneDeep(v)
            delete vsimple.descriptionInfo
            delete vsimple.validationInfo
            let param = {
                id: v.id,
                fieldNo: v.fieldNo,
                fieldName: v.fieldName,
                descriptionInfo: v.descriptionInfo,
                validationInfo: v.validationInfo,
                label: v.label,
                // fieldComponentName: v.componentDefs?.type?.value,
                // fieldType: v.fieldType,
                object: vsimple,
            };
            // if(this.temp_relate_fieldId != null && this.temp_relate_fieldId.length > 0){
            //     param.ssFieldId = this.temp_relate_fieldId[this.temp_relate_fieldId.length -1];
            // }
            let result = await saveOne(param);

            if (!result.success) return;
            v.id = result.data.id;
            this.$message({ type: "success", message: "保存成功" });
            this.load();
            this.editDialogVisibleDY = false;
        },
        // 载入
        async load() {
            let result = await getField({ approvalItemId: this.itemId,pageNum: this.currentPage,
                pageSize: this.pagesize,
                keyword: this.valueF,
                fieldComponentName: this.temp_type_search,
                fieldType: this.field_type
                 });
            if (!result.success) return;
            this.totalCount = result.data.total;
            this.currentPage = result.data.current;
            let tableData = result.data.records.map(v => ({ id: v.id, fieldType: v.fieldType, fieldName: v.fieldName,
                remark: v.remark,
                descriptionInfo: v.descriptionInfo,
                validationInfo: v.validationInfo,children: v.children, ...v.object })).map(deserializeTableData);
            console.log("tableData:",tableData)
            this.$store.commit(
                "putTableData",
                tableData
            )
            // this.$store.commit(
            //     "putBaseFields",
            //     tableData.filter(v => v.fieldType == 1)

            // );
            // this.$store.commit(
            //     "putComputedFields",
            //     tableData.filter(v => v.fieldType == 2)

            // );
        },
        formatFieldType(row, column, cellValue, index) {
            if (cellValue == 1) {
                return "基本字段"
            }
            if (cellValue == 2) {
                return "合成字段"
            }
            return "其他"
        },
        async handleImportPublic() {
            this.dialogPublicVisible = true;
            // 初始化公共事项列表
            let result = await listPublicApprovalItem({pageSize: 100, projectId: this.$route.query.projectId});
            this.publicApprovalItemList = result.data.records;
        },
        handleSelect(){
            this.dialogSelectVisible = true;
        },
        searchField(){
            this.searchCurrentPage = 1;
            this.loadSearch();
        },
        //分页切换
        tablePageChange(n) {
            if (this.searchCurrentPage != n) {
                this.searchCurrentPage = n;
            }
            this.loadSearch();
        },
        handleSearchSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.searchPageSize = val;
            this.searchCurrentPage = 1;
            this.loadSearch();
        },
        async loadSearch(){
            let params = {keyword: this.generalKeyword, itemKeyword: this.itemKeyword, fieldKeyword: this.fieldKeyword, pageNum: this.searchCurrentPage, pageSize: this.searchPageSize};
            let result = await searchFields(params);
            if(result.success){
                // 页码
                this.searchTotal = result.data.total
                this.searchResult = result.data.records;
            }else{
                this.$message({ type: "error", message: "查询出错"});
            }
        },
        handleSelectionChange(sel){
            this.temp_selected_fields = sel;
        },
        async forkSelected(){
            if(this.temp_selected_fields.length > 0){
            // 进行fieldNo是否重复的检查
            for (let index = 0; index < this.temp_selected_fields.length; index++){
                let field = this.temp_selected_fields[index]
                if(this.temp_selected_fields.map(v => v.fieldNo).indexOf(field.fieldNo) !== index){
                    this.$message({ type: "warning", message: "重复fieldNo:"+field.fieldNo});
                    return;
                }
            }

            let selectIds = this.temp_selected_fields.map(f => f.id);
            let params = { approvalItemId: this.itemId, sourceFieldIds: selectIds};
            let result = await forkSelectedFields(params);
            if(result.success){
                this.$message({ type: "success", message: "导入成功"});
                this.clearSelected();
                this.load();
                this.dialogSelectVisible = false;
            }
            }
        },
        // 公共字段导入相关
        clearSelected(){
            this.$refs.checkTable.clearSelection();
            this.temp_selected_fields = [];
        },
        handlePublicSizeChange(val){
            this.publicPagesize = val;
            this.publicCurrentpage = 1;
            this.loadPublicSearch();
        },
        handlePublicSelectionChange(sel){
            this.selected_public_fields = sel;
        },
        publicPageChange(n){
            if (this.searchCurrentPage != n) {
                this.searchCurrentPage = n;
            }
            this.loadPublicSearch();
        },
        clearPublic(){
            this.selected_public_fields = [];
        },
        searchPublicField(){
            this.publicCurrentpage = 1;
            this.loadPublicSearch();
        },
        async forkPublic(){
            if(this.selected_public_fields.length > 0){
            let selectIds = this.selected_public_fields.map(f => f.id);
            let params = { approvalItemId: this.itemId, sourceFieldIds: selectIds};
            let result = await forkPublic(params);
            if(result.success){
                this.$message({ type: "success", message: "导入成功"});
                this.clearPublic();
                this.load();
                this.dialogPublicVisible = false;
            }
            }
        },
        async loadPublicSearch(){
            let params = {approvalItemId: this.publicApprovalItemId, keyword: this.publicKeyword, pageNum: this.publicCurrentpage, pageSize: this.publicPagesize};
            let result = await searchPublic(params);
            if(result.success){
                // 页码
                this.publicTotal = result.data.total
                this.searchPublicResult = result.data.records;
            }else{
                this.$message({ type: "error", message: "查询出错"});
            }
        },
        getTableHeight() {
            let tableH = 276
            let tableHeightDetil = window.innerHeight - tableH
            if (tableHeightDetil <= 300) {
                this.tableHeight = 300
            } else {
                this.tableHeight = window.innerHeight - tableH
            }
        },
        async handleClickChildToParent(v){
            try {
                await this.$confirm('确定要把子字段转为基本字段吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let param = {
                id: v.id
            };
    
            let result = await childToParent(param);
            if (!result.success) {
                return;
            }
            this.$message({ type: "success", message: "修改成功" });
            this.load();
        }
    }
};
</script>

<style scoped lang="scss">
 .searchBox {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left{
            display:flex;
            & > * {
                margin-left: 10px;
            }
        }
        
    }
.form-constructor {
    // ::v-deep .el-dialog{
    //     margin:0 30px 50px auto;
    // }
    display: flex;
    flex-direction: column;
    .op-bar {
        display: inline-flex;
        justify-content: space-between;
    }
    .main {
        margin-top: 20px;
        display: flex;
        // height: calc(100vh - 206px);
        // overflow-y: scroll;
        .fields-table {
            width: 100%;
            height: 100%;
            padding: 0 !important;
            .tablePagination {
                // display: flex;
                // align-items: center;
                // flex-wrap: wrap;
                text-align: center;
                margin-bottom: 20px;
            }
        }
    }
    // .main::-webkit-scrollbar {
    //     display:none;
    // }
    // ::v-deep .el-input {
    //     width: 400px;
    // }
    // .el-textarea {
    //     width: 400px;
    // }
}
.base-field-list {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: red 1px solid;
    height: 100%;
}
.computed-field {
    width: 200px;
    border: green 1px solid;
    height: 100%;
}
.attribute-content {
    .attribute {
        margin: 4px 0;
        display: flex;
        align-items: center;
        .attribute-key {
            width: 200px;
            text-align: right;
            padding-right: 30px;
        }
        .attribute-value {
            flex: 1;
        }
    }
}
</style>