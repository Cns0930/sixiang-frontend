<template>
    <div class="transfer">
        <el-dialog title="关联转移材料" :visible.sync="dialogVisible" width="50%">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="当前一级材料名称" width="180">
                </el-table-column>
                <el-table-column prop="name" label="转移后公共一级材料名称" width="180">
                </el-table-column>
                <el-table-column prop="address" label="对应公共二级材料">
                </el-table-column>
                <el-table-column prop="address" label="转移对应公共二级">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import { api_ListDocumentInfoByCatalogDocumentSub } from "@/api/basicInfo/publicDocument";

export default {
    name: "Transfer",
    data() {
        return {
            dialogVisible: false,
            params: {
                // 全局二级文档id
                catalogDocumentSubId: null,
                // 事项内二级材料名称
                globalDocumentSubName: "",
                // 事项名称
                itemName: "",
                // projectName
                projectName: "",
                pageNum: 1,
                pageSize: 10,
            },
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    },
    components: {

    },
    created() {

    },
    methods: {
        async init() {
            const result = await api_ListDocumentInfoByCatalogDocumentSub(this.params);
            if (result.code === 200) {

            }
        }
    }
}
</script>

<style>
</style>