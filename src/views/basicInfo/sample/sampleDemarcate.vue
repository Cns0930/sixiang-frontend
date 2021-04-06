<template>
    <div class="workWrap">
        <header>
            <span class="title">样本标定</span>
        </header>
        <div class="workBox">
            <el-row :gutter="30" class="datatrend-body-items">
                <div class="datatrend-body-items-box">
                    <el-col :sm="24" :lg="6">
                        <div class="datatrend-body-item">
                            <div class="case-content">
                                <div class="case-header">
                                    <div class="case-header-left">材料选择</div>
                                </div>
                                <div class="case-rows">
                                    <div class="history-navigation">
                                        <div v-for="file in filePathQueue" :key="file.path" class="textName">
                                            <i :class="[file.path === '/' ? 'el-icon-s-home' : 'el-icon-folder']"></i>
                                            <span style="cursor: pointer; margin-right: 10px;"
                                                @click="goBefore(file)">{{file.name}} / </span>
                                        </div>
                                    </div>
                                    <div class="sampleTable">
                                        <el-table ref="fileTable" :data="tableData" tooltip-effect="dark"
                                            highlight-current-row style="width: 100%"
                                            :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:800}"
                                            :row-style="{fontSize:'15px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                                            <el-table-column label="文件名" min-width="60%">
                                                <template slot-scope="scope">
                                                    <i
                                                        :class="[scope.row.isdir ? 'el-icon-folder-opened' : 'el-icon-picture-outline']"></i>
                                                    <el-button type="text" style="font-size: 16px"
                                                        @click="changeFileTable(scope.row)">
                                                        {{ scope.row.fileName }}</el-button>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="name" label="标定信息" min-width="40%">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.documentsubSeq" style="color: green">
                                                        <i class="el-icon-check"></i>
                                                        {{ ' ' + scope.row.documentsubSeq + ' - ' + scope.row.documentsubDisplayname }}
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :sm="24" :lg="11">
                        <div class="datatrend-body-item-mid">
                            <div class="case-content">
                                <div class="case-header">
                                    <div class="case-header-left">图片预览</div>
                                    <div v-show="this.imgName" class="case-header-right">
                                        <el-button icon="el-icon-minus" @click="sizeDown" circle></el-button>
                                        <el-button icon="el-icon-plus" @click="sizeUp" circle></el-button>
                                        <el-button round @click="imgOpen">打开图片</el-button>
                                    </div>
                                </div>
                                <div class="case-rows">
                                    <span>{{ this.imgName ? this.imgName : '请在左侧选择图片文件' }}</span>
                                    <img :src="valueUrl" :alt="imgName" :width="imgWidth" />
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :sm="24" :lg="7">
                        <div class="datatrend-body-item-rgt">
                            <div class="case-content">
                                <div class="case-header">
                                    <div class="case-header-left">标定</div>
                                </div>
                                <div class="case-rows">
                                    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 95%">
                                        <el-tab-pane label="情形标定" name="first">
                                            <div>
                                                <span>请选择情形：</span>
                                                <div style="margin-top: 10px">
                                                    <el-select v-model="approvalSubIds" multiple filterable
                                                        placeholder="请选择标定情形" style="width: 100%"
                                                        @change="setApprovalSubIds">
                                                        <el-option v-for="item in approvalSubList"
                                                            :key="item.approvalSubitemId" :label="item.subitemName"
                                                            :value="item.approvalSubitemId">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                        <el-tab-pane label="图片分类" name="second">
                                            <div>
                                                <div v-show="!this.imgName"
                                                    style="background: #EAF0FF; height: 60px; border-radius: 10px">
                                                    <p style="padding: 20px"><i class="el-icon-warning"></i> 请进入到具体 case
                                                        目录下,点击图片名称预览</p>
                                                </div>
                                                <span>请选择图片分类：</span>
                                                <div style="margin-top: 10px">
                                                    <el-select v-model="imgClass" :disabled="!this.imgName" filterable
                                                        placeholder="请选择图片分类" style="width: 100%" @change="setImgClass">
                                                        <el-option v-for="item in imgClassList"
                                                            :key="item.documentsubSeq"
                                                            :label="item.documentsubSeq + ' : ' + item.documentsubDisplayname"
                                                            :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                            </div>

                                        </el-tab-pane>
                                        <el-tab-pane label="结果标定" name="third" class="resultCase">
                                            <div>
                                                <div v-show="!this.imgName"
                                                    style="background: #EAF0FF; height: 60px; border-radius: 10px">
                                                    <p style="padding: 20px"><i class="el-icon-warning"></i> 请进入到具体 case
                                                        目录下,先选择图片</p>
                                                </div>
                                                <span>请选择规则：</span>
                                                <div style="margin-top: 10px">
                                                    <el-select v-model="ruleClass" :disabled="!this.imgName" filterable
                                                        placeholder="请选择规则" style="width: 100%" @change="setRuleClass">
                                                        <el-option v-for="item in ruleClassList" :key="item.ruleId"
                                                            :label="item.ruleCode + ' : ' + item.rulePoint"
                                                            :value="item.ruleId">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                                <div>判断方式：
                                                    <span
                                                        style="color: #696969; font-weight: bold;">{{ ruleInfo.ruleType }}</span>
                                                </div>
                                                <div>对比材料：</div>
                                                <div class="resultTable">
                                                    <el-table ref="resultTable" :data="tableDataResult"
                                                        tooltip-effect="dark" highlight-current-row border
                                                        style="width: 100%"
                                                        :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:800}"
                                                        :row-style="{fontSize:'15px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                                                        <el-table-column prop="材料编号" label="材料编号" min-width="40%">
                                                        </el-table-column>
                                                        <el-table-column prop="字段名" label="字段名" min-width="60%">
                                                        </el-table-column>
                                                    </el-table>
                                                </div>
                                                <div>请选择判定结果：</div>
                                                <div style="margin-top: 10px">
                                                    <el-select v-model="ruleResult" :disabled="!this.imgName" filterable
                                                        placeholder="请选择判定结果" style="width: 100%"
                                                        @change="setRuleResult">
                                                        <el-option value="R" label="R : 正确"></el-option>
                                                        <el-option value="W" label="W : 错误"></el-option>
                                                        <el-option value="F" label="F : 置信度低，需要人工判断"></el-option>
                                                    </el-select>
                                                </div>
                                                <div v-show="tipInfo !== ''"
                                                    style="width: 100%; word-wrap: break-word;white-space:normal">提示信息：
                                                    <div
                                                        style="width: 90%; color: #696969; font-weight: bold; margin: 20px;text-indent:2em">
                                                        {{ tipInfo }}</div>
                                                    <span style="font-size: 13px">上次更新时间：{{ lastUpdateTime }}</span>
                                                </div>
                                                <div>Tag：
                                                    <el-button type="text" style="font-size: 16px">设置</el-button>
                                                </div>
                                                <div>
                                                    <el-button-group style="margin-left: 30%">
                                                        <el-button type="primary" icon="el-icon-arrow-left" :disabled="goBeforeDisable" @click="goBeforeOne">上一个
                                                        </el-button>
                                                        <el-button type="primary" :disabled="goNextDisable" @click="goNext">下一个<i
                                                                class="el-icon-arrow-right el-icon--right"></i>
                                                        </el-button>
                                                    </el-button-group>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                        <el-tab-pane label="真值标定" name="fourth" disabled>定时任务补偿

                                        </el-tab-pane>
                                    </el-tabs>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
        <div class="workHandleBox">
        </div>

    </div>
