<template>
    <div class="test-manager">
        <div class="table">
            <div class="searchBox" align="center">
                <el-button @click="addUnitTest;addDialogVisible = true" style="margin-right:20px">新增</el-button>
                <el-input placeholder="单元测试名称模糊查询" clearable style="width: 200px;" v-model="constant" ></el-input>
                <el-button @click="searchTestCase()" style="margin-left:20px">搜索</el-button>
            </div>
            <div class="tableWrap" align="center">
                <el-table
                        :data="tableData"
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="序号"
                            width="350" align="center">
                    </el-table-column>
                    <el-table-column
                            prop="unittestName"
                            label="单元测试名称"
                            width="342" align="center">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="新增时间"
                            width="342" align="center">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            label="修改时间"
                            width="342" align="center">
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="342">
                        <template slot-scope="scope" >
                            <el-button size="mini" type="danger"
                                       @click="handleDelete(scope.row,scope.$index, tableData)"
                                       icon="el-icon-minus"></el-button>
                            <el-button size="mini" type="primary" @click="open(scope.row);editDialogVisible = true"
                                       icon="el-icon-edit"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="tablePagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="currentPageTable" :page-size="pageSizeTable" layout="total, sizes, prev, pager, next"
                           :total="totalTable"></el-pagination>
        </div>
        <el-dialog
                title="单元测试修改"
                :visible.sync="editDialogVisible"
                width="50%"
                >
            <div class="attribute">
                <div>
                    <span class="attribute-key">单元测试名称</span>
                    <el-input v-model="unitTestObj.unittestName" placeholder="请输入内容" class="attribute-value-in"></el-input>
                </div>

                <div>
                    <span class="attribute-key">单元测试代码</span>
                    <CodeEditor v-model="unitTestObj.unittestCodeinfo" ></CodeEditor>
                </div>


            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm">确 定
                </el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="提示"
                :visible.sync="addDialogVisible"
                width="50%"
        >
            <div class="attribute">
                <span class="attribute-key">单元测试名称</span>
                <el-input v-model="addValue" placeholder="请输入内容"></el-input>
                <span class="attribute-key">单元测试代码</span>
                <CodeEditor v-model="addCode" ></CodeEditor>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
    import {mixin} from "@/mixin/mixin";
    import {getUnitTest, deleteUnitTest, updateUnitTest,getUnitTestById,addUnitTest} from "../../api/basicInfo/testManager"

    import { CodeEditor } from "@/views/attributeComponents/defRendererComponents/defRendererComponents";

    export default {
        name: "TestManager",
        mixins: [mixin],
        components: { CodeEditor },
        data() {
            return {
                constant: '',
                tableData: [],

                //编辑
                editDialogVisible: false,
                value: '',
                unitTestObj: {},
                code: '',

                //新增
                itemId: this.$route.query.itemId,
                addValue: '',
                addCode: '',
                addUnitTestObj: {},
                addDialogVisible: false,

                // 分页相关
                currentPageSelect: 1,
                pageSize: 10,
                totalAim: 0,
                currentPageTable: 1,
                totalTable: 0,
                pageSizeTable: 10,
            };
        },
        computed: {},
        watch: {
            tableData(val) {
            },
        },

        //页面被创建的时候执行
        async created() {
            // 获取项目信息
            // await this.initProject();
            // await this.init();

            // 获取情形选择框
            // await this.getApprovalSubOptions();

            //初始化加载测试列表
            await this.unitTest();
        },

        methods: {
            // 获取情形选择框
            // async getApprovalSubOptions() {
            //     let result = await listApprovalSubAll({approvalItemId: this.$route.query.itemId})
            //     this.approvalSubOptions = result.data;
            // },

            async vagueSearch() {
                let testName = this.constant
                console.log(testName)
                let result = await getUnitTest({unitTestName: testName});
                if (!result.success) return;
                this.tableData = result.data.records;
            },

            async unitTest() {
                let request = {
                    pageNum: this.currentPageTable,
                    pageSize: this.pageSizeTable,
                }
                let result = await getUnitTest(request);
                if (!result.success) return;
                this.tableData = result.data.records;
                this.totalTable = result.data.total;
            },

            // 搜索测试用例
            async searchTestCase() {
                // this.currentPageTable = 1;
                // this.getTestcaseList();
                this.vagueSearch()
            },

            // 分页
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSizeTable = val;
                this.currentPageTable = 1;
                this.unitTest();
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.currentPageTable = val;
                this.unitTest();
            },

            //打开编辑框
            async open(obj){
                let testUnitResult = await getUnitTestById({id:obj.id})
                if (!testUnitResult.success) return;
                this.value = testUnitResult.data.unittestName
                this.code = testUnitResult.data.unittestCodeinfo
                this.unitTestObj = {
                    approvalItemId: testUnitResult.data.approvalItemId,
                    id: testUnitResult.data.id,
                    unittestName: this.value,
                    unittestCodeinfo: this.code
                }
            },

            // 确认编辑弹窗
            async editConfirm() {
                let result = await updateUnitTest(this.unitTestObj);
                if (!result.success) return;
                this.editDialogVisible = false;
                this.$message({ type: "success", message: "保存成功" });
                await this.unitTest();
            },

            //确认新增
            async addConfirm(){
                this.addUnitTestObj = {
                    approvalItemId: this.itemId,
                    unittestName: this.addValue,
                    unittestCodeinfo: this.addCode
                }
                let result = await addUnitTest(this.addUnitTestObj);
                if (!result.success) return;
                this.addDialogVisible = false;
                this.$message({ type: "success", message: "增加成功" });
                await this.unitTest();
            },

            // 删除
            async handleDelete(item, index, rows) {
                console.log(item, index, rows)
                try {
                    await this.$confirm('此操作将永久删除该单元测试, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch (e) {
                    return;
                }
                let result = await deleteUnitTest({id: item.id});
                if (!result.success) return;
                await this.unitTest();
            }
        },
    };
</script>

<style scoped lang="scss">
    @import "../../assets/css/global.scss";

    .workBox {
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
    }

    .searchBox{
        margin-bottom: 30px;
        margin-top: 30px;
    }
    .attribute-value-in{
        float: right;
    }

</style>
