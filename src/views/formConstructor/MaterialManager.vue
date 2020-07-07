<template>
    <div class="material-manager">
        <div class="op-bar">
            <el-button @click="templateCreateVisible = true"> 新建材料</el-button>
            <el-button> 载入字段</el-button>
        </div>

        <div class="material-list">
            <div v-for="(v,i) in templates" :key="i">
                {{ v.template.templateName }}
                <el-button>删除</el-button>
            </div>
        </div>

        <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="templateCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
                模板名称:<el-input v-model="temp_template_name"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="templateCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplate">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
import { getTemplate, addTemplate } from '@/api/template/index'

export default {
    name: "MaterialManager",
    data() {
        return {
            templates: [],

            templateCreateVisible: false,

            temp_template_name: '',
        }
    },
    mounted() {
        this.getTemplate();
    },
    methods: {
        async getTemplate() {
            const res = await getTemplate({
                itemName: this.$store.state.home.itemName,
            })
            if (!res.success) return;
            this.templates = res.data;
        },
        async addTemplate() {
            if (!this.temp_template_name) return;

            const res = await addTemplate({
                itemName: this.$store.state.home.itemName,
                templateName: this.temp_template_name,
            })

            if (!res.success) return;

            this.$message.success('新增模板成功');
            this.templateCreateVisible = false;
            this.temp_template_name = '';
            
            this.getTemplate();
        },
    }
}
</script>

<style lang="scss" scoped>
.material-manager{
    padding: 20px;
    .material-list{
        padding: 20px;
        border: 1px solid green;
        >div{
            margin-bottom: 10px;
        }
    }
}
</style>