</template>

<script>
import axios from 'axios'
import Vue from "vue";
import { mixin } from "@/mixin/mixin"
import { mapGetters, mapState } from "vuex"
import state from '@/vuex/home/state';
import dayjs from "dayjs";
// 接口
import { getFileList } from "@/api/basicInfo/sample/document"
import {
    addSampleResultSort, listSubitemNameByItemId, addSampleResultSubitem, listRuleAll,
    getResultRule, updateSampleResultRule
} from "@/api/basicInfo/sample/demarcate"
import { listDocumentSubByItemId } from "@/api/basicInfo/ApprovalRules"
import { listApprovalSubAll } from "@/api/basicInfo/approvalSub"

export default {
    name: "SampleDemarcate",
    mixins: [mixin],
    data() {
        return {
            // 初始数据
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 文件表格相关
            tableData: [],
            filePath: this.$route.query.filePath ? this.$route.query.filePath : '/',
            filePathQueue: this.$route.query.filePathQueue ? JSON.parse(this.$route.query.filePathQueue) : [{ path: '/', name: '根目录', index: 0 }],
            // 图片预览相关
            valueUrl: null,
            imgName: '',
            imgWidth: '100%',
            // 标定相关
            activeName: 'first',
            approvalSubIds: [],
            approvalSubList: [],
            imgClass: null,
            imgClassList: [],
            rowInfo: {},
            //  结果标定
            ruleClass: null,
            ruleClassList: [],
            tableDataResult: [],
            ruleResult: '',
            ruleInfo: {},
            lastUpdateTime: '',
            goBeforeDisable: false,
            goNextDisable: false
        }
    },
    computed: {
        ...mapGetters({
            // itemInfo: 'itemInfo'
        }),
        ...mapState({
            itemInfo: state => state.home.item
        }),
        tipInfo() {
            if (this.ruleResult === 'R') {
                if(!this.ruleInfo.ruleTips) {
                    return '';
                }
                return this.ruleInfo.ruleTips[0];
            } else if (this.ruleResult === 'W') {
                if(!this.ruleInfo.ruleTips) {
                    return '';
                }
                return this.ruleInfo.ruleTips[1];
            } else if (this.ruleResult === 'F') {
                if(!this.ruleInfo.ruleTips) {
                    return '';
                }
                return this.ruleInfo.ruleTips[2];
            } else {
                return '';
            }
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getFileListTable();
        await this.getImgClassList();
        await this.getApprovalSubAll();
    },
    methods: {
        // 获取文件列表数据&当前路径的样本的情形标注情况
        async getFileListTable() {
            let result = await getFileList({ approvalItemId: this.itemId, dir: this.filePath });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取文件列表信息失败" });
                return;
            }
            this.tableData = result.data;
            this.getApprovalSubIds();
        },
        // 获取之前的情形标注结果 
        async getApprovalSubIds() {
            let resultSub = await listSubitemNameByItemId({ approvalItemId: this.itemId, path: this.filePath });
            if (!resultSub.success) {
                this.$message({ type: "warning", message: "该样本标定结果查询失败" });
                return;
            }
            this.approvalSubIds = resultSub.data;
        },
        // 获取图片分类下拉选项
        async getImgClassList() {
            let result = await listDocumentSubByItemId({ approvalItemId: this.itemId });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取图片分类列表信息失败" });
                return;
            }
            this.imgClassList = result.data;
            console.log('this.imgClassList', this.imgClassList);
        },
        // 获取情形标定下拉框选项
        async getApprovalSubAll() {
            let result = await listApprovalSubAll({ approvalItemId: this.itemId });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取情形标注列表信息失败" });
                return;
            }
            this.approvalSubList = result.data;
            console.log('this.approvalSubList', this.approvalSubList);
        },
        // 获取规则列表
        async getRuleClassList() {
            let result = await listRuleAll({ approvalItemId: Number(this.itemId), subitemIds: this.approvalSubIds });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取规则列表信息失败" });
                return;
            }
            if(result.data.length === 0) {
                return;
            }
            this.ruleClassList = result.data;
            this.ruleInfo = this.ruleClassList[0];
            this.goBeforeDisable = true;
            console.log('this.ruleInfo', this.ruleInfo)
            this.ruleClass = this.ruleInfo.ruleId;
            this.tableDataResult = this.ruleInfo.ruleInputs;
            console.log('this.approvalSubList', this.ruleClassList);
            // 查询标注结果
            this.getRuleClass();

        },
        // 改变文件目录列表
        async changeFileTable(row) {
            console.log('row', row);
            this.rowInfo = row;
            if (!row.isdir && row.fileId) {
                this.valueUrl = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${row.fileId}`
                this.imgName = row.fileName;
                this.imgClass = row.approvalItemAndDocumentsubId;
                // 获取规则列表
                // this.getRuleClassList();
                return;
            }
            this.valueUrl = null;
            this.imgName = '';
            this.imgClass = '';
            this.filePath = row.filePath;
            this.filePathQueue.push({ path: row.filePath, name: row.fileName, index: this.filePathQueue.length });
            // console.log('this.filePathQueue');
            // console.log(this.filePathQueue);
            this.getFileListTable();
        },
        // 导航回跳
        goBefore(file) {
            // console.log('file');
            // console.log(file);
            this.valueUrl = null;
            this.imgName = '';
            this.filePath = file.path;
            this.filePathQueue = this.filePathQueue.filter(i => i.index <= file.index);
            this.getFileListTable();
        },
        // 图片放大/缩小/打开操作
        sizeUp() {
            this.imgWidth = '150%';
        },
        sizeDown() {
            this.imgWidth = '100%';
        },
        imgOpen() {
            const a = document.createElement("a");
            a.href = this.valueUrl
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        // 标定相关
        handleClick(prop) {
            // console.log('name', prop);
            if (this.activeName === 'first') {
                return;
            } else if (this.activeName === 'third') {
                this.getRuleClassList();
            }
        },
        // 图片分类标定，不刷新table
        async setImgClass() {
            console.log('this.imgClass');
            console.log(this.imgClass);
            let result = await addSampleResultSort({ documentId: this.rowInfo.id, approvalItemAndDocumentsubId: this.imgClass });
            if (!result.success) {
                this.$message({ type: "warning", message: "图片分类失败" });
                return;
            }
            // this.getFileListTable();
            this.imgClassList.forEach(item => {
                if (item.id === this.imgClass) {
                    this.$set(this.rowInfo, 'approvalItemAndDocumentsubId', this.imgClass);
                    this.$set(this.rowInfo, 'globalDocumentSubName', item.globalDocumentSubName);
                    this.$set(this.rowInfo, 'documentsubSeq', item.documentsubSeq);
                    return;
                }
            })
        },
        async setApprovalSubIds() {
            console.log('this.approvalSubIds');
            console.log(this.approvalSubIds);
            let result = await addSampleResultSubitem({ approvalItemId: this.itemId, path: this.filePath, subitemIds: this.approvalSubIds });
            if (!result.success) {
                // this.$message({ type: "warning", message: "该样本标定情形失败" });
                return;
            }
        },
        async setRuleClass() {
            console.log('this.ruleClass', this.ruleClass)
            this.ruleClassList.forEach(item => {
                if (item.ruleId === this.ruleClass) {
                    console.log('this.ruleInfo in', this.ruleInfo)
                    console.log('item', item)
                    this.ruleInfo = item; // 触发计算属性,要保证能走通计算过程;
                    this.tableDataResult = this.ruleInfo.ruleInputs;
                }
            })
            console.log('this.ruleInfo Set', this.ruleInfo)
            this.getRuleClass();
        },
        // 获取之前的规则标注结果 
        async getRuleClass() {
            let result = await getResultRule({ ruleId: this.ruleClass, sampleId: this.rowInfo.sampleId });
            if (!result.success) {
                this.$message({ type: "warning", message: "该样本规则结果查询失败" });
                return;
            }
            console.log('result');
            console.log(result);
            if (result.data === null) {
                this.ruleResult = '';
                this.lastUpdateTime = '';
            } else {
                this.ruleResult = result.data.resultlabeled;
                this.lastUpdateTime = dayjs(result.data.updateTime).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        // 标定规则结果
        async setRuleResult() {
            let request = {
                approvalItemId: Number(this.itemId),
                resultlabeled: this.ruleResult,
                ruleId: this.ruleClass,
                sampleId: this.rowInfo.sampleId
            }
            let result = await updateSampleResultRule(request);
            if (!result.success) {
                this.$message({ type: "warning", message: "该样本标定规则结果失败" });
                return;
            }
            console.log('result change');
            console.log(result);
        },
        // 按钮上一个、下一个
        goBeforeOne() {
            let index = this.ruleClassList.indexOf(this.ruleInfo);
            console.log('index be');
            console.log(index);
            this.goNextDisable = false;
            if (index - 1 >= 0) {
                this.ruleClass = this.ruleClassList[index-1].ruleId;
                this.setRuleClass();
            } else {
                this.goBeforeDisable = true;
            }
            if (index - 1 === 0) {
                this.goBeforeDisable = true;
            }
        },
        goNext() {
            let index = this.ruleClassList.indexOf(this.ruleInfo);
            console.log('index Ne');
            console.log(index);
            this.goBeforeDisable = false;
            if (index + 1 < this.ruleClassList.length ) {
                this.ruleClass = this.ruleClassList[index+1].ruleId;
                this.setRuleClass();
            } else {
                this.goNextDisable = true;
            }
            if (index + 1 === this.ruleClassList.length -1) {
                this.goNextDisable = true;
            }
        }
    },

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
            // font-size: 20px;
            margin-right: 20px;
        }
    }
    .workBox {
        width: 100%;
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
        .datatrend-body-items {
            width: 100%;
            padding-bottom: 25px;
            .datatrend-body-items-box {
                // margin: 25px 20px 25px 30px;
                .datatrend-body-item {
                    border: thin #f7f3f3 solid;
                    box-shadow: 1px 1px 3px #e2dddd;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row;
                    align-items: flex-start;
                    justify-content: center;
                    width: 100%;
                    height: 725px;
                    background: #ffffff;
                    // margin-bottom: 10px;
                    .case-content {
                        margin-top: 20px;
                        // background: rgb(169, 240, 240);
                        display: flex;
                        flex-direction: column;
                        // align-items: center;
                        // justify-content: center;
                        width: 95%;
                        height: 100%;
                        color: #7a7a7a;
                        .case-header {
                            // background: rgb(169, 240, 240);
                            width: 100%;
                            height: 3.8%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: flex-start;
                            border-bottom: 2px solid #f0f3f7;
                            .case-header-left {
                                margin-left: 12px;
                                margin-bottom: 10px;
                                font-weight: bold;
                                width: 100%;
                                padding-left: 10px;
                                border-left: 4px solid #6389e7;
                            }
                        }
                        .case-rows {
                            width: 100%;
                            height: 90%;
                            overflow-y: auto;
                            white-space: nowrap;
                            // background: rgb(245, 240, 244);
                            display: flex;
                            flex-direction: column;
                            // align-items: center;
                            margin-top: 18px;
                            .history-navigation {
                                margin: 0px 15px;
                                display: flex;
                                align-items: row;
                                flex-direction: column;
                                justify-content: flex-start;
                                .textName:hover {
                                    color: #f5527a;
                                }
                            }
                            .sampleTable {
                                margin-top: 20px;
                            }
                        }
                    }
                }
                .datatrend-body-item-mid {
                    border: thin #f7f3f3 solid;
                    box-shadow: 1px 1px 3px #e2dddd;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row;
                    align-items: flex-start;
                    justify-content: center;
                    width: 100%;
                    height: 725px;
                    // background: #f57979;
                    // margin-bottom: 10px;
                    .case-content {
                        margin-top: 20px;
                        // background: rgb(169, 240, 240);
                        display: flex;
                        flex-direction: column;
                        // align-items: center;
                        // justify-content: center;
                        width: 98%;
                        height: 100%;
                        color: #7a7a7a;
                        .case-header {
                            // background: rgb(169, 240, 240);
                            width: 100%;
                            height: 3.8%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: flex-start;
                            border-bottom: 2px solid #f0f3f7;
                            .case-header-left {
                                // background: rgb(189, 240, 169);
                                margin-left: 15px;
                                margin-bottom: 10px;
                                font-weight: bold;
                                // width: 75%;
                                padding-left: 10px;
                                border-left: 4px solid #6389e7;
                            }
                            .case-header-right {
                                // background: rgb(169, 240, 240);
                                float: right;
                                margin-left: 50%;
                                margin-bottom: 10px;
                                font-weight: bold;
                                width: 200px;
                                padding-left: 10px;
                            }
                        }
                        .case-rows {
                            width: 100%;
                            height: 90%;
                            overflow-y: auto;
                            white-space: nowrap;
                            // background: rgb(245, 240, 244);
                            display: flex;
                            flex-direction: column;
                            // align-items: center;
                            margin-top: 18px;
                            span {
                                margin-left: 20px;
                            }
                        }
                    }
                }
                .datatrend-body-item-rgt {
                    border: thin #f7f3f3 solid;
                    box-shadow: 1px 1px 3px #e2dddd;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row;
                    align-items: flex-start;
                    justify-content: center;
                    width: 100%;
                    height: 725px;
                    background: #ffffff;
                    // margin-bottom: 10px;
                    .case-content {
                        margin-top: 20px;
                        // background: rgb(169, 240, 240);
                        display: flex;
                        flex-direction: column;
                        // align-items: center;
                        // justify-content: center;
                        width: 95%;
                        height: 100%;
                        color: #7a7a7a;
                        .case-header {
                            // background: rgb(169, 240, 240);
                            width: 100%;
                            height: 3.8%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: flex-start;
                            border-bottom: 2px solid #f0f3f7;
                            .case-header-left {
                                margin-left: 12px;
                                margin-bottom: 10px;
                                font-weight: bold;
                                width: 100%;
                                padding-left: 10px;
                                border-left: 4px solid #6389e7;
                            }
                        }
                        .case-rows {
                            width: 100%;
                            height: 90%;
                            overflow-y: auto;
                            white-space: nowrap;
                            // background: rgb(245, 240, 244);
                            display: flex;
                            flex-direction: column;
                            // align-items: center;
                            margin-top: 18px;
                            .resultCase {
                                div {
                                    margin: 10px 0px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .workHandleBox {
        display: flex;
        // align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        // flex-wrap: wrap;
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
}
</style>