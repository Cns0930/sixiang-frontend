<template>
    <div class="datum-content">
        <div class="title">
            项目资料导出
        </div>
        <div class="line">
            <div class="line-item">
                <el-select v-model="materParams.idList" placeholder="请选择" multiple clearable>
                    <el-option v-for="item in parjectList" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
            </div>
            <div class="line-item">
                <span>
                    选择导出的数据
                </span>
                <el-select v-model="materParams.featureDataList" placeholder="请选择" multiple clearable>
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
                <el-select v-model="matterParams.featureDataList" placeholder="请选择" multiple clearable>
                    <el-option v-for="item in materials" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="success" @click="matterDownload()">下载</el-button>
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
import { batchDownload } from "@/utils/download"
export default {
    name: 'Datum',
    data() {
        return {
            options: [
                {
                    label: "公共一级材料信息",
                    value: 1
                },
                {
                    label: "公共二级材料信息",
                    value: 2
                }
            ],
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
            parjectList: [],
            materials: [
                {
                    label: "一级材料信息",
                    value: 1
                },
                {
                    label: "情形信息",
                    value: 2
                },
                {
                    label: "二级材料信息",
                    value: 3
                },
                {
                    label: "材料字段信息",
                    value: 4
                },
                {
                    label: "审批规则",
                    value: 5
                }
            ],
            // 项目资料导出入参
            materParams: {
                featureDataList: [],
                idList: [],
            },
            // 事项资料导出入参
            matterParams: {
                featureDataList: [
                ],
                idList: [
                ]
            },
            multipleSelection: []

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
        handleSelectionChange(val) {
            this.matterParams.idList = val.map(item => {
                return item.projectId
            });
        },
        clearSelectionList() {
            this.$refs.multipleTables.clearSelection();
        },
        async dowoload() {
            if (this.materParams.featureDataList.length === 0 || this.materParams.idList.length === 0) {
                this.$message.warning("请选择要下载的数据");
                return
            }
            await batchDownload(this.materParams, '/ss/Import/downloadGlobalMaterialData');
            this.materParams.featureDataList = [];
            this.materParams.idList = [];
        },
        async matterDownload() {
            if (this.matterParams.featureDataList.length === 0 || this.matterParams.idList.length === 0) {
                this.$message.warning("请选择要下载的数据");
                return
            }
            await batchDownload(this.matterParams, '/ss/Import/downloadFeatureData');
            this.matterParams.featureDataList = [];
            this.matterParams.idList = [];
            this.clearSelectionList();
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