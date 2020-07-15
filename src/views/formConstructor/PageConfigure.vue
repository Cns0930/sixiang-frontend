<template>
    <div class="page-configure">
        <div class="op-bar">
            <el-button @click="createStepPage">创建步骤页面</el-button>
            <el-button @click="$router.push('/')">-> 字段管理</el-button>
            <el-button @click="handlePreview">预览页面</el-button>
        </div>
        <div class="main">
            <!-- 页面 -->
            <div class="computed-field">
                <div v-for="(v,i) in stepPages" :key="i">
                    <el-button
                        type="text"
                        @click="handleClickPage(v,i)"
                        style="width:150px;margin:0"
                    >{{v.stepTitle}}</el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteStepPage(i)">删除</el-button>
                </div>
            </div>

            <!-- 页面属性填写 -->
            <!-- 注意和temp_page关联 -->
            <div class="attribute-content" v-if="temp_page.id">
                <!-- 根据上个页面的值 -->

                <!-- <div>始终存在</div> -->
                <el-button type="primary" @click="addFieldDialogVisible = true">添加字段</el-button>
                <el-button type="primary" @click="saveTempFields">保存修改</el-button>
                <el-table :data="temp_page.fields">
                    <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                    <el-table-column prop="label" label="字段"></el-table-column>
                     <el-table-column prop="type" label="组件名" width="120"></el-table-column>
                     
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteField(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- TODO:代码框 -->

                <div>beforeLeave: </div>
                <!-- 代码框 -->
                <div id="ace1"
                    class="ace-container"
                    style="flex:1;height:500px;top:10px;position:relative;margin-top:30px"
    
                ></div>

                <div>beforeEnter: </div>
                <!-- 代码框 -->
                <div id="ace2"
                    class="ace-container"
                    style="flex:1;height:500px;top:10px;position:relative;margin-top:30px"
                    
                ></div>

            </div>
        </div>

        <!-- 创建步骤页面 -->
        <el-dialog
            title="创建步骤页面"
            :visible.sync="stepPageCreateVisible"
            width="50%"
            :close-on-click-modal="false"
        >
            <div>
                页面名称:
                <el-input v-model="temp_page_name"></el-input>
            </div>
            <div>
                页面组件:
                <el-select v-model="temp_component">
                    <el-option v-for="(v,i) in componentOptions" :key="i" :label="v" :value="v"></el-option>
                </el-select>
            </div>
            <div>
                规则类型:
                <el-select v-model="temp_configType">
                    <el-option
                        v-for="(v,i) in configOptions"
                        :key="i"
                        :label="v.label"
                        :value="v.value"
                    ></el-option>
                </el-select>
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
                            :disabled="!!temp_chosen_fields.find(v=>v.fieldNo===scope.row.fieldNo)"> 选择</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-tag
                size="mini"
                closable
                v-for="(v,i) in temp_chosen_fields"
                :key="i"
                @close="handleDeleteFromTempChosenFields(i)"
            >{{v.label}}</el-tag>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFieldDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFields">添 加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getStep, saveStep, deleteStep } from "@/api/step/index";
import {
    deserializeComputedField,
    deserializeBaseField
} from "../attributeComponents/index";
import ace from "ace-builds";
import beautify from "ace-builds/src-noconflict/ext-beautify";
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
            temp_chosen_fields: [],
            componentOptions: ["commonForm"],
            temp_component: "",
            temp_configType: "",
            configOptions: [
                { label: "字段", value: 1 }
                // , {"label": "代码框", "value": 2}
            ],
            stepPages: [],
            // 代码框
            aceEditor: null
        };
    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            // stepPages: state => state.fieldModel.stepPages,
            itemName: state => state.home.itemName
        })
    },
    mounted() {
        this.load();
    },
    methods: {
        createStepPage() {
            this.stepPageCreateVisible = true;
        },
        // 确认添加步骤页面
        async addStepPage() {
            let data = {
                stepTitle: this.temp_page_name,
                stepComponent: this.temp_component,
                stepConfigType: this.temp_configType,
                itemName: this.itemName,
                stepConfig: "[]"
            };
            let result = await saveStep(data);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功" });
            // this.$store.commit("pushStepPage", data);
            this.stepPageCreateVisible = false;
            // 重新加载
            this.load();
        },
        // 保存添加字段的修改
        async saveTempFields() {
            let param = this.temp_page;
            let ids = this.temp_chosen_fields.map(v => v.id);
            param.stepConfig = "[" + ids.join(",") + "]";
            console.log(param);
            // TODO: 保存config
            let beforeLeave = this.aceEditor1.getSession().getValue();
            let beforeEnter = this.aceEditor2.getSession().getValue();

            let result = await saveStep(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功" });
        },
        handleDeleteStepPage(i) {
            this.$store.commit("deleteStepPage", i);
        },
        // 选中 某个页面
        handleClickPage(page) {
            this.temp_page = page;
            // 从baseFields中筛选
            let ids = JSON.parse(
                this.temp_page.stepConfig ? this.temp_page.stepConfig : "[]"
            );
            this.temp_chosen_fields = this.baseFields.filter(v => {
                if (ids.includes(v.id)) {
                    return true;
                } else {
                    return false;
                }
            });
            this.temp_page.fields = this.temp_chosen_fields;
            // this.temp_chosen_fields = page.fields ? page.fields : [];

            // TODO:加载代码编辑框
            this.aceEditor1 = ace.edit("ace1", {
                maxLines: 20, // 最大行数，超过会自动出现滚动条
                minLines: 2, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
                fontSize: 14, // 编辑器内字体大小
                theme: "ace/theme/monokai",
                mode: 'ace/mode/javascript',
                tabSize: 4 // 制表符设置为 4 个空格大小
            });
            this.aceEditor1.setOption("wrap", "free");
            this.aceEditor2 = ace.edit("ace2", {
                maxLines: 20, // 最大行数，超过会自动出现滚动条
                minLines: 2, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
                fontSize: 14, // 编辑器内字体大小
                theme: "ace/theme/monokai",
                mode: 'ace/mode/javascript',
                tabSize: 4 // 制表符设置为 4 个空格大小
            });
            this.aceEditor2.setOption("wrap", "free");

        },
        // 选择某个字段
        chooseFieldToTemp(scope) {
            this.temp_chosen_fields.push(scope.row);
        },
        //删除 选中的字段
        handleDeleteFromTempChosenFields(i) {
            this.temp_chosen_fields.splice(i, 1);
        },
        // 将选中字段添加到页面中
        addFields() {
            this.$set(this.temp_page, "fields", this.temp_chosen_fields);
            this.addFieldDialogVisible = false;
        },
        deleteField(scope) {
            console.log(scope);
            let index = scope.$index;
            this.temp_page.fields.splice(index, 1);
        },
        //  预览
        handlePreview() {
            let module = {
                state: {},
                getters: {}
            };
            console.log(this.temp_page.fields);
            module.state = this.temp_page.fields.reduce((result, item) => {
              
                let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
                let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo },attrObj, {attributes:item.componentDefs.getAttributes?item.componentDefs.getAttributes() || {}:{}})
                result[item.fieldNo] = mergeObj;
                return result;
            }, {});
            if (this.$store.hasModule("preview")) {
                this.$store.unregisterModule("preview");
            }
            console.log(JSON.stringify(module.state, null, 4));
            this.$store.registerModule("preview", module);
            this.$router.push("/preview");
        },
        // 重新加载步骤列表
        async load() {
            let result = await getStep({ itemName: this.itemName });
            if (!result.success) return;
            this.stepPages = result.data;
        }
    }
};
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