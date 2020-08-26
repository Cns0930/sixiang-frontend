<template>
    <div class="material-manager">
        
        <div class="op-bar">
            <el-button @click="templateCreateVisible = true"> 新建材料</el-button>
            <el-button @click="getTemplate">载入材料</el-button>
        </div>

        <div class="main">
        <!-- 模板列表 -->
        <div class="material-list">
            <div v-for="(v,i) in templates" :key="i" class="material-item">
                <el-button type="text" style="color: orange;" @click="goTemplatemanager(v.template.id)">{{ v.template.docxTemplateName }}</el-button>
                <el-button @click="openDetail(v)">编辑</el-button>
                <el-button @click="deleteTemplate(v.template.id)">删除</el-button>
                <el-button @click="transferTemplate(v)">保存到超级帮办</el-button>
            </div>
        </div>

        <!-- 模板编辑 -->
        <div class="material-detail" v-if="temp_template">
            <div>
            <el-button type="primary" @click="saveTemplate">保存修改</el-button>
            </div>
            模板名称(必填)<el-input v-model="temp_template.docxTemplateName"></el-input>
            材料中文名(必填)<el-input v-model="temp_template.documentName"></el-input>
            材料序号(必填)<el-input v-model="temp_template.documentSeq"></el-input>
            备注<el-input v-model="temp_template.notes"></el-input>
            page配置<CodeEditor v-model="temp_template.script"></CodeEditor>

        </div>
        </div>
        <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                模板名称(必填):<el-input v-model="temp_template_name" @keyup.enter.native="addTemplate"></el-input>
                材料中文名(必填):<el-input v-model="temp_document_name"></el-input>
                材料序号(必填):<el-input v-model="temp_document_seq"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="templateCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplate">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import { getTemplate, addTemplate, deleteTemplate } from '@/api/template/index'
import { getById } from "@/api/item/index";
import {mixin} from "@/mixin/mixin"
<<<<<<< HEAD
import axios from 'axios';

=======
import {CodeEditor} from "@/views/attributeComponents/defRendererComponents/defRendererComponents"
>>>>>>> e65b85c34cd3178d79a1d46af0a3c87a4822ae33
export default {
    name: "MaterialManager",
    mixins:[mixin],
    components:{CodeEditor},
    data() {
        return {
            templates: [],

            templateCreateVisible: false,

            temp_template_name: '',
            temp_document_seq: '',
            temp_document_name: '',

            temp_template: null,
        }
    },
    async mounted() {
        await this.init();
        await this.getTemplate();
    },
    methods: {
        async getTemplate() {
            const res = await getTemplate({
                itemName: this.$store.state.home.item.name,
            });
            if (!res.success) return;
            this.templates = res.data;
        },

        async addTemplate() {
            if (!this.temp_template_name) return;

            const res = await addTemplate({
                itemName: this.$store.state.home.item.name,
                sid: this.$store.state.home.item.sid,
                itemId: this.$store.state.home.item.id,
                docxTemplateName: this.temp_template_name,
                documentSeq: this.temp_document_seq,
                documentName: this.temp_document_name,
            });

            if (!res.success) return;

            this.$message.success('新增模板成功');
            this.templateCreateVisible = false;
            this.temp_template_name = '';
            
            this.getTemplate();
        },
        
        async deleteTemplate(id) {
            let message = "确定要删除吗";
            if (confirm(message) == true) {
            const res = await deleteTemplate({
                templateId: id,
            });

            if (!res.success) return;

            this.$message.success('删除模板成功');
            this.getTemplate();
            }
        },

        goTemplatemanager(id) {
            this.$router.push({
                path: '/templatemanager',
                query: {
                    itemId: this.$store.state.home.item.id,
                    id: id,
                },
            });
        },
        openDetail(v){
            this.temp_template = v.template;
            this.temp_template.script || (this.temp_template.script="")
        },
        async saveTemplate(){
            console.log(this.temp_template)
            let result = await addTemplate(this.temp_template);
            if (!result.success) return;

            this.$message.success('保存模板成功');
        },
        async transferTemplate(v){
            // TODO: 材料保存到超级帮办
            let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
            if(serviceBaseUrl.endsWith('/')){
                serviceBaseUrl = serviceBaseUrl.substring(0, serviceBaseUrl.length-1)
            }
            console.log(serviceBaseUrl)
            if(serviceBaseUrl == null || serviceBaseUrl == ''){
                this.$message({ type: "error", message: "请先设置超级帮办地址!" });
                return;
            }

            let params = {
                documentName: v.template.documentName,
                documentSeq: v.template.documentSeq,
                docxTemplateName: v.template.docxTemplateName,
                notes: v.template.notes,
                sid: v.template.sid,
                script: v.template.script,
            }
            console.log(params)

            let result = await axios.post(serviceBaseUrl+"/api/sixiang/saveTemplate", params).then(res => res.data);
            console.log(result)
            if(result.code == 200){
                this.$message({ type: "success", message: "导入成功 请查看数据库" });
            }else{
                this.$message({ type: "error", message: result.message + " "+ result.data });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.material-manager{
    padding: 20px;
    .op-bar{
        padding-left: 20px;
    }
    .main{
        display: flex;
    flex-direction: row;
    .material-list{
        width: 500px;
        margin-top: 10px;
        padding: 20px;
        border: 1px solid green;
        .material-item{
            margin-bottom: 10px;
        }
    }
    .material-detail{
        border: 1px solid blue;
        width: 600px;
        margin-top: 10px;
    }
    }
    
}
</style>
