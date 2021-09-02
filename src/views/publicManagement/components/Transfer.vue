<template>
    <div class="transfer">
        <el-dialog title="关联转移材料" :visible.sync="dialogVisible" width="50%">
            <div style="margin-bottom: 20px">
                <span>
                    转移至
                </span>
                <el-select v-model="transferParams.aimsGlobalDocumentId" placeholder="请选择要转移的公共一级材料"
                    @change="changeSelect">
                    <el-option v-for="item in primaryMaterialList" :key="item.globalDocumentId"
                        :label="item.globalDocumentName" :value="item.globalDocumentId"
                        :disabled="transferParams.sourceGlobalDocumentId === item.globalDocumentId">
                    </el-option>
                </el-select>
            </div>

            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="sourceGlobalDocumentName" label="当前一级材料名称" width="180">
                </el-table-column>
                <el-table-column prop="aimsGlobalDocumentName" label="转移后公共一级材料名称" width="180">
                </el-table-column>
                <el-table-column prop="sourceGlobalDocumentSubName" label="对应公共二级材料">
                </el-table-column>
                <el-table-column prop="address" label="转移对应公共二级">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.aimsGlobalDocumentSubId" placeholder="请选择"
                            @visible-change="visibleChange($event, scope.row)" clearable>
                            <el-option v-for="(item, index) in options" :key="index" :label="item.globalDocumentSubName"
                                :value="item.globalDocumentSubId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sure">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { api_ListDocumentInfoByCatalogDocumentSub, ape_listTransferSubDocument, api_listGlobalDcumentSubByGlobalDcumentId, api_transferSubDocumentBatch } from "@/api/basicInfo/publicDocument";

export default {
    name: "Transfer",
    props: ["primaryMaterialList"],
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            value: "",
            transferParams: {
                aimsGlobalDocumentId: "",
                sourceGlobalDocumentId: ""
            },
            options: []
        }
    },
    components: {

    },
    created() {

    },
    methods: {
        async changeSelect(e) {
            const result = await ape_listTransferSubDocument(this.transferParams);
            if (result.code === 200) {
                this.tableData = result.data;
            } else {
                this.$message.error(result.msg)
            }
        },
        async visibleChange(e, item) {
            if (e) {
                const result = await api_listGlobalDcumentSubByGlobalDcumentId({ globalDocumentId: this.transferParams.aimsGlobalDocumentId });
                if (result.code === 200) {
                    this.options = result.data;
                } else {
                    this.$message.error(result.msg);
                }
            }
        },
        async sure() {
            this.$confirm(`公共一级材料'${this.tableData[0].sourceGlobalDocumentName}'下所关联的公共二级材料和事项内一级材料转移到'${this.tableData[0].aimsGlobalDocumentName}'材料下,是否确认转移`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(async () => {
                const result = await api_transferSubDocumentBatch(this.tableData);
                if (result.code === 200) {
                    this.dialogVisible = false;
                    this.$message.success("转移成功");
                    this.$emit("updata");
                } else {
                    this.$message.error(result.msg);
                }
            }).catch(() => {
            });

        }
    }
}
</script>

<style>
</style>