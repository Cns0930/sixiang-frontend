<template>
    <div class="workWrap">
        <header>事项管理</header>
        <section class="workBox">
            <div class="searchBox">
                <el-select
                    placeholder="筛选项目"
                    v-model="filterProjectId"
                    filterable clearable
                    style="width: 200px;">
                    <el-option
                        v-for="(v,i) in projectOptions"
                        :key="i"
                        :label="v.projectName"
                        :value="v.projectId"
                    ></el-option>
                </el-select>
                <el-select
                    placeholder="筛选大项"
                    v-model="filterApprovalId"
                    filterable clearable
                    style="width: 200px;"
                >
                    <el-option
                        v-for="(v,i) in approvalOptions"
                        :key="i"
                        :label="v.approvalName"
                        :value="v.approvalId"
                    ></el-option>
                </el-select>
                <el-input
                    placeholder="搜索事项"
                    v-model="filterKeyword"
                    clearable
                    style="width: 200px;"
                ></el-input>
                <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="创建时间开始日期"
                    @change="getTime"
                    end-placeholder="创建时间截止日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
                <el-button @click="searchItem">搜索</el-button>
                <div class="handle">
                    <el-button type="primary" @click="handleClickAdd">新增</el-button>
                    <!-- <el-button type="primary">导出</el-button>
                    <el-button type="primary">导入</el-button> -->
                </div>
            </div>
            <div class="tableWrap">
                <el-table
                    ref="multipleTable"
                    class="workTable"
                    :data="tableData"
                    style="width: 100%;"
                    border
                    tooltip-effect="dark"
                    :default-sort="{prop: 'createTime', order: 'descending'}"
                >
                    <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>
                    <el-table-column prop="projectName" label="项目" sortable width="80"></el-table-column>
                    <el-table-column prop="approvalName" label="大项" sortable width="80"></el-table-column>
                    <el-table-column
                        prop="itemInternalNo"
                        label="内部事项编号"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="itemNo" label="事项编号" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column label="事项名称" width="200">
                        <template slot-scope="scope">
                        <el-button
                            @click="handleClickItem(scope.row)"
                            type="text"
                            style="color: orange;"
                        >{{scope.row.itemName}}</el-button>
                    </template>
                    </el-table-column>
                    <el-table-column prop="itemType" label="事项类型" width="80"></el-table-column>
                    <el-table-column
                        prop="itemCode"
                        label="事项实施编码"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="createBy" label="创建人" width="80"></el-table-column>
                    <el-table-column prop="itemStatus" label="状态" sortable width="80"></el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        :formatter="timeFormatter"
                        sortable
                        width="140"
                    ></el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="最后修改时间"
                        width="140"
                        :formatter="timeFormatter"
                        sortable
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="handleClickItem(scope.row)">管理详情</el-button>
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pagesize"
                    layout="total, prev, pager, next"
                    :total="totalCount"
                ></el-pagination>
            </div>
        </section>

        <section class="dialogBox">
            <!-- 新建窗口 -->
            <el-dialog
                title="事项属性填写"
                :visible.sync="dialogAddVisible"
                width="80%"
                :close-on-click-modal="false"
            >
                <div class="attribute-content">
                    <el-form :inline="false" label-position="left" class="demo-form-inline">
                        <el-form-item label="项目">
                            <el-select v-model="tempItem.projectId" filterable>
                                <el-option
                                    v-for="(v,i) in projectOptions"
                                    :key="i"
                                    :label="v.projectName"
                                    :value="v.projectId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="大项">
                            <el-select v-model="tempItem.approvalId" filterable>
                                <el-option
                                    v-for="(v,i) in approvalOptions"
                                    :key="i"
                                    :label="v.approvalName"
                                    :value="v.approvalId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事项编号">
                            <el-input v-model="tempItem.itemNo"></el-input>
                        </el-form-item>
                        <el-form-item label="事项内部编号">
                            <el-input v-model="tempItem.itemInternalNo"></el-input>
                        </el-form-item>
                        <el-form-item label="事项实施编码">
                            <el-input v-model="tempItem.itemCode"></el-input>
                        </el-form-item>
                        <el-form-item label="事项名称">
                            <el-input v-model="tempItem.itemName"></el-input>
                        </el-form-item>
                        <el-form-item label="事项类型(如新增/变更)">
                            <el-input v-model="tempItem.itemType"></el-input>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="tempItem.sort"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogAddVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveItem()">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑窗口 -->
            <el-dialog
                title="事项属性填写"
                :visible.sync="dialogUpdateVisible"
                width="80%"
                :close-on-click-modal="false"
            >
                <div class="attribute-content">
                    <el-form :inline="false" label-position="left" class="demo-form-inline">
                        <el-form-item label="大项">
                            <el-select v-model="tempItem.approvalId" filterable>
                                <el-option
                                    v-for="(v,i) in approvalOptions"
                                    :key="i"
                                    :label="v.approvalName"
                                    :value="v.approvalId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事项编号">
                            <el-input v-model="tempItem.itemNo"></el-input>
                        </el-form-item>
                        <el-form-item label="事项实施编码">
                            <el-input v-model="tempItem.itemCode"></el-input>
                        </el-form-item>
                        <el-form-item label="事项名称">
                            <el-input v-model="tempItem.itemName"></el-input>
                        </el-form-item>
                        <el-form-item label="事项类型(如新增/变更)">
                            <el-input v-model="tempItem.itemType"></el-input>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="tempItem.sort"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUpdateVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateItem()">确 定</el-button>
                </span>
            </el-dialog>
        </section>
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import {
    listApprovalAll,
    listProjectAll,
    addApprovalItem,
    updateApprovalItem,
    getByApprovalItemId,
} from "../../api/basicInfo/approval";

