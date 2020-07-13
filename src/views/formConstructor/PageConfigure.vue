<template>
    <div class="page-configure">
        <div class="op-bar">

            <el-button @click="createStepPage"> 创建步骤页面</el-button>
            <el-button @click="$router.push('/')"> 字段管理</el-button>
            <el-button @click="handlePreview"> 预览页面</el-button>
        </div>
        <div class="main">

            <!-- 页面 -->
            <div class="computed-field">
                <div v-for="(v,i) in stepPages" :key="i">
                    <el-button type="text" @click="handleClickPage(v,i)" style="width:150px;margin:0">
                        {{v.name}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteStepPage(i)">删除</el-button>
                </div>
            </div>

            <!-- 页面属性填写 -->
            <div class="attribute-content">
                <!-- 根据上个页面的值 -->

                <div>始终存在</div>
                <el-button type="primary" @click="addFieldDialogVisible = true">添加</el-button>
                <el-table :data="temp_page.fields">
                    <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                    <el-table-column prop="label" label="字段"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteField(scope)"> 删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>

        <!-- 创建步骤页面 -->
        <el-dialog title="创建步骤页面" :visible.sync="stepPageCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                页面名称:<el-input v-model="temp_page_name"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="stepPageCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStepPage">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加field 页面 -->
        <el-dialog title="添加字段" :visible.sync="addFieldDialogVisible" width="50%" :close-on-click-modal="false">

            <el-table :data="baseFields">
                <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                <el-table-column prop="label" label="字段名"></el-table-column>
                <el-table-column prop="type" label="组件"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="chooseFieldToTemp(scope)"
                            :disabled="temp_chosen_fields.find(v=>v.fieldNo==='scope.row.fieldNo')"> 选择</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-tag size="mini" closable v-for="(v,i) in temp_chosen_fields" :key="i"
                @close="handleDeleteFromTempChosenFields(i)">{{v.label}}</el-tag>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFieldDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFields">添 加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    name: "PageConfigure",
    data() {
        return {
            // 创建页面用
            stepPageCreateVisible: false,
            temp_page_name: "",
            temp_page: {},
            //  添加字段dialog用
            addFieldDialogVisible: false,
            temp_chosen_fields: []
        }

    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            stepPages: state => state.fieldModel.stepPages,
        })

    },

    methods: {
        createStepPage() {
            this.stepPageCreateVisible = true;
        },
        addStepPage() {
            let data = {
                name: this.temp_page_name,
                fields: [],
            }
            this.$store.commit("pushStepPage", data);
            this.stepPageCreateVisible = false;
        },
        handleDeleteStepPage(i) {
            this.$store.commit("deleteStepPage", i)
        },
        // 选中 某个页面
        handleClickPage(page) {
            this.temp_page = page;
            this.temp_chosen_fields = page.fields;
        },
        // 选择某个字段
        chooseFieldToTemp(scope) {
            this.temp_chosen_fields.push(scope.row);
        },
        //删除 选中的字段
        handleDeleteFromTempChosenFields(i) {
            this.temp_chosen_fields.splice(i, 1)
        },
        // 将选中字段添加到页面中
        addFields() {

            this.$set(this.temp_page, "fields", this.temp_chosen_fields)
            this.addFieldDialogVisible = false;
        },
        deleteField(scope) {
            console.log(scope)
            let index = scope.$index;
            this.temp_page.fields.splice(index,1)
             
        },
        //  预览
        handlePreview() {
            let module = {
                state: {},
                getters: {}
            }
            module.state = this.temp_page.fields.reduce((result, item) => {
               
                let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
                let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo },attrObj, {attributes:item.componentDefs.getAttributes() || {}})
                result[item.fieldNo] = mergeObj;
                return result;
            }, {})
            if (this.$store.hasModule("preview")) {
                this.$store.unregisterModule("preview")
            }
            console.log(JSON.stringify(module.state,null,4))
            this.$store.registerModule("preview", module);
            this.$router.push("/preview")
        }
    }

}
</script>

<style lang="scss" scoped>
.page-configure {
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