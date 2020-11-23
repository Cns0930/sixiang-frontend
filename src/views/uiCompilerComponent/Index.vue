<template>
    <div>
        <button @click="addConditionBlock">添加条件块</button>
        <!-- <button>添加行为</button> -->
        <button @click="compile">查看/关闭编译</button>
        <div ref="codeEditor" style="width:100%;height:300px" v-show="codeEditorOpen"></div>
        <div class="statement">
            <Interface v-for="model,i in models" :key="i" :model="model" :list="fieldsWithOptions" class="statement"
                @deleteConditionBlock="deleteConditionBlock(i)"></Interface>
        </div>
    </div>
</template>

<script>

import { mapState } from "vuex"
import compiler from "./compiler/compiler"
import Interface from "./Interface"
import beautify from "ace-builds/src-noconflict/ext-beautify";
export default {
    name: "UiCompilerComponent",
    components: {
        Interface
    },
    props:{
        models:{
            default(){
                return []
            }
        },
        fields:{
            default(){
                return []
            }
        }
    },
    provide() {
        return {
            $fields: () => {
                return this.fields
            },
        }
    },
    data() {
        return {
            // models: [],
            code:"",
            // 开关 configFn
            codeEditorOpen:false,
            codeEditor:null,

        }
    },
    computed: {
        // ...mapState({
        //     tableData: state =>
        //         state.fieldModel.tableData
        // }),
        fieldsWithOptions() {
            return this.fields.map(data => {
                if (data.componentDefs.getDSLOptions) {
                    return { ...data, subjectOptions: data.componentDefs.getDSLOptions() }
                }
                return data;
            })
        },

    },
    mounted(){

    },
    methods: {
        addConditionBlock() {
            this.models.push({
                conditionBlock: {

                    // 逻辑
                    logic: "any",

                    // 条件 列表
                    conditions: [{
                        type: "logical",
                        // 主体
                        subject: "",
                        // 主体的选项 
                        subjectOptions: [],
                        // 谓语 (操作)
                        predicate: "",

                        //  宾语
                        object: "",
                    }],


                },
                actionBlock: {
                    actions:[
                       
                    ]
                },
                type:"stepPage"
            })
        },
        // 删除条件块
        deleteConditionBlock(i) {
            this.models.splice(i, 1)
        },
        addAction() {

        },
        async compile(){
            // console.log(this.models);
            if(this.codeEditorOpen){
                this.codeEditorOpen=false;
                return;
            }
            this.codeEditorOpen = true;
            await this.$nextTick();

            
            try{
               this.code= compiler(this.models)
               
            }catch(e){
                console.warn(e);
                this.code="配置错误"
            }
            this.initEditForConfig(this.code)
            console.log(this.code);
            
        },
        // 初始化 配置 编辑器
        initEditForConfig() {
            this.codeEditor = ace.edit(this.$refs.codeEditor);
            this.codeEditor.setTheme("ace/theme/monokai");
            this.codeEditor.session.setMode("ace/mode/javascript");
            this.codeEditor.setOption("wrap", "free")
            this.codeEditor.setValue(this.code)
            beautify.beautify(this.codeEditor.session)
        },
        getCompilerValue(){
            try{
               this.code= compiler(this.models)
               
            }catch(e){
                console.warn(e);
                this.code="配置错误"
            }
            this.initEditForConfig(this.code)
            return this.codeEditor.getValue();
        },
        getModels(){
            return this.models
        }
    }


}
</script>

<style scoped lang="scss">
.statement {
    margin-bottom: 16px;
}
</style>