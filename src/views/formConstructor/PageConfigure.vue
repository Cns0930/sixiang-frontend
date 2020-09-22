<template>
    <div class="page-configure">
        <div class="op-bar">
            <el-button @click="importDefault">导入默认步骤</el-button>
            <el-button @click="createStepPage">创建步骤页面</el-button>
           <!-- <el-button @click="handlePreview">预览页面</el-button>-->
            <el-button @click="loadAll">载入页面</el-button>
            <el-button @click="$router.push({path:'/run',query:{itemId}})">运行页面</el-button>
            <el-button @click="handleOutput">输出</el-button>
            <el-link :href="`bangban.html#/?itemId=${itemId}&barcode=${barcode}`" target="_blank">超级帮办模拟运行</el-link>barcode<el-input v-model="barcode" style="width:100px"></el-input>

            <el-divider direction="vertical"></el-divider><el-button @click="transferOutput">保存输出到超级帮办</el-button>
        </div>
        <div class="main">
            <!-- 页面 -->
            <div class="computed-field">
                <div v-for="(v,i) in stepPages" :key="i">
                    <el-button type="text" @click="handleClickPage(v,i)" style="width:150px;margin:0">{{v.stepTitle}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteStepPage(v)">删除</el-button>
                </div>
            </div>

            <!-- 页面属性填写 -->
            <!-- 注意和temp_page关联 -->
            <div class="attribute-content" v-if="temp_page.id" style="padding:10px">
                <el-button @click="save" type="primary">保存</el-button>
                <div>
                    <h3>编辑页面名</h3>
                    <el-input v-model="temp_page.stepTitle"></el-input>
                </div>
                <div>
                    <h3>设置步骤序号</h3>
                    <el-input v-model="temp_page.stepPagenum"></el-input>
                </div>
                <div>
                    <h3>设置页面类型</h3>
                    <el-select v-model="temp_page.stepPageType">
                        <el-option label="表单" value="field"></el-option>
                        <el-option label="材料" value="material"></el-option>
                    </el-select>

                </div>
                <div>
                    <h3>
                        配置config（材料名 或 fieldNo）
                    </h3>
                    <div>
                        <el-radio v-model="temp_page.stepObject.configType" :label="1" @change="handleSwitchConfigType">
                            表格添加</el-radio>
                        <el-radio v-model="temp_page.stepObject.configType" :label="2" @change="handleSwitchConfigType">
                            逻辑添加</el-radio>
                    </div>
                    <div v-if="temp_page.stepObject.configType ==1">
                        <!-- config 配置 字段 或者 材料 -->
                        <div v-if="temp_page.stepPageType == 'field'">
                            <el-button type="primary" @click="addFieldDialogVisible = true">添加字段</el-button>
                            <!-- <el-button type="primary" @click="saveTempFields">保存修改</el-button> -->
                            <el-table :data="temp_fields">
                                <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                                <el-table-column prop="label" label="字段"></el-table-column>
                                <el-table-column prop="type" label="组件名" width="120"></el-table-column>

                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="deleteConfig(scope)">删除</el-button>
                                        <el-button type="text" @click="swapUp(scope)" v-if="scope.$index != 0">向上</el-button>
                                        <el-button type="text" @click="swapDown(scope)" v-if="scope.$index != temp_fields.length-1">向下</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div v-else>
                            <el-button type="primary" @click="addMaterialDialogVisible = true">添加材料</el-button>
                            <!-- <el-button type="primary" @click="saveTempFields">保存修改</el-button> -->
                            <el-table :data="temp_materials">

                                <el-table-column prop="docxTemplateName" label="材料filename"></el-table-column>

                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="deleteConfig(scope)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div v-else>

                        <div ref="configEdit" style="width:100%;height:300px"></div>
                    </div>
                </div>
                <el-divider></el-divider>

                <h3>beforeEnter: </h3>
                <el-checkbox label="启用" v-model="temp_page.stepObject.useBeforeEnter" @change="handleUseBeforeEnter"></el-checkbox>
                <!-- 代码框 -->
                <div v-show="!!temp_page.stepObject.useBeforeEnter" class="ace-container" ref="beforeEnterEdit"
                    style="width:100%;height:300px"></div>
                <el-divider></el-divider>
                <h3>afterEnter: </h3>
                <el-checkbox label="启用" v-model="temp_page.stepObject.useAfterEnter" @change="handleUseAfterEnter"></el-checkbox>
                <!-- 代码框 -->
                <div v-show="!!temp_page.stepObject.useAfterEnter" class="ace-container" ref="afterEnterEdit"
                    style="width:100%;height:300px"></div>
                    
                

            </div>
        </div>

        <!-- 创建步骤页面 -->
        <el-dialog title="创建步骤页面" :visible.sync="stepPageCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                页面名称:
                <el-input v-model="temp_page_name"></el-input>
            </div>
            <div>
                页面组件:
                <el-select v-model="temp_page_component">
                    <el-option v-for="(v,i) in componentOptions" :key="i" :label="v.label" :value="v.label"></el-option>
                </el-select>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="stepPageCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStepPage">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加field 页面 -->
        <el-dialog title="添加字段" :visible.sync="addFieldDialogVisible" width="50%" :close-on-click-modal="false">
            <el-button type="text" @click="chooseAllFieldToTemp"> 全选</el-button>
            <el-table :data="fields">
                <el-table-column prop="fieldNo" label="fieldNo" sortable=""></el-table-column>
                <el-table-column prop="label" label="字段名"></el-table-column>
                <el-table-column prop="type" label="组件"></el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="chooseFieldToTemp(scope,'fieldNo')"
                            :disabled="!!temp_page.stepObject.config && !!temp_page.stepObject.config.includes(scope.row.fieldNo)">
                            选择</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-tag size="mini" closable v-for="(v,i) in temp_page.stepObject.config" :key="i"
                @close="handleDeleteFromTempChosenFields(i)">{{v}}</el-tag>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFieldDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">添 加</el-button>
            </span>
        </el-dialog>
        <!-- 添加material 页面 -->
        <el-dialog title="添加材料" :visible.sync="addMaterialDialogVisible" width="50%" :close-on-click-modal="false">
            <!-- <el-button type="text" @click="chooseAllFieldToTemp"> 全选</el-button> -->
            <el-table :data="materials.map(v=>v.template)">

                <el-table-column prop="docxTemplateName" label="材料名"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="chooseFieldToTemp(scope,'docxTemplateName')"
                            :disabled="!!temp_page.stepObject.config && !!temp_page.stepObject.config.includes(scope.row.templateName)">
                            选择</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-tag size="mini" closable v-for="(v,i) in temp_page.stepObject.config" :key="i"
                @close="handleDeleteFromTempChosenFields(i)">{{v}}</el-tag>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addMaterialDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">添 加</el-button>
            </span>
        </el-dialog>
        <!-- 输出 -->
        <el-dialog title="输出" :visible.sync="outputDialog" width="50%" :close-on-click-modal="false">
            <el-button @click="getState">获取state</el-button>
            <el-button @click="getGetters">获取getter</el-button>
            <pre ref="outputEditor" style="height:500px"></pre>

            <span slot="footer" class="dialog-footer">
                <el-button @click="outputDialog = false">取 消</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { getStep, saveStep, deleteStep, saveStepBatch, transferJs } from "@/api/step/index";
import { getFieldAll } from "@/api/superForm/index";
import { getTemplate } from '@/api/template/index'
import { getById } from "@/api/item/index";
import ace from "ace-builds";
import beautify from "ace-builds/src-noconflict/ext-beautify";
import pageComponents from "../pageComponents/index"
import serialize from 'serialize-javascript';
import {mixin} from "@/mixin/mixin"
import {
    deserializeTableData
} from "../attributeComponents/index";
import {convertDefToConfigBundle,functionReviverBundle} from "./util"
import axios from 'axios';
export default {
    name: "PageConfigure",
    mixins: [mixin],
    data() {
        return {
            // 创建页面用
            stepPageCreateVisible: false,
            temp_page_name: "",
            temp_page: { stepObject: { config: [] } },
            //  添加字段dialog用
            addFieldDialogVisible: false,
            temp_chosen_fields: [],
            componentOptions: pageComponents,
            temp_page_component: null,
            temp_configType: "",

            stepPages: [],
            // 代码框
            aceEditor: null,
            // 事项下所有的字段
            fields: [],
            // 事项下所有的材料
            materials: [],
            // 添加材料dialog用
            addMaterialDialogVisible: false,
            // config 的ace 编辑器
            aceForConfig: null,
            
            defaultFn: `function config(state,getters) {
                return []
            }`,
            // beforeEnter 的ace 编辑器
            aceForBeforeEnter:null,
            defaultBeforeEnter:`function beforeEnter(state,getters){

            }`,
            //  afterEnter 的ace 编辑器
            aceForAfterEnter:null,
            defaultAfterEnter:`function afterEnter(state,getters){

            }`,
            //  output 
            outputDialog: false,
            outputEditor: null,
            outputContent: "",
            barcode:"test",
        };
    },
    computed: {
        ...mapState({
            // stepPages: state => state.fieldModel.stepPages,
            itemName: state => state.home.item.name,
            itemId: state => state.home.item.approvalItemId,
        }),
        temp_fields() {
            if (this.temp_page.stepPageType != 'field') return [];
            let fieldNos = this.temp_page.stepObject.config;
            return fieldNos.map(fieldNo => this.fields.find(field => field.fieldNo == fieldNo))
            // return this.fields.filter(field => fieldNos.includes(field.fieldNo))
        },
        temp_materials() {
            if (this.temp_page.stepPageType != 'material') return [];
            let materials = this.temp_page.stepObject.config;

            return this.materials.map(v => v.template).filter(material => materials.includes(material.docxTemplateName))
        }

    },
    async mounted() {
        await this.init();
        await this.loadAll();
    },
    methods: {
        // async init(){
        //     if(this.itemId == null){
        //         let itemId = this.$route.query.itemId;
        //         let result = await getById({id: itemId});
        //         if (!result.success) {
        //         this.$message({ type: "warning", message: "获取初始事项信息失败" });
        //         return;
        //         }
        //         this.$store.commit("changeItem", result.data);
        //     }
        //     this.loadAll();
        // },
        createStepPage() {
            this.stepPageCreateVisible = true;
        },
        // 确认添加步骤页面
        async addStepPage() {
            let component = this.componentOptions.find(v => v.label == this.temp_page_component)
            let data = {
                stepTitle: this.temp_page_name,
                stepComponent: component.name,
                approvalItemId: this.itemId,
                // 类型，字段 或者 材料
                stepPageType: component.type,
                stepObject: {},
            };


            data = this.initStepObject(data)

            let result = await saveStep(data);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功" });
            // this.$store.commit("pushStepPage", data);
            this.stepPageCreateVisible = false;
            // 重新加载
            this.loadStep();
        },
        // 保存添加字段的修改
        async handleDeleteStepPage(step) {
         
            try{
                await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            }catch(e){
                return;
            }
             
           
            let result = await deleteStep({ stepId: step.id })
            if (!result.success) return;
            this.$message({ type: "success", message: "删除成功" })
            this.loadStep();
        },
        // 选中 某个页面
        async handleClickPage(page) {
            if (this.aceForConfig) {
               
                this.aceForConfig.destroy();
            }
            if(this.aceForBeforeEnter){
               
                // this.aceForBeforeEnter.destroy();
                this.aceForBeforeEnter=null;
            }
            if(this.aceForAfterEnter){
                
                // this.aceForAfterEnter.destory();
                this.aceForAfterEnter=null;
            }
            this.temp_page = page;
          
           
            await this.$nextTick();
            this.initEditForConfig();
            if(this.temp_page.stepObject.useBeforeEnter){
                this.initEditForBeforeEnter();
            }
            if(this.temp_page.stepObject.useAfterEnter){
                this.initEditForAfterEnter();
            }
            
        },
        //切换配置类型
        async handleSwitchConfigType(data) {
            if (data != 2) return;
            await this.$nextTick();
            this.initEditForConfig();
            
        },
        // 初始化 配置 编辑器
        initEditForConfig() {
            this.aceForConfig = ace.edit(this.$refs.configEdit);
            this.aceForConfig.setTheme("ace/theme/monokai");
            this.aceForConfig.session.setMode("ace/mode/javascript");
            this.aceForConfig.setOption("wrap", "free")
            this.aceForConfig.setValue(this.temp_page.stepObject.configFn)
            beautify.beautify(this.aceForConfig.session)
        },
        //  启用 beforeEnter
        async handleUseBeforeEnter(v){
            if(v){
                
                await this.$nextTick();
                this.initEditForBeforeEnter();
            }else{
                this.aceForBeforeEnter.destroy();
                this.aceForBeforeEnter=null;
            }

        },
        async handleUseAfterEnter(v){
            if(v){
                
                await this.$nextTick();
                this.initEditForAfterEnter();
            }else{
               
                this.aceForAfterEnter.destroy();
                this.aceForAfterEnter=null;
            }

        },
        // 初始化 beforeEnter编辑器
        async initEditForBeforeEnter(){
           
             this.aceForBeforeEnter =  ace.edit(this.$refs.beforeEnterEdit);
                this.aceForBeforeEnter.setTheme("ace/theme/monokai");
                this.aceForBeforeEnter.session.setMode("ace/mode/javascript");
                this.aceForBeforeEnter.setOption("wrap", "free")
                this.aceForBeforeEnter.setValue(this.temp_page.stepObject.beforeEnterFn || this.defaultBeforeEnter)
                beautify.beautify(this.aceForBeforeEnter.session)

        },
        // 初始化 afterEnter编辑器
        async initEditForAfterEnter(){
           
            this.aceForAfterEnter =  ace.edit(this.$refs.afterEnterEdit);
            this.aceForAfterEnter.setTheme("ace/theme/monokai");
            this.aceForAfterEnter.session.setMode("ace/mode/javascript");
            this.aceForAfterEnter.setOption("wrap", "free")
            this.aceForAfterEnter.setValue(this.temp_page.stepObject.afterEnterFn || this.defaultAfterEnter)
            beautify.beautify(this.aceForAfterEnter.session)

        },
        // 选择某个字段
        chooseFieldToTemp(scope, keyname) {
            this.temp_page.stepObject.config.push(scope.row[keyname])

            // this.temp_chosen_fields.push(scope.row);
        },
        //全选
        chooseAllFieldToTemp() {
            this.temp_page.stepObject.config = this.fields.map(v => v.fieldNO);
        },
        //删除 选中的字段
        handleDeleteFromTempChosenFields(i) {

            this.temp_page.stepObject.config.splice(i, 1);
        },
        // 将选中字段添加到页面中
        async save() {
            this.temp_page.stepObject.configFn = this.aceForConfig.getValue();
            this.temp_page.stepObject.beforeEnterFn = this.aceForBeforeEnter && this.aceForBeforeEnter.getValue();
            this.temp_page.stepObject.afterEnterFn = this.aceForAfterEnter && this.aceForAfterEnter.getValue();
            let data = {
                id: this.temp_page.id,
                stepTitle: this.temp_page.stepTitle,
                stepPagenum: this.temp_page.stepPagenum,
                stepPageType: this.temp_page.stepPageType,

                stepObject: this.temp_page.stepObject,
                beforeEnterFn:this.temp_page.stepObject.beforeEnterFn,
                useBeforeEnter:!!this.temp_page.stepObject.useBeforeEnter,
                afterEnterFn:this.temp_page.stepObject.afterEnterFn,
                useAfterEnter:!!this.temp_page.stepObject.useAfterEnter,
            };
            let result = await saveStep(data);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功" })

            this.addFieldDialogVisible = false;
        },

        async deleteConfig(scope) {
            console.log(scope);
            let index = scope.$index;
            this.temp_page.stepObject.config.splice(index, 1);
            let result = await saveStep(this.temp_page);
        },
        swapUp(scope) {

            let originIndex = scope.$index;
            let targetIndex = originIndex - 1;

            let temp = this.temp_page.stepObject.config[targetIndex];
            // this.temp_page.stepObject.config[targetIndex]=this.temp_page.stepObject.config[originIndex];
            // this.temp_page.stepObject.config[originIndex]=temp;
            this.$set(this.temp_page.stepObject.config, targetIndex, this.temp_page.stepObject.config[originIndex]);
            this.$set(this.temp_page.stepObject.config, originIndex, temp);
            console.log(this.temp_page.stepObject.config)
        },
        //  预览
        // handlePreview() {
        //     let module = {
        //         state: {},
        //         getters: {}
        //     };
        //     console.log("this.temp_page:",this.temp_page);
        //     console.log(this.temp_page.fields);
        //     module.state = this.temp_page.fields.reduce((result, item) => {

        //         let attrObj = _.mapValues(item.componentDefs, (o) => this.functionReviver(o.value));
        //         console.log(attrObj)
        //         let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo }, attrObj, { attributes: item.componentDefs.getAttributes ? item.componentDefs.getAttributes() || {} : {} })
        //         result[item.fieldNo] = mergeObj;
        //         return result;
        //     }, {});
        //     if (this.$store.hasModule("preview")) {
        //         this.$store.unregisterModule("preview");
        //     }
        //     console.log(JSON.stringify(module.state, null, 4));
        //     this.$store.registerModule("preview", module);
        //     this.$router.push("/preview");
        // },
        async loadStep() {
            console.log("this.itemId:",this.itemId)
            let result = await getStep({ approvalItemId: this.itemId });
            if (!result.success) return;
            this.stepPages = this.initStepPagesData(result.data);
        },
        // 重新加载步骤列表
        async loadAll() {
            let result = await Promise.all([
                getStep({approvalItemId: this.itemId}),
                getFieldAll({ approvalItemId: this.itemId }),
                getTemplate({ approvalItemId: this.itemId })
            ])
            if (result.some(v => !v.success)) return;

            let stepRes = result[0]
            let fieldRes = result[1]
            let tplRes = result[2]


            this.stepPages = this.initStepPagesData(stepRes.data);

            this.fields = fieldRes.data.map(v => ({ id: v.id, fieldType: v.fieldType, fieldName: v.fieldName,
                remark: v.remark,children: v.children, ...v.object  })).map(deserializeTableData)
            this.materials = tplRes.data;
        },
        initStepPagesData(data) {
            return data.map(this.initStepObject)
        },
        initStepObject(v) {
            v.stepObject || (v.stepObject = {});
            v.stepObject.title || (v.stepObject.title = v.stepTitle);
            v.stepObject.component || (v.stepObject.component = v.stepComponent);
            v.stepObject.config || (v.stepObject.config = []);
            v.stepObject.configType || (v.stepObject.configType = 1);
            v.stepObject.configFn || (v.stepObject.configFn = `function config(state,getters) {
                return []
            }`);
            return v;
        },
        // 输出 首页
        handleOutput() {
            this.outputDialog = true;
            this.output();
        },
        async output() {

            let result = await getStep({ approvalItemId: this.itemId })


            let stepsData = result.data.map(v => {

                if (typeof v.stepObject.configFn == "string" && v.stepObject.configFn.indexOf('function') > -1) {
                    v.stepObject.configFn = eval(`(${v.stepObject.configFn})`)
                }
                if(v.stepObject.useBeforeEnter){
                    v.stepObject.beforeEnterFn = eval(`(${v.stepObject.beforeEnterFn})`)
                }
                if(v.stepObject.useAfterEnter){
                    v.stepObject.afterEnterFn = eval(`(${v.stepObject.afterEnterFn})`)
                }
                return { ...v.stepObject, stepPagenum: v.stepPagenum }
            }).sort((a, b) => a.stepPagenum - b.stepPagenum)

            
            await this.$nextTick();
           
            this.outputEditor = ace.edit(this.$refs.outputEditor);
            this.outputEditor.setTheme("ace/theme/monokai");
            this.outputEditor.session.setMode("ace/mode/javascript");
            this.outputEditor.setOption("wrap", "free")
            this.outputEditor.setValue(`
            import _ from "lodash" 
            import dayjs from "dayjs"
            import customParseFormat from 'dayjs/plugin/customParseFormat'
            let stepData = ${serialize(stepsData)}
            export default stepData`)
            beautify.beautify(this.outputEditor.session)

        },
        // 输出 state
        async getState() {
            let result = await getFieldAll({ approvalItemId: this.itemId  })
            let allFields = result.data.records.map(v => ({ id: v.id, fieldType: v.fieldType, fieldName: v.fieldName,
                remark: v.remark,children: v.children, ...v.object })).map(deserializeTableData);
            let baseFields = allFields.filter(v => v.fieldType == 1)

            let itemState = convertDefToConfigBundle(baseFields);
            this.outputEditor.setValue(`
            import _ from "lodash" 
            import dayjs from "dayjs"
            import customParseFormat from 'dayjs/plugin/customParseFormat'
            dayjs.extend(customParseFormat)
            import helper from "@/utils/function"
            let state = ${serialize(itemState)} 
            _.forEach(state, function(value, key) {
                if (value.meta) {
                    Object.defineProperty(value, "value", {
                        set:function(list){
                            
                            value.attributes.children=[];
                            list.forEach(obj=>{
                                let child = _.cloneDeep(value.meta);
                                Object.keys(obj).forEach(key=>{
                                    if(!child[key]){
                                        console.warn("list中"+key+"不存在")
                                        return;
                                    }
                                    child[key].value = obj[key]
                                })
                                value.attributes.children.push(child)
                            })
                        },
                        get: function () {
                            return value.attributes.children.map(v => _.mapValues(v, o => o.value))
                        },
                    })
                }

            })
            export default state`)
            beautify.beautify(this.outputEditor.session)

        },
        //输出 getter
        async getGetters() {
            let result = await getField({ approvalItemId: this.itemId  })
            let allFields = result.data.records.map(v => ({ id: v.id, fieldType: v.fieldType, children: v.children, ...v.object })).map(deserializeTableData);
            
            let itemGetters =allFields.filter(v => v.fieldType == 2).reduce((result, item) => {
                // let attrObj = _.mapValues(item.componentDefs, (o) => this.parseFunction(o.value));

                result[item.fieldNo] = functionReviverBundle(item.componentDefs.getter.value, item.fieldNo);

                return result;
            }, {});
            this.outputEditor.setValue(`import _ from "lodash" 
            import dayjs from "dayjs"
            import customParseFormat from 'dayjs/plugin/customParseFormat'
            dayjs.extend(customParseFormat)
            import helper from "@/utils/function"
            let getters = ${serialize(itemGetters)} 
            export default getters`)
            beautify.beautify(this.outputEditor.session)
        },
        async importDefault(){
            let message = "确认导入7个初始步骤页面吗";
            if (confirm(message) == true) {
            // 默认输入
            const input = [{p_name: "情形选择", c_name:"ApprovalSelectContent"},{p_name: "智能提取材料", c_name:"MaterialExtract"},
            {p_name: "基本信息确认", c_name:"BaseFormPage"},{p_name: "变更信息录入", c_name:"BusinessFormPage"},{p_name: "经办人信息录入", c_name:"IdCardInfo"},
            {p_name: "材料预览", c_name:"CommonMaterial"},{p_name: "材料打印", c_name:"LastStep"}];
            // 默认参数
            let params = input.map( each => { 
                let component = this.componentOptions.find(v => v.name == each.c_name)
                return this.initStepObject({
                stepTitle: each.p_name,
                stepComponent: each.c_name,
                approvalItemId: this.itemId ,
                stepPageType: component.type,
                stepObject: {},
            })
            })
            let result = await saveStepBatch(params);
            if (!result.success) return;
            this.$message({ type: "success", message: "默认步骤导入成功" });
            this.loadStep();
            }
        },
        async transferOutput(){
            let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
            // 去尾处理
            if(serviceBaseUrl.endsWith('/')){
                serviceBaseUrl = serviceBaseUrl.substring(0, serviceBaseUrl.length-1)
            }
            console.log(serviceBaseUrl)
            if(serviceBaseUrl == null || serviceBaseUrl == ''){
                this.$message({ type: "error", message: "请先设置超级帮办地址!" });
                return;
            }
            // output
            await this.output();
            let output = this.outputEditor.getValue();

            // state
            await this.getState();
            let state = this.outputEditor.getValue();

            // getters
            await this.getGetters();
            let getters = this.outputEditor.getValue();

            let params = {
                pageStepJs: output,
                getterJs: getters,
                sid: this.$store.state.home.item.itemNo,
                sixiangUserName: "admin",
                stateJs: state,
            };
            console.log(params)

            // 步骤保存到超级帮办
            let result = await axios.post(serviceBaseUrl+"/api/sixiang/saveJavaScript", params).then(res => res.data);
            console.log(result)
            if(result.code == 200){
                this.$message({ type: "success", message: "导入成功 请查看数据库" });
            }else{
                this.$message({ type: "error", message: result.message + " "+ result.data });
            }
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