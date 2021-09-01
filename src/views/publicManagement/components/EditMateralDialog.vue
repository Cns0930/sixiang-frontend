<template>
    <div>
        <el-dialog title="编辑子文档" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <div class="form-content">
                <el-form :model="editForm" label-width="200px" ref="editForm" :rules="rules">
                    <el-form-item label="子文档名称" prop="globalDocumentSubName">
                        <el-input v-model="editForm.globalDocumentSubName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否多页" prop="isMultiplePage">
                        <el-select placeholder="类型" v-model="editForm.isMultiplePage" filterable clearable>
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标记(唯一字段)">
                        <el-input v-model="editForm.description"></el-input>
                    </el-form-item>

                    <el-form-item label="归类">
                        <el-input v-model="editForm.category"></el-input>
                    </el-form-item>
                    <el-form-item label="子文档编号">
                        <el-input v-model="editForm.globalDocumentSubCode"></el-input>
                    </el-form-item>
                    <el-form-item label="标准格式下的页码" prop="pageLocation">
                        <el-input v-model="editForm.pageLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="关联全局二级文档">
                        <el-select placeholder="请选择关联全局二级文档名称" v-model="editForm.catalogDocumentSubId" filterable
                            clearable>
                            <el-option v-for="(v,i) in globalDocumentsSubOption" :label="v.catalogDocumentSubName"
                                :value="v.catalogDocumentSubId" :key="i">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="edit" :loading="editBtnLoading">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import {
    updateGlobalDcumentSub
} from '@/api/basicInfo/publicDocument';
import { listCatalogDocumentSub } from '@/api/basicInfo/catalogDocumentSub'
export default {
    name: "EditMateralDialog",
    data() {
        return {
            editForm: {},
            globalDocumentsSubOption: [],
            editDialogVisible: false,
            editBtnLoading: false,
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
    components: {

    },
    created() {

    },
    methods: {
        async handleEdit(row) {
            let res = await listCatalogDocumentSub();
            if (!res.success) return;
            this.globalDocumentsSubOption = res.data;
        },
        async edit() {
            this.$refs.editForm.validate(async (valid) => {
                if (valid) {
                    this.editBtnLoading = true;

                    let result = await updateGlobalDcumentSub(this.editForm);
                    if (!result.success) {
                        this.$message({ type: "error", message: result.data })
                        return;
                    }
                    this.editBtnLoading = false;
                    this.editDialogVisible = false;
                    this.$message({ type: "success", message: "保存成功" })
                    this.$emit("update")
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

    }
}
</script>

<style>
</style>