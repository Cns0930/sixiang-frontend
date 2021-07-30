<template>
    <div class="workWrap">
        <header>事项批量编辑
        </header>
        <section class="workBox">
            <div class="searchBox">
                <!-- <el-select placeholder="筛选项目" v-model="filterProjectId" filterable clearable style="width: 200px;">
                    <el-option v-for="(v,i) in projectOptions" :key="i" :label="v.projectName" :value="v.projectId">
                    </el-option>
                </el-select>
                <el-select placeholder="筛选大项" v-model="filterApprovalId" filterable clearable style="width: 200px;">
                    <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName" :value="v.approvalId">
                    </el-option>
                </el-select> -->
                <el-input placeholder="搜索事项" v-model="filterKeyword" clearable style="width: 200px;"
                    @change="searchItem">
                </el-input>
                <el-date-picker v-model="timeRange" type="daterange" range-separator="至" start-placeholder="创建时间开始日期"
                    @change="getTime" end-placeholder="创建时间截止日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                <el-button @click="searchItem">
                    搜索
                </el-button>
                <div class="handle">
                    <el-button  @click="toggleSelection">
                        取消选择
                    </el-button>
                    <el-button type="primary" @click="selectClick">
                        确定所选
                    </el-button>
                </div>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border :row-key="getRowKey"
                    tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}" @selection-change="handleSelectionChange" >
                   
                    <el-table-column type="selection" width="70" :reserve-selection='true'></el-table-column>
                    <el-table-column prop="projectName" label="项目" sortable >
                    </el-table-column>
                    <el-table-column prop="approvalName" label="大项" show-overflow-tooltip sortable>
                    </el-table-column>
                    <!-- <el-table-column prop="itemInternalNo" label="内部事项编号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemNo" label="事项编号" show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column prop="itemName" label="事项名称"  show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            <el-button @click="handleClickItemDefault(scope.row)" type="text" style="color: orange;">
                                {{scope.row.itemName}}
                            </el-button>
                        </template> -->
                    </el-table-column>
                    <!-- <el-table-column prop="itemType" label="事项类型" >
                    </el-table-column>
                    <el-table-column prop="itemCode" label="事项实施编码"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createBy" label="创建人" >
                    </el-table-column>
                    <el-table-column prop="itemStatus" label="状态" sortable  width="50">
                    </el-table-column> -->
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable >
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <!-- <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button size="mini" @click="handleClickItem(scope.row)">
                                    调研信息
                                </el-button>
                                <el-button size="mini" @click="handleClickItemBangBan(scope.row)">
                                    帮办工具
                                </el-button>
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
                                    :disabled="!hasManagePermission">
                                    编辑
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleClose(scope.row)"
                                    :disabled="!hasManagePermission">
                                    关闭
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div>
        </section>

        <section class="dialogBox">
            <!-- 新建窗口 -->
            <el-dialog title="事项属性填写" :visible.sync="dialogAddVisible" width="80%" :close-on-click-modal="false">
                <div class="attribute-content">
                    <el-form :inline="false" label-position="left" class="demo-form-inline">
                        <el-form-item label="项目">
                            <el-select v-model="tempItem.projectId" filterable>
                                <el-option v-for="(v,i) in projectOptions" :key="i" :label="v.projectName"
                                    :value="v.projectId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="大项">
                            <el-select v-model="tempItem.approvalId" filterable>
                                <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName"
                                    :value="v.approvalId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事项编号">
                            <el-input v-model="tempItem.itemNo">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项内部编号">
                            <el-input v-model="tempItem.itemInternalNo">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项实施编码">
                            <el-input v-model="tempItem.itemCode">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项名称">
                            <el-input v-model="tempItem.itemName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项类型(如新增/变更)">
                            <el-input v-model="tempItem.itemType">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="tempItem.sort">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogAddVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="saveItem()">
                        确定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑窗口 -->
            <el-dialog title="事项属性填写" :visible.sync="dialogUpdateVisible" width="80%" :close-on-click-modal="false">
                <div class="attribute-content">
                    <el-form :inline="false" label-position="left" class="demo-form-inline">
                        <el-form-item label="大项">
                            <el-select v-model="tempItem.approvalId" filterable>
                                <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName"
                                    :value="v.approvalId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事项编号">
                            <el-input v-model="tempItem.itemNo">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项实施编码">
                            <el-input v-model="tempItem.itemCode">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项名称">
                            <el-input v-model="tempItem.itemName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项类型(如新增/变更)">
                            <el-input v-model="tempItem.itemType">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="排序">
                            <el-input v-model="tempItem.sort">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUpdateVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="updateItem()">
                        确定
                    </el-button>
                </span>
            </el-dialog>
        </section>
    </div>
