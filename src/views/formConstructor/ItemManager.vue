<template>
<div class="item-manager">
    <section class="tabs">
        <div class="op-bar">
            <el-button @click="handleEditItem({});">创建新事项</el-button>
        </div>
        <div class="time-filter" style="width: 100%;margin-left: 40px;">
            <span class="demonstration">筛选事项创建时间:</span>
            <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="margin: 0 20px;"
            ></el-date-picker>
            <el-button @click="filterDate();" size="small">确认</el-button>
        </div>
    </section>
    <div class="main">
        <!-- 事项表格 -->
        <div class="item-table" style="width: 100%;padding:10px 0;">
            <el-table :data="itemlist" border style="width: 100%">
                <el-table-column fixed prop="itemNo" label="sid" width="150"></el-table-column>
                <el-table-column label="事项名称(点击进入)">
                    <template slot-scope="scope">
                        <el-button
                            @click="handleClickItem(scope.row)"
                            type="text"
                            style="color: orange;"
                        >{{scope.row.itemName}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="department" label="委办局" width="120"></el-table-column>
                <el-table-column
                    prop="createTime"
                    :formatter="dateFormat"
                    label="创建时间"
                    width="120"
                ></el-table-column>
                <!-- <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button
                            @click="handleEditItem(scope.row);"
                            type="text"
                            size="small"
                        >编辑</el-button>
                        <el-button
                            @click="handleDeleteItem(scope.row)"
                            type="text"
                            size="small"
                        >删除</el-button>
                    </template>
                </el-table-column> -->
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
    </div>

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
import {
    listAll,
    saveItem,
    listDepartment,
    deleteItem,
    filterDateItem,
} from "@/api/item/index";
import { listApprovalItem } from "@/api/basicInfo/approval";
import axios from "../../api/config";
import dayjs from "dayjs";
import { parse } from "handlebars";
export default {
    name: "ItemManeger",
    data() {
        return {
            itemlist: [],
            tempItem: {},
            dialogVisible: false,
            departmentOptions: [],
            dateRange: "",
            pagesize: 10,
            currentPage: 1,
            totalCount: 0,
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            let result = await listApprovalItem();
            if (!result.success) {
                this.$message({ type: "warning", message: "获取初始数据失败" });
            }
            this.itemlist = result.data.records;
            this.totalCount = result.data.total;
            this.tableData = result.data.records;

            this.itemlist.sort((a, b) => {
                return dayjs(b.createTime) - dayjs(a.createTime);
            });
            console.log(this.itemlist);

            // let departments = await listDepartment();
            // this.departmentOptions = departments.data;
        },
        async saveItem() {
            let result = await saveItem(this.tempItem);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功 请重新筛选时间后查看数据" });
            this.filterDate();
        },
        async handleDeleteItem(v) {
            let message = "确定要删除" + v.name + "吗";
            if (confirm(message) == true) {
                let result = await deleteItem({ itemId: v.id });
                if (!result.success) return;
                this.$message({ type: "success", message: "删除成功" });
                this.filterDate();
            }
        },
        handleClickItem(item) {
            this.$store.commit("changeItem", item);
            this.$router.push({
                path: "/formconstructor",
                query: { itemId: item.approvalItemId },
            });
        },
        handleEditItem(item) {
            this.tempItem = item;
            this.dialogVisible = true;
        },
        dateFormat(row, column, cellValue, index) {
            const daterc = row[column.property];
            return dayjs(daterc).format("YYYY-MM-DD");
        },
        async filterDate() {
            console.log(this.dateRange);
            if (this.dateRange) {
                let params = {
                    startDate: this.dateRange[0],
                    endDate: this.dateRange[1],
                };
                let result = await listApprovalItem(params);
                if (!result.success) {
                    this.$message({
                        type: "warning",
                        message: "获取数据失败",
                        
                    });
                    this.itemlist = []
                    return
                }
                this.itemlist = result.data;
            } else {
                let result = await listApprovalItem();
                if (!result.success) {
                    this.$message({
                        type: "warning",
                        message: "获取数据失败",
                    });
                    this.itemlist = []
                    return
                }
                this.itemlist = result.data.records;
                this.totalCount = result.data.total;
                this.tableData = result.data.records;
            }
            this.itemlist.sort((a, b) => {
                return dayjs(b.createTime) - dayjs(a.createTime);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.item-manager {
    height: calc(100% - 75px);
    .tabs {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .main {
        width: 100%;
        height: calc(100vh - 206px);
        overflow-y: scroll;
        .item-table {
            padding: 0 !important;
        }
    }
}
</style>