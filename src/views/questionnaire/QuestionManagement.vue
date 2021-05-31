<template>
    <div class="workWrap">
        <header>
            <span class="title">问卷列表</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <el-input placeholder="按问卷编号或名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
                </el-input>
                <el-button @click="search">搜索</el-button>
                <el-select v-model="addType" placeholder="请选择新增问卷方式" style="margin-left: 20px;">
                    <el-option label="按材料新增" value="material"></el-option>
                    <el-option label="按字段新增" value="field"></el-option>
                </el-select>
                <el-button type="primary" @click="addQuestionnaire">新增</el-button>
            </div>
            <div class="sampleTable">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55">
                    </el-table-column>
                    <el-table-column prop="questionnaireName" label="名称" width="240">
                    </el-table-column>
                    <!-- <el-table-column prop="isRelease" label="是否发布" :formatter="isRequiredFormatter">
                    </el-table-column> -->
                    <el-table-column prop="questionnaireType" label="类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="creator" label="创建人" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="replyCount" label="回答份数" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="visitUrl" label="问卷链接" show-overflow-tooltip>
                        <template slot-scope="scope" style="display: flex; flex-direction: column;">
                            <a target="_blank" :href="scope.row.visitUrl">{{scope.row.visitUrl}}</a>
                            <div v-if="scope.row.visitUrl">
                                <el-button :data-clipboard-text="scope.row.visitUrl" class="table-read" @click="copy('.table-read')">复 制</el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" width="180" sortable>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" width="180" sortable>
                    </el-table-column>
                    <el-table-column label="是否发布">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.isRelease" :active-value="Number(1)"
                                :inactive-value="Number(0)" active-color="#13ce66" inactive-color="#ff4949"
                                @change="relase(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"
                                @click="editQuestionnaire(scope.row)">编辑
                            </el-button>
                            <el-button type="primary" size="mini"
                                @click="editQuestionnaireItem(scope.row)">编辑题目
                            </el-button>
                            <el-button type="danger" size="mini"
                                @click="deleteQuestionnaireButton(scope.row)">删除
                            </el-button>
                            <el-button type="primary" size="mini"
                                @click="showLog(scope.row)">查看记录
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
        <!--编辑Questionnaire-->
        <el-dialog title="编辑Questionnaire" :visible.sync="dialogVisbleEdit" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm">
                <el-form-item label="名称">
                    <el-input v-model="editForm.questionnaireName"></el-input>
                </el-form-item>
                <!-- <el-form-item label="是否发布">
                    <el-select v-model="editForm.isRelease" placeholder="请选择新问卷发布状态" style="margin-left: 20px;">
                        <el-option label="已发布" :value="Number(1)"></el-option>
                        <el-option label="停止发布" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 发布弹框 -->
        <el-dialog title="发布成功" :visible.sync="releaseDialogVisible" width="30%" center>
            <div class="releaseDialog">
                <div class="nike">
                    <i class="el-icon-success"></i>
                </div>
                <a target="_blank" :href="releaseUrl" class="urltext">{{releaseUrl}}</a>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :data-clipboard-text="releaseUrl" class="dialog-read" @click="copy('.dialog-read')">复 制</el-button>
            </span>
        </el-dialog>
        <!-- 查看记录弹框 -->
        <QueLogDialog ref="questionLog"/>
        <!-- 查看问卷答案的dialog -->
        <el-dialog title="问卷回答" :visible.sync="dialogVisiblePaper" width="60%">
            <div>
                <Paper :paper-list="paperList" :questionnaire-info="questionnaireInfo" father-name="QuestionManagement"
                @getQuestionnaireItem="getQuestionnaireItem"/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { mixin } from "@/mixin/mixin"
import Clipboard from "clipboard"
import VueCompositionAPI from '@vue/composition-api'
import { ref } from "@vue/composition-api";
// 组件
import QueLogDialog from "./QueLogDialog"
import Paper from "./showQueModule/paper"
// 接口
import {
    listQuestion, deleteQuestion, generateQuestion, updateQuestion,
    releaseQuestion, getByQuestionKey
} from "@/api/questionnaire/management"


