<template>
    <el-dialog title="新增子文档" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">
        <div class="form-content">
            <el-form :model="addForm" label-width="200px" ref="addForm" :rules="rules">
                <el-form-item label="子文档名称" prop="globalDocumentSubName">
                    <el-input v-model="addForm.globalDocumentSubName"></el-input>
                </el-form-item>
                <el-form-item label="所属材料" prop="globalDocumentId">
                    <el-select placeholder="所属材料" v-model="addForm.globalDocumentId" filterable clearable>
                        <el-option v-for="(v,i) in allGlobalDocuments" :label="v.label" :value="v.value" :key="i">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否多页" prop="isMultiplePage">
                    <el-select placeholder="类型" v-model="addForm.isMultiplePage" filterable clearable>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标记(唯一字段)">
                    <el-input v-model="addForm.description"></el-input>
                </el-form-item>

                <el-form-item label="归类">
                    <el-input v-model="addForm.category"></el-input>
                </el-form-item>
                <el-form-item label="子文档编号">
                    <el-input v-model="addForm.globalDocumentSubCode"></el-input><span
                        style="font-size:50%;color:orange"> 非必填, 系统会自动生成</span>
                </el-form-item>
                <el-form-item label="标准格式下的页码" prop="pageLocation">
                    <el-input v-model="addForm.pageLocation"></el-input>
                </el-form-item>
                <el-form-item label="关联全局二级文档">
                    <el-select placeholder="请选择关联全局二级文档名称" v-model="addForm.catalogDocumentSubId" filterable clearable disabled>
                        <el-option v-for="(v,i) in globalDocumentsSubOption" :label="v.catalogDocumentSubName"
                            :value="v.catalogDocumentSubId" :key="i">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="add" :loading="addBtnLoading">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
    addGlobalDcumentSub
} from '@/api/basicInfo/publicDocument';
import { listCatalogDocumentSub } from '@/api/basicInfo/catalogDocumentSub'
export default {
    name: "AddMaterialDialog",
    props: [
        "allGlobalDocuments",
        "globalDocumentId"
    ],
    data() {
        return {
            addDialogVisible: false,
            addForm: {},
            addBtnLoading: false,
            globalDocumentsSubOption: [],
            rules: {
                globalDocumentSubName: [{
                    required: true, message: '请输入子材料名称', trigger: 'change'
                }],
                globalDocumentId: [{
                    required: true, message: '请选择所属材料', trigger: 'change'
                }],
                isMultiplePage: [{
                    required: true, message: '请选择是否多页', trigger: 'change'
                }],
                pageLocation: [{
                    required: false, message: '请填写标准格式下的页码', trigger: 'change'
                },
                {
                    pattern: /^\d+(,\d+)*$/,
                    message: "请填写正确的页码格式，如：1,2,3,4", trigger: "blur"
                }]
            },
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        async handleEdit(row) {
            let res = await listCatalogDocumentSub();
            if (!res.success) return;
            this.globalDocumentsSubOption = res.data;
        },
        async add() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.addBtnLoading = true;
                    this.addForm.projectId = this.$route.query.projectId;
                    let result = await addGlobalDcumentSub(this.addForm);
                    this.addBtnLoading = false;

                    if (!result.success) return;
                    this.$message({ type: "success", message: "添加成功" })

                    this.addDialogVisible = false;
                    this.$emit("update");
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>

<style scoped  lang="scss">
</style>