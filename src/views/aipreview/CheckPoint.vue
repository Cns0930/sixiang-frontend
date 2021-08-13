<template>
    <div class="workWrap">
        <header>
            <span class="title">CheckPoint</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <el-input placeholder="按材料编号或名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
                </el-input>
                <el-button @click="search">搜索</el-button>
                <el-button @click="addCheckPoint">新增</el-button>
                <el-button @click="loadCheckPoint">载入数据</el-button>
                <el-select v-model="isMapping" clearable placeholder="选择生成Json的模式"
                    style="width:200px;margin-left: 15px">
                    <el-option label="生成mapping.json" :value="true"></el-option>
                    <el-option label="生成checkpoint.json" :value="false"></el-option>
                </el-select>
                <el-button type="primary" @click="downLoadJson('/ai/aiCheckpoint/getCheckpointJson')">生成Json</el-button>
                <el-upload class="upload-demo" ref="upload" :action="urlExcel" :multiple="false" :limit="1"
                    :with-credentials="true" :on-success="uploadSuccess" :on-remove="handleRemove"
                    :on-exceed="handleExceed" :auto-upload='true' :before-upload="customUpload">
                    <el-button type="primary" icon="el-icon-upload" class="button" :loading="loadings"
                        @click="upLoad()" style="margin-left: 20px;">Excel上传
                    </el-button>
                </el-upload>
                <el-button type="danger" style="margin-left: 20px" @click="deleteCheckPointAll">
                    批量删除
                </el-button>
            </div>
            <div class="sampleTable">
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55">
                    </el-table-column>
                    <el-table-column prop="documentsubSeq" label="材料编号" width="90">
                    </el-table-column>
                    <el-table-column prop="documentsubDisplayname" label="材料名称" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="multiPageInfo" label="是否为多页" width="130" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="fieldName" label="字段名" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="alias" label="字段别名" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="isScreenshot" label="是否为截图" width="100" :formatter="isRequiredFormatter"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="screenshotInfo" label="截图信息" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sort" label="4W分类" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="classify" label="4W归类" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="valueEnvironment" label="字段值所处环境" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="keyValueRelativePosition" label="key和value位置关系" width="180"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="valuePattern" label="文本正则表达式" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                <ul>
                                    <li v-for="(item, i) in scope.row.valuePattern" :key="i">
                                        {{ '- ' + item }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="textStringPatternRange" label="文本正则表达式作用域" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="cutImgTag" label="截图表达式" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                <ul>
                                    <li v-for="(item, i) in scope.row.cutImgTag" :key="i">
                                        {{ '- ' + item }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="initPosition" label="截图初始化位置" width="180" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                <ul>
                                    <li v-for="(item, i) in scope.row.initPosition" :key="i">
                                        {{ '[' + item + ']' }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lineMerge" label="行合并阈值" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="page" label="多页编号" width="90" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="valueField" label="值域" width="90" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                <ul>
                                    <li v-for="(item, i) in scope.row.valueField" :key="i">
                                        {{ '- ' + item }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="valueProperty" label="字段属性" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="primary" style="font-size: 14px" @click="editCheckPoint(scope.row)">编辑
                            </el-button>
                            <el-button type="danger" style="font-size: 14px" @click="deleteCheckPointButton(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                    <el-button @click="toggleSelection()">取消选择</el-button>
                </div>
                <div class="tablePagination">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="currentPage" :page-size="pageSize" :page-sizes="[5, 10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next" :total="totalCount"></el-pagination>
                </div>
            </div>
        </div>
        <!--添加CheckPoint-->
        <el-dialog title="填写ai-CheckPoint" :visible.sync="dialogVisbleAdd" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="addForm">
                <!-- <el-form-item label="材料" required>
                    <el-select v-model="addForm.approvalItemAndDocumentsubId" clearable placeholder="请选择材料展示名称">
                        <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="字段" required>
                    <el-select v-model="addForm.fieldId" clearable filterable placeholder="请选择字段名称">
                        <el-option v-for="(v,i) in fieldOptions" :key="i" :label="v.documentsubDisplayname + ' - ' + v.fieldName" :value="v.fieldId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段值所处环境">
                    <el-select v-model="addForm.valueEnvironment" clearable>
                        <el-option label="table - 表格" value="table"></el-option>
                        <el-option label="text - 文本" value="text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="key和value位置关系">
                    <el-select v-model="addForm.keyValueRelativePosition" filterable allow-create clearable
                        placeholder="上、右、下、左、周围、中央">
                        <el-option label="up" value="up"></el-option>
                        <el-option label="right" value="right"></el-option>
                        <el-option label="right_all" value="right_all"></el-option>
                        <el-option label="down" value="down"></el-option>
                        <el-option label="left" value="left"></el-option>
                        <el-option label="around" value="around"></el-option>
                        <el-option label="middle" value="middle"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文本正则表达式" class="ruleItem">
                    <div v-for="(item,i) in valuePatternList" :key="i" class="ruleItems">
                        <el-input type='textarea' v-model="item.value"></el-input>
                        <i v-if="valuePatternList.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                            class="el-icon-delete" @click="deleteItem(i, 'valuePattern')"></i>
                    </div>
                    <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                        @click="addRuleLawList('valuePattern')"></i>
                </el-form-item>
                <el-form-item label="文本正则表达式作用域">
                    <el-select v-model="addForm.textStringPatternRange" clearable>
                        <el-option label="line - 提取信息和提取锚点位于一行" value="line"></el-option>
                        <el-option label="context - 提取信息和提取锚点处于多行" value="context"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截图表达式" class="ruleItem">
                    <div v-for="(item,i) in cutImgTagList" :key="i" class="ruleItems">
                        <el-input type='textarea' v-model="item.value"></el-input>
                        <i v-if="cutImgTagList.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                            class="el-icon-delete" @click="deleteItem(i, 'cutImgTag')"></i>
                    </div>
                    <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                        @click="addRuleLawList('cutImgTag')"></i>
                </el-form-item>
                <el-form-item label="截图初始化位置">
                    <el-input v-model="addForm.initPosition" placeholder="座标格式：[0,0],[12,12]"></el-input>
                </el-form-item>
                <el-form-item label="行合并阈值">
                    <el-input v-model="addForm.lineMerge"></el-input>
                </el-form-item>
                <el-form-item label="多页编号">
                    <el-input v-model="addForm.page" placeholder="只允许数字"></el-input>
                </el-form-item>
                <el-form-item label="值域" class="ruleItem">
                    <div v-for="(item,i) in valueFieldList" :key="i" class="ruleItems">
                        <el-input type='textarea' v-model="item.value"></el-input>
                        <i v-if="valueFieldList.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                            class="el-icon-delete" @click="deleteItem(i, 'valueField')"></i>
                    </div>
                    <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                        @click="addRuleLawList('valueField')"></i>
                </el-form-item>
                <el-form-item label="字段属性">
                    <el-select v-model="addForm.valueProperty" filterable clearable>
                        <el-option v-for="(v,i) in valuePropertyOptions" :key="i" :label="v.label" :value="v.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑CheckPoint-->
        <el-dialog title="编辑ai-CheckPoint" :visible.sync="dialogVisbleEdit" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm">
                <!-- <el-form-item label="材料" required>
                    <el-select v-model="editForm.approvalItemAndDocumentsubId" clearable placeholder="请选择材料展示名称">
                        <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段" required>
                    <el-select v-model="editForm.fieldId" clearable placeholder="请选择字段名称">
                        <el-option v-for="(v,i) in fieldOptions" :key="i" :label="v.fieldName" :value="v.fieldId">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="是否为多页">
                    <el-select v-model="editForm.multiPageInfo" clearable placeholder="是否为多页">
                        <el-option label="是" value="是"></el-option>
                        <el-option label="否" value="否"></el-option>
                        <el-option label="董事监事经理" value="董事监事经理"></el-option>
                        <el-option label="公司章程" value="公司章程"></el-option>
                        <el-option label="营业执照" value="营业执照"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为截图">
                    <el-select v-model="editForm.isScreenshot" clearable placeholder="是否为截图">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                        <el-option label="是否" :value="Number(2)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截图信息">
                    <el-select v-model="editForm.screenshotInfo" filterable clearable placeholder="截图信息">
                        <el-option v-for="(v,i) in screenshotInfoOptions" :key="i" :label="v.label" :value="v.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="4W分类">
                    <el-select v-model="editForm.sort" filterable clearable>
                        <el-option v-for="(v,i) in sortOptions" :key="i" :label="v.label" :value="v.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="4W归类">
                    <el-input v-model="editForm.classify"></el-input>
                </el-form-item>
                <el-form-item label="字段值所处环境">
                    <el-select v-model="editForm.valueEnvironment" clearable>
                        <el-option label="table - 表格" value="table"></el-option>
                        <el-option label="text - 文本" value="text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="key和value位置关系">
                    <el-select v-model="editForm.keyValueRelativePosition" filterable allow-create clearable
                        placeholder="上、右、下、左、周围、中央">
                        <el-option label="up" value="up"></el-option>
                        <el-option label="right" value="right"></el-option>
                        <el-option label="right_all" value="right_all"></el-option>
                        <el-option label="down" value="down"></el-option>
                        <el-option label="left" value="left"></el-option>
                        <el-option label="around" value="around"></el-option>
                        <el-option label="middle" value="middle"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文本正则表达式" class="ruleItem">
                    <div v-for="(item,i) in valuePatternList" :key="i" class="ruleItems">
                        <el-input type='textarea' v-model="item.value"></el-input>
                        <i v-if="valuePatternList.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                            class="el-icon-delete" @click="deleteItem(i, 'valuePattern')"></i>
                    </div>
                    <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                        @click="addRuleLawList('valuePattern')"></i>
                </el-form-item>
                <el-form-item label="文本正则表达式作用域">
                    <el-select v-model="editForm.textStringPatternRange" clearable>
                        <el-option label="line - 提取信息和提取锚点位于一行" value="line"></el-option>
                        <el-option label="context - 提取信息和提取锚点处于多行" value="context"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截图表达式" class="ruleItem">
                    <div v-for="(item,i) in cutImgTagList" :key="i" class="ruleItems">
                        <el-input type='textarea' v-model="item.value"></el-input>
                        <i v-if="cutImgTagList.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                            class="el-icon-delete" @click="deleteItem(i, 'cutImgTag')"></i>
                    </div>
                    <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                        @click="addRuleLawList('cutImgTag')"></i>
                </el-form-item>
                <el-form-item label="截图初始化位置">
                    <el-input v-model="editForm.initPosition" placeholder="座标格式：[0,0],[12,12]"></el-input>
                </el-form-item>
                <el-form-item label="行合并阈值">
                    <el-input v-model="editForm.lineMerge"></el-input>
                </el-form-item>
                <el-form-item label="多页编号">
                    <el-input v-model="editForm.page" placeholder="只允许数字"></el-input>
                </el-form-item>
                <el-form-item label="值域" class="ruleItem">
                    <div v-for="(item,i) in valueFieldList" :key="i" class="ruleItems">
                        <el-input type='textarea' v-model="item.value"></el-input>
                        <i v-if="valueFieldList.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                            class="el-icon-delete" @click="deleteItem(i, 'valueField')"></i>
                    </div>
                    <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                        @click="addRuleLawList('valueField')"></i>
                </el-form-item>
                <el-form-item label="字段属性">
                    <el-select v-model="editForm.valueProperty" filterable clearable>
                        <el-option v-for="(v,i) in valuePropertyOptions" :key="i" :label="v.label" :value="v.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段别名">
                    <el-input v-model="editForm.alias"></el-input>
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
import axios from 'axios'
import { mixin } from "@/mixin/mixin"

// 接口
import {
    listCheckpoint, getByCheckpointIdid, getCheckpoint, getCheckpointJson,
    addCheckpoint, updateCheckpoint, deleteCheckpoint, deleteCheckpointBatch
} from "@/api/aipreview/checkPoint.js"
import { listItemAndDocumentSub } from '@/api/basicInfo/approvalSub'
import { listFieldUnionMaterial } from '@/api/basicInfo/field'

export default {
    mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 搜索区域
            keyWord: '',
            isMapping: null,
            // 表格区域
            tableData: [],
            multipleSelection: [],
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            // 新增弹窗
            dialogVisbleAdd: false,
            addForm: {
                initPosition: '',
            },
            // materialOptions: [],
            fieldOptions: [],
            cutImgTagList: [],
            valueFieldList: [],
            valuePatternList: [],
            // 编辑弹窗
            dialogVisbleEdit: false,
            screenshotInfoOptions: [
                { value: '是否签字', label: '是否签字' }, { value: '是否盖章', label: '是否盖章' }, { value: '是否填写日期', label: '是否填写日期' }, { value: '是否粘贴身份证', label: '是否粘贴身份证' }, { value: '提取身份证姓名', label: '提取身份证姓名' }, { value: '提取身份证有效期限', label: '提取身份证有效期限' },
                { value: '是否已填写', label: '是否已填写' }, { value: '提取身份证住址', label: '提取身份证住址' }, { value: '提取身份证公民身份号码', label: '提取身份证公民身份号码' }, { value: '提取身份证性别', label: '提取身份证性别' }, { value: '提取身份证民族', label: '提取身份证民族' },
                { value: '提取身份证出生', label: '提取身份证出生' }, { value: '是否勾选', label: '是否勾选' }, { value: '勾选内容_right', label: '勾选内容_right' }, { value: '勾选内容_left', label: '勾选内容_left' }, { value: '是否粘贴证件照片', label: '是否粘贴证件照片' }, { value: '是否盖红章', label: '是否盖红章' },
                { value: 'NER', label: 'NER' } ,{ value: '打印或手写', label: '打印或手写' }
            ],
            sortOptions: [
                { value: 'WHO', label: 'WHO' }, { value: 'WHERE', label: 'WHERE' }, { value: 'WHAT', label: 'WHAT' },
                { value: 'WHEN', label: 'WHEN' }, { value: 'SIGN', label: 'SIGN' }
            ],
            valuePropertyOptions: [
                { value: 'ch', label: 'ch 汉字' }, { value: 'char', label: 'char 字母' }, { value: 'num', label: 'num 数字' }, { value: 'num_char', label: '数字+字母' },
                { value: 'ch_char', label: 'ch_char 汉字+字母' }, { value: 'ch_num', label: 'ch_num 汉字+数字' }, { value: 'ch_char_num', label: 'ch_char_num 汉字字母数字' }, { value: 'date', label: 'date 单一日期' },
                { value: 'id_number', label: 'id_number 身份证号' }, { value: 'last4id', label: 'last4id 后4位' }, { value: 'addr', label: 'addr 地址' }, { value: 'credit_number', label: 'credit_number 机构统一信用代码' }
            ],
            editForm: {
                cutImgTag: [],
                initPosition: '',
                valueField: [],
                valuePattern: [],
            },
            // 上传EXCEL
            loadings: false,
            urlExcel: process.env.VUE_APP_BASE_IP + '/ss/Import/aiCheckpointImportData',
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getListCheckpoint();
        await this.getOptions();
    },
    methods: {
        // 多选表格相关
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                    // this.$refs.multipleTable.setCurrentRow(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
                this.$refs.multipleTable.setCurrentRow();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log('multipleSelection', val);
            if (this.multipleSelection.length === 1) {
                this.$refs.multipleTable.setCurrentRow(this.multipleSelection[0]);
            } else {
                this.$refs.multipleTable.setCurrentRow();
            }
        },

        // 分页
        async handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.currentPage = 1;
            await this.getListCheckpoint();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.getListCheckpoint();
        },

        // 加载表单
        async getListCheckpoint() {
            let request = {
                approvalItemId: this.itemId,
                globalDocumentSubNameAndCode: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            let res = await listCheckpoint(request);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },

        // 载入ba填写的数据
        async loadCheckPoint() {
            try {
                await this.$confirm("是否导入BA已填数据", "确认载入",);
                let res = await getCheckpoint({ approvalItemId: this.itemId });
                if (!res.success) return;
                this.getListCheckpoint();
                this.$message({ type: "success", message: "载入成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消载入" })
            }
        },

        // 搜索
        search() {
            this.currentPage = 1;
            this.getListCheckpoint();
        },

        // 弹框内操作
        // 增加
        addRuleLawList(val) {
            if (val == 'cutImgTag') {
                this.cutImgTagList.push({ value: '' });
            }
            if (val == 'valueField') {
                this.valueFieldList.push({ value: '' });
            }
            if (val === 'valuePattern') {
                this.valuePatternList.push({ value: '' });
            }
        },
        // 删除
        deleteItem(i, val) {
            if (val === 'cutImgTag') {
                this.cutImgTagList.splice(i, 1);
            } else if (val === 'valueField') {
                this.valueFieldList.splice(i, 1);
            } else if (val === 'valuePattern') {
                this.valuePatternList.splice(i, 1);
            }
        },

        // 加载下拉框选项
        async getOptions() {
            // let resMaterial = await listItemAndDocumentSub({ approvalItemId: this.itemId, pageNum: 1, pageSize: 500 });
            // if (!resMaterial.success) return;
            // this.materialOptions = resMaterial.data.records;
            let resField = await listFieldUnionMaterial({ approvalItemId: this.itemId, isCheckpoint: 1, pageNum: 1, pageSize: 500 });
            if (!resField.success) return;
            this.fieldOptions = resField.data.records;
        },

        // 新增打开弹框
        async addCheckPoint() {
            this.dialogVisbleAdd = true;
        },

        // 确认新增
        async addConfirm() {
            console.log(this.cutImgTagList);
            let updateAddForm = _.cloneDeep(this.addForm)
            updateAddForm.cutImgTag = this.cutImgTagList.map(item => item.value);
            updateAddForm.initPosition = this.addForm.initPosition === null || this.addForm.initPosition === '' ? null : JSON.parse('[' + this.addForm.initPosition + ']');
            updateAddForm.valueField = this.valueFieldList.map(item => item.value);
            updateAddForm.valuePattern = this.valuePatternList.map(item => item.value);
            updateAddForm.approvalItemId = this.itemId;
            let res = await addCheckpoint(updateAddForm);
            if (!res.success) return;
            this.dialogVisbleAdd = false;
            this.getListCheckpoint();
        },

        // 编辑
        async editCheckPoint(row) {
            this.editForm = _.cloneDeep(row);
            console.log('this.editForm');
            console.log(this.editForm);
            this.editForm.cutImgTag === null ? this.editForm.cutImgTag = [] : this.editForm.cutImgTag
            this.editForm.valueField === null ? this.editForm.valueField = [] : this.editForm.valueField
            this.editForm.valuePattern === null ? this.editForm.valuePattern = [] : this.editForm.valuePattern
            this.cutImgTagList = this.editForm.cutImgTag.map(item => { return { value: item } });
            this.valueFieldList = this.editForm.valueField.map(item => { return { value: item } });
            this.valuePatternList = this.editForm.valuePattern.map(item => { return { value: item } });
            if (this.editForm.initPosition) {
                this.editForm.initPosition = JSON.stringify(this.editForm.initPosition[0]) + ',' + JSON.stringify(this.editForm.initPosition[1]);
                if (this.editForm.initPosition === 'null,undefined') {
                    this.editForm.initPosition = '';
                }
            }
            this.dialogVisbleEdit = true;
        },
        // 确认编辑
        async editConfirm() {
            let updateEditForm = _.cloneDeep(this.editForm);
            updateEditForm.cutImgTag = this.cutImgTagList.map(item => item.value);
            updateEditForm.initPosition = this.editForm.initPosition === null ? null : JSON.parse('[' + this.editForm.initPosition + ']');
            updateEditForm.valueField = this.valueFieldList.map(item => item.value);
            updateEditForm.valuePattern = this.valuePatternList.map(item => item.value);
            updateEditForm.approvalItemId = this.itemId;
            let res = await updateCheckpoint(updateEditForm);
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            this.getListCheckpoint();
        },
        // 删除checkPoint
        async deleteCheckPointButton(row) {
            let res = await deleteCheckpoint({ checkpointId: row.checkpointId });
            if (!res.success) return;
            this.getListCheckpoint();
        },
        // 批量删除
        async deleteCheckPointAll() {
            if(this.multipleSelection.length === 0) {
                this.$message.warning('请先选择要删除的checkpoint')
                return
            }
            console.log('this.multipleSelection')
            console.log(this.multipleSelection)
            let ids = this.multipleSelection.map( item => {return item.checkpointId})
            console.log('ids')
            console.log(ids)
            let res = await deleteCheckpointBatch({idList: ids})
            if(!res.success) return
            this.$message.success('批量删除成功')
            this.getListCheckpoint()
        },
        // 生成Json
        async downLoadJson(url) {
            if (this.multipleSelection.length === 0) {
                this.$message({ type: "warning", message: "请在表格中勾选要生成Json的数据" })
                return;
            }
            let checkpointIds = [];
            this.multipleSelection.forEach(item => {
                checkpointIds.push(item.checkpointId);
            })
            let res = await axios({
                method: "get",
                url: url,
                params: {
                    approvalItemId: this.itemId,
                    checkpointIds: checkpointIds.toString(),
                    isMapping: this.isMapping
                },
                responseType: "arraybuffer",
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("没有需要下载的文件");
                return;
            }
            let blob = new Blob([res.data], { type: "application/zip" });
            const a = document.createElement("a");
            // 生成文件路径
            let href = window.URL.createObjectURL(blob);
            a.href = href;
            console.log('res');
            console.log(res);
            // let _fileName = _res.headers['Content-disposition'].split(';')[1].split('=')[1].split('.')[0]
            let _fileName = res.headers["content-disposition"]
                .split(";")[1]
                .split("=")[1];
            // 文件名中有中文 则对文件名进行转码
            a.download = decodeURIComponent(_fileName);
            // 利用a标签做下载
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(href);
        },
        // Excel上传
        // 成功上传文件
        uploadSuccess(res, file) {
            console.log(res)
            if (res.status == 200) {
                this.$message.success(res);
            }
        },
        uploadError(err) {
            console.log(err);
            this.$message.error(err);
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`只能选择上传 1 个文件`);
        },
        //  移除文件
        handleRemove(file, fileList) {
        },
        upLoad() {
            this.$refs.upload.submit();
        },
        customUpload(file) {
            this.loadings = true
            let fd = new FormData();
            fd.append("file", file);
            fd.append("approvalItemId", this.itemId);
            try {
                axios.post(
                    this.urlExcel,
                    fd, { timeout: 1000 * 90 }
                ).then(
                    (res) => {
                        console.log('rescode', res.code);
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.loadings = false;
                            this.getListCheckpoint();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                            this.loadings = false;
                            this.getListCheckpoint();
                        }
                    },
                ).catch(error => {
                    this.loadings = false;
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        //   console.log(error.response.data);
                        //   console.log(error.response.status);
                        //   console.log(error.response.headers);
                        this.$message.warning('哦no，不知道后端的开发又搞了什么乱子！');
                    } else if (error.request) {
                        // The request was made but no response was received
                        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                        // http.ClientRequest in node.js
                        //   console.log(error.request);
                        this.$message.warning('你用的2g网络么，现在都5g时代了！');
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        //   console.log('Error', error.message);
                        this.$message.warning('出现了其他问题！');
                    }
                    // console.log(error.config);
                });
            } catch (error) {
            }
            return false;
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
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
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