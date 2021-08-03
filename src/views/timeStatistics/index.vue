<template>
    <div class="workWrap">
        <header>
            <span class="title">时间统计</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <div>
                    项目选择：
                    <el-select v-model="tempProjectId" placeholder="请选择项目名称" @change="selectProject">
                        <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                            :value="item.projectId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    事项名称：
                    <el-select v-model="approvalItemLordList" multiple collapse-tags filterable clearable
                        placeholder="请先选择项目，再选择事项名称（多选）" style="width: 280px">
                        <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                            :value="v.approvalItemLordId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    用户：
                    <el-select v-model="userIdList" multiple collapse-tags filterable clearable
                        placeholder="请选择用户名称（多选）" style="width: 200px">
                        <el-option v-for="(v,i) in userOptions" :key="i" :label="v.username" :value="v.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    页面分类：
                    <el-select v-model="routerConfClassifIdList" multiple collapse-tags filterable clearable
                        placeholder="筛选分类名称（多选）" style="width: 200px">
                        <el-option v-for="(v,i) in routerConfClassOptions" :key="i" :label="v.confClassif"
                            :value="v.routerConfClassifId">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    页面分组：
                    <el-select v-model="confGroup" filterable clearable placeholder="筛选页面分组" style="width: 180px">
                        <el-option v-for="(v,i) in confGroupOption" :key="i" :label="v.confGroup" :value="v.confGroup">
                        </el-option>
                    </el-select>
                </div>
                <div class="block">
                    <span class="demonstration">时间范围：</span>
                    <el-date-picker v-model="dataValue" type="daterange" align="right" unlink-panels range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-search" style="font-size: 14px" @click="searchData">搜索
                    </el-button>
                </div>
            </div>
            <div class="echarts-area">
                <div id="type" style="width: 600px;height:400px;"></div>
                <div id="group" style="width: 600px;height:400px;"></div>
            </div>
            <!-- <div class="sampleTable">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="100">
                    </el-table-column>
                    <el-table-column prop="projectName" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="itemName" label="事项名称">
                    </el-table-column>
                    <el-table-column prop="username" label="用户">
                    </el-table-column>
                    <el-table-column prop="statisticsDate" label="操作日期" :formatter="timeFormatter" sortable width="210">
                    </el-table-column>
                    <el-table-column prop="confClassif" label="页面名称">
                    </el-table-column>
                    <el-table-column prop="confGroup" label="页面分组">
                    </el-table-column>
                    <el-table-column prop="operatingTime" label="时长（单位 秒）">
                    </el-table-column>
                </el-table>
            </div> -->
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import dayjs from "dayjs";
import * as echarts from 'echarts';
import { mixin } from "@/mixin/mixin"

// 接口
// 项目\事项选项接口
import {
    listApprovalItem, listProjectAll
} from "@/api/basicInfo/approval";
import {
    listUserAllByRole, listRouterConfAndClassif, listRouterConfAndGroup, listOperatingItemTime
} from "@/api/timeConsume/time"



export default {
    mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            // 搜索区域
            tempProjectId: null,
            projectOptions: [],
            approvalItemLordList: [],
            typeSubItemOptions: [],
            userIdList: [],
            userOptions: [],
            routerConfClassifIdList: [],
            routerConfClassOptions: [],
            confGroup: null,
            confGroupOption: [],
            dataValue: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            // 表格区域
            tableData: [],
        }
    },
    async mounted() {
        await this.getOptions();
        await this.searchData();
    },
    methods: {
        async getOptions() {
            let resultProject = await listProjectAll();
            this.projectOptions = resultProject.data;
            let resUser = await listUserAllByRole();
            this.userOptions = resUser.data
            let resRouterClass = await listRouterConfAndClassif();
            this.routerConfClassOptions = resRouterClass.data;
            let resConfGroup = await listRouterConfAndGroup()
            this.confGroupOption = resConfGroup.data
        },
        async selectProject() {
            this.approvalItemLordList = [];
            let result = await listApprovalItem({ pageNum: 1, pageSize: 500, projectId: this.tempProjectId });
            this.typeSubItemOptions = result.data.records;
        },
        indexMethod(index) {
            return index + 1;
        },
        async searchData() {
            if (this.dataValue && this.dataValue[0].getTime() == this.dataValue[1].getTime()) {
                this.$message.warning('时间范围不能为同一天，请把结束时间延后一天')
                return
            }
            let params = {
                approvalItemLordList: this.approvalItemLordList,
                confGroup: this.confGroup,
                projectId: this.tempProjectId,
                routerConfClassifIdList: this.routerConfClassifIdList,
                userIdList: this.userIdList,
                startTime: this.dataValue ? this.dataValue[0] : null,
                endTime: this.dataValue ? this.dataValue[1] : null,
            }
            console.log('params')
            console.log(params)
            let res = await listOperatingItemTime(params)
            if (!res.success) return
            this.tableData = res.data.routerTiming
            let classif = res.data.confClassifTiming.map(item => {
                return {value: (item.value / 60).toFixed(1), name: item.name}
            })
            let group = res.data.confGroupTiming.map(item => {
                return {value: (item.value / 60).toFixed(1), name: item.name}
            })
            this.setCharts(classif, group)
        },
        setCharts(classif, group) {
            let myChart = echarts.init(document.getElementById('type'));
            // if (myChart != null && myChart != "" && myChart != undefined) {
            //     myChart.dispose();
            // }
            myChart.setOption({
                title: {
                    text: '页面分类',
                    subtext: '单位：分钟',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        data: classif,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
            let myCharttwo = echarts.init(document.getElementById('group'));
            // if (myCharttwo != null && myCharttwo != "" && myCharttwo != undefined) {
            //     myCharttwo.dispose();
            // }
            myCharttwo.setOption({
                title: {
                    text: '页面分组',
                    subtext: '单位：分钟',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        data: group,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
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
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin-left: 20px;
        div {
            margin: 5px 10px;
        }
    }
    .echarts-area {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin: 20px;
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
}
</style>