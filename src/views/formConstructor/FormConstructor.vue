<template>
    <div class="form-constructor">
        <div class="op-bar">
            <div class="left-bar">
                <el-button @click="handleAddBaseField">创建字段模型</el-button>
                <el-button @click="handleAddComputedField">创建合成字段模型</el-button>

                <!-- <el-button @click="$router.push('/templatemanager')"> -> 模板管理</el-button> -->

                <el-button @click="load">载入字段</el-button>
                <el-button @click="handlePreview">预览全字段</el-button>
            </div>

            <div class="right-bar">
                <el-button :disabled="itemId==-1" @click="handleImportPublic">导入全部公共字段</el-button>
                <el-button :disabled="itemId==-1" @click="handleManagePublic">管理公共字段</el-button>
            </div>

        </div>

        <div class="main">
            <!-- 字段表格 -->
            <div class="fields-table" style="width: 100%;padding:10px 60px">
                <el-table :data="tableData" border style="width: 100%" row-key="id"
                    :tree-props="{children: 'list', hasChildren: 'hasChildren'}" default-expand-all>
                    <el-table-column fixed prop="fieldNo" label="fieldNo" width="150"></el-table-column>
                    <el-table-column prop="label" label="label" width="180"></el-table-column>
                    <el-table-column prop="type" label="组件名" width="120"></el-table-column>
                    <el-table-column prop="fieldType" label="类型" :formatter="formatFieldType" width="120">
                    </el-table-column>
                    <el-table-column label="备注">
                        <template slot-scope="scope">
                            {{scope.row.componentDefs.remark?scope.row.componentDefs.remark.value:""}}
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="250">
                        <template slot-scope="scope">
                            <el-button @click="handleClickField(scope.row);" type="text" size="small"> 编辑</el-button>
                            <el-button @click="handleClickChangeType(scope);" type="text" size="small">更改组件类型
                            </el-button>
                            <el-button @click="handleClickAddChild(scope.row);" type="text" size="small"
                                :disabled="!scope.row.isList">添加子项
                            </el-button>
                            <el-button @click="handleDeleteField(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 编辑 -->
        <el-dialog title="字段组件属性填写" :visible.sync="editDialogVisible" width="80%" :close-on-click-modal="false" >
            <div class="attribute-content">
                <div v-if="temp_fieldObj">
                    <div class="attribute">
                        <span class="attribute-key">fieldNo</span>
                        <el-input v-model="temp_fieldObj.fieldNo"></el-input>
                    </div>

                    <div class="attribute">
                        <span class="attribute-key">label</span>
                        <el-input v-model="temp_fieldObj.label"></el-input>
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
import { getById } from "@/api/item/index";
import { mapState } from "vuex";
import _ from "lodash";
import defRenderers from "@/views/attributeComponents/defRendererComponents/index";
import { save, getField, saveOne, deleteOne, forkPublicFields,getFieldById } from "@/api/superForm/index";
import { functionReviverEventRuntime, convertDefToConfigEventRuntime, functionReviverRuntime } from "./util"
import { log } from 'handlebars';
import { mixin } from "@/mixin/mixin"
export default {
    name: "FormConstructor",
    components: {
        ...defRenderers
    },
    mixins: [mixin],
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
            temp_parent: null
        };
    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            itemName: state => state.home.item.name,
            itemId: state => state.home.item.id,
            tableData: state =>
                state.fieldModel.tableData
        })
    },
    async mounted() {
        await this.init();
        await this.load();
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
            this.temp_parent = row;
            this.dialogChildVisible = true;
        },
        // 确定添加子项
        async addChildFieldConfirm() {
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
                itemId: this.itemId,
                fieldType: 3,
                object: v,
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
            if (this.temp_change_type == "computed") {
                if (this.temp_fieldObj.children != null || this.temp_fieldObj.fieldType == 3) {
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
                        fieldType: this.temp_fieldObj.fieldType == 3 ? 3 : 1,
                        isList,
                        componentDefs: new ComponentDefClass()
                    }

            await this.handleSaveField(this.temp_fieldObj)
            this.dialogChangeTypeVisible = false;
        },
        // 确定添加字段
        async addFieldConfirm() {
            let def = defs.find(v => v.value == this.temp_type);

            let ComponentDefClass = def.componentDef
            let fieldType = this.temp_type == "computed" ? 2 : 1;
            let isList = !!def.isList;

            let v = {
                fieldNo: this.temp_fieldNo,
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
                fieldComponentName: v.componentDefs?.type?.value,
                itemName: this.itemName,
                itemId: this.itemId,
                fieldType,
                object: v,

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
                itemName: this.itemName,
                itemId: this.itemId,
                fieldType: 2,
                object: v
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

            let newFieldObj = deserializeTableData({ id: result.data.id, fieldType:  result.data.fieldType, children:  result.data.children, ... result.data.object }); 
            this.temp_fieldObj = newFieldObj;
          
            delete this.temp_fieldObj.list;
            this.editDialogVisible = true;
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
            let param = {
                fieldId: v.id
            };
    
            let result = await deleteOne(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" });
            this.load();
        },

        //  预览
        handlePreview() {
            let module = {
                namespaced:true,
                state: {},
                getters: {}
            };
            let itemState= convertDefToConfigEventRuntime(this.baseFields, "meta");
           

            module.state=itemState;



            let itemGetters = this.computedFields.reduce((result, item) => {
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
        // 单个保存
        async handleSaveField(v) {
            let param = {
                id: v.id,
                fieldNo: v.fieldNo,
                label: v.label,
                fieldComponentName: v.componentDefs?.type?.value,
                itemName: this.itemName,
                itemId: this.itemId,
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

            let tableData = result.data.map(v => ({ id: v.id, fieldType: v.fieldType, children: v.children, ...v.object })).map(deserializeTableData);

            this.$store.commit(
                "putTableData",
                tableData
            )
            this.$store.commit(
                "putBaseFields",
                tableData.filter(v => v.fieldType == 1)

            );
            this.$store.commit(
                "putComputedFields",
                tableData.filter(v => v.fieldType == 2)

            );
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
            let message = "确认导入吗？\n提示：\n1.已存在的字段不会被覆盖 \n2.导入后如公共字段有修改，不会自动更新";
            if (confirm(message) == true) {
                let result = await forkPublicFields({ itemId: this.itemId, itemName: this.itemName })
                if (result.success) {
                    this.$message({ type: "success", message: "导入成功！新增" + result.data + "条数据" });
                    this.load();
                } else {
                    this.$message({ type: "warning", message: "导入失败，请查看错误信息或联系管理员" });
                }
            }
        },
        handleManagePublic() {
            window.open('#/formconstructor?itemId=-1', '_blank')
        }
    }
};
</script>

<style scoped lang="scss">
.form-constructor {
    ::v-deep .el-dialog{
        margin:0 30px 50px auto;
    }
    display: flex;
    flex-direction: column;
    .op-bar {
        display: inline-flex;
        justify-content: space-between;
    }
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