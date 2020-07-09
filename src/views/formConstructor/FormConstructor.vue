<template>
    <div class="form-constructor">
        <div class="op-bar">
            <el-button @click="handleAddBaseField"> 创建字段模型</el-button>
            <el-button @click="handleAddComputedField"> 创建合成字段模型</el-button>
            <el-button @click="$router.push('/pageconfigure')"> -> 步骤页面管理</el-button>
            <!-- <el-button @click="$router.push('/templatemanager')"> -> 模板管理</el-button> -->
            <el-button @click="$router.push('/materialmanager')"> -> 材料管理</el-button>
            <el-button @click="load"> 载入字段</el-button>
            <el-button @click="save"> 全部覆盖保存</el-button>
        </div>
        <div class="main">
            <!-- 基本字段 -->

            <div class="base-field-list">
                <div v-for="(v,i) in baseFields" :key="i">
                    <el-button type="text" @click="handleClickField(v)" style="width:100px;margin:0">
                        ({{v.fieldNo}}){{v.label}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleSaveField(v,1)">保存</el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteBaseField(v,i)">删除</el-button>
                </div>

            </div>

            <!-- 计算字段 -->
            <div class="computed-field">
                <div v-for="(v,i) in computedFields" :key="i">
                    <el-button type="text" @click="handleClickField(v)" style="width:100px;margin:0">
                        ({{v.fieldNo}}){{v.label}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleSaveField(v,2)">保存</el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteComputedField(v,i)">删除</el-button>
                </div>
            </div>
           

            <!-- 字段组件属性填写 -->
            <div class="attribute-content">
                <div class="attribute" v-if="temp_fieldObj">
                    fieldNo<el-input v-model="temp_fieldObj.fieldNo"></el-input>
                    label<el-input v-model="temp_fieldObj.label"></el-input>
                </div>
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
import defs,{deserializeComputedField,deserializeBaseField} from "../attributeComponents/index"
import { mapState } from "vuex"
import _ from "lodash"
import defRenderers from "../attributeComponents/defRendererComponents"
import {save,getField,saveOne,deleteOne} from "@/api/superForm/index"
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
            temp_fieldObj: null,
        //    baseFields:[],
        //    computedFields:[],

        }
    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            itemName:state=>state.home.itemName,
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

            this.temp_fieldObj = fieldObj;
            console.log("=====temp_fieldObj======")
            console.log(this.temp_fieldObj)
            this.temp_component_attribute = fieldObj.componentDefs;
            // this.temp_component_attribute = {fieldNo:fieldObj.fieldNo, label:fieldObj.label, ...fieldObj.componentDefs};
            // console.log("=====temp_component_attribute======")
            // console.log(this.temp_component_attribute)
        },
        // 删除 fieldNo
        async handleDeleteBaseField(v,i) {
            let param = {
                fieldId:v.id
            }
            console.log(param);
            let result = await deleteOne(param);
            if(!result.success) return
            this.$message({type:"success",message:"删除成功"})
            this.$store.commit("deleteBaseField", i)
        },
        // 删除 computed fieldNo
        async handleDeleteComputedField(v,i) {
            let param = {
                fieldId:v.id
            }
            console.log(param);
            let result = await deleteOne(param);
            if(!result.success) return
            this.$message({type:"success",message:"删除成功"})
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
        // 单个保存
        async handleSaveField(v,type){
            let param = {
                id:v.id,
                fieldNo:v.fieldNo,
                label:v.label,
                fieldComponentName:v.componentDefs?.type?.value,
                itemName:this.itemName,
                fieldType:type,
                object:v,
            }
            let result = await saveOne(param);
         
            if(!result.success) return
            v.id = result.data.id;
            this.$message({type:"success",message:"保存成功"})
        },
        // save 全部保存
        async save(){
            let baseFieldList =this.baseFields.map(field=>({
                fieldNo:field.fieldNo,
                label:field.label,
                fieldComponentName:field.componentDefs?.type?.value,
                itemName:this.itemName,
                fieldType:1,
                object:field,
            })) 
            let computedFieldList = this.computedFields.map(field=>({
                fieldNo:field.fieldNo,
                label:field.label,
                itemName:this.itemName,
                fieldType:2,
                object:field,
            }))
            let result = await save({itemName:this.itemName,fieldsList:[...baseFieldList,...computedFieldList]})
            if(!result.success) return;
            this.$message({type:"success",message:"保存成功"})
        },
        // 载入
        async load(){
            let result = await getField({itemName:this.itemName})
            if(!result.success) return;
            console.log(result.data)
            this.$store.commit("putBaseFields",result.data.filter(v=>v.fieldType == 1).map(v=> ({id:v.id,...v.object})).map(deserializeBaseField))
            this.$store.commit("putComputedFields",result.data.filter(v=>v.fieldType == 2).map(v=> ({id:v.id,...v.object})).map(deserializeComputedField))
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