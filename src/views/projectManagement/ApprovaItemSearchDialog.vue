<template>
    <div>
        <el-dialog title="搜索事项列表" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false">
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">
                    <el-table-column prop="projectName" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="departmentName" label="委办局名称" sortable>
                    </el-table-column>
                    <el-table-column prop="approvalName" label="大项" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemInternalNo" label="内部事项编号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemNo" label="事项编号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="事项名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="handleClickItemDefault(scope.row)" type="text" style="color: orange;">
                                {{scope.row.itemName}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="itemType" label="事项类型" >
                    </el-table-column> -->
                    <!-- <el-table-column prop="itemCode" label="事项实施编码"  show-overflow-tooltip> -->
                    <!-- </el-table-column> -->
                    <el-table-column prop="createBy" label="创建人">
                    </el-table-column>
                    <el-table-column prop="itemStage" label="事项阶段">
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pagesize" layout="total, prev, pager, next" :total="totalCount">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 事项多版本查看导入 -->
        <el-dialog title="版本列表" :visible.sync="dialogVisibleVersion" width="80%" :close-on-click-modal="false">

            <el-table ref="versionTable" :data="versionList" border style="width: 100%" row-key="id">
                <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
                <el-table-column prop="version" label="版本号"></el-table-column>
                <el-table-column prop="username" label="提交人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                <el-table-column prop="latest" label="是否最新" :formatter="formatBoolean"></el-table-column>
                <el-table-column prop="note" label="备注信息"></el-table-column>
                <el-table-column label="操作" fixed="right" width="200px">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" :loading="scope.row.loadingImport"
                                @click="confirmImport(scope.row)">确认导入</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleVersion = false">
                    关闭
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { mixin } from "@/mixin/mixin"
import Vue from "vue";
import VueCompositionAPI from '@vue/composition-api'
import { ref } from "@vue/composition-api";
// 组件
import { mapGetters } from "vuex"
import {
    listApprovalAll,
    addApprovalItem,
    getByApprovalItemId,
    shutApprovalItem,
    listApprovalItem,
    exApprovalItem,
    listVersionItem,
    obtainVersionItem, isNewItemVersion, listApprovalItemOverall
} from "@/api/basicInfo/approval";

export default {
    mixins: [mixin],
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            // 分页
            currentPage: 1,
            pagesize: 15,
            totalCount: 0,
            keyword: '',
            // 导入版本列表
            dialogVisibleVersion: false,
            versionList: [],
        }
    },
    methods: {
        async openDialog(keyword) {
            this.dialogVisible = true;
            this.keyword = keyword;
            let params = {
                keyword,
                pageNum: this.currentPage,
                pageSize: this.pagesize
            }
            let res = await listApprovalItemOverall(params)
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },
        closeDialog() {
            this.dialogVisible = false;
        },

        // 进入事项
        async handleClickItemDefault(item) {
            this.currentItemInfo = item;
            this.currentClickButton = '事项名';
            let newItem = await this.getRoleApprovalId(item);
            if (!newItem) return;
            console.log('newItem', newItem,);
            this.$store.commit("changeProject", item);
            this.$store.commit("changeItem", newItem);
            sessionStorage.setItem("itemInfo", newItem);
            sessionStorage.setItem('activeName', 'approvalDetail');
            let hasAdmin = this.$store.state['config'].roles.includes('admin');
            let hasResearcher = this.$store.state['config'].roles.includes('researcher');
            if (hasAdmin || hasResearcher) {
                this.$router.push({
                    path: "/basic/approvalDetail",
                    query: { itemId: newItem.approvalItemId, projectId: item.projectId },
                });
            } else {
                this.$router.push({
                    path: "/formconstructor",
                    query: { itemId: item.approvalItemId, projectId: item.projectId },
                });
            }
        },
        async handleClose(item) {
            try {
                await this.$confirm("是否关闭项目", "确认关闭",);
                let result = await shutApprovalItem({ approvalItemId: item.approvalItemLordId });
                if (!result.success) return;
                await this.list();
                this.$message({ type: "success", message: "关闭成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消关闭" })
            }
        },
        async handleCurrentChange() {
            this.openDialog(this.keyword);
        },
        // git多版本相关方法
        async getRoleApprovalId(row) {
            let result = await exApprovalItem({ approvalItemId: row.approvalItemLordId });
            if (!result.success) return;
            // 无当前用户的事项数据
            if (result.data === null) {
                try {
                    await this.$confirm("您当前无最新个人数据，是否从历史版本导入", "提示",);
                    let res = await listVersionItem({ approvalItemLordId: row.approvalItemLordId });
                    this.versionList = res.data;
                    this.versionList.forEach((item) => {
                        this.$set(item, 'loadingImport', false)
                    })
                    this.dialogVisibleVersion = true;
                    return false;
                } catch (e) {
                    this.$message({ type: "success", message: "新建版本" });
                    let request = {
                        approvalItemLordId: row.approvalItemLordId,
                        exImport: false
                    }
                    let res = await obtainVersionItem(request);
                    console.log('新建', res);
                    return res.data;
                }
            } else {
                let res = await isNewItemVersion({ approvalItemId: result.data.approvalItemId })
                if (res.data) {
                    this.$message.warning(res.data)
                }
                return result.data;
            }
        },
        // 确认导入
        async confirmImport(row) {
            row.loadingImport = true;
            let request = {
                approvalItemLordId: row.approvalItemLordId,
                exImport: true,
                id: row.id
            }
            let res = await obtainVersionItem(request)
            if (res.success) {
                this.$message.success('导入事项数据成功！');
                row.loadingImport = false;
                this.dialogVisibleVersion = false;
                console.log('导入的id', res.data);
                this.handleClickItemDefault(this.currentItemInfo);
            } else {
                this.$message.warning('导入事项数据失败！');
                row.loadingImport = false;
            }
        },
        formatBoolean(row, column, cellValue) {
            let ret = ''  //你想在页面展示的值
            if (cellValue) {
                ret = "最新"  //根据自己的需求设定
            } else {
                ret = "-"
            }
            return ret;
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workHandleBoxContent {
    display: flex;
    // align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .block {
        width: 95%;
        margin: 20px;
    }
    .handleBox {
        width: 300px;
        margin: 20px;
        padding: 10px;
        display: flex;
        // background: rgb(250, 218, 218);
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .title {
            margin: 20px;
        }
    }
    .el-table .red-row {
        color: #ff5160;
        background: #ffeaea;
    }
}
</style>