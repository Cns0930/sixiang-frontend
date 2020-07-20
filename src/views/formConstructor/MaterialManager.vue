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
            </div>
        </div>

        <!-- 模板编辑 -->
        <div class="material-detail" v-if="temp_template">
            <div>
            <el-button type="primary" @click="saveTemplate">保存修改</el-button>
            </div>
            模板名称<el-input v-model="temp_template.docxTemplateName"></el-input>
            材料中文名<el-input v-model="temp_template.documentName"></el-input>
            材料序号<el-input v-model="temp_template.documentSeq"></el-input>
            备注<el-input v-model="temp_template.notes"></el-input>
            

        </div>
        </div>
        <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                模板名称:<el-input v-model="temp_template_name" @keyup.enter.native="addTemplate"></el-input>
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

export default {
    name: "MaterialManager",
    data() {
        return {
            templates: [],

            templateCreateVisible: false,

            temp_template_name: '',

            temp_template: null,
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async init(){
            if(this.$store.state.home.item.id == null){
                let itemId = this.$route.query.itemId;
                let result = await getById({id: itemId});
                if (!result.success) {
                this.$message({ type: "warning", message: "获取初始事项信息失败" });
                return;
                }
                this.$store.commit("changeItem", result.data);
            }
            this.getTemplate();
        },
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
            });

            if (!res.success) return;

            this.$message.success('新增模板成功');
            this.templateCreateVisible = false;
            this.temp_template_name = '';
            
            this.getTemplate();
        },
        
        async deleteTemplate(id) {
            const res = await deleteTemplate({
                templateId: id,
            });

            if (!res.success) return;

            this.$message.success('删除模板成功');
            this.getTemplate();
        },

        goTemplatemanager(id) {
            this.$router.push({
                path: '/templatemanager',
                query: {
                    id: id,
                },
            });
        },
        openDetail(v){
            this.temp_template = v.template;
        },
        async saveTemplate(){
            let result = await addTemplate(temp_template);
            if (!res.success) return;

            this.$message.success('保存模板成功');
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
        width: 300px;
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
