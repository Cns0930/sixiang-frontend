<template>
    <div class="workWrap">
        <header>
            <span class="title">测试环境服务管理</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <el-input placeholder="按服务和说明信息查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
                </el-input>
                <el-button @click="search">搜索</el-button>
                <el-button @click="addMachine">新增</el-button>
            </div>
            <div class="sampleTable">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 70%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                    <el-table-column prop="id" label="编号"  width="100" v-if="show" >
                    </el-table-column>
                    <el-table-column type="index" label="序号" :index="indexMethod" width="100">
                    </el-table-column>
                    <el-table-column prop="superformIpPort" label="服务地址" width="280">
                    </el-table-column>
                    <el-table-column prop="displayNotes" label="补充说明信息" width="200">
                    </el-table-column>
                    <el-table-column prop="version" label="服务版本" width="180" show-overflow-tooltip>
                    </el-table-column>                
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" style="font-size: 14px" @click="editDepartments(scope.row)">修改
                            </el-button>
                            <el-button type="danger" style="font-size: 14px" @click="deleteMachineButton(scope.row)">
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
        <!--添加委办局-->
        <el-dialog title="新增测试服务" :visible.sync="dialogVisbleAdd" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="addForm">
                
                <el-form-item label="服务地址">
                    <el-input v-model="addForm.superformIpPort"></el-input>
                </el-form-item>
                <el-form-item label="补充信息说明">
                    <el-input v-model="addForm.displayNotes"></el-input>
                </el-form-item>
                <el-form-item label="服务版本">
                    <el-input v-model="addForm.version"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑委办局-->
        <el-dialog title="编辑测试服务" :visible.sync="dialogVisbleEdit" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm">
                <el-form-item label="服务地址">
                    <el-input v-model="editForm.superformIpPort"></el-input>
                </el-form-item>
                <el-form-item label="补充信息说明">
                    <el-input v-model="editForm.displayNotes"></el-input>
                </el-form-item>
                <el-form-item label="服务版本">
                    <el-input v-model="editForm.version"></el-input>
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
import axios from 'axios';
import dayjs from "dayjs";
import { mixin } from "@/mixin/mixin"

// 接口
import {
    likelistMachine, addMachine, updateMachine,  deleteMachine
} from "../../api/basicInfo/testService"


export default {
     mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 搜索区域
            keyWord: '',
            show: false,
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
        await this.likelistMachine();
        // await this.getOptions();
    },
    methods: {
        //  切页
        handleCurrentChange() {
            this.likelistMachine();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.likelistMachine();
        },


        // 加载表单
        async likelistMachine() {
            let request = {
                // approvalItemId: this.itemId,
                keyWord: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            let res = await likelistMachine(request);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },


        // 搜索
        async search() {
            this.currentPage = 1;
             let result = await likelistMachine({
                keyword: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
            });
            if (!result.success) return;
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
        },

      

        // 新增打开弹框
        async addMachine() {
            this.dialogVisbleAdd = true;
        },

        // 确认新增
        async addConfirm() {
           
            console.log('this.addForm', this.addForm);
           
            let res = await addMachine(this.addForm);
            if (!res.success) return;
            this.dialogVisbleAdd = false;
            this.likelistMachine();
        },

        // 编辑
        async editDepartments(row) {
            this.editForm = _.cloneDeep(row);
            console.log('this.editForm');
            console.log(this.editForm);
            this.dialogVisbleEdit = true;
        },
        // 确认编辑
        async editConfirm() {
             console.log('this.editForm', this.editForm);
            let res = await updateMachine(this.editForm);
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            this.likelistMachine();
        },
        // 删除checkPoint
        async deleteMachineButton(row) {
            let res = await deleteMachine({ id: row.id  });
            if (res.success) {
            this.$message({
              type: "success",
              message: "删除成功"
             });
            }else{
                return;
            }
            this.likelistMachine();
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