<template>
    <div class="datum-content">
        <div class="title">
            项目资料导出
        </div>
        <div class="line">
            <div class="line-item">
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in parjectList" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </div>
            <div class="line-item">
                <span>
                    选择导出的数据
                </span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="success" @click="dowoload()">下载</el-button>
        </div>
        <div class="title">
            事项资料导出
        </div>
        <div class="search-list">
            <el-input placeholder="请搜素项目" v-model="params.projectName" clearable @change="init()">
            </el-input>
            <el-input placeholder="请搜索事项" v-model="params.itemName" clearable @change="init()">
            </el-input>
            <el-select placeholder="筛选开发阶段" v-model="params.itemStage" clearable @change="init()">
                <el-option value="开发中" label="开发中"></el-option>
                <el-option value="提测" label="提测"></el-option>
                <el-option value="验收" label="验收"></el-option>
                <el-option value="停用" label="停用"></el-option>
                <el-option value="demo" label="demo"></el-option>
            </el-select>
            <el-input placeholder="搜索标签" v-model="params.itemLabel" clearable @change="init()">
            </el-input>
            <el-button type="success" @click="search()">搜索</el-button>
            <div class="line-item">
                <span>
                    选择导出的数据
                </span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="success" @click="dowoload()">下载</el-button>
        </div>

        <el-table ref="multipleTables" :data="tableList" border style="width: 100%"
            @selection-change="handleSelectionChange" :row-key="getRowKeys" tooltip-effect="dark"
            @clearSelection="clearSelectionList">
            <el-table-column type="selection" width="50" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="projectName" label="项目名" width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="itemName" label="事项名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="itemStage" label="开发阶段" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="projectLabelNameList" label="标签" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>
                        {{scope.row.projectLabelNameList}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <Pagination v-show="total>0" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize"
            @pagination="init()" style="float:right" />

    </div>
</template>

<script>
import {
    apilistAllApprovalItem, listProjectAll
} from "@/api/basicInfo/approval";
import Pagination from "@/components/Pagintion.vue";
export default {
    name: 'Datum',
    data() {
        return {
            options: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            value: '',
            params: {
                itemLabel: "",
                itemName: "",
                itemStage: "",
                pageNum: 1,
                pageSize: 10,
                projectName: ""
            },
            tableList: [],
            total: null,
            parjectList: []
        }
    },
    components: {
        Pagination,
    },
    computed: {

    },
    created() {
        this.init();
        this.getListProjectAll();
    },
    methods: {
        async getListProjectAll() {
            const result = await listProjectAll();
            if (result.code === 200) {
                console.log(result);
                this.parjectList = result.data;
            } else {
                this.$message.error(result.msg)
            }
        },
        async init() {
            const result = await apilistAllApprovalItem(this.params);
            if (result.code === 200) {
                this.tableList = result.data.records;
                this.total = result.data.total;
            } else {
                this.$message.error(result.msg);
            }
        },
        getRowKeys(row) {
            return row.approvalItemLordId
        },
        handleSelectionChange() {

        },
        clearSelectionList() {

        },
        async download() {
            const result = await aa()
        }
    }
}
</script>

<style scoped lang="scss">
.datum-content {
    padding: 30px;
    .title {
        margin-bottom: 15px;
    }
    .line {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .line-item {
            display: flex;
            > span {
                font-size: 16px;
                color: #606266;
                padding-right: 15px;
            }
            /deep/.el-input {
                width: 200px;
                margin-right: 20px;
            }
        }
    }
    .search-list {
        width: 100%;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        /deep/.el-input {
            width: 200px;
            margin-right: 20px;
        }
        .line-item {
            margin-left: 20px;
            > span {
                font-size: 16px;
                color: #606266;
                padding-right: 15px;
            }
        }
    }
}
</style>