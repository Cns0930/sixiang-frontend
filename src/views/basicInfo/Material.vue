<template>
    <div class="workWrap">
        <header>帮办材料</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选材料名称或者模板名称" v-model="valueM" clearable style="width: 200px;"></el-input>
                <el-button @click="materialSearch()">搜索</el-button>
                <div class="handle">
                    <el-button type="primary" @click="materialVisible(materialInit)">新建材料</el-button>
                    <!-- <el-button type="primary">导出</el-button> -->
                    <el-button type="primary" @click="handleImport()">导入材料</el-button>
                </div>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}" :height="tableHeight">
                    <!-- <el-table-column
              type="selection"
              width="50">
                    </el-table-column>-->
                    <el-table-column label="序号" type="index" width="50px" :index="indexMethod"></el-table-column>
                    <!-- <el-table-column
              label="部门"
              sortable
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="大项"
              sortable
              width="120">
                    </el-table-column>
                    <el-table-column
                        prop="approvalItemId"
                        label="审批事项编号"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="materialId" label="事项(小项)办事材料编号" width="100" show-overflow-tooltip></el-table-column>-->
                    <!-- <el-table-column prop="materialCode" label="材料编码" width="100" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="materialName" label="材料名称"></el-table-column>
                    <el-table-column prop="templateName" label="模板名称(自取)"></el-table-column>
                    <!-- <el-table-column prop="materialStatus" label="材料状态" width="80"></el-table-column>
                    <el-table-column prop="documentSeq" label="文档编号" width="80"></el-table-column>
                    <el-table-column
                        prop="catMainCode"
                        label="市证照编码"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column> -->
                    <el-table-column prop="docxTemplateName" label="超级帮办word模板命名"></el-table-column>
                    <el-table-column prop="documentSeq" label="文档序号"  width="50px">
                    </el-table-column>
                    <el-table-column prop="isNavigation" label="是否显示在左侧导航" :formatter="isRequiredFormatter">
                    </el-table-column>
                    <el-table-column prop="navigationOrder" label="导航顺序"  width="50px" ></el-table-column>
                    <el-table-column prop="descriptionInfo" label="材料逻辑" show-overflow-tooltip width="300"></el-table-column>
                    <el-table-column prop="produceSource" label="产生方式" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable width="160">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" fixed="right" width="110px">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary"  @click="goOnlineDocumentEditor(scope.row)">编辑word模板</el-button>
                            <el-button size="mini" @click="EditmaterialVisible(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDeleteMaterial(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
              label="启/停用"
              fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="value"
                >
                <span style="display: none;">{{scope.$index}}</span>
                </el-switch>
              </template>
                    </el-table-column>-->
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount"></el-pagination>
            </div>
            <!-- <component :is="model.type" v-model="model.val" v-bind="{
          type: 'textarea',
          placeholder:'输入数字信息',
            }" @input="inputs"></component>-->
        </section>
        <!-- 创建模板弹窗 -->
        <el-dialog title="新建材料信息" :visible.sync="materialWriteVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="materialT" label-width="30%" class="demo-ruleForm">
                <div>
                    <el-form-item label="材料名称">
                        <el-input v-model="materialT.materialName"></el-input>
                    </el-form-item>
                    <el-form-item label="模板名称(自取)">
                        <el-input v-model="materialT.templateName"></el-input>
                    </el-form-item>
                    <el-form-item label="超级帮办word模板名称">
                        <el-input v-model="materialT.docxTemplateName" @change="writeDocumentNumberAdd"></el-input>
                    </el-form-item>
                    <el-form-item label="文档序号">
                        <el-input v-model="materialT.documentSeq"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示在左侧导航">
                        <el-select v-model="materialT.isNavigation">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导航顺序">
                        <el-input v-model="materialT.navigationOrder" placeholder="请输入数字"></el-input>
                    </el-form-item>
                    <el-form-item label="材料逻辑">
                        <el-input type="textarea" :rows="3" v-model="materialT.descriptionInfo"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="产生方式">
                            <el-select v-model="materialT.produceSource" placeholder="材料的产生来源">
                                <el-option label="用户自带" value="用户自带"></el-option>
                                <el-option label="现场制作" value="当场制作"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <br>
                    <el-form-item label="材料编码">
                        <el-input v-model="materialT.materialCode"></el-input>
                    </el-form-item>
                    <el-form-item label="市证照编码">
                        <el-input v-model="materialT.catMainCode"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="materialT.note"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="materialT.sort"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="materialWriteVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMaterial();materialWriteVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑窗口 -->
        <el-dialog title="编辑材料信息" :visible.sync="editMaterialWriteVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="materialTEdit" label-width="30%" class="demo-ruleForm">
                <div>
                    <el-form-item label="材料名称">
                        <el-input v-model="materialTEdit.materialName"></el-input>
                    </el-form-item>
                    <el-form-item label="模板名称(自取)">
                        <el-input v-model="materialTEdit.templateName"></el-input>
                    </el-form-item>
                    <el-form-item label="超级帮办word模板名称">
                        <el-input v-model="materialTEdit.docxTemplateName" @change="writeDocumentNumberEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="文档序号">
                        <el-input v-model="materialTEdit.documentSeq"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示在左侧导航">
                        <el-select v-model="materialTEdit.isNavigation">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导航顺序">
                        <el-input v-model="materialTEdit.navigationOrder" placeholder="请输入数字"></el-input>
                    </el-form-item>
                    <el-form-item label="材料逻辑">
                        <el-input type="textarea" :rows="3" v-model="materialTEdit.descriptionInfo"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="产生方式">
                            <el-select v-model="materialTEdit.produceSource" placeholder="材料的产生来源">
                                <el-option label="用户自带" value="用户自带"></el-option>
                                <el-option label="现场制作" value="当场制作"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <br>
                    <el-form-item label="材料编码">
                        <el-input v-model="materialTEdit.materialCode"></el-input>
                    </el-form-item>
                    <el-form-item label="市证照编码">
                        <el-input v-model="materialTEdit.catMainCode"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="materialTEdit.note"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="materialTEdit.sort"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editMaterialWriteVisible = false">取 消</el-button>
                <el-button type="primary" @click="editMaterial();editMaterialWriteVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入自选材料 -->
        <el-dialog title="导入自选材料" :visible.sync="importDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label="事项名称">
                <el-select clearable filterable placeholder="请选择事项名称或者输入关键词" v-model="idd" @change="selectOne"
                    style="position:relative" remote reserve-keyword :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                        :value="v.approvalItemId">

                    </el-option>

                    <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                        <a class="text-normal">
                            <el-pagination @size-change="handleSizeChangeSelect"
                                @current-change="handleCurrentChangeSelect" :current-page="currentPageSelect"
                                :total="totalAim" :page-size="pageSize" layout="prev, pager, next" />
                        </a>
                    </div>
                </el-select>
            </el-form>

            <el-table :data="tableDataSS" border row-key="materialId" style="width:80%" ref="checkTable"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" reserve-selection label="选择">
                </el-table-column>
                <el-table-column prop="materialCode" label="材料编码" width="200"></el-table-column>
                <el-table-column prop="materialName" label="材料名称"></el-table-column>
                
            </el-table>

            <p>已选中{{temp_selected_fields.length}}个材料</p>
            <el-button type="primary" @click="importSubApproval">确认导入</el-button>
            <el-button type="text" @click="clearSelected">清除所有选择</el-button>
            <el-button @click="importDialogVisible = false">取 消</el-button>

        </el-dialog>
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import { listMaterial, addMaterial, delMaterial, getTemplateByMaterialId, updateMaterial, getByMaterialId, copySelectedMaterial, getAllByApprovalItemId } from "../../api/basicInfo/material";
import { listApprovalItem } from "@/api/basicInfo/approval";
export default {
    name: "Material",
    mixins: [basicMixin],
    data() {
        return {
            // model: {
            //   type: 'NumberInput',
            //   val: '12',
            //   options: {
            //     type: 'textarea',
            //     placeholder:'输入数字信息',
            //   }
            // },
            type: "material",
            materialT: {
                documentSeq: '',
            },
            materialInit: {
                documentSeq: '',
            },
            materialTEdit: {
                documentSeq: '',
            },
            materialWriteVisible: false,
            editMaterialWriteVisible: false,
            currentPageSelect: 1,
            pageSize: 10,
            selectData: [],
            importDialogVisible: false,
            tableDataSS: [],
            typeSubItemOptions: [],
            idd: "",
            itemId: this.$route.query.itemId,
            temp_selected_fields: [],
            list: [],
            loading: false,
            valueM: "",
            timeRange: [],
            tableData: [],
            totalAim: 0,
            multipleSelection: [],
            tableHeight:0,
        };
    },
    computed: {},
    async created() {
        await this.init();
        await this.search();
        this.getTableHeight()
    },
    //挂载window.onresize事件
    mounted() {
    let _this = this
    window.onresize = () => {
        if (_this.resizeFlag) {
        clearTimeout(_this.resizeFlag)
        }
        _this.resizeFlag = setTimeout(() => {
        _this.getTableHeight()
        _this.resizeFlag = null
        }, 100)
    }
    },
    // 注销window.onresize事件
    beforeRouteLeave(to, from, next) {
    //离开组件的时候触发
    window.onresize = null
    next()
    },
    methods: {
        // inputs(val) {
        //   console.log(this.model);
        // },
        getTableHeight() {
            let tableH = 280
            let tableHeightDetil = window.innerHeight - tableH
            if (tableHeightDetil <= 300) {
                this.tableHeight = 300
            } else {
                this.tableHeight = window.innerHeight - tableH
            }
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
        //下拉框带分页
        async handleSizeChangeSelect(size) {
            this.selectData = [];
            this.pageSize = size;
            let result = await listApprovalItem({ pageNum: this.currentPageSelect, pageSize: this.pageSize });
            this.typeSubItemOptions = result.data.records;
        },
        async handleCurrentChangeSelect(current) {
            this.selectData = [];
            this.currentPageSelect = current;
            let result = await listApprovalItem({ pageNum: this.currentPageSelect, pageSize: this.pageSize });
            this.typeSubItemOptions = result.data.records;
        },
        //远程搜索
        async remoteMethod(query) {
            if (query !== '') {
                let result = await listApprovalItem({ keyword: query, pageNum: this.currentPageSelect, pageSize: this.pageSize });
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;

                    this.totalAim = result.data.total;
                    this.typeSubItemOptions = result.data.records;

                })
            }
        },
        async materialSearch() {
            this.currentPage = 1;
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
                materialStatus: 'Y',
            });

            if (!result.success) return;
            this.totalCount = result.data.total;
            this.tableData = result.data.records;

            this.$message({ type: "success", message: "查询成功" });

        },
        async materialVisible(item) {
            // console.log('item');
            // console.log(item);
            let id = item.materialId;
            if (!id) {
                item = item;
            } else {
                item = await getByMaterialId({ materialId: id });
                item = item.data;
            }

            this.materialT = item;
            // console.log('this.materialT');
            // console.log(this.materialT);
            this.materialWriteVisible = true;
        },
        async EditmaterialVisible(item) {
            let id = item.materialId;
            item = await getByMaterialId({ materialId: id });
            item = item.data;
            this.materialTEdit = item;
            console.log('this.materialTEdit');
            console.log(this.materialTEdit);
            this.editMaterialWriteVisible = true;
        },
        //导入材料
        async handleImport() {
            let result = await listApprovalItem({ pageNum: this.currentPageSelect, pageSize: this.pageSize });
            this.totalAim = result.data.total;
            this.typeSubItemOptions = result.data.records;
            console.log("resulthhh:", this.typeSubItemOptions);
            this.importDialogVisible = true;
        },
        async selectOne() {
            this.tableDataSS = [];
            let result = await getAllByApprovalItemId({ approvalItemId: this.idd });
            if (!result.success) return;
            this.total = result.data.total;
            this.tableDataSS = result.data;
        },
        handleSelectionChange(sel) {
            this.temp_selected_fields = sel;
        },
        async importSubApproval() {
            console.log("this.temp_selected_fields:", this.temp_selected_fields);
            if (this.temp_selected_fields.length > 0) {
                // 进行materialName是否重复的检查
                // let a = this.temp_selected_fields.map(v => v.materialName);
                // console.log("a", a);
                // for (let index = 0; index < this.temp_selected_fields.length; index++) {
                //     let field = this.temp_selected_fields[index];
                //     console.log("field.materialName:", field.materialName);
                //     if (this.temp_selected_fields.map(v => v.materialName).indexOf(field.materialName) !== index) {
                //         this.$message({ type: "warning", message: "重复材料:" + field.materialName });
                //         return;
                //     }
                // }

                let selectIds = this.temp_selected_fields.map(f => f.materialId);
                let param = {};
                param["aimsItemId"] = this.itemId;
                param["sourceMaterialIds"] = selectIds;
                let result = await copySelectedMaterial(JSON.stringify(param))
                if (!result.success) return;
                this.$message({ type: "success", message: "导入成功" });
                this.clearSelected();
                this.search();
                this.importDialogVisible = false;
            }
        },
        clearSelected() {
            this.$refs.checkTable.clearSelection();
            this.temp_selected_fields = [];
        },
        //获取材料列表
        async listMaterial() {
            const res = await listMaterial({
                approvalItemId: this.materialT.approvalItemId,
                materialStatus: this.materialT.materialStatus,
                // keyword: this.materialM,
                pageNum: this.currentPage,
                pageSize: this.pagesize
            });
            if (!res.success) return;
            this.totalCount = result.data.total;
            console.log("dadathis.current:", this.current, " dathis.pagesize", this.pagesize, " dathis.totalCount", this.totalCount)
            this.tableData = res.data.records;
            await this.search();
        },
        //增加材料
        async addMaterial() {
            let res;
            if (!this.materialT.materialId) {
                this.materialT["materialStatus"] = "Y";
                this.materialT["approvalItemId"] = this.$route.query.itemId;
                console.log("this.materialT ", this.materialT)
                res = await addMaterial(this.materialT);
            } else {
                res = await updateMaterial(this.materialT);
            }

            if (!res.success) return;

            this.$message.success('保存成功');
            this.materialWriteVisible = false;
            // this.materialT_item_id = '';
            if (!this.materialT.materialId) {
                await this.search();
            } else {
                await this.materialSearch();
            }

        },
        // 编辑材料
        async editMaterial() {
            let res = await updateMaterial(this.materialTEdit);
            if (!res.success) return;

            this.$message.success('编辑成功');
            this.editMaterialWriteVisible = false;
            // this.materialT_item_id = '';
            if (!this.materialTEdit.materialId) {
                await this.search();
            } else {
                this.materialT.approvalItemId = this.materialTEdit.approvalItemId;
                this.materialT.materialStatus = this.materialTEdit.materialStatus;
                await this.materialSearch();
            }
        },
        // 删除
        async handleDeleteMaterial(v) {
            let param = {
                materialId: v.materialId
            };
            let id = v.materialId;
            console.log('param');
            console.log(param);
            let isRelevance = await getTemplateByMaterialId(param);
            console.log('isRelevance');
            console.log(isRelevance);
            if (isRelevance.data) {
                try {
                    await this.$confirm('材料已关联超级帮办事项开发模板，是否确定要删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch (e) {
                    return;
                }
            } else {
                try {
                    await this.$confirm('此操作将永久删除该材料, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch (e) {
                    return;
                }
            }

            let result = await delMaterial(param);
            if (!result.success) return;

            // if(!id){
            await this.search();
            // }else{
            // await this.materialSearch();
            // }
        },
        // 自动填写文档编号
        writeDocumentNumberAdd() {
            if (this.materialT.docxTemplateName) {
                let index = this.materialT.docxTemplateName.indexOf('_');
                console.log('index');
                console.log(index);
                if (index === -1) return;
                let DocumentNumber = this.materialT.docxTemplateName.slice(index + 1);
                index = DocumentNumber.indexOf('_');
                console.log('index2');
                console.log(index);
                if (index === -1) return;
                DocumentNumber = DocumentNumber.slice(0, index);
                this.materialT.documentSeq = DocumentNumber;
                console.log('DocumentNumber');
                console.log(DocumentNumber);
                console.log('materialT.documentSeq');
                console.log(this.materialT.documentSeq);
            }
        },
        writeDocumentNumberEdit() {
            if (this.materialTEdit.docxTemplateName) {
                let index = this.materialTEdit.docxTemplateName.indexOf('_');
                // console.log('index');
                // console.log(index);
                if (index === -1) return;
                let DocumentNumber = this.materialTEdit.docxTemplateName.slice(index + 1);
                index = DocumentNumber.indexOf('_');
                // console.log('index2');
                // console.log(index);
                if (index === -1) return;
                DocumentNumber = DocumentNumber.slice(0, index);
                this.materialTEdit.documentSeq = DocumentNumber;
            }
        },
        // 跳转到在线文档编辑界面
        goOnlineDocumentEditor(row) {
            console.log('row');
            console.log(row);
            let routeUrl = this.$router.resolve({ name: "OnlineDocumentEditor", query:{'materialId': row.materialId, 'itemId': this.itemId }});
            window.open(routeUrl.href, '_blank');
        }
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
        .handle {
            margin-left: auto;
            margin-top: -55px;
        }
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
