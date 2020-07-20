<template>
    <div class="form-constructor">
        <div class="op-bar">
            <el-button @click="handleAddBaseField">创建字段模型</el-button>
            <el-button @click="handleAddComputedField">创建合成字段模型</el-button>
           
            <!-- <el-button @click="$router.push('/templatemanager')"> -> 模板管理</el-button> -->
            
            <el-button @click="load">载入字段</el-button>
            <el-button @click="handlePreview">预览全字段</el-button>
            
        </div>
        <div class="main">
            <!-- 字段表格 -->
            <div class="fields-table" style="width: 100%;padding:10px 60px">
                <el-table :data="tableData" border style="width: 100%"
                row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column fixed prop="fieldNo" label="fieldNo" width="150"></el-table-column>
                    <el-table-column prop="label" label="label"></el-table-column>
                    <el-table-column prop="type" label="组件名" width="120"></el-table-column>
                    <el-table-column prop="fieldType" label="类型" :formatter="formatFieldType" width="120">
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button @click="handleClickField(scope.row);" type="text" size="small">
                                编辑</el-button>
                            <el-button @click="handleClickChangeType(scope);" type="text" size="small">更改组件类型
                            </el-button>
                            <el-button @click="handleClickAddChild(scope.row);" type="text" size="small" :disabled="scope.row.fieldType != 1">添加子项
                            </el-button>
                            <el-button @click="handleDeleteField(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 编辑 -->
        <el-dialog title="字段组件属性填写" :visible.sync="editDialogVisible" width="80%" :close-on-click-modal="false">
            <div class="attribute-content">
                <div class="attribute" v-if="temp_fieldObj">
                    fieldNo
                    <el-input v-model="temp_fieldObj.fieldNo"></el-input>
                    <br />label
                    <el-input v-model="temp_fieldObj.label"></el-input>
                    <div class="attribute" v-for="(v,i) in temp_fieldObj.componentDefs" :key="i">
                        {{i}} 
                        <component :is="v.renderTemplateName" v-model="v.value" v-bind="v.attributes" :key="temp_fieldObj.fieldNo+v.renderTemplateName"></component>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                    @click="handleSaveField(temp_fieldObj);editDialogVisible = false">确 定
                </el-button>
            </span>
        </el-dialog>

        <!-- 创建基本字段 -->
        <el-dialog title="创建基本字段" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
            <div>
                fieldNo:
                <el-input v-model="temp_fieldNo"></el-input>
            </div>
            <div>
                名称（中文）:
                <el-input v-model="temp_label"></el-input>
            </div>
            <div>
                <el-select v-model="temp_type">
                    <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFieldConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建子项字段 -->
        <el-dialog title="创建子项字段" :visible.sync="dialogChildVisible" width="80%" :close-on-click-modal="false">
            <div>
                fieldNo:
                <el-input v-model="temp_fieldNo"></el-input>
            </div>
            <div>
                名称（中文）:
                <el-input v-model="temp_label"></el-input>
            </div>
            <div>
                <el-select v-model="temp_type">
                    <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value"></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogChildVisible = false">取 消</el-button>
                <el-button type="primary" @click="addChildFieldConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 创建合成字段 -->
        <el-dialog title="创建合成字段" :visible.sync="dialogComputedVisible" width="50%" :close-on-click-modal="false">
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
        </el-dialog>
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
    </div>
</template>

