<template>
    <div class="workWrap">
        <header>
            <span class="title">标签管理</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <el-input placeholder="标签名称查询" v-model="labelName" clearable style="width: 200px;" @change="search">
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
                    <el-table-column type="index" label="序号" :index="indexMethod" width="100">
                    </el-table-column>
                    <el-table-column prop="labelName" label="标签名称">
                    </el-table-column>
                    <el-table-column prop="approvalName" label="标签对应功能">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.labelFunctionList" :key="item.labelFunctionId">
                                <el-tag>{{item.labelFunction}}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable width="250">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip width="250">
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="primary" style="font-size: 14px" @click="updateApproval(scope.row)">编辑
                            </el-button>
                            <el-button type="danger" style="font-size: 14px" @click="deleteButton(scope.row)">
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
        <!--添加标签-->
        <el-dialog title="新增标签" :visible.sync="dialogVisbleAdd" width="40%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="addForm" style="width: 100%">
                <el-form-item label="标签名称" required>
                    <el-input v-model="addForm.labelName"></el-input>
                </el-form-item>
                <el-form-item label="标签对应功能" required>
                    <el-select v-model="addForm.labelFunctionIdList" multiple clearable
                        placeholder="请选择标签对应功能" style="width: 100%">
                        <el-option v-for="(v,i) in functionOptions" :key="i" :label="v.labelFunction"
                            :value="v.labelFunctionId"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑标签-->
        <el-dialog title="编辑标签" :visible.sync="dialogVisbleEdit" width="40%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm" style="width: 100%">
                <el-form-item label="标签名称" required>
                    <el-input v-model="editForm.labelName"></el-input>
                </el-form-item>
                <el-form-item label="标签对应功能" required>
                    <el-select v-model="editForm.labelFunctionIdList" multiple clearable
                        placeholder="请选择标签对应功能" style="width: 100%">
                        <el-option v-for="(v,i) in functionOptions" :key="i" :label="v.labelFunction"
                            :value="v.labelFunctionId"> </el-option>
                    </el-select>
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
    listProjecLabelPage, saveOrUpdateProjecLabel, deleteProjecLabel, listLabelFunction
} from "@/api/basicInfo/tags"
// import {
//     getTagsTable, addApproval, updateApproval, deleteApproval, getByApprovalId
// } from "@/api/basicInfo/approval"
// import {
//     likelistDepartments
// } from "@/api/documentAndApproval/index"


export default {
    mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 搜索区域
            labelName: '',
            // 表格区域
            tableData: [],
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            // 新增弹窗
            dialogVisbleAdd: false,
            addForm: {
                labelFunctionIdList: [],
            },
            functionOptions: [],
            // 编辑弹窗
            dialogVisbleEdit: false,
            editForm: {
                labelFunctionIdList: [],
            },
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        // await this.init();
        await this.getTagsTable();
        await this.getOptions();
    },
    methods: {
        //  切页
        handleCurrentChange() {
            this.getTagsTable();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTagsTable();
        },

        // 加载表单
        async getTagsTable() {
            let request = {
                projectId: this.projectId,
                labelName: this.labelName,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            let res = await listProjecLabelPage(request);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },


        // 搜索
        async search() {
            this.currentPage = 1;
            this.getTagsTable();
        },

        // 加载下拉框选项
        async getOptions() {
            let result = await listLabelFunction();
            if (!result.success) return;
            this.functionOptions = result.data;
        },

        // 新增打开弹框
        async addApproval() {
            this.dialogVisbleAdd = true;
        },
        // 确认新增
        async addConfirm() {
            this.addForm.projectId = Number(this.projectId);
            let res = await saveOrUpdateProjecLabel(this.addForm);
            if (!res.success) return;
            this.dialogVisbleAdd = false;
            this.getTagsTable();
        },

        // 编辑
        async updateApproval(row) {
            this.editForm = _.cloneDeep(row);
            this.$set(this.editForm, 'labelFunctionIdList', [])
            this.editForm.labelFunctionList.forEach(item => {
                this.editForm.labelFunctionIdList.push(item.labelFunctionId)
            })
            console.log('this.editForm');
            console.log(this.editForm);
            await this.$nextTick();
            this.dialogVisbleEdit = true;
        },
        // 确认编辑
        async editConfirm() {
            // this.editForm.approvalId = this.row.approvalId;
            let res = await saveOrUpdateProjecLabel(this.editForm);
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            this.getTagsTable();
        },

        // 删除标签
        async deleteButton(row) {
            let res = await deleteProjecLabel({ projecLabelId: row.projecLabelId });
            if (!res.success) {
                this.$message.warning('删除失败')
                return;
            }
            this.getTagsTable();
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/global.scss";
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