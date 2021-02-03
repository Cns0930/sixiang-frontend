<template>
    <div class="workWrap">
        <section class="workBox">
            <div class="searchBox">
                <el-select v-model="approvalSubList" multiple collapse-tags style="width: 300px;" placeholder="请选择情形名称"
                    @change="searchTestCase">
                    <el-option v-for="item in approvalSubOptions" :key="item.approvalSubitemId"
                        :label="item.subitemName" :value="item.approvalSubitemId">
                    </el-option>
                </el-select>
                <el-input placeholder="搜索测试状态" v-model="testState" clearable style="width: 200px;"
                    @change="searchTestCase"></el-input>
                <el-input placeholder="搜索开发状态" v-model="devState" clearable style="width: 200px;"
                    @change="searchTestCase"></el-input>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%" border
                    :row-style="{height:'60px'}" :header-row-style="{height:'50px'}" tooltip-effect="dark"
                    :default-sort="{ prop: 'createTime', order: 'descending' }">
                    <el-table-column label="序号" type="index" width="70"></el-table-column>
                    <el-table-column prop="subitemName" label="情形名称" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="需求界面图" width="250">
                        <template slot-scope="scope">
                            <!-- <img :src="localUrl + `/superform/testcase/getTestcasePic?testcaseId=${scope.row.testcaseId}`"
                                :alt="'用例编号:'+scope.row.testcaseId" width="100%" /> -->
                            <el-image
                                :src="scope.row.imgUrl"
                                :alt="'用例编号:'+scope.row.testcaseId" :preview-src-list="scope.row.imgUrlList">
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="demandPoint" label="需求点">
                    </el-table-column>
                    <el-table-column prop="exampleCode" label="用例编号">
                    </el-table-column>
                    <el-table-column prop="testStep" label="测试步骤" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="testResult" label="测试结果" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="developmentStatus" label="开发状态" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.flag" v-model="scope.row.developmentStatus"></el-input>
                            <span v-else>{{scope.row.developmentStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="testStatus" label="测试状态" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.flag" v-model="scope.row.testStatus"></el-input>
                            <span v-else>{{scope.row.testStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.flag">
                                <el-button size="mini" icon="el-icon-close"
                                    @click="closeText(scope.row,scope.$index, tableData)"></el-button>
                                <el-button size="mini" type="primary" icon="el-icon-check"
                                    @click="saveText(scope.row,scope.$index, tableData)"></el-button>
                            </div>
                            <div v-else>
                                <!-- <el-button size="mini" @click="addText(scope.row,scope.$index, tableData)"
                                    style="margin-left: 20px" icon="el-icon-plus">
                                </el-button> -->
                                <el-button size="mini" type="danger"
                                    @click="handleDelete(scope.row,scope.$index, tableData)" icon="el-icon-minus">
                                </el-button>
                                <el-button size="mini" type="primary" @click="Edit(scope.row,scope.$index, tableData)"
                                    icon="el-icon-edit"></el-button>
                                <el-button size="mini" type="primary" @click="EditAll(scope.row)"
                                    icon="el-icon-edit-outline">
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPageTable" :page-size="pageSizeTable" layout="total, prev, pager, next"
                    :total="totalTable"></el-pagination>
            </div>
        </section>
        <!-- 编辑弹窗 -->
        <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%">
            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="情形名称">
                    <el-select v-model="editForm.approvalSubList" multiple collapse-tags style="width: 300px;"
                        placeholder="请选择情形名称" @change="searchTestCase">
                        <el-option v-for="item in approvalSubOptions" :key="item.approvalSubitemId"
                            :label="item.subitemName" :value="item.approvalSubitemId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="需求点">
                    <el-input v-model="editForm.demandPoint"></el-input>
                </el-form-item>
                <el-form-item label="测试步骤">
                    <el-input v-model="editForm.testStep"></el-input>
                </el-form-item>
                <el-form-item label="测试结果">
                    <el-input v-model="editForm.testResult"></el-input>
                </el-form-item>
                <el-form-item label="测试状态">
                    <el-input v-model="editForm.testStatus"></el-input>
                </el-form-item>
                <el-form-item label="开发状态">
                    <el-input v-model="editForm.developmentStatus"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>



<script>
import { mixin } from "@/mixin/mixin";
import Vue from "vue";

import { listApprovalSubAll } from "../../api/basicInfo/approvalSub";
import { listTestcase, updateTestcase, updateTestcaseAndSubitem, deleteTestcase } from "../../api/basicInfo/testcase"

import { listSubitemAndDocumentNew, getApprovalSub, addSubitemAndDocumentNew, deleteSubitemAndDocumentNew, updateSubitemAndDocumentNew } from "../../api/basicInfo/approvalSub";
// import { delete } from 'node_modules/vue/types/umd';
export default {
    name: "ApprovalSubItemText",
    mixins: [mixin],
    data() {
        return {
            // 初始化数据
            itemId: this.$route.query.itemId,

            // 搜索相关
            approvalSubList: [], // 情形列表
            approvalSubOptions: [],
            testState: '',
            devState: '',

            // 表格相关
            tableData: [],
            localUrl: process.env.VUE_APP_BASE_IP,
            srcList: ['https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'],

            // 分页相关
            currentPageSelect: 1,
            pageSize: 10,
            totalAim: 0,
            currentPageTable: 1,
            totalTable: 0,
            pageSizeTable: 10,

            // 编辑弹窗相关
            editDialogVisible: false,
            editForm: {

            },
        };
    },
    computed: {},
    watch: {
        tableData(val) {
        },
    },

    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();

        // 获取情形选择框
        await this.getApprovalSubOptions();

        // 获取测试用例列表
        await this.getTestcaseList();
    },

    methods: {
        // 获取情形选择框
        async getApprovalSubOptions() {
            let result = await listApprovalSubAll({ approvalItemId: this.$route.query.itemId })
            this.approvalSubOptions = result.data;
        },

        // 获取测试用例列表
        async getTestcaseList() {
            let request = {
                approvalItemId: this.$route.query.itemId,
                approvalSubitemIdlist: this.approvalSubList,
                developmentStatus: this.devState,
                testStatus: this.testState,
                pageNum: this.currentPageTable,
                pageSize: this.pageSizeTable,
            }
            let result = await listTestcase(request);
            if (!result.success) return;
            // 赋予图片路径
            result.data.records.forEach(item => {
                let imgUrl = this.localUrl + `/superform/testcase/getTestcasePic?testcaseId=${item.testcaseId}`;
                this.$set(item, 'imgUrl', imgUrl)
                item.imgUrlList = [imgUrl];
            })
            this.tableData = result.data.records;
            console.log('this.tableData');
            console.log(this.tableData);
            this.totalTable = result.data.total;
        },

        // 搜索测试用例
        searchTestCase() {
            this.currentPageTable = 1;
            this.getTestcaseList();
        },

        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },

        // 放大图片


        // 打开编辑弹窗
        EditAll(row) {
            this.editForm = {
                demandPoint: '',
                testStep: '',
                testResult: '',
                developmentStatus: '',
                testStatus: ''
            };
            console.log('row');
            console.log(row);
            this.editDialogVisible = true;
            this.editForm.approvalSubList = row.subitemIds;
            this.editForm.demandPoint = row.demandPoint;
            this.editForm.testStep = row.testStep;
            this.editForm.testResult = row.testResult;
            this.editForm.developmentStatus = row.developmentStatus;
            this.editForm.testStatus = row.testStatus;
            this.editForm.testcaseId = row.testcaseId;
        },

        // 确认编辑弹窗
        async editConfirm() {
            let result = await updateTestcase(this.editForm);
            if (!result.success) return;
            let resultSecond = await updateTestcaseAndSubitem({ subitemIds: this.editForm.approvalSubList, testcaseId: this.editForm.testcaseId });
            if (!resultSecond.success) return;
            this.editDialogVisible = false;
            await this.getTestcaseList();
        },

        // 新增
        async addText(item, index, rows) {
            console.log(item, index, rows)
            if (item == 0) {
                rows.splice(index + 1, 0, {
                    approvalSubitemId: '',
                    subitemName: '',
                    globalDocumentSubId: '',
                    isRequired: '',
                    flag: true
                })
            } else {
                rows.splice(index + 1, 0, {
                    approvalSubitemId: Number(item.approvalSubitemId),
                    subitemName: item.subitemName,
                    globalDocumentSubId: '',
                    isRequired: '',
                    flag: true
                });
            }
        },
        // 删除
        async handleDelete(item, index, rows) {
            console.log(item, index, rows)
            try {
                await this.$confirm('此操作将永久删除该测试用例, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await deleteTestcase({ id: item.testcaseId });
            if (!result.success) return;
            await this.getTestcaseList();
        },
        // 修改
        Edit(item, index, rows) {
            this.$set(item, 'flag', true)
            this.$set(item, 'edits', true)
        },

        // 保存
        async saveText(item, index, rows) {
            if (item.edits) {
                // delete item.edits
                // delete item.flag
                const result = await updateTestcase(item)
                if (!result.success) return;
            }
            // else {
            //     // delete item.flag
            //     const res = await addSubitemAndDocumentNew(item)
            //     console.log(res, 'res')
            // }
            await this.getTestcaseList();
        },
        // 取消
        closeText(item, index, rows) {
            console.log(item, index, rows, '0000')
            if (item.edits) {
                this.$set(item, 'flag', null)
            } else {
                rows.splice(index, 1)
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
        .title {
            // font-size: 20px;
            margin-right: 20px;
        }
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
        justify-content: flex-start;
        align-items: center;
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
