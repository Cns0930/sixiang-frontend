<template>
    <div class="workWrap">
        <header>单窗材料</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选文档名称或者文档编号" v-model="valueM" clearable style="width: 200px"></el-input>
                <el-button @click="materialSearch()">搜索</el-button>
            </div>
            <div class="handle">
                <el-button type="primary" @click="materialVisible({})">新建</el-button>
            </div>

            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%" border
                    tooltip-effect="dark" :default-sort="{ prop: 'createTime', order: 'descending' }">
                    <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>

                    <el-table-column prop="singlewindowMaterialName" label="单窗材料名称"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="proDocId" label="proDocId" width="100"></el-table-column>
                    <el-table-column prop="isRequired" label="是否必须" :formatter="isRequiredFormatter" width="100"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="100"></el-table-column>
                    <el-table-column prop="notes" label="备注"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable >
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <!-- <el-select v-model="scope.row.singleWindowMaterial" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select> -->
                            <el-button size="mini" @click="EditmaterialVisible(scope.row)" style="margin-left: 20px">编辑
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
        <el-dialog title="新建单窗材料" :visible.sync="addDialogVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="addInfo" label-width="20%" class="demo-ruleForm">
                <div>
                    <el-form-item label="单窗材料名称">
                        <el-input v-model="addInfo.singlewindowMaterialName"></el-input>
                    </el-form-item>
                    <el-form-item label="proDocId">
                        <el-input v-model="addInfo.proDocId"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必须">
                        <el-select v-model="addInfo.isRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="addInfo.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="addInfo.notes"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="
                        addSingleWindowMaterial();
                        addDialogVisible = false;
                    ">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑窗口 -->
        <el-dialog title="编辑单窗材料" :visible.sync="EditDialogVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="editInfo" label-width="20%" class="demo-ruleForm">
                 <div>
                    <el-form-item label="单窗材料名称">
                        <el-input v-model="editInfo.singlewindowMaterialName"></el-input>
                    </el-form-item>
                    <el-form-item label="proDocId">
                        <el-input v-model="editInfo.proDocId"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必须">
                        <el-select v-model="editInfo.isRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="editInfo.sort"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="editInfo.notes"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="
                        editSingleWindow();
                        EditDialogVisible = false;
                    ">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import { listSinglewindow, addSinglewindow, getBySinglewindowId, updateSinglewindow, delSinglewindow } from "../../api/basicInfo/singleWindow";
import { listApprovalItem } from "@/api/basicInfo/approval";
import { log } from 'handlebars';
export default {
    name: "singleWindowMaterial",
    mixins: [basicMixin],
    data() {
        return {
            type: "singleWindow",
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            valueM: '',
            tableData: [],
            addDialogVisible: false,
            EditDialogVisible: false,
            addInfo: {
            },
            editInfo: {
            },

            // 可删
            
          
            
            currentPageSelect: 1,
            pageSize: 10,
            selectData: [],
            importDialogVisible: false,
            idd: "",
            itemId: this.$route.query.itemId,
        };
    },
    computed: {},
    async created() {
        await this.search();
    },
    methods: {
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
        async materialVisible(item) {
            // console.log('item');
            // console.log(item);
            // let id = item.materialId;
            // if (!id) {
            //     item = item;
            // } else {
            //     item = await getByMaterialId({ materialId: id });
            //     item = item.data;
            // }

            this.addInfo = item;
            // console.log('this.addInfo');
            // console.log(this.addInfo);
            this.addDialogVisible = true;
        },
        async EditmaterialVisible(item) {
            console.log('item');
            console.log(item);
            let id = item.singlewindowMaterialId;
            item = await getBySinglewindowId({ singlewindowId: id });
            item = item.data;
            this.editInfo = item;
            console.log('this.editInfo');
            console.log(this.editInfo);
            this.EditDialogVisible = true;
        },

        //获取材料列表
        // async listMaterial() {
        //     const res = await listMaterial({
        //         approvalItemId: this.addInfo.approvalItemId,
        //         materialStatus: this.addInfo.materialStatus,
        //         // keyword: this.materialM,
        //         pageNum: this.currentPage,
        //         pageSize: this.pagesize
        //     });
        //     if (!res.success) return;
        //     this.totalCount = result.data.total;
        //     console.log("dadathis.current:", this.current, " dathis.pagesize", this.pagesize, " dathis.totalCount", this.totalCount)
        //     this.tableData = res.data.records;
        //     await this.search();
        // },
        //增加单窗材料
        async addSingleWindowMaterial() {
            this.addInfo["approvalItemId"] = this.$route.query.itemId;
            console.log('this.addInfo');
            console.log(this.addInfo);
            let res = await addSinglewindow(this.addInfo);

            if (!res.success) return;

            this.$message.success('添加成功');
            this.addDialogVisible = false;
            await this.search();
        },
        // 编辑材料
        async editSingleWindow() {
            let res = await updateSinglewindow(this.editInfo);
            if (!res.success) return;

            this.$message.success('编辑成功');
            this.EditDialogVisible = false;
            await this.search();
        },
        // 删除
        async handleDeleteMaterial(v) {
            let param = {
                singlewindowId: v.singlewindowMaterialId
            };
            let id = v.singlewindowMaterialId;
            console.log('param');
            console.log(param);
            try {
                await this.$confirm('此操作将永久删除该单窗材料, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await delSinglewindow(param);
            if (!result.success) return;

            await this.search();
        },
        // 自动填写文档编号
        writeDocumentNumberAdd() {
            if (this.addInfo.docxTemplateName) {
                let index = this.addInfo.docxTemplateName.indexOf('_');
                console.log('index');
                console.log(index);
                if (index === -1) return;
                let DocumentNumber = this.addInfo.docxTemplateName.slice(index + 1);
                index = DocumentNumber.indexOf('_');
                console.log('index2');
                console.log(index);
                if (index === -1) return;
                DocumentNumber = DocumentNumber.slice(0, index);
                this.addInfo.documentSeq = DocumentNumber;
                console.log('DocumentNumber');
                console.log(DocumentNumber);
                console.log('addInfo.documentSeq');
                console.log(this.addInfo.documentSeq);
            }
        },
        writeDocumentNumberEdit() {
            if (this.editInfo.docxTemplateName) {
                let index = this.editInfo.docxTemplateName.indexOf('_');
                // console.log('index');
                // console.log(index);
                if (index === -1) return;
                let DocumentNumber = this.editInfo.docxTemplateName.slice(index + 1);
                index = DocumentNumber.indexOf('_');
                // console.log('index2');
                // console.log(index);
                if (index === -1) return;
                DocumentNumber = DocumentNumber.slice(0, index);
                this.editInfo.documentSeq = DocumentNumber;
            }
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