export default {
    mixins: [mixin],
    components: { QueLogDialog, Paper },
    setup() {
        const questionLog = ref(null);
        return {
            questionLog,
        }
    },
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 搜索区域
            serchType: '',
            keyWord: '',
            // 表格区域
            tableData: [],
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            //新增问卷
            addType: null,
            // 编辑弹窗
            dialogVisbleEdit: false,
            editForm: {},
            // 发布
            releaseDialogVisible: false,
            releaseUrl: '',
            // 编辑问卷题目
            dialogVisiblePaper: false,
            paperList: [],
            questionnaireInfo: {},
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getQuestionnaireList();
        // await this.getOptions();
    },
    methods: {
        // 分页
        async handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.currentPage = 1;
            await this.getQuestionnaireList();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.getQuestionnaireList();
        },

        // 加载表单
        async getQuestionnaireList() {
            let request = {
                approvalItemId: this.itemId,
                keyword: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
            };
            let res = await listQuestion(request);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },

        // 搜索
        search() {
            this.currentPage = 1;
            this.getQuestionnaireList();
        },
        // 新增一条问卷
        async addQuestionnaire() {
            if (!this.addType) {
                this.$message.warning('请先选择新增类型')
                return
            }
            let res = await generateQuestion({ approvalItemId: this.itemId, questionnaireType: this.addType })
            if (!res.success) {
                this.$message.warning('新增失败')
                return
            }
            this.$message.success('新增成功')
            this.getQuestionnaireList();
        },
        // 编辑
        async editQuestionnaire(row) {
            this.editForm = _.cloneDeep(row);
            console.log('this.editForm');
            console.log(this.editForm);
            this.dialogVisbleEdit = true;
        },
        // 确认编辑
        async editConfirm() {
            let res = await updateQuestion({ questionId: this.editForm.questionId, questionnaireName: this.editForm.questionnaireName });
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            this.getQuestionnaireList();
        },
        // 编辑题目
        editQuestionnaireItem(row) {
            this.getQuestionnaireItem(row.questionKey)
            this.dialogVisiblePaper = true
        },
        // 获取问卷题目
        async getQuestionnaireItem(questionKey) {
            let res = await getByQuestionKey({questionKey: questionKey})
            if(!res.success) return
            this.paperList = res.data.list
            this.questionnaireInfo = res.data.question
        },
        // 删除
        async deleteQuestionnaireButton(row) {
            try {
                await this.$confirm('是否确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                this.$message.info('取消了删除')
                return;
            }
            let res = await deleteQuestion({ id: row.questionId });
            if (!res.success) {
                this.$message.warning('删除失败')
                return;
            }
            this.$message.success('删除成功')
            this.getQuestionnaireList();
        },
        // 发布或停止发布
        async relase(row) {
            let params = {
                isRelease: row.isRelease,
                id: row.questionId,
            }
            let res = await releaseQuestion(params)
            if (!res.success) {
                this.$message.warning('更改发布状态失败')
                return
            }
            console.log('params.isRelease')
            console.log(params.isRelease)
            if (params.isRelease === 1) {
                this.releaseUrl = res.data
                this.releaseDialogVisible = true
            } else {
                this.releaseUrl = ''
            }
        },
        // 复制链接
        copy(item) {
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
        // 查看答卷记录
        showLog(row) {
            // console.log('row');
            // console.log(row
            this.questionLog && this.questionLog.openDialog();
            this.questionLog.row = row;
        }
    }
}
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
        .title {
            margin-right: 20px;
        }
    }
    .searchBox {
        margin-left: 20px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
    }
    .workBox {
        width: 100%;
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
        .sampleTable {
            margin: 20px;
        }
    }
    .workHandleBox {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
        margin: 30px;
        .button {
            margin-right: 12px;
        }
        // background: rgb(219, 237, 238);
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
    }
    .ruleItems {
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 10px;
        margin-bottom: 5px;
    }
    .releaseDialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 10px 20px;
        // background: rgb(250, 218, 246);
        .nike {
            font-size: 50px;
            color: #409eff;
        }
        .urltext {
            text-align: center;
        }
    }
}
</style>