</template>



<script>

import {mixin} from "@/mixin/mixin"
import Vue from "vue";

import {mapGetters} from "vuex"
import {
    listApprovalAll,
    listProjectAll,
    addApprovalItem,
    getByApprovalItemId,
    shutApprovalItem,
    listApprovalItem,
} from "../../api/basicInfo/approval";

export default {
    name: "AllEdit",
    mixins: [mixin],
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
            currentPage: 1,
            pagesize: 15,
            totalCount: 0,
            flag:true,
            multipleSelection: [],
        };
    },
    computed: {
        ...mapGetters({hasManagePermission:'config/hasManagePermission'})
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.list();
        await this.loadOptions();

        let itemInfo = this.$store.state.home.item;
        itemInfo.approvalItemId = null;
        itemInfo.itemName = null;
        itemInfo.itemNo = null;
        this.$store.commit("changeItem", itemInfo);
        sessionStorage.removeItem('itemInfo');
        
    },
    methods: {
        getTime(val) {
            console.log(val);
        },
        async list() {
            let params = {
                approvalId: this.filterApprovalId,
                projectId: this.$route.query.projectId,
                keyword: this.filterKeyword,
                pageSize: this.pagesize,
                pageNum: this.currentPage,
            }
            if (this.timeRange != null && this.timeRange.length > 1) {
                params.startTime = this.timeRange[0];
                params.endTime = this.timeRange[1];
            }
            let result = await listApprovalItem(params);
            if(!result.success) return;
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
        },
        getRowKey(row) {
           return row.approvalItemId
        },
        handleSelectionChange (val) {
            console.log(val)
            this.multipleSelection = val;
        },

        // 取消选择
        toggleSelection() {
           this.$refs.multipleTable.clearSelection();
        },
        // 确定选择
        async selectClick() {
           console.log(this.multipleSelection)
            let lists = this.multipleSelection.map(ele=>({approvalItemId:ele.approvalItemId,itemName:ele.itemName,itemNo:ele.itemNo,itemNo:ele.itemNo}))
            this.$store.commit('changeEditList',lists)
            sessionStorage.setItem('editAll',JSON.stringify(lists))
            this.$router.push('/changeEdit')
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
        async loadOptions() {
            // 获取选项
            let projectRes = await listProjectAll();
            if (projectRes.success) {
                this.projectOptions = projectRes.data;
            }
            let approvalRes = await listApprovalAll({projectId: this.$route.query.projectId});
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
        },
        async searchItem() {
            this.currentPage = 1;
            await this.list();
        },
        handleClickItemDefault(item) {
          
            this.$store.commit("changeItem", item);
            sessionStorage.setItem("itemInfo", item);
            sessionStorage.setItem('activeName', 'subitem');
            // this.$router.push({
            //     path: "/basic/subitem",
            //     query: { itemId: item.approvalItemId },
            // });
            let hasAdmin = this.$store.state['config'].roles.includes('admin');
            let hasResearcher = this.$store.state['config'].roles.includes('researcher');
            if (hasAdmin || hasResearcher) {
                this.$router.push({
                    path: "/basic/subitem",
                    query: { itemId: item.approvalItemId },
                });
            } else {
                this.$router.push({
                    path: "/formconstructor",
                    query: { itemId: item.approvalItemId },
                });
            }
        },
        handleClickItem(item) {
            this.$store.commit("changeItem", item);
            sessionStorage.setItem("itemInfo", item);
            sessionStorage.setItem('activeName', 'subitem');
            this.$router.push({
                path: "/basic/subitem",
                query: { itemId: item.approvalItemId },
            });
        },
        handleClickItemBangBan(item) {
            this.$store.commit("changeItem", item);
            sessionStorage.setItem("itemInfo", item);
            sessionStorage.setItem('activeTab', 'formconstructor');
            this.$router.push({
                path: "/formconstructor",
                query: { itemId: item.approvalItemId },
            });
        },
        async handleClose(item) {
            try {
                await this.$confirm("是否关闭项目", "确认关闭",);
                let result = await shutApprovalItem({ approvalItemId: item.approvalItemId });
                if (!result.success) return;
                await this.list();
                this.$message({ type: "success", message: "关闭成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消关闭" })
            }
        },
        // 分页切换
        async handleCurrentChange(v) {
            await this.list();
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
        .handle {
            margin-left: auto;
            // margin-top: -55px;
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
