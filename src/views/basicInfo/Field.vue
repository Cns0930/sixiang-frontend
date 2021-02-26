<template>
    <div class="workWrap">
        <header>材料字段</header>
        <div class="operation-box">
            <el-button @click="addFiledOpen" type="primary">添加</el-button>
            <el-button class="operation-item" @click="openImportDialog" type="primary">导入</el-button>
            <el-input class="operation-item" placeholder="筛选材料名称或者模板名称" v-model="materialKeyword" clearable
                style="width: 200px;" @change="reloadTable"></el-input>
            <el-input class="operation-item" placeholder="筛选字段名称或者字段编号" v-model="fieldKeyword" clearable
                style="width: 200px;" @change="reloadTable"></el-input>
            <el-button class="operation-item" @click="reloadTable">搜索</el-button>

        </div>
        <div class="submitTip">
            <div class="upload-box">
                <el-upload class="upload-demo" ref="upload" :action="url" :limit="1" accept=".xlsx"
                    :with-credentials="true" :on-success="upFile" :on-remove="handleRemove" :on-exceed="handleExceed"
                    :auto-upload="false" :before-upload="customUpload">
                    <el-button type="primary">选择材料字段数据Excel</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
                </el-upload>
                <el-button type="success" @click="upload()" class="upload-input">导入</el-button>
            </div>
            <div class="upload-box" style="margin-left: 20px">
                <el-upload class="upload-demo" ref="uploadNew" :action="url" :limit="1" accept=".xlsx"
                    :with-credentials="true" :on-success="upFile" :on-remove="handleRemove" :on-exceed="handleExceed"
                    :auto-upload="false" :before-upload="customUpload">
                    <el-button type="primary">选择新模板材料Excel</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传Excel文件</div>
                </el-upload>
                <el-button type="success" @click="uploadNew()" class="upload-input">导入</el-button>
            </div>
            <div style="margin-left: 55%">
                <el-button type="primary" @click="upToBangban" class="upload-input">导出成提取点</el-button>
                <el-button type="primary" @click="updown" class="upload-input">导出到帮办字段</el-button>
            </div>
        </div>
        <el-table ref="multipleTables" :data="tableData" border style="width: 100%;margin-top: 10px;"
            :row-style="{height:'60px'}" :header-row-style="{height:'50px'}" :height="tableHeight" v-loading="loading"
            :row-key="getRowKey" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection='true'></el-table-column>
            <el-table-column prop="docxTemplateName" label="模板名称" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column prop="materialName" label="材料名称" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column prop="globalDocumentSubName" label="关联二级材料名称" show-overflow-tooltip width="180">
            </el-table-column>
            <el-table-column prop="fieldName" label="字段名称" show-overflow-tooltip width="180"></el-table-column>
            <el-table-column prop="isRequired" label="是否必填" :formatter="isRequiredFormatter"></el-table-column>
            <el-table-column prop="label" label="前端字段名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fieldNo" label="字段编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="valueSource" label="字段值来源" show-overflow-tooltip></el-table-column>
            <el-table-column prop="defaultValue" label="默认值" show-overflow-tooltip></el-table-column>
            <el-table-column prop="descriptionInfo" label="字段逻辑描述" show-overflow-tooltip width="200"></el-table-column>
            <!-- <el-table-column prop="note" label="备注"></el-table-column> -->
            <el-table-column prop="fieldMeaning" label="定义字段名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="module" label="前端字段模块" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isCheckpoint" label="是否提取点" :formatter="isRequiredFormatter" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="isScreenshot" label="是否为截图" :formatter="isRequiredFormatter" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="screenshotInfo" label="截图信息" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sort" label="4W分类" show-overflow-tooltip></el-table-column>
            <el-table-column prop="classify" label="4W归类" show-overflow-tooltip></el-table-column>
            <el-table-column prop="checkpointSource" label="来源" show-overflow-tooltip></el-table-column>
            <el-table-column prop="checkpointSourceField" label="来源字段" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isOcr" label="是否OCR" :formatter="isRequiredFormatter" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="fieldComponentType" label="字段格式" show-overflow-tooltip></el-table-column>
            <el-table-column prop="optionsValue" label="枚举值" show-overflow-tooltip></el-table-column>
            <el-table-column prop="frontDescriptionInfo" label="前端字段填写逻辑" show-overflow-tooltip></el-table-column>
            <el-table-column prop="globalCheckpointId" label="关联公共信息点主键" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" :formatter="timeFormatter" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120px">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button @click="handleEdit(scope)" type="primary">编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope)">删除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePagination">
            <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>

        <!--添加字段-->
        <el-dialog title="添加材料字段" :visible.sync="addDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label-width="90px" :model="addForm">
                <el-form-item label="材料名称" required>
                    <el-select v-model="addForm.materialW" clearable placeholder="请选择材料名称" @focus="changeMaterialValue">
                        <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                            :value="v.materialId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联二级材料名称" required>
                    <el-select v-model="addForm.approvalItemAndDocumentsubId" clearable placeholder="请选择二级材料名称">
                        <el-option v-for="(v,i) in secondaryMaterialOptions" :key="i" :label="v.globalDocumentSubName"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段名称" required>
                    <el-input v-model="addForm.fieldName"></el-input>
                </el-form-item>
                <el-form-item label="字段编号" required>
                    <el-input v-model="addForm.fieldNo"></el-input>
                </el-form-item>
                <el-form-item label="是否提取点">
                    <el-select v-model="addForm.isCheckpoint" clearable placeholder="是否为提取点">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="前端字段名称">
                    <el-input v-model="addForm.label"></el-input>
                </el-form-item>
                <el-form-item label="字段逻辑描述">
                    <el-input v-model="addForm.descriptionInfo"></el-input>
                </el-form-item>
                <el-form-item label="是否必填">
                    <el-select v-model="addForm.isRequired" clearable placeholder="是否必填">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段值来源">
                    <el-select v-model="addForm.valueSource" filterable allow-create clearable placeholder="字段值来源">
                        <el-option label="前端字段" value="前端字段"></el-option>
                        <el-option label="企业数据" value="企业数据"></el-option>
                        <el-option label="票号数据" value="票号数据"></el-option>
                        <el-option label="默认值" value="默认值"></el-option>
                        <el-option label="系统日期" value="系统日期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认值">
                    <el-input v-model="addForm.defaultValue"></el-input>
                </el-form-item>
                <!-- 2021/2/5新增 -->
                <el-form-item label="定义字段名称">
                    <el-input v-model="addForm.fieldMeaning"></el-input>
                </el-form-item>
                <el-form-item label="前端字段模块">
                    <el-input v-model="addForm.module" placeholder="只允许填入纯数字"></el-input>
                </el-form-item>
                <el-form-item label="是否为截图">
                    <el-select v-model="addForm.isScreenshot" clearable placeholder="是否为截图">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截图信息">
                    <el-input v-model="addForm.screenshotInfo"></el-input>
                </el-form-item>
                <el-form-item label="4W分类">
                    <el-input v-model="addForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="4W归类">
                    <el-input v-model="addForm.classify"></el-input>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select v-model="addForm.checkpointSource" clearable placeholder="来源（客户自带/帮办生成）">
                        <el-option label="客户自带" value="客户自带"></el-option>
                        <el-option label="帮办生成" value="帮办生成"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源字段">
                    <el-input v-model="addForm.checkpointSourceField"></el-input>
                </el-form-item>
                <el-form-item label="是否OCR">
                    <el-select v-model="addForm.isOcr" clearable placeholder="是否为OCR">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 2021/2/25新增 -->
                <el-form-item label="字段格式">
                    <el-input v-model="addForm.fieldComponentType"></el-input>
                </el-form-item>
                <el-form-item label="枚举值">
                    <el-input v-model="addForm.optionsValue"></el-input>
                </el-form-item>
                <el-form-item label="前端字段填写逻辑">
                    <el-input type="textarea" :rows="2" v-model="addForm.frontDescriptionInfo"></el-input>
                </el-form-item>
                <el-form-item label="关联公共信息点主键">
                    <el-select v-model="addForm.globalCheckpointId" clearable filterable placeholder="公共信息名称">
                        <el-option v-for="(v,i) in globalCheckpointOptions" :key="i" :label="v.aliasName"
                            :value="v.checkpointId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="addForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addField">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑字段-->
        <el-dialog title="编辑材料字段" :visible.sync="editDialogVisible" width="50%" :close-on-click-modal="false">
            <el-form label-width="80px" :model="editForm">
                <el-form-item label="材料名称" prop="materialName">
                    <el-select v-model="editForm.materialId" placeholder="请选择材料名称">
                        <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                            :value="v.materialId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联二级材料名称">
                    <el-select v-model="editForm.approvalItemAndDocumentsubId" placeholder="请选择二级材料名称">
                        <el-option v-for="(v,i) in secondaryMaterialOptions" :key="i" :label="v.globalDocumentSubName"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段名称" required prop="fieldName">
                    <el-input v-model="editForm.fieldName"></el-input>
                </el-form-item>
                <el-form-item label="字段编号" required>
                    <el-input v-model="editForm.fieldNo"></el-input>
                </el-form-item>
                <el-form-item label="是否提取点">
                    <el-select v-model="editForm.isCheckpoint" clearable placeholder="是否为提取点">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="前端字段名称">
                    <el-input v-model="editForm.label"></el-input>
                </el-form-item>
                <el-form-item label="字段逻辑描述">
                    <el-input type="textarea" v-model="editForm.descriptionInfo"></el-input>
                </el-form-item>
                <el-form-item label="是否必填">
                    <el-select v-model="editForm.isRequired" clearable placeholder="是否必填">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段值来源">
                    <el-select v-model="editForm.valueSource" filterable allow-create clearable placeholder="字段值来源">
                        <el-option label="前端字段" value="前端字段"></el-option>
                        <el-option label="企业数据" value="企业数据"></el-option>
                        <el-option label="票号数据" value="票号数据"></el-option>
                        <el-option label="默认值" value="默认值"></el-option>
                        <el-option label="系统日期" value="系统日期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认值">
                    <el-input v-model="editForm.defaultValue"></el-input>
                </el-form-item>
                <!-- 2021/2/5新增 -->
                <el-form-item label="定义字段名称">
                    <el-input v-model="editForm.fieldMeaning"></el-input>
                </el-form-item>
                <el-form-item label="前端字段模块">
                    <el-input v-model="editForm.module" placeholder="只允许填入纯数字"></el-input>
                </el-form-item>
                <el-form-item label="是否为截图">
                    <el-select v-model="editForm.isScreenshot" clearable placeholder="是否为截图">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="截图信息">
                    <el-input v-model="editForm.screenshotInfo"></el-input>
                </el-form-item>
                <el-form-item label="4W分类">
                    <el-input v-model="editForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="4W归类">
                    <el-input v-model="editForm.classify"></el-input>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select v-model="editForm.checkpointSource" clearable placeholder="来源（客户自带/帮办生成）">
                        <el-option label="客户自带" value="客户自带"></el-option>
                        <el-option label="帮办生成" value="帮办生成"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源字段">
                    <el-input v-model="editForm.checkpointSourceField"></el-input>
                </el-form-item>
                <el-form-item label="是否OCR">
                    <el-select v-model="editForm.isOcr" clearable placeholder="是否为OCR">
                        <el-option label="是" :value="Number(1)"></el-option>
                        <el-option label="否" :value="Number(0)"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 2021/2/25新增 -->
                <el-form-item label="字段格式">
                    <el-input v-model="editForm.fieldComponentType"></el-input>
                </el-form-item>
                <el-form-item label="枚举值">
                    <el-input v-model="editForm.optionsValue"></el-input>
                </el-form-item>
                <el-form-item label="前端字段填写逻辑">
                    <el-input type="textarea" :rows="2" v-model="editForm.frontDescriptionInfo"></el-input>
                </el-form-item>
                <el-form-item label="关联公共信息点主键">
                    <el-select v-model="editForm.globalCheckpointId" clearable filterable placeholder="公共信息名称">
                        <el-option v-for="(v,i) in globalCheckpointOptions" :key="i" :label="v.aliasName"
                            :value="v.checkpointId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="editForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editField">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导出字段 -->
        <el-dialog title="导出到帮办字段" :visible.sync="updownDialogVisible" width="60%" :close-on-click-modal="false">
            <div style="margin-bottom:10px" v-if="taglists.length">已自动为您去除重复项
                <el-tag type="info" v-for="(item,index) in taglists" :key="index" style="margin-left:10px">{{item}}
                </el-tag>
            </div>
            <el-table class="workTable" :data="tableDataDown" style="width:95%;" border tooltip-effect="dark">
                <el-table-column label="序号" type="index" width="60" :index="indexMethod"></el-table-column>
                <el-table-column prop="fieldNo" label="字段编号" width="200"></el-table-column>
                <el-table-column prop="label" label="前端字段名称"></el-table-column>
                <el-table-column prop="fieldComponentName" label="组件类型" fixed="right">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.fieldComponentName" clearable placeholder="请选择组件类型"
                            @change="(val)=>typeChange(val,scope.row)">
                            <el-option v-for="(v,i) in typeOptions" :key="i" :label="v.label" :value="v.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type='primary' @click="submitDown">确认导出</el-button>
            </span>
        </el-dialog>

        <!-- 导入字段 -->
        <el-dialog title="导入材料字段" :visible.sync="importDialogVisible" width="75%" :close-on-click-modal="false">
            <div class="searchBox">
                <el-input placeholder="筛选事项名称/材料名称/材料编码" v-model="reloadTableItem.keyword" clearable
                    style="width: 250px;" @keyup.native.enter='materialSearch' @change="materialSearch"></el-input>
                <el-button @click="materialSearch">搜索</el-button>
            </div>

            <el-table ref="multipleTable" class="workTable" :data="tableDataImport" style="width: 100%;" border
                tooltip-effect="dark">
                <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>
                <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip width="120"></el-table-column>
                <el-table-column prop="itemName" label="审批事项名称"></el-table-column>
                <el-table-column prop="materialCode" label="材料编码" width="140" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="materialId" label="材料ID" width="100" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="materialName" label="材料名称"></el-table-column>

                <el-table-column label="是否关联" fixed="right" width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isRelevance">
                            <span style="display: none;">{{scope.$index}}</span>
                        </el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop="materialName" label="关联材料名称" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.aimsMaterialId" clearable placeholder="请选择材料名称">
                            <el-option v-for="(v,i) in typeMaterialOptions" :key="i" :label="v.materialName"
                                :value="v.materialId"> </el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type='text' @click="LookMaterial(scope.row)">查看该材料字段</el-button>
                        <el-button type='text' @click="importMaterial(scope.row)">导入字段</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChangeImport" :current-page.sync="currentPageImport"
                    :page-size="reloadTableItem.pagesize" layout="total, prev, pager, next" :total="totalImport">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 查看字段 -->
        <el-dialog :title="getMaterialName" :visible.sync="lookFieldsDialogVisible" width="50%"
            :close-on-click-modal="false">
            <div v-if="this.lookFieldsData.length !== 0">
                <el-row :gutter="20" v-for="(item,index) in lookFieldsData" :key="index">
                    <el-col :span="6" v-for="fieldName in item" :key="fieldName">
                        <div class="grid-content bg-purple">{{fieldName}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="grid-content bg-purple">{{noLookFieldsData}}</div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="lookFieldsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="importMaterial(materialRow)">导 入</el-button>
            </span>
        </el-dialog>

        <!-- 上传提示信息 -->
        <el-dialog title="上传信息提示" :visible.sync="uploadDialogVisible" width="30%" center>
            <span class="uploadBackInfo-title">关联材料不存在：</span>
            <br>
            <p>{{ uploadBackInfo.关联材料不存在 }}</p>
            <br><br>
            <span class="uploadBackInfo-title">同情形下名称相同：</span>
            <br>
            <p>{{ uploadBackInfo.同情形下名称相同 }}</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="uploadDialogVisible = false">确 认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import defs from "../attributeComponents/index";
import basicMixin from "./basicMixin";
import { mixin } from "@/mixin/mixin"
import { mapState } from "vuex";
import {
    getField, addField, updateField, deleteField,
    getAllByApprovalItemId, listField,
    listFieldUnionMaterial, listAllMaterial, importfields, lookfields, listFieldNosByIds, updateFieldComponentName, saveBatch,
    saveBatchCheck
} from "@/api/basicInfo/field";
import { listGlobalCheckpoint} from '@/api/basicInfo/examination'
import { listItemAndDocumentSub } from "@/api/basicInfo/approvalSub";
import dayjs from "dayjs";
import { getRolelist } from '@/api/item';
import axios from "axios";
export default {
    name: "FieldItem",
    mixins: [basicMixin, mixin],
    data() {
        return {
            taglists: [],
            loading: false,
            // 页面信息
            type: "field",
            itemId: this.$route.query.itemId,
            addDialogVisible: false,
            // 搜索
            materialKeyword: '',
            fieldKeyword: '',
            tableData: [],
            material_change: "",
            pageSize: 50,
            currentPage: 1,
            typeMaterialOptions: [],
            globalCheckpointOptions: [],
            secondaryMaterialOptions: [],
            total: 0,
            addForm: {
                note: "",
            },
            editDialogVisible: false,
            editForm: {
                fielditemId: 0,
                note: "",
            },
            // 导入材料字段相关
            importDialogVisible: false,
            tableDataImport: [],
            totalImport: null,
            currentPageImport: 1,
            totalImport: null,
            reloadTableItem: {
                approvalItemId: null,
                pageNum: null,
                pageSize: null,
                keyword: null,
                materialStatus: null,
            },
            importRequest: {
                aimsMaterialId: null,
                approvalItemId: null,
                materialId: null,
            },
            // 导入材料->查看该材料下字段
            lookFieldsDialogVisible: false,
            materialRow: null,
            lookFieldsData: [],
            getMaterialName: null,
            noLookFieldsData: null,
            // 文件上传
            fileList: [],
            url: process.env.VUE_APP_BASE_IP + "/ss/Import/ssFieldImportData",
            urlNew: process.env.VUE_APP_BASE_IP + "/ss/Import/ssFieldNewImportData",
            uploadUrl: '',
            uploadDialogVisible: false,
            uploadBackInfo: {
                关联材料不存在: null,
                同情形下名称相同: null,
            },
            tableHeight: 600,
            //导出
            multipleSelection: [],
            tableDataDown: [],
            subdownList: [],
            updownDialogVisible: false,
            typeOptions: defs.map(v => ({ value: v.value, label: v.label })),
        };
    },
    computed: {
        ...mapState({
            roles: state => state.config.roles,

        })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        this.materialList();
        this.reloadTable();
        this.getSecondaryMaterialOptions();
        this.getTableHeight();

    },
    //挂载window.onresize事件
    mounted() {
        let _this = this
        window.onresize = () => {
            if (_this.resizeFlag) {
                clearTimeout(_this.resizeFlag)
            }
            _this.resizeFlag = setTimeout(() => {
                _this.getTableHeight()
                _this.resizeFlag = null
            }, 100)
        }
    },
    // 注销window.onresize事件
    beforeRouteLeave(to, from, next) {
        //离开组件的时候触发
        window.onresize = null
        next()
    },
    methods: {
        // 查询表格
        async reloadTable() {
            console.log("this.itemId:", this.$route.query.itemId)
            let result = await listFieldUnionMaterial({ approvalItemId: this.itemId, pageNum: this.currentPage, pageSize: this.pageSize, materialKeyword: this.materialKeyword, fieldKeyword: this.fieldKeyword });
            if (!result.success) return;
            this.tableData = result.data.records;
            this.total = result.data.total;
        },
        //  切页
        handleCurrentChange() {
            this.reloadTable();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.reloadTable();
        },
        // 查询当前事项下的所有材料
        async materialList() {
            let result = await getAllByApprovalItemId({ approvalItemId: this.itemId });
            if (!result.success) return;
            this.typeMaterialOptions = result.data;
        },
        // 查询二级材料作关联下拉选项
        async getSecondaryMaterialOptions() {
            let result = await listItemAndDocumentSub({ approvalItemId: this.itemId, pageNum: 1, pageSize: 1000 });
            if (!result.success) return;
            this.secondaryMaterialOptions = result.data.records;
        },
        // 添加字段的导入材料字段
        changeMaterialValue() {
            this.typeMaterialOptions.forEach(v => {
                if (v.materialName === null) {
                    v.materialName = v.docxTemplateName;
                }
            })
        },
        // 打开添加弹窗
        async addFiledOpen() {
            this.addDialogVisible = true;
            let params = {
                // globalDocumentSubName:this.globalDocumentSubName,
                // checkpointName:this.checkpointName,
                projectId: this.$route.query.projectId,
                // aliasName: this.aliasName,
            }
            let result = await listGlobalCheckpoint(params);
            if(!result.success) return;
            this.globalCheckpointOptions = result.data.records;
        },
        // 添加
        async addField() {
            this.addForm.approvalItemId = this.itemId
            this.addForm.materialId = this.addForm.materialW
            let result = await addField(
                this.addForm
            )
            if (!result.success) {
                this.$message.warning('添加失败');
                return;
            }
            this.addDialogVisible = false;
            this.reloadTable();
            this.$message({ type: "success", message: "添加成功" })

        },

        // 处理编辑
        async handleEdit(scope) {
            this.editForm = _.clone(scope.row);
            this.material_change = scope.row.materialName;
            this.editDialogVisible = true;
            let params = {
                projectId: this.$route.query.projectId,
            }
            let result = await listGlobalCheckpoint(params);
            if(!result.success) return;
            this.globalCheckpointOptions = result.data.records;
        },
        // 编辑
        async editField() {
            let result = await updateField(this.editForm);
            if (!result.success) return;
            this.reloadTable();
            this.editDialogVisible = false;
        },
        // 删除
        async handleDelete(scope) {

            try {
                await this.$confirm("是否删除", "确认删除",);
                let result = await deleteField({ fieldId: scope.row.fieldId });
                if (!result.success) return;
                this.$message({ type: "success", message: "删除成功" })
                this.reloadTable();
            } catch (e) {
                this.$message({ type: "warning", message: "取消删除" })
            }


        },
        // 导出到前端字段

        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val;
        },
        getRowKey(row) {
            return row.fieldId
        },
        // 导出到前端字段
        async updown() {
            let vm = this
            let fieldIdList = this.multipleSelection.map(e => e.fieldId)
            let result = await listFieldNosByIds({ fieldIdList })
            this.taglists = result.data
            console.log(result)
            if (result.data.length) {
                let lists = []
                result.data.forEach(e => {
                    console.log(e)
                    if (!lists.length) {
                        lists = vm.multipleSelection.filter(ele => ele.fieldNo != e)
                    } else {
                        lists = lists.filter(ele => ele.fieldNo != e)
                    }
                })
                this.tableDataDown = lists
            } else {
                this.tableDataDown = this.multipleSelection
            }
            this.updownDialogVisible = true
        },
        async upToBangban() {
            let result = await saveBatchCheck({ approvalItemId: this.itemId });
            if (!result.success) {
                this.$message.warning('转到帮办字段失败')
            } else {
                this.$message.success('转到帮办字段成功')
                if(result.data.length === 0) return;
                const h = this.$createElement;
                this.$notify({
                    title: '以下字段缺少二级材料未导出提取点',
                    message: h('i', { style: 'color: teal; white-space:pre-line' }, JSON.stringify(result.data).replace(/,/g,"\n")),
                    duration: 0
                });
            }
        },
        async close() {
            await this.reloadTable();
            this.updownDialogVisible = false
        },
        async typeChange(val, item) {
            console.log(val, item)
            let res = await updateFieldComponentName({ fieldId: item.fieldId, fieldComponentName: val })
            console.log(res)
        },
        // 确认导出
        async submitDown() {
            console.log(this.tableDataDown)
            let vm = this
            this.subdownList = []
            this.tableDataDown.forEach(ele => {
                if (ele.fieldComponentName) {
                    let def = defs.find(v => v.value == ele.fieldComponentName);
                    console.log("def:", def)
                    let ComponentDefClass = def.componentDef
                    let fieldType = (ele.fieldComponentName == "computed" || ele.fieldComponentName == "checkpoint") ? 2 : 1;
                    let isList = !!def.isList;
                    let v = {
                        fieldNo: ele.fieldNo,
                        type: ele.fieldComponentName,
                        label: ele.label,
                        fieldComponentName: ele.fieldComponentName,
                        fieldType,
                        isList,
                        componentDefs: new ComponentDefClass()
                    };
                    let param = {
                        fieldId: ele.fieldId,
                        fieldNo: v.fieldNo,
                        label: v.label,
                        fieldComponentName: v.componentDefs?.type?.value,
                        fieldName: ele.fieldName,
                        approvalItemId: vm.itemId,
                        descriptionInfo: ele.descriptionInfo,
                        fieldType,
                        object: v,
                    }
                    if (vm.roles.includes("admin") || vm.roles.includes("developer")) {
                        param.createRole = "developer";
                    } else {
                        param.createRole = "researcher";
                    }
                    vm.subdownList.push(param)
                }
            })
            let res = await saveBatch({ fieldsList: this.subdownList })
            console.log(res)
            if (res.success) {
                this.$refs.multipleTables.clearSelection();
                await this.close()
                this.$message.success('导出字段成功')
            }

        },
        // 导入字段相关
        async reloadImportTable() {
            console.log("this.itemId:", this.$route.query.itemId)
            this.reloadTableItem.pageNum = this.currentPageImport;
            let result = await listAllMaterial(this.reloadTableItem);
            if (!result.success) return;
            this.tableDataImport = result.data.records;
            this.tableDataImport.forEach(item => {
                this.$set(item, "aimsMaterialId", null);
                this.$set(item, "isRelevance", true);
            });
            this.totalImport = result.data.total;
        },
        handleCurrentChangeImport() {
            this.reloadImportTable();
        },
        materialSearch() {
            this.currentPageImport = 1;
            this.reloadImportTable();
        },
        openImportDialog() {
            this.reloadImportTable();
            this.importDialogVisible = true;
        },
        async importMaterial(row) {
            console.log('row');
            console.log(row);
            this.importRequest = {
                aimsMaterialId: null,
                approvalItemId: null,
                materialId: null,
            };
            this.importRequest.approvalItemId = this.itemId;
            this.importRequest.materialId = row.materialId;
            if (row.isRelevance) {
                if (row.aimsMaterialId === null) {
                    this.$message({ type: "warning", message: "请选择要导入的材料" });
                    return;
                }
                this.importRequest.aimsMaterialId = row.aimsMaterialId;
            }
            let result = await importfields(this.importRequest);
            if (!result.success) {
                this.$message({ type: "warning", message: "导入失败" });
                return;
            } else if (result.data === 0) {
                this.$message({ type: "warning", message: "该材料下无字段可导入" });
                return;
            } else {
                this.reloadTable();
                this.$message({ type: "success", message: "导入成功" });
                this.lookFieldsDialogVisible = false;
            }
        },
        async LookMaterial(row) {
            this.lookFieldsData = [];
            this.noLookFieldsData = null;
            console.log('row');
            console.log(row);
            if (row.materialName !== null) {
                this.getMaterialName = row.materialName;
            } else {
                this.getMaterialName = '无材料名';
            }
            this.materialRow = row;
            let result = await lookfields({ materialId: row.materialId });
            let fieldData = [];
            if (result.data.length === 0) {
                this.noLookFieldsData = '该材料下无对应的字段';
            } else {
                this.noLookFieldsData = null;
            }
            let y = 0;
            for (let i = 0; i < result.data.length; i += 1) {
                fieldData.push(result.data[i].fieldName);
                y += 1;
                if (y === 4) {
                    this.lookFieldsData.push(fieldData);
                    y = 0;
                    fieldData = [];
                }
            }
            this.lookFieldsData.push(fieldData);
            this.lookFieldsDialogVisible = true;
        },
        // 跳转到帮办工具模块并打开新标签页
        goFormconstructor() {
            let routeUrl = this.$router.resolve({ name: "FormConstructor", query: { 'itemId': this.$route.query.itemId } });
            window.open(routeUrl.href, '_blank');
            // this.$router.push({ name: "FormConstructor", query:{'itemId': this.$route.query.itemId }});
        },
        // 上传文件
        customUpload(file) {
            this.loading = true
            let fd = new FormData();
            fd.append("file", file);
            fd.append("approvalItemId", this.itemId);
            console.log('fd');
            console.log(fd);
            // console.log('this.uploadUrl', this.uploadUrl)
            axios.post(
                this.uploadUrl,
                fd
            )
                .then(
                    (res) => {
                        console.log('res');
                        console.log(res);
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            const h = this.$createElement;
                            this.$notify({
                                title: 'Excel上传消息提示',
                                message: h('i', { style: 'color: teal; white-space:pre-line' }, JSON.stringify(res.data.data).replace(/,/g,"\n")),
                                duration: 0
                            });
                            this.reloadTable();
                            this.$refs.upload.clearFiles();
                            this.uploadBackInfo = res.data.data;
                            this.loading = false;
                            // this.uploadDialogVisible = true;
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                            this.loading = false;
                        }
                    },
                );
            return false;
        },
        upload() {
            this.uploadUrl = this.url;
            this.$confirm('会全部覆盖，是否继续导入？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$refs.upload.submit();
            }).catch(_ => { });
        },
        uploadNew() {
            this.uploadUrl = this.urlNew;
            this.$confirm('会全部覆盖，是否继续导入？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$refs.uploadNew.submit();
            }).catch(_ => { });
        },
        // 成功上传文件
        upFile(res, file) {
            if (res.status == 200) {
                this.$message.success(res);
            }
        },
        // 上传文件超出个数
        handleExceed(files, fileList) {
            this.$message.warning(`只能选择上传 1 个文件`);
        },
        //  移除文件
        handleRemove(file, fileList) {
        },
        getTableHeight() {
            let tableH = 330
            let tableHeightDetil = window.innerHeight - tableH
            if (tableHeightDetil <= 300) {
                this.tableHeight = 300
            } else {
                this.tableHeight = window.innerHeight - tableH
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99%;
    height: calc(100% - 22px);
    .submitTip {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .operation-box {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .operation-item {
            margin-right: 15px;
        }
    }
    .upload-box {
        padding: 10px 12px 12px 12px;
        width: 230px;
        background: #f0f2f5;
        display: flex;
        flex-direction: row;
        .upload-demo {
            width: 160px;
        }
        .upload-input {
            height: 26px;
        }
    }
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
    }
    .searchBox {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        background: #fff;
    }
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #ffffff;
    }
    .bg-purple {
        background: #ffffff;
    }
    .bg-purple-light {
        background: #ffffff;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .right-bar {
        .button {
            //   width: 60px;
            //   height: 20px;
            font-size: 18px;
            font-weight: 600;
            font-family: Tahoma, Helvetica, "Arial", "Microsoft YaHei", "宋体",
                sans-serif;
        }
    }
    .uploadBackInfo-title {
        font-size: 18px;
        margin: 20px auto;
        font-weight: bold;
        line-height: 20px;
    }
}
</style>