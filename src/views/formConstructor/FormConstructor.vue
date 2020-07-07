<template>
    <div class="form-constructor">
        <div class="op-bar">
            <el-button @click="handleAddBaseField"> 创建字段模型</el-button>
            <el-button @click="handleAddComputedField"> 创建合成字段模型</el-button>
            <el-button @click="$router.push('/pageconfigure')"> -> 步骤页面管理</el-button>
            <el-button @click="$router.push('/templatemanager')"> -> 模板管理</el-button>
            <el-button @click="$router.push('/materialmanager')"> -> 材料管理</el-button>
            <el-button @click="save"> 全部保存</el-button>
        </div>
        <div class="main">
            <!-- 基本字段 -->

            <div class="base-field-list">
                <div v-for="(v,i) in baseFields" :key="i">
                    <el-button type="text" @click="handleClickField(v)" style="width:150px;margin:0">
                        ({{v.fieldNo}}){{v.label}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteBaseField(i)">删除</el-button>
                </div>

            </div>

            <!-- 计算字段 -->
            <div class="computed-field">
                <div v-for="(v,i) in computedFields" :key="i">
                    <el-button type="text" @click="handleClickField(v)" style="width:150px;margin:0">
                        ({{v.fieldNo}}){{v.label}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteComputedField(i)">删除</el-button>
                </div>
            </div>
           

            <!-- 字段组件属性填写 -->
            <div class="attribute-content">
                <div class="attribute" v-for="(v,i) in temp_component_attribute" :key="i">{{i}}

                    <component :is="v.renderTemplateName" v-model="v.value" v-bind="v.attributes"></component>

                </div>
            </div>

        </div>
        <!-- 创建基本字段 -->
        <el-dialog title="创建基本字段" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
            <div>
                fieldNo:<el-input v-model="temp_fieldNo"></el-input>
            </div>
            <div>
                名称（中文）:<el-input v-model="temp_label"></el-input>
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
        <!-- 创建合成字段 -->
        <el-dialog title="创建合成字段" :visible.sync="dialogComputedVisible" width="50%" :close-on-click-modal="false">
            <div>
                fieldNo:<el-input v-model="temp_computed_fieldNo"></el-input>
            </div>
            <div>
                名称（中文）:<el-input v-model="temp_computed_label"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogComputedVisible = false">取 消</el-button>
                <el-button type="primary" @click="addComputedFieldConfirm">确 定</el-button>
            </span>
        </el-dialog>
     
    </div>
</template>

<script>
import defs from "../attributeComponents/index"
import { mapState } from "vuex"
import _ from "lodash"
import defRenderers from "../attributeComponents/defRendererComponents"
import {save} from "@/api/superForm/index"
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
            typeOptions: Object.keys(defs).map(v => ({ value: v, label: v })),
            temp_fieldNo: "",
            temp_type: "",
            temp_label: "",
            // 添加 合成fieldNo的dialog 用
            dialogComputedVisible: false,
            temp_computed_fieldNo: "",
            temp_computed_label: "",
            // 属性填写用
            temp_component_attribute: null,
           

        }
    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
          
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
        // 确定添加字段
        addFieldConfirm() {
            this.$store.commit("pushBaseField", {
                fieldNo: this.temp_fieldNo,
                type: this.temp_type,
                label: this.temp_label,
                componentDefs: new defs[this.temp_type](),
            })

            this.dialogVisible = false;
        },
        // 确定添加计算字段
        addComputedFieldConfirm() {
            this.$store.commit("pushComputedField", {
                fieldNo: this.temp_computed_fieldNo,
                label: this.temp_computed_label,
                componentDefs: new defs["computed"]()
            })
            this.dialogComputedVisible = false;
        },
        // 点击 fieldNo
        handleClickField(fieldObj) {
            console.log(fieldObj)
            this.temp_component_attribute = fieldObj.componentDefs;
        },
        // 删除 fieldNo
        handleDeleteBaseField(i) {
            this.$store.commit("deleteBaseField", i)
        },
        // 删除 computed fieldNo
        handleDeleteComputedField(i) {
            this.$store.commit("deleteComputedField", i)
        },
        
        //  预览
        handlePreview() {
            let module = {
                state: {},
                getters: {}
            }
            module.state = this.baseFields.reduce((result, item) => {
                let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
                let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo }, attrObj)
                result[item.fieldNo] = mergeObj;
                return result;
            }, {})
            if (this.$store.hasModule("preview")) {
                this.$store.unregisterModule("preview")
            }
            this.$store.registerModule("preview", module);
            this.$router.push("/preview")
        },
        // save 保存
        async save(){
            let baseFieldList =this.baseFields.map(field=>({
                fieldNo:field.filedNo,
                label:field.label,
                fieldComponentName:field.componentDefs?.type?.value,
                itemName:this.$store.state.home.itemName,
                fieldType:1,
                object:field,
            })) 
            let computedFieldList = this.computedFields.map(field=>({
                fieldNo:field.filedNo,
                label:field.label,
                itemName:this.$store.state.home.itemName,
                fieldType:2,
                object:field,
            }))
            let result = await save({itemName:this.$store.state.home.itemName,fieldsList:[...baseFieldList,...computedFieldList]})
            if(!result.success) return;
            this.$message({type:"success",message:"保存成功"})
        },
        // 载入
        async load(){
            
        }
    }
}
</script>

<style scoped lang="scss">
.form-constructor {
    display: flex;
    flex-direction: column;
    .main {
        display: flex;
        height: calc(100vh - 40px);
    }
    .el-input {
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
    flex: 1;
    border: blue 1px solid;
    height: 100%;
    .attribute {
        margin: 4px 0;
    }
}
</style>