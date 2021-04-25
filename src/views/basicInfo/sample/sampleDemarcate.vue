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
                                    <vueCropper v-if="activeName === 'fourth'" ref="cropper" :img="valueUrl"
                                        :autoCrop="true" dragMode="crop" :outputSize="Number(1)" :canMove="false"
                                        :full="true" :fixedBox="false" :canScale="false"></vueCropper>
                                    <img v-else :src="valueUrl" :alt="imgName" :width="imgWidth" />
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
                                                            :key="item.globalDocumentSubId"
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
                                                            :label="item.ruleCode + ' : ' + item.rulePoint + ' - ' + item.resultlabeled"
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
                                                        <el-button type="primary" icon="el-icon-arrow-left"
                                                            :disabled="goBeforeDisable" @click="goBeforeOne">上一个
                                                        </el-button>
                                                        <el-button type="primary" :disabled="goNextDisable"
                                                            @click="goNext">下一个<i
                                                                class="el-icon-arrow-right el-icon--right"></i>
                                                        </el-button>
                                                    </el-button-group>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                        <el-tab-pane label="真值标定" name="fourth" class="truth">
                                            <span>
                                                <el-button type="plain" @click="showRectangles()"
                                                    style="margin-left: 10px;" round>显示坐标框图</el-button>
                                                <el-button type="plain" @click="importTruthData(sampleTruthTable)"
                                                    style="margin-left: 10px;" round>一键导入最新提取结果</el-button>
                                            </span>
                                            <span v-show="imgUrl" class="truth-table">截取展示:</span>
                                            <img :src="imgUrl" alt="" width="100%">
                                            <div class="truth-table">
                                                <span>图片分类：</span>
                                                <span
                                                    style="color: green">{{ ' ' + rowInfo.documentsubSeq + ' - ' + rowInfo.documentsubDisplayname }}</span>
                                                <div v-for="item in sampleTruthTable" :key="item.fieldId">
                                                    <span
                                                        style="font-size: 18px;line-height: 50px;">{{item.fieldName + ' : '}}</span>
                                                    <div class="truth-table-item">
                                                        <div style="display: flex; flex-direction: row;">
                                                            <span style="width: 40px;">值:</span>
                                                            <el-input v-model="item.fieldContent" clearable
                                                                style="width: 200px;" />
                                                            <el-button type="plain" @click="getCropData(item)"
                                                                style="margin-left: 10px;">智能填入</el-button>
                                                        </div>
                                                        <div
                                                            style="display: flex; flex-direction: row;  margin-top: 10px;">
                                                            <span style="width: 40px;">坐标:</span>
                                                            <el-input v-model="item.fieldLocation" clearable disabled
                                                                style="width: 200px;" />
                                                            <el-button type="primary" @click="updateTruthData(item)"
                                                                style="margin-left: 10px;">保存真值</el-button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <span>
                                                <el-button type="plain" @click="clearData(sampleTruthTable)"
                                                    style="margin-left: 10px;" round>一键清空</el-button>
                                                <span>
                                                    <el-popover placement="bottom" title="注释" width="200"
                                                        trigger="click"
                                                        content="一键导入和一键清空只更改当前页面数据，均未保存到云端，请点击“保存真值”来保存修改。">
                                                        <el-button slot="reference" type="text" size="medium" round><i
                                                                class="el-icon-info" style="font-size: 18px;" />
                                                        </el-button>
                                                    </el-popover>
                                                </span>
                                            </span>
                                        </el-tab-pane>
                                    </el-tabs>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </div>
            </el-row>
        </div>
        <el-dialog title="坐标展示图" :visible.sync="showPosition" width="80%" :destroy-on-close="true">
            <canvas id="canvas" :width="rowInfo.width" :height="rowInfo.height"
                style="width: 100%;">你的浏览器不支持canvas，建议使用Chrome浏览器。</canvas>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showPosition = false">关 闭</el-button>
            </span>
        </el-dialog>
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
import { VueCropper } from "vue-cropper";
// 接口
import { getFileList } from "@/api/basicInfo/sample/document"
import {
    addSampleResultSort, listSubitemNameByItemId, addSampleResultSubitem, listRuleAll,
    getResultRule, updateSampleResultRule, getSampleResultFieldByDocumentId, importSampleResultFieldByDocumentId,
    addSampleResultField
} from "@/api/basicInfo/sample/demarcate"
import { listDocumentSubByItemId } from "@/api/basicInfo/ApprovalRules"
import { listApprovalSubAll } from "@/api/basicInfo/approvalSub"