<script>
import defs, {
    deserializeComputedField,
    deserializeBaseField,
    deserializeTableData
} from "../attributeComponents/index";
import { mapState } from "vuex";
import _ from "lodash";
import defRenderers from "../attributeComponents/defRendererComponents";
import { save, getField, saveOne, deleteOne } from "@/api/superForm/index";
import {functionReviverEventRuntime} from "./util"
export default {
    name: "FormConstructor",
    components: {
        ...defRenderers
    },
    data() {
        return {
            defRenderers,
            // 添加 fieldNo 的dialog 用
            dialogVisible: false,
            editDialogVisible: false,
            typeOptions: defs.map(v => ({ value: v.value, label: v.label })),
            temp_fieldNo: "",
            temp_type: "",
            temp_label: "",
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
            temp_parentId: null
        };
    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            itemName: state => state.home.itemName,
            tableData: state =>
                state.fieldModel.tableData
        })
    },
    methods: {
        // 创建 基本字段
        handleAddBaseField() {
            this.dialogVisible = true;
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
        // 添加子项
        handleClickAddChild(row) {
            this.temp_parentId = row.id;
            this.dialogChildVisible = true;
        },
        // 确定添加子项
        async addChildFieldConfirm(){
            let ComponentDefClass = defs.find(v => v.value == this.temp_type)?.componentDef
            let v = {
                fieldNo: this.temp_fieldNo,
                type: this.temp_type,
                label: this.temp_label,
                fieldComponentName: this.temp_type,
                fieldType: 3,
                componentDefs: new ComponentDefClass()
            };
            let param = {
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: v.componentDefs?.type?.value,
                itemName: this.itemName,
                fieldType: 3,
                object: v,
                parentId: this.temp_parentId
            }
            console.log("===param===")
            console.log(param)

            let result = await saveOne(param);

            if (!result.success) return;

            this.$message({ type: "success", message: "保存成功" });
            this.load();

            this.dialogChildVisible = false;
        },
        //  确定 改变类型
        async changeTypeConfirm() {
            let ComponentDefClass = defs.find(v => v.value == this.temp_change_type)?.componentDef
            // 不可修改类型时给出提示
            if(this.temp_change_type == "computed"){
                if(this.temp_fieldObj.children != null || this.temp_fieldObj.fieldType == 3){
                    this.$message({ type: "warning", message: "父项/子项不可修改为合成类型" });
                    return
                }
            }
            this.temp_fieldObj =
                this.temp_change_type == "computed" ?
                    {
                        id: this.temp_fieldObj.id,
                        fieldNo: this.temp_fieldObj.fieldNo,
                        type: this.temp_change_type,
                        label: this.temp_fieldObj.label,
                        fieldType: 2,
                        componentDefs: new ComponentDefClass()
                    } : {
                        id: this.temp_fieldObj.id,
                        fieldNo: this.temp_fieldObj.fieldNo,
                        type: this.temp_change_type,
                        label: this.temp_fieldObj.label,
                        fieldComponentName: this.temp_change_type,
                        fieldType: this.temp_fieldObj.fieldType == 3 ? 3: 1,
                        componentDefs: new ComponentDefClass()
                    }

            await this.handleSaveField(this.temp_fieldObj)
            this.dialogChangeTypeVisible = false;
        },
        // 确定添加字段
        async addFieldConfirm() {
            let ComponentDefClass = defs.find(v => v.value == this.temp_type)?.componentDef

            let v = {
                fieldNo: this.temp_fieldNo,
                type: this.temp_type,
                label: this.temp_label,
                fieldComponentName: this.temp_type,
                fieldType: 1,
                componentDefs: new ComponentDefClass()
            };
            let param = {
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: v.componentDefs?.type?.value,
                itemName: this.itemName,
                fieldType: 1,
                object: v
            }
            console.log("===param===")
            console.log(param)

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
                itemName: this.itemName,
                fieldType: 2,
                object: v
            }
            console.log("===param===")
            console.log(param)

            let result = await saveOne(param);

            if (!result.success) return;

            this.$message({ type: "success", message: "保存成功" });
            this.load();

            this.dialogComputedVisible = false;
        },
        // 点击 fieldNo
        handleClickField(fieldObj) {
            this.temp_fieldObj = fieldObj;
            this.editDialogVisible = true;
        },
        // 删除 fieldNo
        async handleDeleteBaseField(v, i) {
            let param = {
                fieldId: v.id
            };
            console.log(param);
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
            console.log(param);
            let result = await deleteOne(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" });
            // this.$store.commit("deleteComputedField", i);
        },

        // 重新定义删除
        async handleDeleteField(v) {
            let param = {
                fieldId: v.id
            };
            console.log(param);
            let result = await deleteOne(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" });
            this.load();
        },

        //  预览
        handlePreview() {
            let module = {
                state: {},
                getters: {}
            };
            module.state = this.baseFields.reduce((result, item) => {
                 let attrObj = _.mapValues(item.componentDefs, function (o) { return functionReviverEventRuntime(o.value)});
                console.log(item.fieldNo,attrObj.onchange && attrObj.onchange.toString())
                let mergeObj = _.merge(
                    { label: item.label, fieldNo: item.fieldNo },
                    attrObj ,{ attributes: item.componentDefs.getAttributes ? item.componentDefs.getAttributes() || {} : {} }
                );
                result[item.fieldNo] = mergeObj;
                return result;
            }, {});
            if (this.$store.hasModule("preview")) {
                this.$store.unregisterModule("preview");
            }
            this.$store.registerModule("preview", module);
            this.$router.push("/preview");
        },
        // 单个保存
        async handleSaveField(v) {
            let param = {
                id: v.id,
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: v.componentDefs?.type?.value,
                itemName: this.itemName,
                fieldType: v.fieldType,
                object: v
            };
            let result = await saveOne(param);

            if (!result.success) return;
            v.id = result.data.id;
            this.$message({ type: "success", message: "保存成功" });
            this.load();
        },
        // 载入
        async load() {
            let result = await getField({ itemName: this.itemName });
            if (!result.success) return;
            
            this.$store.commit(
                "putBaseFields",
                result.data
                    .filter(v => v.fieldType == 1)
                    .map(v => ({ id: v.id, fieldType: v.fieldType, ...v.object }))
                    .map(deserializeBaseField)
            );
            this.$store.commit(
                "putComputedFields",
                result.data
                    .filter(v => v.fieldType == 2)
                    .map(v => ({ id: v.id, fieldType: v.fieldType, ...v.object }))
                    .map(deserializeComputedField)
            );
            this.$store.commit(
                "putTableData",
                result.data.map(v => ({ id: v.id, fieldType: v.fieldType, children: v.children, ...v.object })).map(deserializeTableData)
            )
        },
        formatFieldType(row, column, cellValue, index) {
            if (cellValue == 1) {
                return "基本字段"
            }
            if (cellValue == 2) {
                return "合成字段"
            }
            return "其他"
        }
    }
};
</script>

<style scoped lang="scss">
.form-constructor {
    display: flex;
    flex-direction: column;
    .main {
        display: flex;
        height: calc(100vh - 40px);
    }
    ::v-deep .el-input {
        width: 400px;
    }
    .el-textarea {
        width: 400px;
    }
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
// .attribute-content {
//     flex: 1;
//     border: blue 1px solid;
//     height: 100%;
//     .attribute {
//         margin: 4px 0;
//     }
// }
</style>