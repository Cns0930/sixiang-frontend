<template>
    <div class="workWrap">
        <header>
            <span class="title">样例开发</span>
        </header>
        <div class="workBox">
            <el-row :gutter="30" class="datatrend-body-items">
                <div class="datatrend-body-items-box">
                    <el-col :xs="24" :lg="6">
                        <div class="datatrend-body-item" style="height:725px">
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
                                            highlight-current-row style="width: 100%; min-width: 250px"
                                            :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:800}"
                                            :row-style="{fontSize:'13px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}"
                                            @selection-change="handleSelectionChange">
                                            <el-table-column type="selection" :selectable="checkboxSelect" width="45">
                                            </el-table-column>
                                            <el-table-column prop="name" label="标定信息" min-width="40%">
                                                <template slot-scope="scope">
                                                    <span v-if="scope.row.documentsubSeq" style="color: green">
                                                        <i class="el-icon-check"></i>
                                                        {{ ' ' + scope.row.documentsubSeq + ' - ' + scope.row.documentsubDisplayname }}
                                                    </span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="文件名" min-width="60%">
                                                <template slot-scope="scope">
                                                    <i
                                                        :class="[scope.row.isdir ? 'el-icon-folder-opened' : 'el-icon-picture-outline']"></i>
                                                    <el-button type="text" style="font-size: 16px"
                                                        @click="changeFileTable(scope.row)">
                                                        {{ scope.row.fileName }}</el-button>
                                                </template>
                                            </el-table-column>
                                            
                                        </el-table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :lg="18">
                        <div class="multiple-show">
                            <div v-for="(item, i) in multipleSelection" :key="i">
                                <el-col :span="16" class="multiple-show-item">
                                    <div class="datatrend-body-item-mid">
                                        <div class="case-content">
                                            <div class="case-header">
                                                <div class="case-header-left">图片预览</div>
                                                <div class="case-header-right">
                                                    <el-button icon="el-icon-minus" @click="sizeDown(item)" circle>
                                                    </el-button>
                                                    <el-button icon="el-icon-plus" @click="sizeUp(item)" circle>
                                                    </el-button>
                                                    <el-button round @click="imgOpen(item.valueUrl)">打开图片</el-button>
                                                    <el-button @click="updateOcr(item)">更新ocr</el-button>
                                                </div>
                                            </div>
                                            <div class="case-rows">
                                                <img :src="item.valueUrl" :alt="item.imgName" :width="item.imgWidth" />
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="8" class="multiple-show-item">
                                    <div class="datatrend-body-item-rgt">
                                        <div class="case-content">
                                            <div class="case-header">
                                                <div class="case-header-left">OCR结果展示</div>
                                            </div>
                                            <div class="case-rows">
                                                <div v-for="(ocrResult, i) in item.ocrResultShow" :key="i"
                                                    class="ocr-result-item">
                                                    {{ ' - ' + ocrResult }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </div>
                        </div>
                    </el-col>
                </div>
            </el-row>
            <el-row :gutter="30" class="datatrend-body-items" style="padding: 0 15px;">
                <div class="datatrend-body-items-box">
                    <div class="datatrend-body-item">
                        <div class="case-content">
                            <div class="case-header">
                                <div class="case-header-left">SortConfig</div>
                                <div class="case-header-mid">
                                    <el-select v-model="selectedSortConfigs" multiple filterable clearable
                                        placeholder="请选择要修改的SortConfig(多选)" style="width: 600px"
                                        @change="showSortConfigs()">
                                        <el-option v-for="item in sortConfigOptions" :key="item.sortconfigId"
                                            :label="item.documentsubSeq + ' : ' + item.documentsubDisplayname + ' sortconfigId : ' + item.sortconfigId"
                                            :value="item.sortconfigId">
                                        </el-option>
                                    </el-select>
                                    <el-button @click="addSortConfig" style="margin-left: 15px">新增</el-button>
                                </div>
                            </div>
                            <div class="case-rows">
                                <div class="sortConfigTable">
                                    <el-table ref="multipleTable" border :data="sortConfigData" tooltip-effect="dark"
                                        highlight-current-row style="width: 100%"
                                        :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                                        :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                                        <el-table-column type="index" label="索引" width="55">
                                        </el-table-column>
                                        <el-table-column prop="documentsubSeq" label="材料编号" width="90">
                                        </el-table-column>
                                        <el-table-column prop="sortconfigId" label="sortconfig编号" width="100">
                                        </el-table-column>
                                        <el-table-column prop="documentsubDisplayname" label="材料名称" width="180"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="lordKeyword" label="主关键字" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="assistKeyword" label="辅助关键字" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="excludeKeyword" label="排除关键字" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="pageCode" label="多页编号" width="100" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作" fixed="right" width="180">
                                            <template slot-scope="scope">
                                                <el-button type="primary" style="font-size: 14px"
                                                    @click="editSortConfig(scope.row)">编辑
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-row>
            <el-row :gutter="30" class="datatrend-body-items"
                style="padding: 0 15px; margin-top: 15px; display: flex; flex-flow: row;">
                <div class="datatrend-body-items-box" style="width: 85%;">
                    <div class="datatrend-body-item">
                        <div class="case-content">
                            <div class="case-header">
                                <div class="case-header-left">CheckPoint</div>
                                <div class="case-header-mid">
                                    <el-select v-model="selectedCheckPoints" multiple filterable clearable
                                        placeholder="请选择要修改的CheckPoint(多选)" style="width: 600px"
                                        @change="showCheckPoints()">
                                        <el-option v-for="item in CheckPointOptions" :key="item.checkpointId"
                                            :label="item.documentsubSeq + ' : ' + item.fieldName"
                                            :value="item.checkpointId">
                                        </el-option>
                                    </el-select>
                                    <el-button @click="addCheckPoint" style="margin-left: 15px">新增</el-button>
                                </div>
                            </div>
                            <div class="case-rows">
                                <div class="checkpointTable">
                                    <el-table ref="multipleTable" border :data="CheckPointData" tooltip-effect="dark"
                                        highlight-current-row style="width: 100%"
                                        :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                                        :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}">
                                        <el-table-column type="index" label="索引" width="55">
                                        </el-table-column>
                                        <el-table-column prop="documentsubSeq" label="材料编号" width="90">
                                        </el-table-column>
                                        <el-table-column prop="documentsubDisplayname" label="材料名称" width="180"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="multiPageInfo" label="是否为多页" width="130"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="fieldName" label="字段名" width="180" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="alias" label="字段别名" width="180" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="isScreenshot" label="是否为截图"
                                            :formatter="isRequiredFormatter" width="100" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="screenshotInfo" label="截图信息" width="180"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="sort" label="4W分类" width="100" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="classify" label="4W归类" width="100" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="valueEnvironment" label="字段值所处环境" width="180"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="keyValueRelativePosition" label="key和value位置关系"
                                            width="180" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="valuePattern" label="文本正则表达式" width="180"
                                            show-overflow-tooltip>
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
                                        <el-table-column prop="textStringPatternRange" label="文本正则表达式作用域" width="180"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column prop="cutImgTag" label="截图表达式" width="180"
                                            show-overflow-tooltip>
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
                                        <el-table-column prop="initPosition" label="截图初始化位置" width="180"
                                            show-overflow-tooltip>
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
                                        <el-table-column prop="lineMerge" label="行合并阈值" width="180"
                                            show-overflow-tooltip>
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
                                        <el-table-column prop="valueProperty" label="字段属性" width="180"
                                            show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作" fixed="right" width="180">
                                            <template slot-scope="scope">
                                                <el-button type="primary" style="font-size: 14px"
                                                    @click="editCheckPoint(scope.row)">编辑
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="datatrend-body-items-box" style="width: 14%; margin-left: 1%; display: flex;
                    flex-flow: column;
                    align-items: center;
                    justify-content: center;">
                    <div class="results-presentation">
                        <el-select v-model="calcMode" style="width:100px;margin:10px;">
                            <el-option label="分类" :value="Number(1)"></el-option>
                            <el-option label="提取" :value="Number(3)"></el-option>
                        </el-select>
                        <div>
                            <el-button icon="el-icon-video-play" circle style="font-size: 30px"
                                @click="openResultsPresentation"></el-button>
                        </div>
                        <div style="font-size: 18px;color: rgb(99, 137, 231); margin-top: 10px; margin-bottom: 10px;">
                            查看结果</div>
                        <el-button type="primary" @click="downLoad" :loading="loadingDownFile">下载ai开发文档</el-button>
                    </div>
                </div>
            </el-row>
        </div>
        <div class="workHandleBox">
            <!--添加CheckPoint-->
            <el-dialog title="填写ai-CheckPoint" :visible.sync="dialogVisbleAddCheckPoint" width="50%"
                :close-on-click-modal="false">
                <el-form label-width="120px" :model="addForm">
                    <el-form-item label="材料" required>
                        <el-select v-model="addForm.approvalItemAndDocumentsubId" clearable placeholder="请选择材料展示名称">
                            <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                                :value="v.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字段" required>
                        <el-select v-model="addForm.fieldId" clearable placeholder="请选择字段名称">
                            <el-option v-for="(v,i) in fieldOptions" :key="i" :label="v.fieldName" :value="v.fieldId">
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
                    <el-form-item label="截图初始化位置" class="ruleItem">
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
                    <el-button @click="dialogVisbleAddCheckPoint = false">取 消</el-button>
                    <el-button type="primary" @click="addConfirm">确 定</el-button>
                </span>
            </el-dialog>
            <!--编辑CheckPoint-->
            <el-dialog title="编辑ai-CheckPoint" :visible.sync="dialogVisbleEdit" width="50%"
                :close-on-click-modal="false">
                <el-form label-width="120px" :model="editForm">
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
                            <el-option v-for="(v,i) in screenshotInfoOptions" :key="i" :label="v.label"
                                :value="v.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="4W分类">
                        <el-select v-model="editForm.sort" filterable clearable>
                            <el-option v-for="(v,i) in sortOptions" :key="i" :label="v.label" :value="v.value">
                            </el-option>
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
                    <el-form-item label="截图初始化位置" class="ruleItem">
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
            <!--添加SortConfig-->
            <el-dialog title="填写ai-SortConfig" :visible.sync="dialogVisbleAddSortConfig" width="50%"
                :close-on-click-modal="false">
                <el-form label-width="120px" :model="addFormSortConfig">
                    <el-form-item label="材料" required>
                        <el-select v-model="addFormSortConfig.approvalItemAndDocumentsubId" clearable
                            placeholder="请选择材料展示名称">
                            <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                                :value="v.id"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主关键字">
                        <el-input v-model="addFormSortConfig.lordKeyword"></el-input>
                    </el-form-item>
                    <el-form-item label="辅助关键字">
                        <el-input v-model="addFormSortConfig.assistKeyword"></el-input>
                    </el-form-item>
                    <el-form-item label="排除关键字">
                        <el-input v-model="addFormSortConfig.excludeKeyword"></el-input>
                    </el-form-item>
                    <el-form-item label="多页编号">
                        <el-input v-model="addFormSortConfig.pageCode" placeholder="只允许数字"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisbleAddSortConfig = false">取 消</el-button>
                    <el-button type="primary" @click="addConfirmSortConfig">确 定</el-button>
                </span>
            </el-dialog>
            <!--编辑SortConfig-->
            <el-dialog title="编辑ai-SortConfig" :visible.sync="dialogVisbleEditSortConfig" width="50%"
                :close-on-click-modal="false">
                <el-form label-width="120px" :model="editFormSortConfig">
                    <!-- <el-form-item label="材料" required>
                    <el-select v-model="editFormSortConfig.approvalItemAndDocumentsubId" clearable placeholder="请选择材料展示名称">
                        <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item> -->
                    <el-form-item label="主关键字">
                        <el-input v-model="editFormSortConfig.lordKeyword"></el-input>
                    </el-form-item>
                    <el-form-item label="辅助关键字">
                        <el-input v-model="editFormSortConfig.assistKeyword"></el-input>
                    </el-form-item>
                    <el-form-item label="排除关键字">
                        <el-input v-model="editFormSortConfig.excludeKeyword"></el-input>
                    </el-form-item>
                    <el-form-item label="多页编号">
                        <el-input v-model="editFormSortConfig.pageCode" placeholder="只允许数字"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisbleEditSortConfig = false">取 消</el-button>
                    <el-button type="primary" @click="editConfirmSortConfig">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 结果展示页面dialog -->
            <ResultsPresentationDialog ref="resPresentation" />
            <!-- 抽屉 -->
            <el-drawer title="显示图片与标注信息" :visible.sync="showDrawer" direction="rtl" size="50%">
                <span v-if="drawerRowInfo.documentsubSeq" style="color: green">
                    <i class="el-icon-check"></i>
                    {{ ' ' + drawerRowInfo.documentsubSeq + ' - ' + drawerRowInfo.documentsubDisplayname }}
                </span>
                <img :src="valueUrl" :alt="drawerRowInfo.imgName" width="100%" />
            </el-drawer>
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
import VueCompositionAPI from '@vue/composition-api'
import { ref } from "@vue/composition-api";
import ResultsPresentationDialog from "./ResultsPresentationDialog"
// 接口
import { getFileList, uploadOcrById } from "@/api/basicInfo/sample/document"
import {
    listCheckpoint, updateCheckpoint, addCheckpoint
} from "@/api/aipreview/checkPoint.js"
import {
    listSortconfig, updateSortconfig, addSortconfig
} from "@/api/aipreview/sortConfig"
import { listItemAndDocumentSub } from '@/api/basicInfo/approvalSub'
import { listFieldUnionMaterial } from '@/api/basicInfo/field'

