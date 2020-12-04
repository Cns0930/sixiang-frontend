<template>
    <div class="workWrap">
        <header>已选事项
        </header>
        <section class="workBox">
            <div class="searchBox">
                <el-tag  size="medium" style="margin-top:10px" v-for="item in tagList" :key="item.itemNo">{{item.itemName}}</el-tag>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}" >>
                   
                    <el-table-column type="selection" width="70"></el-table-column>
                    <el-table-column prop="projectName" label="fieldNo" sortable >
                    </el-table-column>
                    <el-table-column prop="approvalName" label="组件名" show-overflow-tooltip sortable>
                    </el-table-column>
                    <!-- <el-table-column prop="itemInternalNo" label="内部事项编号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemNo" label="事项编号" show-overflow-tooltip>
                    </el-table-column> -->
                    <!-- <el-table-column label="事项名称"  show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="handleClickItemDefault(scope.row)" type="text" style="color: orange;">
                                {{scope.row.itemName}}
                            </el-button>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="itemType" label="事项类型" >
                    </el-table-column>
                    <el-table-column prop="itemCode" label="事项实施编码"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createBy" label="创建人" >
                    </el-table-column>
                    <el-table-column prop="itemStatus" label="状态" sortable  width="50">
                    </el-table-column> -->
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable >
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <el-button-group>
                                <!-- <el-button size="mini" @click="handleClickItem(scope.row)">
                                    调研信息
                                </el-button> -->
                                <el-button size="mini" @click="lookFor(scope.$index,scope.row)">
                                    查看
                                </el-button>
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
                                    编辑
                                </el-button>
                                <!-- <el-button size="mini" type="danger" @click="handleClose(scope.row)"
                                    :disabled="!hasManagePermission">
                                    关闭
                                </el-button> -->
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div> -->
        </section>
    </div>
</template>



<script>

import {mixin} from "@/mixin/mixin"
import Vue from "vue";

import {mapGetters} from "vuex"
import {
    listApprovalAll,
    listProjectAll,
    addApprovalItem,
    updateApprovalItem,
    getByApprovalItemId,
    shutApprovalItem,
    listApprovalItem,
} from "../../api/basicInfo/approval";
import {listEqualFields} from "../../api/basicInfo/allEdit";
export default {
    name: "changeEdit",
    mixins: [mixin],
    data() {
        return {
            // 页面信息
            type: "work",
            tagList:Object.values(this.$route.query),
            // 筛选
            filterProjectId: null,
            filterApprovalId: null,
            filterKeyword: "",
            timeRange: [],
            // 表格
            tableData: [],
            // 弹窗
            dialogAddVisible: false,
            dialogUpdateVisible: false,
            tempItem: {},
            projectOptions: [],
            approvalOptions: [],
            currentPage: 1,
            pagesize: 15,
            totalCount: 0,
            multipleSelection: []
        };
    },
    computed: {
         ...mapGetters({hasManagePermission:'config/hasManagePermission'}),
        //  tagList() {
        //     return Object.values(this.$route.query)
        //  }
    },
    async created() {
        // await this.searchItem();
        // await this.loadOptions();
        
        // let itemInfo = this.$store.state.home.item;
        // itemInfo.approvalItemId = null;
        // itemInfo.itemName = null;
        // itemInfo.itemNo = null;
        // this.$store.commit("changeItem", itemInfo);
        // sessionStorage.removeItem('itemInfo');
        await this.getTable()
    },
    methods: {
        // inputs(val) {
        //   console.log(this.model);
        // },
        async getTable() {
            let params = this.tagList.map(ele=>ele.approvalItemId)
            console.log(params)
            const res = await listEqualFields(params)
            console.log(res)
            let fieldSameList = []
            if(!res.success) return;
            let resultList = data.reduce((acc,cur) => {
                if(!fieldSameList.includes(cur.fieldNo)) {
                    fieldSameList.push(cur.fieldNo);
                    cur.ids = [];
                    cur.ids.push(cur.id)
                    acc.push(cur);
                } else {
                    let fieldIndex = fieldSameList.findIndex(v => v == cur.fieldNo);
                    acc[fieldIndex].ids.push(cur.id)
                }
                return acc
            },[])
            console.log(resultList)
        },
        getTime(val) {
            console.log(val);
        },
        handleEdit(index,item) {
            console.log(index,item)
        },
        lookFor(index,item) {
            console.log(index,item)
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
        flex-wrap: wrap;
        background: #fff;
        & > * {
            margin-left: 10px;
        }
        .handle {
            margin-left: auto;
            // margin-top: -55px;
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
