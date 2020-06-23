<template>
    <div class="form-constructor">
        <div class="op-bar">
            <el-button @click="handleAddField"> 创建字段模型</el-button>
            <el-button @click="handlePreview"> 预览布局</el-button>
        </div>
        <div class="main">
            <!-- 基本字段 -->

            <div class="base-field-list">
                <el-button type="text" v-for="(v,i) in baseFields" :key="i" @click="handleClickField(v)" style="width:100%">
                    {{v.label}}
                </el-button>
            </div>

            <!-- 计算字段 -->
            <div class="computed-field">
               
            </div>
            <!-- 字段组件属性填写 -->
            <div class="attribute-content">
                 <div v-for="(v,i) in temp_component_attribute" :key="i">{{i}}
                    <component  :is="v.renderType" v-model="v.value"></component>
                    
                </div>
            </div>

        </div>
        <!--  -->
        <el-dialog title="创建字段" :visible.sync="dialogVisible" width="30%">
            fieldNo:<el-input v-model="temp_fieldNo"></el-input>
            名称（中文）:<el-input v-model="temp_label"></el-input>
            <el-select v-model="temp_type">
                <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value" ></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFieldConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import defs from "../components/index"
export default {
    name: "FormConstructor",
    data() {
        return {
            baseFields: [],
            // 添加 fieldNo 的dialog 用
            dialogVisible: false,
            typeOptions: Object.keys(defs).map(v => ({ value: v, label: v })),
            temp_fieldNo: "",
            temp_type: "",
            temp_label: "",
            // 属性填写用
            temp_component_attribute:null,
        }
    },
    // watch:{
    //     baseFields:{
    //         handler: function (val, oldVal) {

    //          },
    //         deep: true
    //     }
    // },
    methods: {
        handleAddField() {
            this.dialogVisible = true;
        },
        // 确定添加字段
        addFieldConfirm() {
            this.baseFields.push({
                fieldNo: this.temp_fieldNo,
                type: this.temp_type,
                label: this.temp_label,
                component:new defs[this.temp_type](),
            })
            this.dialogVisible = false;
        },
        // 点击 fieldNo
        handleClickField(fieldObj){
            console.log(fieldObj)
            this.temp_component_attribute = fieldObj.component;
        },
        handlePreview(){

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
}
</style>