Vue.use(VueCompositionAPI)

export default {
    name: "AiDevelopment",
    mixins: [mixin],
    components: {
        ResultsPresentationDialog
    },
    setup() {
        const resPresentation = ref(null);
        return {
            resPresentation,
        }
    },
    data() {
        return {
            // 初始数据
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 文件表格相关
            tableData: [],
            multipleSelection: [],
            filePath: this.$route.query.filePath ? this.$route.query.filePath : '/',
            filePathQueue: this.$route.query.filePathQueue ? JSON.parse(this.$route.query.filePathQueue) : [{ path: '/', name: '根目录', index: 0 }],
            // 图片预览相关
            valueUrl: null,
            imgName: '',
            imgWidth: '100%',

            // CheckPoint
            CheckPointData: [],
            CheckPointOptions: [],
            selectedCheckPoints: [],
            // 新增弹窗
            dialogVisbleAddCheckPoint: false,
            addForm: {
                initPosition: '',
            },
            materialOptions: [],
            fieldOptions: [],
            // CheckPoint编辑弹窗
            cutImgTagList: [],
            valueFieldList: [],
            valuePatternList: [],
            dialogVisbleEdit: false,
            screenshotInfoOptions: [
                { value: '是否签字', label: '是否签字' }, { value: '是否盖章', label: '是否盖章' }, { value: '是否填写日期', label: '是否填写日期' }, { value: '是否粘贴身份证', label: '是否粘贴身份证' }, { value: '提取身份证姓名', label: '提取身份证姓名' }, { value: '提取身份证有效期限', label: '提取身份证有效期限' },
                { value: '是否已填写', label: '是否已填写' }, { value: '提取身份证住址', label: '提取身份证住址' }, { value: '提取身份证公民身份号码', label: '提取身份证公民身份号码' }, { value: '提取身份证性别', label: '提取身份证性别' }, { value: '提取身份证民族', label: '提取身份证民族' },
                { value: '提取身份证出生', label: '提取身份证出生' }, { value: '是否勾选', label: '是否勾选' }, { value: '勾选内容_right', label: '勾选内容_right' }, { value: '勾选内容_left', label: '勾选内容_left' }, { value: '是否粘贴证件照片', label: '是否粘贴证件照片' }, { value: '是否盖红章', label: '是否盖红章' },
                { value: 'NER', label: 'NER' }
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

            // SortConfig
            sortConfigOptions: [],
            sortConfigData: [],
            selectedSortConfigs: [],
            // 新增弹窗
            dialogVisbleAddSortConfig: false,
            addFormSortConfig: {},
            // 编辑弹框
            editFormSortConfig: {},
            dialogVisbleEditSortConfig: false,

            // 运行结果
            calcMode: 1,
            loadingDownFile: false,

            // 抽屉
            showDrawer: false,
            drawerRowInfo: {},
        }
    },
    computed: {
        ...mapGetters({
            // itemInfo: 'itemInfo'
        }),
        ...mapState({
            itemInfo: state => state.home.item
        }),
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getFileListTable();
        await this.getListCheckpoint();
        await this.getSortConfigList();
        await this.getOptions();
    },
    methods: {
        // 多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.multipleSelection.forEach(item => {
                item.valueUrl = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${item.fileId}`;
                item.imgWidth = '100%';
            })
            console.log('multipleSelection', this.multipleSelection);
        },
        // 加载下拉框选项
        async getOptions() {
            let resMaterial = await listItemAndDocumentSub({ approvalItemId: this.itemId, pageNum: 1, pageSize: 500 });
            if (!resMaterial.success) return;
            this.materialOptions = resMaterial.data.records;
            let resField = await listFieldUnionMaterial({ approvalItemId: this.itemId, isCheckpoint: 1, pageNum: 1, pageSize: 500 });
            if (!resField.success) return;
            this.fieldOptions = resField.data.records;
        },
        // 禁用选择文件夹
        checkboxSelect(row, rowIndex) {
            if (row.isdir) {
                return false; // 禁用
            } else {
                return true; // 不禁用
            }
        },
        // 获取文件列表数据&当前路径的样本的情形标注情况
        async getFileListTable() {
            let result = await getFileList({ approvalItemId: this.itemId, dir: this.filePath });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取文件列表信息失败" });
                return;
            }
            this.tableData = result.data;
        },
        // 改变文件目录列表
        async changeFileTable(row) {
            console.log('row', row);
            this.rowInfo = row;
            if (!row.isdir && row.fileId) {
                this.valueUrl = process.env.VUE_APP_BASE_IP + `/docInfo/getPic?fileId=${row.fileId}`
                this.imgName = row.fileName;
                this.imgClass = row.approvalItemAndDocumentsubId;
                // 打开抽屉
                this.showDrawer = true;
                this.drawerRowInfo = row;
                return;
            }
            this.valueUrl = null;
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
        sizeUp(item) {
            this.$set(item, 'imgWidth', '150%');
            this.$forceUpdate();
        },
        sizeDown(item) {
            this.$set(item, 'imgWidth', '100%');
            this.$forceUpdate();
        },
        imgOpen(valueUrl) {
            const a = document.createElement("a");
            a.href = valueUrl
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        // 更新OCR结果
        async updateOcr(item) {
            let result = await uploadOcrById({ documentId: item.id });
            if (!result.success) return;
            result.data.unshift('- - - - - OCR结果已更新 - - - - - - ');
            item.ocrResultShow = result.data;
        },


        // CheckPoint
        // 加载checkPointOptions
        async getListCheckpoint() {
            let request = {
                approvalItemId: this.itemId,
                pageNum: 1,
                pageSize: 500
            };
            let res = await listCheckpoint(request);
            if (!res.success) return;
            this.CheckPointOptions = res.data.records;
        },
        // 展示CheckPoint
        showCheckPoints() {
            this.CheckPointData = [];
            this.selectedCheckPoints.forEach(selected => {
                this.CheckPointOptions.forEach(checkPoint => {
                    if (checkPoint.checkpointId === selected) {
                        // console.log('wantCheckPoint', checkPoint)
                        this.CheckPointData.push(checkPoint);
                    }
                })
            })
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
            this.editForm.cutImgTag = this.cutImgTagList.map(item => item.value);
            this.editForm.initPosition = JSON.parse('[' + this.editForm.initPosition + ']');
            this.editForm.valueField = this.valueFieldList.map(item => item.value);
            this.editForm.valuePattern = this.valuePatternList.map(item => item.value);
            this.editForm.approvalItemId = this.itemId;
            let res = await updateCheckpoint(this.editForm);
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            await this.getListCheckpoint();
            this.showCheckPoints();
        },
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
        // 新增打开弹框
        async addCheckPoint() {
            this.dialogVisbleAddCheckPoint = true;
        },
        // 确认新增
        async addConfirm() {
            console.log(this.cutImgTagList);
            this.addForm.cutImgTag = this.cutImgTagList.map(item => item.value);
            this.addForm.initPosition = JSON.parse('[' + this.addForm.initPosition + ']');
            this.addForm.valueField = this.valueFieldList.map(item => item.value);
            this.addForm.valuePattern = this.valuePatternList.map(item => item.value);
            this.addForm.approvalItemId = this.itemId;
            console.log('this.addForm', this.addForm);
            let res = await addCheckpoint(this.addForm);
            if (!res.success) return;
            this.dialogVisbleAddCheckPoint = false;
            this.getListCheckpoint();
        },


        // SortConfig
        // 加载表单
        async getSortConfigList() {
            let request = {
                approvalItemId: this.itemId,
                pageNum: 1,
                pageSize: 500
            };
            let res = await listSortconfig(request);
            if (!res.success) return;
            this.sortConfigOptions = res.data.records;
        },
        // 展示SortConfig
        showSortConfigs() {
            this.sortConfigData = [];
            this.selectedSortConfigs.forEach(selected => {
                this.sortConfigOptions.forEach(sortConfig => {
                    if (sortConfig.sortconfigId === selected) {
                        // console.log('wantsortConfig', sortConfig)
                        this.sortConfigData.push(sortConfig);
                    }
                })
            })
        },
        // 编辑
        async editSortConfig(row) {
            this.editFormSortConfig = _.cloneDeep(row);
            console.log('this.editFormSortConfig');
            console.log(this.editFormSortConfig);
            this.dialogVisbleEditSortConfig = true;
        },
        // 确认编辑
        async editConfirmSortConfig() {
            let res = await updateSortconfig(this.editFormSortConfig);
            if (!res.success) return;
            this.dialogVisbleEditSortConfig = false;
            await this.getSortConfigList();
            this.showSortConfigs();
        },
        // 新增打开弹框
        async addSortConfig() {
            this.dialogVisbleAddSortConfig = true;
        },
        // 确认新增
        async addConfirmSortConfig() {
            this.addFormSortConfig.approvalItemId = this.itemId;
            console.log('this.addFormSortConfig', this.addFormSortConfig);
            let res = await addSortconfig(this.addFormSortConfig);
            if (!res.success) return;
            this.dialogVisbleAddSortConfig = false;
            this.getSortConfigList();
        },


        // 打开结果展示页面弹框
        openResultsPresentation() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning('请先选择材料图片!');
                return;
            }
            if (this.sortConfigData.length === 0) {
                this.$message.warning('请先选择sortConfig!');
                return;
            }
            if (this.CheckPointData.length === 0 && this.calcMode === 3) {
                this.$message.warning('选择提取模式, 需要选择checkPoint!');
                return;
            }
            if (this.resPresentation) {
                this.resPresentation.approvalItemId = Number(this.itemId);
                this.resPresentation.checkpointIds = this.CheckPointData.map(item => {
                    return item.checkpointId
                })
                this.resPresentation.sortconfigIds = this.sortConfigData.map(item => {
                    return item.sortconfigId
                })
                this.resPresentation.picId = this.multipleSelection.map(item => {
                    return item.id
                })
                this.resPresentation.picListInfo = this.multipleSelection;
                this.resPresentation.calcMode = this.calcMode;
            }
            this.resPresentation && this.resPresentation.openDialog();
        },
        // 下载 支持压缩包和单个图片文件的下载
        async downLoad() {
            this.loadingDownFile = true;
            let res;
            try {
                res = await axios({
                    method: "get",
                    url: "/ai/DocumentKvInfo/downloadAiZip",
                    params: {
                        approvalItemId: this.itemId,
                    },
                    responseType: "arraybuffer",
                    timeout: 1000 * 20
                });
            } catch (error) {
                this.loadingDownFile = false;
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
                    this.$message.warning('哦no，不知道后端的开发又搞了什么乱子！');
                }
            }
            console.log('res');
            console.log(res);
            try {
                let enc = new TextDecoder('utf-8');
                let resJson = JSON.parse(enc.decode(new Uint8Array(res.data)));
                console.log('resJson');
                console.log(resJson);
                this.$message.warning(resJson.msg);
                this.loadingDownFile = false;
                return;
            } catch (err) {
                console.log('下载文件');
                this.loadingDownFile = true;
                if (res.data.byteLength === 0) {
                    this.$message.warning("该事项下没有ai开发文件");
                    return;
                }
                let blob = new Blob([res.data], { type: "application/zip" });
                const a = document.createElement("a");
                // 生成文件路径
                let href = window.URL.createObjectURL(blob);
                a.href = href;
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
                this.loadingDownFile = false;
            }
            return;
        },
    },

}
</script>

<style>
.el-drawer__body {
    overflow: auto;
    /* overflow-x: auto; */
}
</style>

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
                .multiple-show {
                    // background: #cceec5;
                    border: thin #f7f3f3 solid;
                    box-shadow: 1px 1px 5px #e2dddd;
                    border-radius: 10px;
                    overflow-y: auto;
                    height: 725px;
                    padding: 15px;
                    .multiple-show-item {
                        margin: 10px 0;
                    }
                }
                .datatrend-body-item {
                    border: thin #f7f3f3 solid;
                    box-shadow: 1px 1px 3px #e2dddd;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row;
                    align-items: flex-start;
                    justify-content: center;
                    width: 100%;
                    // height: 725px;
                    padding-bottom: 25px;
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
                                width: 30%;
                                padding-left: 10px;
                                border-left: 4px solid #6389e7;
                            }
                            .case-header-mid {
                                width: 70%;
                                margin-bottom: 10px;
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
                                margin-left: 20px;
                                margin-bottom: 10px;
                                font-weight: bold;
                                width: 400px;
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
                            white-space: pre-line;
                            // background: rgb(245, 240, 244);
                            display: flex;
                            flex-direction: column;
                            // align-items: center;
                            margin-top: 18px;
                            .ocr-result-item {
                                font-size: 18px;
                                line-height: 35px;
                            }
                        }
                    }
                }
                // 结果展示运行按钮页面样式
                .results-presentation {
                    border: thin #f7f3f3 solid;
                    box-shadow: 1px 1px 3px #e2dddd;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    padding: 22px 0px;
                    background: #ffffff;
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