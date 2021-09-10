<template>
    <div class="vialidate">
        <div class="search-content">
            <el-input class="distance" placeholder="请输入名称" v-model="params.keyword" clearable style="width: 200px">

            </el-input>
            <el-select class="distance" v-model="params.isCustom" placeholder="请选择" clearable>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-select class="distance" v-model="params.isRequired" placeholder="请选择" clearable>
                <el-option v-for="item in requiredList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button @click="init()">搜索</el-button>
        </div>
        <div style="margin-bottom: 20px">
            <el-button @click="toAdd()">新增</el-button>
        </div>
        <div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="validateName" label="验证名称" width="180">
                </el-table-column>
                <el-table-column prop="validateDescription" label="补充描述" width="180">
                </el-table-column>
                <el-table-column prop="isCustom" label="内置/自定义" width="100">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.isCustom == 0 ? "内置" : "自定义" }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="isCustom" label="必填/非必填" width="100">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.isRequired == 1 ? "必填" : "非必填" }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="validateScript" label="验证代码">
                </el-table-column>
                <el-table-column prop="address" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="toEdit(scope.row)" :disabled="(scope.row.isCustom === 0)">编辑</el-button>
                        <el-button @click="toDelete(scope.row)" :disabled="(scope.row.isCustom === 0)">删除</el-button>
                        <el-button @click="toCopy('.table-read')" :data-clipboard-text="scope.row.validateScript"
                            class="table-read">
                            复制
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination v-show="total>0" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize"
                @pagination="init()" style="float:right" />
        </div>
        <AddJsDialog ref="addJsDialog" @update="addUpdate"></AddJsDialog>
        <AddJsDialog ref="editJsDialog" @update="update"></AddJsDialog>
    </div>
</template>

<script>

import { api_listFieldsValidate, api_deleteFieldsValidate, api_addFieldsValidate, api_updateFieldsValidate } from "@/api/basicInfo/catalogDocumentSub.js";
import Pagination from "@/components/Pagintion.vue";
import AddJsDialog from "./components/AddJsDialog.vue";
import Clipboard from "clipboard";

export default {
    name: "ValidateJs",
    data() {
        return {
            options: [
                {
                    value: '0',
                    label: "内置",
                },
                {
                    value: 1,
                    label: "自定义",
                }
            ],
            requiredList: [
                {
                    value: '1',
                    label: '必填',
                },
                {
                    value: '0',
                    label: '非必填'
                },
            ],
            tableData: [],
            params: {
                pageNum: 1,
                pageSize: 10,
                isCustom: "",
                isRequired: "",
                keyword: "",
            },
            total: null,
        }
    },
    components: {
        Pagination,
        AddJsDialog
    },
    created() {
        this.init();
    },
    methods: {
        async init() {
            const result = await api_listFieldsValidate(this.params);
            if (result.code === 200) {
                this.tableData = result.data.records;
                this.total = result.data.total;
            } else {
                this.$message.err(result.msg)
            }
        },
        toAdd() {
            this.$refs.addJsDialog.ruleForm = {};
            this.$refs.addJsDialog.ruleForm.isCustom = 1;
            this.$refs.addJsDialog.dialogVisible = true;
            // this.$nextTick(()=>{
            //     this.$refs.addJsDialog.initEditForConfig();
            // })
        },
        toEdit(e) {
            console.log(e)
            this.$refs.editJsDialog.ruleForm = JSON.parse(JSON.stringify(e));
            this.$nextTick(() => {
                this.$refs.editJsDialog.dialogVisible = true;
            })
        },
        async toCopy(item) {
            let clipboard = new Clipboard(item)
            clipboard.on('success', e => {
                this.$message.success('复制成功')
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                this.$message.error('该浏览器不支持自动复制')
                // 释放内存
                clipboard.destroy()
            })
        },
        toDelete(e) {
            console.log(e)
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const result = await api_deleteFieldsValidate({ id: e.id });
                if (result.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.init();
                } else {
                    this.$message.err(result.msg);
                }
            }).catch(() => {
            });
        },
        async addUpdate(e) {
            console.log(e)
            const result = await api_addFieldsValidate(e);
            if (result.code === 200) {
                this.$refs.addJsDialog.dialogVisible = false;
                this.init();
            } else {
                this.$message.error(result.msg)
            }
        },
        // 修改后更新
        async update(e) {
            console.log(e);
            let { id, isCustom, isRequired, validateDescription, validateName, validateScript, validateValue } = e;
            let param = {
                id,
                isCustom,
                isRequired,
                validateDescription,
                validateName,
                validateScript,
                validateValue
            }
            console.log(param)
            const result = await api_updateFieldsValidate(param);
            if (result.code === 200) {
                this.$refs.editJsDialog.dialogVisible = false;
                this.init();
            } else {
                this.$message.error(result.msg);
            }
        }
    }

}
 </script>

<style lang="scss" scoped>
.vialidate {
    .search-content {
        margin-bottom: 20px;
        .distance {
            margin-right: 20px;
        }
    }
}
</style>