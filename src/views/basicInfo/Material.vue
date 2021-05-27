<template>
    <div class="workWrap">
        <header>一级材料</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选材料名称或者模板名称" v-model="valueM" clearable style="width: 200px;"
                    @change="materialSearch"></el-input>
                <el-button @click="materialSearch">搜索</el-button>
                <div class="handle">
                    <el-button type="primary" @click="materialVisible(materialInit)">新建材料</el-button>
                    <!-- <el-button type="primary">导出</el-button> -->
                    <el-button type="primary" @click="handleImport()">导入材料</el-button>
                    <el-button @click="handleClickWordDialog" type="primary" style="margin-bottom:10px">上传模板压缩包
                    </el-button>

                </div>
            </div>
            <el-dialog title="上传word压缩包" :visible.sync="addWordDialogVisible" width="50%" :close-on-click-modal="false">
                历史上传记录
                <el-table :data="tableDataWord" border>
                    <el-table-column prop="fileVersion" label="版本" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="filePath" label="模板文件Name" :formatter="fileNameFormatter"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="operateUser" label="创建者"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                    <el-table-column prop="notes" label="备注"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button @click="handleDownload(scope.row)" type="primary"
                                    :disabled="scope.row.latest === false">下载</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form label-width="80px" :model="addFormWord">

                    <el-form-item label="上传模板">
                        <el-upload class="upload-demo" ref="upload" :action="url" :limit="1" accept=".zip, .rar"
                            :with-credentials="true" :on-success="upFile" :data="this.addFormWord"
                            :on-remove="handleRemove" :on-exceed="handleExceed" :auto-upload="false"
                            :before-upload="customUpload">
                            <el-button type="primary">添加</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传压缩包文件</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="addFormWord.notes"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addWordDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="upload()">确 定</el-button>
                </span>

            </el-dialog>

            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    :row-style="{height:'60px'}" :header-row-style="{height:'50px'}" tooltip-effect="dark"
                    :default-sort="{prop: 'createTime', order: 'descending'}" :height="tableHeight">
                    <el-table-column label="序号" type="index" width="50px" :index="indexMethod"></el-table-column>
                    <el-table-column prop="materialName" label="材料展示名称" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="documentSeq" label="文档序号" width="50px">
                    </el-table-column>
                    <el-table-column prop="isNavigation" label="是否材料清单展示" width="90px"
                        :formatter="isRequiredFormatter">
                    </el-table-column>
                    <el-table-column prop="uploadRequired" label="是否必须上传" width="60px" :formatter="isRequiredFormatter">
                    </el-table-column>
                    <el-table-column prop="navigationOrder" label="导航顺序" width="50px"></el-table-column>
                    <el-table-column prop="descriptionInfo" label="材料逻辑" show-overflow-tooltip width="200">
                    </el-table-column>
                    <el-table-column prop="produceSource" label="产生方式" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="materialNameNotes" label="清单补充说明信息" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="uploadDescription" label="上传逻辑说明" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="logicType" label="子材料逻辑" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable width="160">
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" fixed="right" width="250px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="showPreview(scope.row)">查看预览图</el-button>
                            <el-button size="mini" @click="showTemplate(scope.row)">查看模板</el-button>
                            <el-button size="mini" @click="EditmaterialVisible(scope.row)">编辑</el-button>
                            <el-button size="mini" type="primary" @click="goOnlineDocumentEditor(scope.row)">word编辑
                            </el-button>
                            <el-button size="mini" type="danger" @click="handleDeleteMaterial(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount"></el-pagination>
            </div>
        </section>
        <!-- 创建模板弹窗 -->
        <el-dialog title="新建材料信息" :visible.sync="materialWriteVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="materialT" label-width="30%" class="demo-ruleForm">
                <div>
                    <el-form-item label="关联一级材料">
                        <!-- <el-input v-model="materialT.materialName"></el-input> -->
                        <el-select v-model="materialT.globalDocumentId" placeholder="请选择关联的公共一级材料" clearable filterable
                            remote reserve-keyword :remote-method="remoteMethodBang" :loading="loadingBang"
                            @change="globalDocumentChange" ref="globalDocument">
                            <el-option v-for="item in approvalTextList" :key="item.globalDocumentId"
                                :label="item.globalDocumentName" :value="item.globalDocumentId" />
                            <div class="text-center"
                                style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                <a class="text-normal">
                                    <el-pagination @size-change="handleSizeChangeSelectBang"
                                        @current-change="handleCurrentChangeSelectBang"
                                        :current-page="currentPageSelectBang" :total="totalBang"
                                        :page-size="pageSizeBang" layout="prev, pager, next" />
                                </a>
                            </div>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="材料展示名称">
                        <el-input v-model="materialT.materialName"></el-input>
                    </el-form-item>
                    <el-form-item label="文档序号">
                        <el-input v-model="materialT.documentSeq"></el-input>
                    </el-form-item>
                    <el-form-item label="超级帮办word模板名称">
                        <el-input v-model="materialT.docxTemplateName"></el-input>
                    </el-form-item>
                    <el-form-item label="模板名称(自取)">
                        <el-input v-model="materialT.templateName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否材料清单展示">
                        <el-select v-model="materialT.isNavigation">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导航顺序">
                        <el-input v-model="materialT.navigationOrder" placeholder="请输入数字"></el-input>
                    </el-form-item>
                    <el-form-item label="是否必须上传">
                        <el-select v-model="materialT.uploadRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="上传逻辑说明">
                        <el-input v-model="materialT.uploadDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="材料逻辑">
                        <el-input type="textarea" :rows="3" v-model="materialT.descriptionInfo"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="产生方式">
                            <el-select v-model="produceSource" placeholder="材料的产生来源" multiple>
                                <el-option label="用户自带" value="用户自带"></el-option>
                                <el-option label="现场制作" value="现场制作"></el-option>
                                <el-option label="电子证照" value="电子证照"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <br>
                    <el-form-item label="清单补充说明信息">
                        <el-input v-model="materialT.materialNameNotes"></el-input>
                    </el-form-item>
                    <el-form-item label="子材料逻辑">
                        <el-select v-model="materialT.logicType" placeholder="材料的产生来源">
                            <el-option label="and" value="and"></el-option>
                            <el-option label="or" value="or"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="materialT.note"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="排序">
                        <el-input v-model="materialT.sort"></el-input>
                    </el-form-item> -->
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="materialWriteVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMaterial()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑窗口 -->
        <el-dialog title="编辑材料信息" :visible.sync="editMaterialWriteVisible" width="40%" :close-on-click-modal="false">
            <el-form :model="materialTEdit" label-width="30%" class="demo-ruleForm">
                <div>
                    <el-form-item label="材料名称">
                        <el-input v-model="materialTEdit.materialName"></el-input>
                    </el-form-item>
                    <el-form-item label="文档序号">
                        <el-input v-model="materialTEdit.documentSeq"></el-input>
                    </el-form-item>
                    <el-form-item label="是否材料清单展示">
                        <el-select v-model="materialTEdit.isNavigation">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否必须上传">
                        <el-select v-model="materialTEdit.uploadRequired">
                            <el-option label="是" :value="Number(1)"></el-option>
                            <el-option label="否" :value="Number(0)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="导航顺序">
                        <el-input v-model="materialTEdit.navigationOrder" placeholder="请输入数字"></el-input>
                    </el-form-item>
                    <el-form-item label="材料逻辑">
                        <el-input type="textarea" :rows="3" v-model="materialTEdit.descriptionInfo"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="产生方式">
                            <el-select v-model="produceSource" placeholder="材料的产生来源" multiple>
                                <el-option label="用户自带" value="用户自带"></el-option>
                                <el-option label="现场制作" value="现场制作"></el-option>
                                <el-option label="电子证照" value="电子证照"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <br>
                    <el-form-item label="清单补充说明信息">
                        <el-input v-model="materialTEdit.materialNameNotes"></el-input>
                    </el-form-item>
                    <el-form-item label="上传逻辑说明">
                        <el-input v-model="materialTEdit.uploadDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="子材料逻辑">
                        <el-select v-model="materialTEdit.logicType" placeholder="材料的产生来源">
                            <el-option label="and" value="and"></el-option>
                            <el-option label="or" value="or"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="materialTEdit.note"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="排序">
                        <el-input v-model="materialTEdit.sort"></el-input>
                    </el-form-item> -->
                    <el-form-item label="关联公共一级材料">
                        <el-select v-model="materialTEdit.globalDocumentId" placeholder="请选择关联的公共一级材料" clearable
                            filterable remote reserve-keyword :remote-method="remoteMethodBang" :loading="loadingBang">
                            <el-option v-for="item in approvalTextList" :key="item.globalDocumentId"
                                :label="item.globalDocumentName" :value="item.globalDocumentId" />
                            <!-- <div class="text-center"
                                style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                                <a class="text-normal">
                                    <el-pagination @size-change="handleSizeChangeSelectBang"
                                        @current-change="handleCurrentChangeSelectBang"
                                        :current-page="currentPageSelectBang" :total="totalBang"
                                        :page-size="pageSizeBang" layout="prev, pager, next" />
                                </a>
                            </div> -->
                        </el-select>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editMaterialWriteVisible = false">取 消</el-button>
                <el-button type="primary" @click="editMaterial()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入自选材料 -->
        <el-dialog title="导入自选材料" :visible.sync="importDialogVisible" width="50%" :close-on-click-modal="false">

            <el-form label="事项名称">
                <el-select v-model="temp_page_projectId" placeholder="请选择项目名称" @change="selectProject"
                    style="position:relative;margin: 10px 20px 10px 0px">
                    <el-option v-for="item in projectOptions" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId">
                    </el-option>
                </el-select>
                <el-select clearable filterable placeholder="请选择事项名称或者输入关键词" v-model="idd" @change="selectOne" remote
                    reserve-keyword :remote-method="remoteMethod" :loading="loading"
                    style="position:relative;margin: 10px 20px 10px 0px">
                    <el-option v-for="(v,i) in typeSubItemOptions" :key="i" :label="v.itemName"
                        :value="v.approvalItemId">

                    </el-option>

                    <div class="text-center" style="position: sticky;background: #fff;height:30px;top:0;z-index:1">
                        <a class="text-normal">
                            <el-pagination @size-change="handleSizeChangeSelect"
                                @current-change="handleCurrentChangeSelect" :current-page="currentPageSelect"
                                :total="totalAim" :page-size="pageSize" layout="prev, pager, next" />
                        </a>
                    </div>
                </el-select>
            </el-form>

            <el-table :data="tableDataSS" border row-key="materialId" style="width:80%" ref="checkTable"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" reserve-selection label="选择">
                </el-table-column>
                <!-- <el-table-column prop="materialCode" label="材料编码" width="200"></el-table-column> -->
                <el-table-column prop="materialName" label="材料名称"></el-table-column>
                <el-table-column prop="documentSeq" label="文档序号"></el-table-column>

            </el-table>

            <p>已选中{{temp_selected_fields.length}}个材料</p>
            <el-button type="primary" @click="importSubApproval">确认导入</el-button>
            <el-button type="text" @click="clearSelected">清除所有选择</el-button>
            <el-button @click="importDialogVisible = false">取 消</el-button>
        </el-dialog>
        <!-- 查看材料对应的模板 -->
        <el-dialog title="模板信息" :visible.sync="templateVisible" width="80%" :close-on-click-modal="false">
            <div class="tableWrap">
                <el-button type="primary" @click="addText(tableDataTemplate.length, tableDataTemplate)"
                    style="margin-bottom: 10px">新增模板</el-button>
                <el-table class="workTable" :data="tableDataTemplate" style="width: 100%;" border tooltip-effect="dark">
                    <el-table-column prop="docxTemplateName" label="word模板名称" show-overflow-tooltip>
                        <template slot-scope="scopeD">
                            <el-input v-if="scopeD.row.flag" placeholder="word模板名称"
                                v-model="scopeD.row.docxTemplateName" clearable>
                            </el-input>
                            <span v-else>{{scopeD.row.docxTemplateName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="templateName" label="模板名称—自取" show-overflow-tooltip>
                        <template slot-scope="scopeD">
                            <el-input v-if="scopeD.row.flag" placeholder="模板名称(自取)" v-model="scopeD.row.templateName"
                                clearable>
                            </el-input>
                            <span v-else>{{scopeD.row.templateName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="300">
                        <template slot-scope="scope">
                            <div v-if="scope.row.flag">
                                <el-button size="mini" icon="el-icon-close" @click="closeText(scope.$index, scope.row, tableDataTemplate)">
                                </el-button>
                                <el-button size="mini" type="primary" icon="el-icon-check" @click="saveText(scope.row)">
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button size="mini" type="danger" @click="deleteMaterialTemplate(scope.row)"
                                    icon="el-icon-minus">
                                </el-button>
                                <el-button size="mini" type="primary" @click="Edit(scope.row)" icon="el-icon-edit">
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="templateVisible = false">关闭</el-button>
            </span>
        </el-dialog>
        <Preview ref="previewRef"></Preview>
    </div>
</template>



<script>
import Preview from './materialComponents/Preview';
import basicMixin from "./basicMixin";
import { mixin } from "@/mixin/mixin"
import Vue from "vue";
import { mapState, mapMutations } from 'vuex';
import {
    listMaterial, addMaterial, delMaterial,
    getTemplateByMaterialId, updateMaterial, getByMaterialId,
    copySelectedMaterial, getAllByApprovalItemId,
    listPreTemplatesByMaterialId, savePreTemplate, deletePreTemplate
} from "../../api/basicInfo/material";
import { listApprovalItemByUser, listProjectAll } from "@/api/basicInfo/approval";
import { listGlobalDcument } from '@/api/basicInfo/publicDocument';
import { listAccessory } from "@/api/basicInfo/accessory"
import axios from "axios";
export default {
    name: "Material",
    mixins: [basicMixin, mixin],
    components: {Preview},
    data() {
        return {
            // model: {
            //   type: 'NumberInput',
            //   val: '12',
            //   options: {
            //     type: 'textarea',
            //     placeholder:'输入数字信息',
            //   }
            // },
            type: "material",
            materialT: {
                materialName: '',
                documentSeq: '',
                docxTemplateName: '',
            },
            materialInit: {
                materialName: '',
                documentSeq: '',
                docxTemplateName: '',
            },
            materialTEdit: {
                materialName: '',
                documentSeq: '',
                docxTemplateName: '',
            },
            materialWriteVisible: false,
            editMaterialWriteVisible: false,
            currentPageSelect: 1,
            pageSize: 10,
            selectData: [],
            importDialogVisible: false,
            tableDataSS: [],
            typeSubItemOptions: [],
            idd: "",
            itemId: this.$route.query.itemId,
            temp_selected_fields: [],
            list: [],
            loading: false,
            valueM: "",
            timeRange: [],
            tableData: [],
            totalAim: 0,
            multipleSelection: [],
            tableHeight: 0,
            // 导入字段
            projectId: null,
            temp_page_projectId: null,
            projectOptions: [],
            // 全局材料下拉远程搜索
            approvalTextList: [],
            currentPageSelectBang: 1,
            pageSizeBang: 10,
            totalBang: 0,
            loadingBang: false,

            // 产生来源编辑
            produceSource: [],

            addWordDialogVisible: false,
            addFormWord: {
                approvalItemId: null,
                notes: "",
                type: null,
                operateUser: null,
            },
            url: process.env.VUE_APP_BASE_IP + "/superform/additional/uploadWord",
            tableDataWord: [],

            // 查看材料对应的模板
            templateVisible: false,
            tableDataTemplate: [],
            currentMaterialId: null,
        };
    },
    computed: {
        ...mapState({
            itemInfo: state => state.home.item,
        }),
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.search();
        this.getTableHeight()
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
        // 查看预览图
        showPreview(row) {
            console.log('previewRef', this.$refs.previewRef)
            // this.$refs.previewRef.previewVisble = true;
            this.$refs.previewRef.fatherRow = row;
            this.$refs.previewRef.init();
        },
        // <—————————————— 查看材料对应的模板————————————
        async listTemplate() {
            let res = await listPreTemplatesByMaterialId({ material_id: this.currentMaterialId })
            if (!res.success) return;
            this.tableDataTemplate = res.data;
        },
        showTemplate(row) {
            console.log('row', row);
            this.templateVisible = true;
            this.currentMaterialId = row.materialId;
            this.listTemplate();
        },
        // 新增
        async addText(index, rows) {
            console.log(index, rows)
            rows.splice(index + 1, 0, { flag: true });
        },
        // 取消
        async closeText(index, item, data) {
            if (item.edits) {
                this.$set(item, 'flag', null);
            } else {
                data.splice(index, 1)
            }
            // 刷新了表单，可以清空已填的没用的值
            this.listTemplate();
        },
        // 保存
        async saveText(item) {
            if (item.edits) {
                console.log('editrow', item);
                let request = {
                    materialId: this.currentMaterialId,
                    docxTemplateName: item.docxTemplateName,
                    templateName: item.templateName,
                    materialTemplateId: item.materialTemplateId
                }
                const res = await savePreTemplate(request)
                if (!res.success) return;
                delete item.edits;
                delete item.flag;
            } else {
                console.log('addrow', item);
                let request = {
                    materialId: this.currentMaterialId,
                    docxTemplateName: item.docxTemplateName,
                    templateName: item.templateName
                }
                const res = await savePreTemplate(request)
                if (!res.success) return;
                delete item.flag;
            }
            this.listTemplate();
        },
        // 修改
        Edit(item) {
            this.$set(item, 'flag', true)
            this.$set(item, 'edits', true)
        },
        // 删除
        async deleteMaterialTemplate(item) {
            try {
                await this.$confirm('是否确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await deletePreTemplate({ material_template_id: item.materialTemplateId });
            if (!result.success) return;
            this.listTemplate();
        },
        //  —————————————— 查看材料对应的模板————————————>

        getTableHeight() {
            let tableH = 290
            let tableHeightDetil = window.innerHeight - tableH
            if (tableHeightDetil <= 300) {
                this.tableHeight = 300
            } else {
                this.tableHeight = window.innerHeight - tableH
            }
        },
        getTime(val) {
            console.log(val);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: val,
                approvalItemId: this.$route.query.itemId,
            });
            this.tableData = result.data.records;
        },
        async handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: val,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
            });
            this.tableData = result.data.records;
        },
        //下拉框带分页
        async handleSizeChangeSelect(size) {
            this.selectData = [];
            this.pageSize = size;
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.$route.query.projectId });
            this.typeSubItemOptions = result.data.records;
        },
        async handleCurrentChangeSelect(current) {
            this.selectData = [];
            this.currentPageSelect = current;
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.$route.query.projectId });
            this.typeSubItemOptions = result.data.records;
        },
        //远程搜索
        async remoteMethod(query) {
            if (query !== '') {
                let result = await listApprovalItemByUser({ keyword: query, pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.$route.query.projectId });
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;

                    this.totalAim = result.data.total;
                    this.typeSubItemOptions = result.data.records;

                })
            }
        },
        async remoteMethodBang(query) {
            // if (query !== '') {
            this.currentPageSelectBang = 1;
            let result = await listGlobalDcument({ globalDocumentName: query, pageNum: 1, pageSize: 99999, projectId: this.$route.query.projectId });
            this.loadingBang = true;
            setTimeout(() => {
                this.loadingBang = false;

                this.totalBang = result.data.total;
                this.approvalTextList = result.data.records;

            })
            // }
        },
        // Bangban下拉框带分页
        async handleSizeChangeSelectBang(size) {
            this.selectData = [];
            this.pageSizeBang = size;
            let result = await listGlobalDcument({ pageNum: 1, pageSize: 99999, projectId: this.$route.query.projectId });
            this.approvalTextList = result.data.records;
        },
        async handleCurrentChangeSelectBang(current) {
            this.selectData = [];
            this.currentPageSelectBang = current;
            let result = await listGlobalDcument({ pageNum: 1, pageSize: 99999, projectId: this.$route.query.projectId });
            this.approvalTextList = result.data.records;
        },
        globalDocumentChange(id) {
            this.approvalTextList.forEach(item => {
                if (item.globalDocumentId === id) {
                    this.materialT.produceSource = item.produceSource;
                    this.materialT.materialName = item.globalDocumentName;
                    this.materialT.documentSeq = item.globalDocumentCode;
                    this.materialT.docxTemplateName = `${this.itemInfo.itemNo}_${item.globalDocumentCode}_tpl`;
                    this.produceSource = item.produceSource === null ? [] : item.produceSource.split(',');
                }
            })
        },
        async getApprovalTextList() {
            this.pageSizeBang = 10;
            this.currentPageSelectBang = 1;
            let result = await listGlobalDcument({ pageNum: 1, pageSize: 99999, projectId: this.$route.query.projectId });
            this.approvalTextList = result.data.records;
            this.totalBang = result.data.total;
        },
        async materialSearch() {
            this.currentPage = 1;
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: this.pagesize,
                approvalItemId: this.$route.query.itemId,
                materialStatus: 'Y',
            });

            if (!result.success) return;
            this.totalCount = result.data.total;
            this.tableData = result.data.records;

            this.$message({ type: "success", message: "查询成功" });

        },
        async materialVisible(item) {
            // console.log('item');
            // console.log(item);
            let id = item.materialId;
            if (!id) {
                item = item;
            } else {
                item = await getByMaterialId({ materialId: id });
                item = item.data;
            }

            this.materialT = item;
            // console.log('this.materialT');
            // console.log(this.materialT);
            this.getApprovalTextList();
            this.materialWriteVisible = true;
        },
        async EditmaterialVisible(item) {
            let id = item.materialId;
            item = await getByMaterialId({ materialId: id });
            item = item.data;
            this.materialTEdit = item;
            this.produceSource = item.produceSource === null ? [] : item.produceSource.split(',');
            console.log('this.materialTEdit');
            console.log(this.materialTEdit);
            this.getApprovalTextList();
            this.editMaterialWriteVisible = true;
        },
        //导入材料
        async handleImport() {
            // let result = await listApprovalItem({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.$route.query.projectId });
            // this.totalAim = result.data.total;
            // this.typeSubItemOptions = result.data.records;
            let resultProject = await listProjectAll();
            this.projectOptions = resultProject.data;
            this.importDialogVisible = true;
        },
        async selectProject() {
            this.idd = '';
            this.tableDataSS = [];
            let result = await listApprovalItemByUser({ pageNum: this.currentPageSelect, pageSize: this.pageSize, projectId: this.temp_page_projectId });
            this.typeSubItemOptions = result.data.records;
            this.totalAim = result.data.total;
        },
        async selectOne() {
            this.tableDataSS = [];
            let result = await getAllByApprovalItemId({ approvalItemId: this.idd });
            if (!result.success) return;
            this.total = result.data.total;
            this.tableDataSS = result.data;
        },
        handleSelectionChange(sel) {
            this.temp_selected_fields = sel;
        },
        async importSubApproval() {
            console.log("this.temp_selected_fields:", this.temp_selected_fields);
            if (this.temp_selected_fields.length > 0) {
                // 进行materialName是否重复的检查
                // let a = this.temp_selected_fields.map(v => v.materialName);
                // console.log("a", a);
                // for (let index = 0; index < this.temp_selected_fields.length; index++) {
                //     let field = this.temp_selected_fields[index];
                //     console.log("field.materialName:", field.materialName);
                //     if (this.temp_selected_fields.map(v => v.materialName).indexOf(field.materialName) !== index) {
                //         this.$message({ type: "warning", message: "重复材料:" + field.materialName });
                //         return;
                //     }
                // }

                let selectIds = this.temp_selected_fields.map(f => f.materialId);
                let param = {};
                param["aimsItemId"] = this.itemId;
                param["sourceMaterialIds"] = selectIds;
                let result = await copySelectedMaterial(JSON.stringify(param))
                if (!result.success) return;
                this.$message({ type: "success", message: "导入成功" });
                this.clearSelected();
                this.search();
                this.importDialogVisible = false;
            }
        },
        clearSelected() {
            this.$refs.checkTable.clearSelection();
            this.temp_selected_fields = [];
        },
        //获取材料列表
        async listMaterial() {
            const res = await listMaterial({
                approvalItemId: this.materialT.approvalItemId,
                materialStatus: this.materialT.materialStatus,
                // keyword: this.materialM,
                pageNum: this.currentPage,
                pageSize: this.pagesize
            });
            if (!res.success) return;
            this.totalCount = result.data.total;
            console.log("dadathis.current:", this.current, " dathis.pagesize", this.pagesize, " dathis.totalCount", this.totalCount)
            this.tableData = res.data.records;
            await this.search();
        },
        //增加材料
        async addMaterial() {
            let res;
            this.materialT.produceSource = this.produceSource.toString();
            if (!this.materialT.materialId) {
                this.materialT["materialStatus"] = "Y";
                this.materialT["approvalItemId"] = this.$route.query.itemId;
                console.log("this.materialT ", this.materialT)
                res = await addMaterial(this.materialT);
            } else {
                res = await updateMaterial(this.materialT);
            }

            if (!res.success) return;

            this.$message.success('保存成功');
            this.materialWriteVisible = false;
            this.produceSource = [];
            // this.materialT_item_id = '';
            // if (!this.materialT.materialId) {
            //     await this.search();
            // } else {
            //     await this.materialSearch();
            // }
            await this.search();
        },
        // 编辑材料
        async editMaterial() {
            this.materialTEdit.produceSource = this.produceSource.toString();
            let res = await updateMaterial(this.materialTEdit);
            if (!res.success) return;

            this.$message.success('编辑成功');
            this.editMaterialWriteVisible = false;
            // this.materialT_item_id = '';
            // if (!this.materialTEdit.materialId) {
            //     await this.search();
            // } else {
            //     this.materialT.approvalItemId = this.materialTEdit.approvalItemId;
            //     this.materialT.materialStatus = this.materialTEdit.materialStatus;
            //     await this.materialSearch();
            // }
            await this.search();
        },
        // 删除
        async handleDeleteMaterial(v) {
            let param = {
                materialId: v.materialId
            };
            let id = v.materialId;
            console.log('param');
            console.log(param);
            let isRelevance = await getTemplateByMaterialId(param);
            console.log('isRelevance');
            console.log(isRelevance);
            if (isRelevance.data) {
                try {
                    await this.$confirm('材料已关联超级帮办事项开发模板，是否确定要删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch (e) {
                    return;
                }
            } else {
                try {
                    await this.$confirm('此操作将永久删除该材料, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                } catch (e) {
                    return;
                }
            }

            let result = await delMaterial(param);
            if (!result.success) return;

            // if(!id){
            await this.search();
            // }else{
            // await this.materialSearch();
            // }
        },
        // 自动填写文档编号
        writeDocumentNumberEdit() {
            if (this.materialTEdit.docxTemplateName) {
                let index = this.materialTEdit.docxTemplateName.indexOf('_');
                // console.log('index');
                // console.log(index);
                if (index === -1) return;
                let DocumentNumber = this.materialTEdit.docxTemplateName.slice(index + 1);
                index = DocumentNumber.indexOf('_');
                // console.log('index2');
                // console.log(index);
                if (index === -1) return;
                DocumentNumber = DocumentNumber.slice(0, index);
                this.materialTEdit.documentSeq = DocumentNumber;
            }
        },
        // 跳转到在线文档编辑界面
        goOnlineDocumentEditor(row) {
            console.log('row');
            console.log(row);
            let routeUrl = this.$router.resolve({ name: "OnlineDocumentEditor", query: { 'materialId': row.materialId, 'itemId': this.itemId, 'projectId': this.$route.query.projectId } });
            window.open(routeUrl.href, '_blank');
        },
        // 上传文件
        customUpload(file) {
            let fd = new FormData();
            fd.append("file", file);
            fd.append("approvalItemId", this.itemId)
            fd.append("notes", this.addFormWord.notes)
            fd.append("type", 'word')
            fd.append("operateUser", localStorage.getItem("username"))
            console.log('fd');
            console.log(fd);
            axios.post(
                this.url,
                fd
            )
                .then(
                    (res) => {
                        console.log('res');
                        console.log(res);
                        if (res.data.data === 'SUCCESS') {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.addWordDialogVisible = false;
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                        }
                    },
                );
            return false;
        },
        upload() {
            this.addFormWord.type = 'word';
            this.addFormWord.operateUser = localStorage.getItem("username");
            this.addFormWord.approvalItemId = this.itemId;
            console.log('addFormWord');
            console.log(this.addFormWord);
            this.$refs.upload.submit();
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
        async handleClickWordDialog() {
            this.addWordDialogVisible = true;
            let result = await listAccessory({ approvalItemId: this.itemId, type: 'word' });
            if (!result.success) return;
            this.tableDataWord = result.data;
        },
        fileNameFormatter(row, column, cellValue, index) {
            let location = cellValue.lastIndexOf("\/");
            return cellValue.substring(location + 1);
        },
        async handleDownload(row) {
            await axios({ method: 'get', url: "/superform/additional/downloadWord", params: { approvalItemId: row.approvalItemId, type: row.type }, responseType: 'arraybuffer' }).then((_res) => {
                let blob = new Blob([_res.data], { type: 'application/zip' });
                const a = document.createElement('a')
                // 生成文件路径
                let href = window.URL.createObjectURL(blob)
                a.href = href
                // let _fileName = _res.headers['Content-disposition'].split(';')[1].split('=')[1].split('.')[0]
                let _fileName = _res.headers['content-disposition'].split(';')[1].split('=')[1]
                // 文件名中有中文 则对文件名进行转码
                a.download = decodeURIComponent(_fileName)
                // 利用a标签做下载
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(href)
            })
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
        background: #fff;
        & > * {
            margin-left: 10px;
        }
        .handle {
            margin-left: auto;
            margin-top: -55px;
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
