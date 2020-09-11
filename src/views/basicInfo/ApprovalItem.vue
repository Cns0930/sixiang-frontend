<template>
    <div class="workWrap">
        <header>事项管理</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选委办局" v-model="value" clearable style="width: 200px;"></el-input>
                <el-input placeholder="筛选事项" v-model="valueT" clearable style="width: 200px;"></el-input>
                <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="getTime"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button>搜索</el-button>
                <div class="handle">
                    <el-button type="primary">新增</el-button>
                    <el-button type="primary">导出</el-button>
                    <el-button type="primary">导入</el-button>
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
                    <!-- <el-table-column
              type="selection"
              width="50">
                    </el-table-column>-->
                    <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>
                    <!-- <el-table-column
              label="部门"
              sortable
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="大项"
              sortable
              width="120">
                    </el-table-column>-->
                    <el-table-column
                        prop="itemInternalNo"
                        label="内部事项编号"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="itemNo" label="事项编号" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="itemName" label="事项名称" width="160"></el-table-column>
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
                        :formatter="(row,column,flag) => formatterTime(row,column,0)"
                        sortable
                        width="140"
                    ></el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="最后修改时间"
                        width="140"
                        :formatter="(row,column,flag) => formatterTime(row,column,1)"
                        sortable
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                            >审核</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
              label="启/停用"
              fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="value"
                >
                <span style="display: none;">{{scope.$index}}</span>
                </el-switch>
              </template>
                    </el-table-column>-->
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
            <!-- <component :is="model.type" v-model="model.val" v-bind="{
          type: 'textarea',
          placeholder:'输入数字信息',
            }" @input="inputs"></component>-->
        </section>
        <!-- 新建窗口 -->

        <!-- 编辑窗口 -->
        <!-- <el-dialog
        title="事项属性填写"
        :visible.sync="dialogVisible"
        width="80%"
        :close-on-click-modal="false"
    >
        <div class="attribute-content">
            sid
            <el-input v-model="tempItem.sid"></el-input>审批事项名称
            <el-input v-model="tempItem.name"></el-input>审批事项英文代号(拼音)
            <el-input v-model="tempItem.itemCode"></el-input>审批事项大类
            <el-input v-model="tempItem.category"></el-input>属性
            <el-input v-model="tempItem.type"></el-input>所属委办局
            <div>
                <el-select v-model="tempItem.department">
                    <el-option
                        v-for="(v,i) in departmentOptions"
                        :key="i"
                        :label="v.department"
                        :value="v.department"
                    ></el-option>
                </el-select>
            </div>事权性质
            <el-input v-model="tempItem.authority"></el-input>序号
            <el-input v-model="tempItem.seq"></el-input>备注
            <el-input v-model="tempItem.note"></el-input>激活状态
            <el-input v-model="tempItem.status"></el-input>所在区域
            <el-input v-model="tempItem.area"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveItem();dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog> -->
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import { listApprovalAll, listProjectAll } from "../../api/basicInfo/approval";

export default {
    name: "Work",
    mixins: [basicMixin],
    data() {
        return {
            // model: {
            //   type: 'NumberInput',
            //   val: '12',
            //   options: {
            //     type: 'textarea',
            //     placeholder:'输入数字信息',
            //   }
            // },
            type: "work",
            value: "",
            valueT: "",
            timeRange: [],
            tableData: [],
            multipleSelection: [],
        };
    },
    computed: {},
    async created() {
        await this.search();
    },
    methods: {
        // inputs(val) {
        //   console.log(this.model);
        // },
        getTime(val) {
            console.log(val);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
