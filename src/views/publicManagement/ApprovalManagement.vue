<template>
    <div class="workWrap">
        <header>
            <span class="title">大项管理</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <el-input placeholder="按大项名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
                </el-input>
                <el-button @click="search">搜索</el-button>
                <el-button @click="addApproval">新增</el-button>
            </div>
            <div class="sampleTable">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}"
                    >
                    <el-table-column prop="approvalId" label="序号" width="55">
                    </el-table-column>
                    <el-table-column prop="approvalNo" label="审批项目序号" width="120">
                    </el-table-column>
                    <el-table-column prop="approvalName" label="审批项目名称" width="180">
                    </el-table-column>
                    <el-table-column prop="approvalType" label="审批项目类型" width="180" show-overflow-tooltip>
                    </el-table-column>
                   <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable >
                    </el-table-column>
                    <el-table-column prop="updateTime" label="修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="primary" style="font-size: 14px" @click="updateApproval(scope.row)">编辑
                            </el-button>
                            <el-button type="danger" style="font-size: 14px" @click="deleteApprovalButton(scope.row)">
                                删除
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
        <!--添加SortConfig-->
        <el-dialog title="新增大项信息" :visible.sync="dialogVisbleAdd" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="addForm">
                <el-form-item label="审批项目序号">
                    <el-input v-model="addForm.approvalNo"></el-input>
                </el-form-item>
                <el-form-item label="审批项目名称">
                    <el-input v-model="addForm.approvalName"></el-input>
                </el-form-item>
                <el-form-item label="审批项目类型">
                    <el-input v-model="addForm.approvalType"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑大项-->
        <el-dialog title="修改大项信息" :visible.sync="dialogVisbleEdit" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm">
                <el-form-item label="审批项目序号">
                    <el-input v-model="editForm.approvalNo"></el-input>
                </el-form-item>
                <el-form-item label="审批项目名称">
                    <el-input v-model="editForm.approvalName"></el-input>
                </el-form-item>
                <el-form-item label="审批项目类型">
                    <el-input v-model="editForm.approvalType"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import dayjs from "dayjs";
import { mixin } from "@/mixin/mixin"

// 接口
import {
    pageApprovalAll, addApproval, updateApproval, deleteApproval, getByApprovalId
} from "@/api/basicInfo/approval"


export default {
    mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 搜索区域
            keyWord: '',
            // 表格区域
            tableData: [],
            multipleSelection: [],
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            // 新增弹窗
            dialogVisbleAdd: false,
            addForm: {},
            materialOptions: [],
            cutImgTagList: [],
            initPositionList: [],
            valueFieldList: [],
            valuePatternList: [],
            // 编辑弹窗
            dialogVisbleEdit: false,
            editForm: {
                cutImgTag: [],
                initPosition: [],
                valueField: [],
                valuePattern: [],
            },
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        // await this.init();
        await this.pageApprovalAll();
        // await this.getOptions();
    },
    methods: {
        //  切页
        handleCurrentChange() {
            this.pageApprovalAll();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageApprovalAll();
        },

        // 加载表单
        async pageApprovalAll() {
            let request = {
                projectId: this.projectId,
                keyword: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            let res = await pageApprovalAll(request);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },


        // 搜索
        async search() {
            this.currentPage = 1;
             let result = await pageApprovalAll({
                projectId: this.projectId,
                keyword: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
            });
            if (!result.success) return;
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
        },

        // 加载下拉框选项
        async getOptions() {
            let resMaterial = await listItemAndDocumentSub({ approvalItemId: this.itemId, pageNum: 1, pageSize: 500 });
            if (!resMaterial.success) return;
            this.materialOptions = resMaterial.data.records;
        },

        // 新增打开弹框
        async addApproval() {
            this.dialogVisbleAdd = true;
        },

        // 确认新增
        async addConfirm() {
            this.addForm.projectId = this.projectId;
            let res = await addApproval(this.addForm);
            if (!res.success) return;
            this.dialogVisbleAdd = false;
            this.pageApprovalAll();
        },

        // 编辑
        async updateApproval(row) {
            this.editForm = _.cloneDeep(row);
            console.log('this.editForm');
            console.log(this.editForm);
            this.dialogVisbleEdit = true;
        },
        // 确认编辑
        async editConfirm() {
            // this.editForm.approvalId = this.row.approvalId;
            let res = await updateApproval(this.editForm);
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            this.pageApprovalAll();
        },
        // 删除checkPoint
        async deleteApprovalButton(row) {
            let res = await deleteApproval({ approvalId: row.approvalId  });
            if (!res.success) return;
            this.pageApprovalAll();
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
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
}
</style>