export default {
    name: "ApprovalItem",
    mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "work",
            // 筛选
            filterProjectId: null,
            filterApprovalId: null,
            filterKeyword: "",
            timeRange: [],
            // 表格
            tableData: [],
            // 弹窗
            dialogAddVisible: false,
            dialogUpdateVisible: false,
            tempItem: {},
            projectOptions: [],
            approvalOptions: [],
            pagesize: 15,
        };
    },
    computed: {},
    async created() {
        await this.searchItem();
        await this.loadOptions();
    },
    methods: {
        // inputs(val) {
        //   console.log(this.model);
        // },
        getTime(val) {
            console.log(val);
        },
        // handleSelectionChange(val) {
        //     this.multipleSelection = val;
        // },
        async handleEdit(index, row) {
            console.log(row);
            let res = await getByApprovalItemId({
                approvalItemId: row.approvalItemId,
            });
            if (!res.success) {
                return;
            }
            this.tempItem = res.data;
            this.dialogUpdateVisible = true;
            // 获取选项
            let approvalRes = await listApprovalAll();
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
        },
        async handleClickAdd() {
            this.dialogAddVisible = true;
            this.tempItem = {};
            await this.loadOptions();
        },
        async saveItem() {
            this.tempItem.createBy = this.loginName;
            let res = await addApprovalItem(this.tempItem);
            if (res.success) {
                this.$message.success("事项保存成功!");
                this.tempItem = {};
                this.dialogAddVisible = false;
                await this.list();
            }
        },
        async updateItem() {
            let res = await updateApprovalItem(this.tempItem);
            console.log(res);
            if (res.success) {
                this.$message.success("事项修改成功!");
                this.tempItem = {};
                this.dialogUpdateVisible = false;
                await this.list();
            }
        },
        async loadOptions() {
            // 获取选项
            let projectRes = await listProjectAll();
            if (projectRes.success) {
                this.projectOptions = projectRes.data;
            }
            let approvalRes = await listApprovalAll();
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
        },
        async searchItem() {
           this.currentPage = 1;
           this.list();
        },
        handleClickItem(item){
            this.$store.commit("changeApprovalItem", item);
            this.$router.push({
                path: "/basic/subitem",
                query: { itemId: item.approvalItemId },
            });
        },
        async handleCurrentChange(){
            this.list();
        },
        async list(){
            let params = {
                approvalId: this.filterApprovalId,
                projectId: this.filterProjectId,
                keyword: this.filterKeyword,
                pageSize: this.pagesize,
                pageNum: this.currentPage,
            }
            if(this.timeRange != null && this.timeRange.length > 1){
                params.startTime = this.timeRange[0];
                params.endTime = this.timeRange[1];
            }
            this.search(params);
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
