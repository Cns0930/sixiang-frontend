<template>
    <div class="workWrap">
        <header>AI文档</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选文档名称或者文档编号" v-model="valueM" clearable style="width: 200px"></el-input>
                <el-button @click="materialSearch()">搜索</el-button>
            </div>
            <div class="handle">
                <el-button type="primary" @click="documentVisible({})">新建</el-button>
            </div>

            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%" border
                    tooltip-effect="dark" :default-sort="{ prop: 'createTime', order: 'descending' }">
                    <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>

                    <el-table-column prop="documentName" label="文档名称" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="documentAlias" label="文档别名"></el-table-column>
                    <el-table-column prop="isRequired" label="是否必须" :formatter="isRequiredFormatter" width="100"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="100"></el-table-column>
                    <el-table-column prop="notes" label="备注"></el-table-column>
                    <el-table-column prop="proDocId" label="proDocId" width="100"></el-table-column>
                    <el-table-column prop="singlewindowMateriaIsRequired" label="单窗材料是否必须" :formatter="isRequiredFormatter" width="100"></el-table-column>
                    <el-table-column prop="singlewindowMaterialName" label="单窗材料名" width="100"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable width="160">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="160" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="EditdocumentVisible(scope.row)" style="margin-left: 20px">编辑
                            </el-button>
                            <el-button size="mini" type="danger" @click="handleDeleteMaterial(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount"></el-pagination>
            </div>
        </section>
        <!-- 创建模板弹窗 -->
        <el-dialog title="新建AI文档" :visible.sync="addDialogVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="documentAdd" label-width="25%" class="demo-ruleForm">
                <div>
                    <el-form-item label="文档名称">
                        <el-input v-model="documentAdd.documentName"></el-input>
                    </el-form-item>
                    <el-form-item label="文档别名">
                        <el-input v-model="documentAdd.documentAlias"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必须">
                        <el-select v-model="documentAdd.isRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="documentAdd.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="documentAdd.notes"></el-input>
                    </el-form-item>
                    <el-form-item label="proDocId">
                        <el-input v-model="documentAdd.proDocId"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="单窗材料是否必须">
                        <el-select v-model="documentAdd.singlewindowMateriaIsRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="关联单窗材料名">
                        <el-select v-model="documentAdd.singlewindowMaterialId" placeholder="关联单窗材料">
                            <el-option v-for="item in singleWindowMaterials" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="
                        addDocumentButton();
                        addDialogVisible = false;
                    ">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑窗口 -->
        <el-dialog title="编辑材料信息" :visible.sync="editDialogVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="documentEdit" label-width="25%" class="demo-ruleForm">
                <div>
                    <el-form-item label="文档名称">
                        <el-input v-model="documentEdit.documentName"></el-input>
                    </el-form-item>
                    <el-form-item label="文档别名">
                        <el-input v-model="documentEdit.documentAlias"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必须">
                        <el-select v-model="documentEdit.isRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="documentEdit.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="documentEdit.notes"></el-input>
                    </el-form-item>
                    <el-form-item label="proDocId">
                        <el-input v-model="documentEdit.proDocId"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="单窗材料是否必须">
                        <el-select v-model="documentEdit.singlewindowMateriaIsRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="关联单窗材料名">
                        <el-select v-model="documentEdit.singlewindowMaterialId" placeholder="关联单窗材料">
                            <el-option v-for="item in singleWindowMaterials" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="
                        editDocument();
                        editDialogVisible = false;
                    ">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import { listMaterial, getTemplateByMaterialId, copySelectedMaterial, getAllByApprovalItemId } from "../../api/basicInfo/material";
import { addDocument, updateDocument, getByDocumentId, delDocument } from "../../api/basicInfo/AIdocument";
import { listitemNoSinglewindow } from "../../api/basicInfo/singleWindow";
export default {
    name: "AIdocument",
    mixins: [basicMixin],
    data() {
        return {
            type: "AIdocument",
            itemId: this.$route.query.itemId,
            singleWindowMaterials: [],
            valueM: '',
            tableData: [],
            addDialogVisible: false,
            editDialogVisible: false,
            documentAdd: {
            },
            documentEdit: {
            },
            // 可删
           
            
            materialInit: {
                documentSeq: '',
            },
            
            
            currentPageSelect: 1,
            pageSize: 10,
            selectData: [],
            importDialogVisible: false,
            idd: "",
        };
    },
    computed: {},
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.search();
        await this.initSingleWindowMaterials();
    },
    methods: {
        async initSingleWindowMaterials() {
            let result = await listitemNoSinglewindow({itemNo: this.$store.state.home.item.itemNo});
            if (!result.success) return;
            result.data.forEach(element => {
                let material = {
                    value: element.singlewindowMaterialId,
                    label: element.singlewindowMaterialName
                }
                this.singleWindowMaterials.push(material);
            });
            console.log('this.singleWindowMaterials');
            console.log(this.singleWindowMaterials);
        },
        getTime(val) {
            console.log(val);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: val,
                approvalItemId: this.$route.query.itemId,
            });
            this.tableData = result.data.records;
        },
        async handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: val,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
            });
            this.tableData = result.data.records;
        },
        documentVisible(item) {
            this.documentAdd = item;
            this.addDialogVisible = true;
        },
        async EditdocumentVisible(item) {
            let id = item.documentId;
            item = await getByDocumentId({ documentId: id });
            if (!item.success) return;
            item = item.data;
            this.documentEdit = item;
            console.log('this.documentEdit');
            console.log(this.documentEdit);
            this.editDialogVisible = true;
        },

        //增加文档
        async addDocumentButton() {
            this.documentAdd["approvalItemId"] = this.$route.query.itemId;
            console.log("this.documentAdd ", this.documentAdd);
            const res = await addDocument(this.documentAdd);
            if (!res.success) return;
            this.$message.success('保存成功');
            this.addDialogVisible = false;
            await this.search();
        },
        // 编辑文档
        async editDocument() {
            let res = await updateDocument(this.documentEdit);
            if (!res.success) return;
            this.$message.success('编辑成功');
            this.editDialogVisible = false;
            // this.materialT_item_id = '';
            await this.search();
        },
        // 删除
        async handleDeleteMaterial(v) {
            let param = {
                documentId: v.documentId
            };
            let id = v.documentId;
            console.log('param');
            console.log(param);
            try {
                await this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await delDocument(param);
            if (!result.success) return;
            await this.search();
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
    }
    .workBox {
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
    }
    .searchBox {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        background: #fff;
        & > * {
            margin-left: 10px;
        }
    }
    .handle {
        // display: flex;
        // flex-direction: row;
        // justify-content: right;
        // align-items: center;
        margin: 0 70px 15px auto;
        float: right;
    }
    .tableWrap {
        margin-top: 16px;
        margin-left: 10px;
        width: calc(100% - 10px);
        overflow: hidden;
        .workTable {
            width: 100%;
        }
    }
}
</style>
