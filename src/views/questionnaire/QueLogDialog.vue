<template>
    <div>
        <el-dialog title="问卷回答记录列表" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
            <div class="one-area">
                <div class="title">{{row.questionnaireName}}</div>
                <div class="middle">
                    <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                        style="width: 100%"
                        :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                        :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                        <el-table-column prop="serialNumber" label="答题序号" width="100">
                        </el-table-column>
                        <el-table-column prop="answerer" label="作答人">
                        </el-table-column>
                        <el-table-column prop="completeTime" label="作答时长" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="问题反馈">
                            <el-table-column prop="answerExpand.telephone" label="联系电话" width="160">
                            </el-table-column>
                            <el-table-column prop="answerExpand.problem" label="问题描述" width="300">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable>
                        </el-table-column>
                        <el-table-column prop="isTest" label="是否为测试回答" :formatter="isRequiredFormatter" width="80">
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="300">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="checkQuestionnaire(scope.row)">查看回答
                                </el-button>
                                <el-button v-if="!scope.row.isTest" type="primary" size="mini" @click="backfillQuestionnaire(scope.row)">回填数据
                                </el-button>
                                <el-button v-if="!scope.row.isTest" type="plain" size="mini" @click="backfillLog(scope.row)">查看回填日志
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="tablePagination">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                            layout="total, sizes, prev, pager, next" :total="totalCount"></el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 查看问卷答案的dialog -->
        <el-dialog title="问卷回答" :visible.sync="dialogVisiblePaper" width="60%">
            <div>
                <Paper :paper-list="paperList" father-name="QueLogDialog" />
            </div>
        </el-dialog>
        <!-- 回填日志 -->
        <el-dialog title="问卷回答记录列表" :visible.sync="dialogVisibleLog" width="60%">
            <div>
                <el-table ref="multipleTable" border :data="tableDataLog" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                    <el-table-column label="序号" type="index" width="80" :index="indexMethod"></el-table-column>
                    <el-table-column prop="operateUser" label="回填操作人"  width="120"></el-table-column>
                    <el-table-column prop="createTime" label="回填时间" :formatter="timeFormatter" width="180"></el-table-column>
                    <el-table-column prop="fillbackLog" label="日志信息"></el-table-column>
                </el-table>
                <div class="tablePagination">
                    <el-pagination :current-page.sync="currentPage_log" :page-size.sync="pageSize_log"
                        :page-sizes="[5, 10, 20, 50, 100]" layout="total, sizes, prev, pager, next"
                        :total="totalCount_log">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
// 组件
import Paper from "./showQueModule/paper"
// 接口
import {
    listReply, fillback, listReplyFillbackLog
} from "@/api/questionnaire/management"

export default {
    mixins: [mixin],
    components: { Paper },
    data() {
        return {
            row: {},
            dialogVisible: false,
            tableData: [],
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            // 查看问卷答案
            dialogVisiblePaper: false,
            paperList: [],
            // 回填日志
            dialogVisibleLog: false,
            tableDataLog: [],
            currentPage_log: 1,
            pageSize_log: 10,
            totalCount_log: 0,
            rowInfo: {},
        }
    },
    watch: {
        currentPage_log: function (newValue, oldValue) {
            this.getReplyFillbackLog(this.rowInfo.replyId)
        },
        pageSize_log: function (newValue, oldValue) {
            this.currentPage_log = 1;
            this.getReplyFillbackLog(this.rowInfo.replyId)
        },
    },
    methods: {
        // 分页
        async handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.currentPage = 1;
            await this.getTableData();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.getTableData();
        },
        // 序号
        indexMethod(index) {
            return index + 1;
        },

        async openDialog() {
            this.dialogVisible = true;
            await this.$nextTick();
            console.log('row', this.row);
            this.getTableData();
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        async getTableData() {
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                questionId: this.row.questionId
            }
            let res = await listReply(params);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },
        checkQuestionnaire(row) {
            this.dialogVisiblePaper = true;
            this.paperList = row.replyJson;
        },
        // 回填数据
        async backfillQuestionnaire(row) {
            try {
                await this.$confirm('是否确定回填? 这将会覆盖一些字段数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                this.$message.info('取消了回填')
                return;
            }
            let params = {
                approvalItemId: Number(this.$route.query.itemId),
                replyId: row.replyId
            }
            let res = await fillback(params)
            if (!res.success) {
                this.$message.warning('回填失败')
                return
            }
            this.$message.success(res.data)
        },
        // 获取回填的日志数据
        async getReplyFillbackLog(id) {
            let params = {
                replyId: id,
                pageNum: this.currentPage_log,
                pageSize: this.pageSize_log,
            }
            let res = await listReplyFillbackLog(params)
            if (!res.success) return
            this.tableDataLog = res.data.records
            this.totalCount_log = res.data.total
        },
        // 查看回填日志
        backfillLog(row) {
            this.rowInfo = row;
            this.getReplyFillbackLog(row.replyId)
            this.dialogVisibleLog = true;
        }
    }
}
</script>

<style>
    .el-table .cell {
    white-space: pre-line;
}
</style>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.one-area {
    .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
    }
}
</style>