export default {
    name: "SampleDemarcate",
    mixins: [mixin],
    components: { VueCropper },
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
            goNextDisable: false,
            sampleId: null,
            // 真值标定
            previews: {
                url: '',
                img: ''
            },
            imgUrl: null,
            imgTrueSize: {
                width: 0,
                height: 0
            },
            coordinate: [],
            sampleTruthTable: [],
            showPosition: false,
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
                if (!this.ruleInfo.ruleTips) {
                    return '';
                }
                return this.ruleInfo.ruleTips[0];
            } else if (this.ruleResult === 'W') {
                if (!this.ruleInfo.ruleTips) {
                    return '';
                }
                return this.ruleInfo.ruleTips[1];
            } else if (this.ruleResult === 'F') {
                if (!this.ruleInfo.ruleTips) {
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
            let result = await listRuleAll({ approvalItemId: Number(this.itemId), subitemIds: this.approvalSubIds, sampleId: this.sampleId });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取规则列表信息失败" });
                return;
            }
            if (result.data.length === 0) {
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
            this.rowInfo = row; // 文件夹或图片的所有数据
            if (!row.isdir && row.fileId) {
                this.valueUrl = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${row.fileId}`
                this.imgName = row.fileName;
                this.imgClass = row.approvalItemAndDocumentsubId;
                this.sampleId = row.sampleId;
                // 获取规则列表
                // this.getRuleClassList();
                // 获取图片真实尺寸
                this.imgTrueSize.width = row.width;
                this.imgTrueSize.height = row.height;
                // 真值标定结果重置
                this.imgUrl = '';
                this.sampleTruthTable = [];
                if (this.activeName === 'fourth') {
                    this.getSampleResultField();
                }
                return;
            }
            this.valueUrl = null;
            this.activeName = 'first';
            this.imgName = '';
            this.imgClass = '';
            this.filePath = row.filePath;
            if (!this.filePathQueue.find(item => item.path === row.filePath)) {
                this.filePathQueue.push({ path: row.filePath, name: row.fileName, index: this.filePathQueue.length });
            }
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
            } else if (this.activeName === 'fourth') {
                this.getSampleResultField();
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
                    this.$set(this.rowInfo, 'documentsubDisplayname', item.documentsubDisplayname);
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
            this.ruleInfo.resultlabeled = this.ruleResult;
            // 更新规则下拉框数据
            let res = await listRuleAll({ approvalItemId: Number(this.itemId), subitemIds: this.approvalSubIds, sampleId: this.sampleId });
            if (!res.success) {
                return;
            }
            if (res.data.length === 0) {
                return;
            }
            this.ruleClassList = res.data;
            this.ruleClassList.forEach(item => {
                if (item.ruleId === this.ruleClass) {
                    console.log('this.ruleInfo in', this.ruleInfo)
                    console.log('item', item)
                    this.ruleInfo = item; // 触发计算属性,要保证能走通计算过程;
                    this.tableDataResult = this.ruleInfo.ruleInputs;
                }
            })
        },
        // 按钮上一个、下一个
        goBeforeOne() {
            let index = this.ruleClassList.indexOf(this.ruleInfo);
            console.log('index be');
            console.log(index);
            this.goNextDisable = false;
            if (index - 1 >= 0) {
                this.ruleClass = this.ruleClassList[index - 1].ruleId;
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
            if (index + 1 < this.ruleClassList.length) {
                this.ruleClass = this.ruleClassList[index + 1].ruleId;
                this.setRuleClass();
            } else {
                this.goNextDisable = true;
            }
            if (index + 1 === this.ruleClassList.length - 1) {
                this.goNextDisable = true;
            }
        },
        // 真值标定
        getCropData(item) {
            this.$refs.cropper.getCropData((data) => {
                this.imgUrl = data;
                // console.log('this.imgUrl');
                // console.log(this.imgUrl);
            });
            // console.log(this.$refs.cropper);
            // console.log('获取图片基于容器的坐标点');
            // console.log(this.$refs.cropper.getImgAxis());
            // console.log('获取截图框基于容器的坐标点');
            // console.log(this.$refs.cropper.getCropAxis());

            let imgAxis = this.$refs.cropper.getImgAxis(); // 获取图片基于容器的坐标点
            let cropAxis = this.$refs.cropper.getCropAxis(); // 获取截图框基于容器的坐标点
            let zoom = this.imgTrueSize.width / (imgAxis.x2 - imgAxis.x1); // 真实图片放大系数
            // coordinate = [[cropAxis.x1-imgAxis.x1, cropAxis.y1-imgAxis.y1], [cropAxis.x2-imgAxis.x1, cropAxis.y2-imgAxis.y1]]  // 正常座标系 [[x1, y1], [x2, y2]] 左上座标和右下座标
            // 反人类座标系 [[y1, x1], [y2, x2]] 左上座标和右下座标
            this.coordinate = [[Math.round((cropAxis.y1 - imgAxis.y1) * zoom), Math.round((cropAxis.x1 - imgAxis.x1) * zoom)], [Math.round((cropAxis.y2 - imgAxis.y1) * zoom), Math.round((cropAxis.x2 - imgAxis.x1) * zoom)]];
            console.log('this.coordinate');
            console.log(this.coordinate);
            item.fieldLocation = JSON.stringify(this.coordinate);
            this.$refs.cropper.getCropBlob((data) => {
                this.uploadToOcr(data, item);
            });
        },
        // OCR接口识别文本
        uploadToOcr(file, item) {
            // console.log('文件数据');
            // console.log(file);
            let fd = new FormData();
            fd.append("file", file);
            axios.post(
                process.env.VUE_APP_BASE_IP + '/docInfo/getOcr',
                fd
            )
                .then(
                    (res) => {
                        if (res.data.success) {
                            console.log(res.data.data);
                            let fileName = res.data.data[0].image_name
                            item.fieldContent = res.data.data[res.data.data.length - 1][fileName][0];
                        } else {
                        }
                    },
                ).catch(error => {
                    this.$message.warning('OCR识别失败,请重新截图或手动填写');
                });
            return false;
        },
        // 预览
        // realTime(data) {
        //     this.previews = {
        //         ...data
        //     };
        // },
        // 获取真值标定结果
        async getSampleResultField() {
            let result = await getSampleResultFieldByDocumentId({ documentId: this.rowInfo.id });
            if (!result.success) return;
            this.sampleTruthTable = result.data;
        },
        // 表存标定的真值
        async updateTruthData(item) {
            console.log('真值item');
            console.log(item);
            item.documentId = this.rowInfo.id;
            let result = await addSampleResultField(item);
            if (!result.success) {
                this.$message.warning('真值保存失败');
                return;
            };
            this.$message.success('真值保存成功');
        },
        // 一键导入最新提取结果
        async importTruthData(truthTable) {
            let result = await importSampleResultFieldByDocumentId({ documentId: this.rowInfo.id })
            if (!result.success) return;
            let importNew = result.data;
            importNew.forEach(newitem => {
                newitem.fieldLocation = JSON.stringify(newitem.fieldLocation);
            })
            truthTable.forEach((item, i) => {
                if(item.fieldContent === null) {
                    item.fieldContent = importNew[i].fieldContent;
                }
                if(item.fieldLocation === null) {
                    item.fieldLocation = importNew[i].fieldLocation;
                }
            })
        },
        // 一键清空已填信息
        clearData(truthTable) {
            truthTable.forEach(item => {
                item.fieldContent = null;
                item.fieldLocation = null;
            })
        },
        // 显示or关闭坐标框
        showRectangles() {
            this.showPosition = true;
            this.$nextTick(() => {
                let canvas = document.querySelector("#canvas");
                let ctx = canvas.getContext('2d');

                // 绘制图片对象 ctx.drawImage(图片对象， x位置， y位置)
                let img = new Image();
                img.src = this.valueUrl;

                img.onload = () => {
                    // ctx.clearRect(10,10,this.rowInfo.width -10,this.rowInfo.height - 10); // 清空画布, 但没用，应该是dialog关闭没有销毁元素
                    ctx.drawImage(img, 0, 0);
                    console.log('this.sampleTruthTable');
                    console.log(this.sampleTruthTable);
                    let number = 1;
                    this.sampleTruthTable.forEach(item => {
                        if (item.fieldLocation !== null) {
                            let coordinate = JSON.parse(item.fieldLocation);
                            let x = coordinate[0][1];
                            let y = coordinate[0][0];
                            let width = coordinate[1][1] - x;
                            let height = coordinate[1][0] - y;
                            let xText = coordinate[1][1] + 40;
                            let yText = coordinate[1][0] - 10;
                            console.log(x, y, width, height);
                            ctx.rect(x, y, width, height);
                            ctx.strokeStyle = 'salmon';
                            ctx.lineWidth = 5;
                            ctx.stroke();
                            ctx.font = "70px 微软雅黑";
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                            ctx.shadowOffsetX = 5;
                            ctx.shadowOffsetY = 5;
                            ctx.strokeText(String(number), xText, yText);
                            number += 1;
                        }
                    })
                }

            })
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
                            .truth {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: flex-start;
                                .truth-table {
                                    width: 100%;
                                    padding: 20px;
                                    .truth-table-item {
                                        margin-left: 20px;
                                        display: flex;
                                        flex-direction: column;
                                        align-items: flex-start;
                                        justify-content: flex-start;
                                    }
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