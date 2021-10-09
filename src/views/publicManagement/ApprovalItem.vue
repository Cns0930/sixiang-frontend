<template>
    <div class="workWrap">
        <header>事项管理</header>
        <section class="workBox">
            <div class="searchBox">
                <!-- <el-select placeholder="筛选项目" v-model="filterProjectId" filterable clearable style="width: 200px;">
                    <el-option v-for="(v,i) in projectOptions" :key="i" :label="v.projectName" :value="v.projectId">
                    </el-option>
                </el-select> -->
                <el-select placeholder="筛选大项" v-model="filterApprovalId" filterable clearable style="width: 200px;">
                    <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName" :value="v.approvalId">
                    </el-option>
                </el-select>
                <el-input placeholder="搜索事项" v-model="filterKeyword" clearable style="width: 200px;"
                    @change="searchItem">
                </el-input>
                <el-date-picker v-model="timeRange" type="daterange" range-separator="至" start-placeholder="创建时间开始日期"
                    @change="getTime" end-placeholder="创建时间截止日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                <el-button @click="searchItem">
                    搜索
                </el-button>
                <div class="handle">
                    <el-button type="primary" @click="handleClickAdd" v-btn>
                        新增
                    </el-button>
                    <!-- <el-button type="primary">导出</el-button>
                    <el-button type="primary">导入</el-button> -->
                </div>
            </div>
            <div class="tableWrap">
                <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">

                    <!-- <el-table-column prop="projectName" label="项目" sortable >
                    </el-table-column> -->
                    <el-table-column prop="approvalName" label="大项" show-overflow-tooltip sortable>
                    </el-table-column>
                    <el-table-column prop="itemInternalNo" label="内部事项编号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemNo" label="事项编号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="事项名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="handleClickItemDefault(scope.row)" type="text" style="color: orange;">
                                {{scope.row.itemName}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="itemType" label="事项类型" >
                    </el-table-column> -->
                    <!-- <el-table-column prop="itemCode" label="事项实施编码"  show-overflow-tooltip> -->
                    <!-- </el-table-column> -->
                    <el-table-column prop="createBy" label="创建人">
                    </el-table-column>
                    <el-table-column prop="itemStage" label="事项阶段">
                    </el-table-column>
                    <el-table-column prop="projecLabelList" label="事项标签" width="220">
                        <template slot-scope="scope">
                            <div v-for="(item,i) in scope.row.projectLabelNameList" :key="i">
                                <el-tag>{{item}}</el-tag>
                            </div>
                            <div>
                                <el-select v-model="scope.row.projectLabelIdList" multiple collapse-tags style=""
                                    placeholder="请选择" @change="changeTags(scope.row)">
                                    <el-option v-for="item in tagOptions" :key="item.projecLabelId" :label="item.labelName"
                                        :value="item.projecLabelId">
                                    </el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="itemStatus" label="状态" sortable  width="50">
                    </el-table-column> -->
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="260">
                        <template slot-scope="scope">
                            <el-button-group>
                                <!-- <el-button size="mini" @click="handleClickItem(scope.row)">
                                    调研信息
                                </el-button>
                                <el-button size="mini" @click="handleClickItemBangBan(scope.row)">
                                    帮办工具
                                </el-button> -->
                                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
                                    :disabled="!hasManagePermission">
                                    编辑
                                </el-button>
                                <el-button size="mini" type="danger" @click="handleClose(scope.row)"
                                    :disabled="!hasManagePermission">
                                    关闭
                                </el-button>
                                <el-button size="mini" @click="handleItemStage(scope.row)">
                                    修改事项阶段
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pagesize" layout="total, prev, pager, next" :total="totalCount">
                </el-pagination>
            </div>
        </section>

        <section class="dialogBox">
            <!-- 新建窗口 -->
            <el-dialog title="事项属性填写" :visible.sync="dialogAddVisible" width="80%" :close-on-click-modal="false"
                :show-close='false'>
                <div class="attribute-content">
                    <el-form :model='tempItem' ref="tempItem" :inline="false" label-position="left"
                        class="demo-form-inline" :rules="rules">
                        <!-- <el-form-item label="项目" prop="projectId">
                            <el-select v-model="tempItem.projectId" filterable>
                                <el-option v-for="(v,i) in projectOptions" :key="i" :label="v.projectName"
                                    :value="v.projectId">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="大项" prop="approvalId">
                            <el-select v-model="tempItem.approvalId" filterable>
                                <el-option v-for="(v,i) in approvalOptions" :key="i" :label="v.approvalName"
                                    :value="v.approvalId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="事项编号" prop="itemNo">
                            <el-input v-model="tempItem.itemNo">
                            </el-input>
                        </el-form-item>
                        <!-- <el-form-item label="事项内部编号">
                            <el-input v-model="tempItem.itemInternalNo">
                            </el-input>
                        </el-form-item> -->
                        <!-- <el-form-item label="事项实施编码" prop="itemCode">
                            <el-input v-model="tempItem.itemCode">
                            </el-input>
                        </el-form-item> -->
                        <el-form-item label="事项名称" prop="itemName">
                            <el-input v-model="tempItem.itemName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="事项类型(如新增/变更)" prop="itemType">
                            <el-input v-model="tempItem.itemType">
                            </el-input>
                        </el-form-item>
                        <!-- <el-form-item label="排序">
                            <el-input v-model="tempItem.sort">
                            </el-input>
                        </el-form-item> -->
                        <el-form-item label="办件类型">
                            <el-select v-model="tempItem.sujectType" multiple filterable placeholder="个人/企业"
                                style="width:300px">
                                <el-option :value="Number(0)" label="个人"></el-option>
                                <el-option :value="Number(1)" label="企业"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm(tempItem)">
                        取消
                    </el-button>
                    <el-button type="primary" @click="saveItem(tempItem)">
                        确定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑窗口 -->
            <EditItemInfoDialog ref="editDialog" @changeMain="updateItem" />

            <!-- 事项多版本查看导入 -->
            <el-dialog title="版本列表" :visible.sync="dialogVisibleVersion" width="80%" :close-on-click-modal="false">

                <el-table ref="versionTable" :data="versionList" border style="width: 100%" row-key="id">
                    <el-table-column label="序号" type="index" width="50" :index="indexMethod"></el-table-column>
                    <el-table-column prop="version" label="版本号"></el-table-column>
                    <el-table-column prop="username" label="提交人"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter"></el-table-column>
                    <el-table-column prop="latest" label="是否最新" :formatter="formatBoolean"></el-table-column>
                    <el-table-column prop="note" label="备注信息"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="200px">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="primary" :loading="scope.row.loadingImport"
                                    @click="confirmImport(scope.row)">确认导入</el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleVersion = false">
                        关闭
                    </el-button>
                </span>
            </el-dialog>
            <!-- 修改事项阶段弹窗 -->
            <el-dialog title="修改事项阶段" :visible.sync="dialogVisibleStage" width="40%" :close-on-click-modal="false">
                <div>
                    <el-select v-model="tempStage">
                        <el-option value="开发中" label="开发中"></el-option>
                        <el-option value="提测" label="提测"></el-option>
                        <el-option value="验收" label="验收"></el-option>
                        <el-option value="停用" label="停用"></el-option>
                        <el-option value="demo" label="demo"></el-option>
                    </el-select>

                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibleStage = false">
                        关闭
                    </el-button>
                    <el-button type="primary" @click="confirmStage">确认</el-button>
                </span>
            </el-dialog>
        </section>
    </div>
</template>



<script>

import { mixin } from "@/mixin/mixin"
import Vue from "vue";
import VueCompositionAPI from '@vue/composition-api'
import { ref } from "@vue/composition-api";
// 组件
import EditItemInfoDialog from "@/views/basicInfo/basicInfoComponents/EditItemInfoDialog"

import { mapGetters } from "vuex"
import {
    listApprovalAll,
    addApprovalItem,
    getByApprovalItemId,
    shutApprovalItem,
    listApprovalItem,
    exApprovalItem,
    listVersionItem,
    obtainVersionItem, isNewItemVersion, updateItemStage
} from "../../api/basicInfo/approval";

import { listProjecLabel, saveOrUpdateLabelAndApprovalitem } from "@/api/basicInfo/tags"

export default {
    name: "ApprovalItem",
    mixins: [mixin],
    components: { EditItemInfoDialog },
    setup() {
        const editDialog = ref(null);
        return {
            editDialog,
        }
    },
    data() {
        return {
            // 页面信息
            type: "work",
            // 筛选
            filterProjectId: null,
            filterApprovalId: null,
            filterKeyword: "",
            timeRange: [],
            // 表格
            tableData: [],
            tagOptions: [],
            // 弹窗
            dialogAddVisible: false,
            tempItem: {},
            projectOptions: [],
            approvalOptions: [],
            currentPage: 1,
            pagesize: 15,
            totalCount: 0,
            rules: {
                // projectId: [
                //     { required: true, message: '请选择项目', trigger: 'change' },
                // ],
                approvalId: [
                    { required: true, message: '请选择大项', trigger: 'change' }
                ],
                itemNo: [
                    { required: true, message: '请输入事项编号', trigger: 'blur' },
                ],
                // itemCode: [
                //     { required: true, message: '请输入事项实施编号', trigger: 'blur' }
                // ],
                itemName: [
                    { required: true, message: '请输入事项名称', trigger: 'blur' },
                ],
                itemType: [
                    { required: true, message: '请输入事项类型', trigger: 'blur' }
                ],
            },
            // 事项多版本相关
            dialogVisibleVersion: false,
            versionList: [],
            currentItemInfo: {},
            currentClickButton: '',
            // 修改事项阶段弹窗
            dialogVisibleStage: false,
            tempStage: '',
            tempRow: {},
        };
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.searchItem();
        await this.loadOptions();

        let itemInfo = this.$store.state.home.item;
        itemInfo.approvalItemId = null;
        itemInfo.itemName = null;
        itemInfo.itemNo = null;
        this.$store.commit("changeItem", itemInfo);
        sessionStorage.removeItem('itemInfo');

    },
    methods: {
        // 修改事项阶段
        handleItemStage(row) {
            this.dialogVisibleStage = true
            this.tempStage = row.itemStage
            this.tempRow = row
        },
        // 确认阶段更改
        async confirmStage() {
            let res = await updateItemStage({ approvalItemLordId: this.tempRow.approvalItemLordId, itemStage: this.tempStage })
            if (!res.success) return
            this.$message.success('修改阶段成功')
            this.list()
            this.dialogVisibleStage = false
        },
        getTime(val) {
            console.log(val);
        },
        async handleEdit(index, row) {

            let res = await getByApprovalItemId({
                approvalItemId: row.approvalItemLordId,
                exLord: true,
            });
            if (!res.success) {
                return;
            }
            this.tempItem = res.data;
            this.tempItem.approvalItemId = row.approvalItemLordId;
            this.tempItem.sujectType ? this.tempItem.sujectType = this.tempItem.sujectType.split(',').map(Number) : [];
            this.editDialog && this.editDialog.openDialog();
            this.editDialog.tempItem = this.tempItem
        },
        async handleClickAdd() {
            this.dialogAddVisible = true;
            this.tempItem = {};
            await this.loadOptions();
        },
        //新增取消
        resetForm(tempItem) {
            this.dialogAddVisible = false
            this.$refs.tempItem.resetFields();
        },
        // 新增保存
        async saveItem(tempItem) {
            tempItem.projectId = this.$route.query.projectId;
            this.tempItem.sujectType = this.tempItem.sujectType.toString();
            this.$refs.tempItem.validate(async (valid) => {
                if (valid) {
                    this.tempItem.createBy = localStorage.getItem("username");
                    let res = await addApprovalItem(this.tempItem);
                    if (res.success) {
                        this.$message.success("事项保存成功!");
                        this.tempItem = {};
                        this.dialogAddVisible = false;
                        this.list();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        async updateItem() {
            await this.list();
        },
        async loadOptions() {
            // 获取选项
            // let projectRes = await listProjectAll();
            // if (projectRes.success) {
            //     this.projectOptions = projectRes.data;
            // }
            let approvalRes = await listApprovalAll({ projectId: this.$route.query.projectId });
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
            let tagRes = await listProjecLabel({ projectId: this.$route.query.projectId });
            if (tagRes.success) {
                this.tagOptions = tagRes.data;
            }
        },
        // 给事项分配标签
        async changeTags(row) {
            let params = {
                approvalItemLordId: row.approvalItemLordId,
                projecLabelList: row.projectLabelIdList
            }
            let res = await saveOrUpdateLabelAndApprovalitem(params)
            if(!res.success) return;
            this.$message.success('编辑成功')
            await this.list()

        },
        async searchItem() {
            this.currentPage = 1;
            await this.list();
        },
        async handleClickItemDefault(item) {
            this.currentItemInfo = item;
            this.currentClickButton = '事项名';
            let newItem = await this.getRoleApprovalId(item);
            if (!newItem) return;
            console.log('newItem', newItem);
            this.$store.commit("changeItem", newItem);
            sessionStorage.setItem("itemInfo", newItem);
            sessionStorage.setItem('activeName', 'approvalDetail');
            let hasAdmin = this.$store.state['config'].roles.includes('admin');
            let hasResearcher = this.$store.state['config'].roles.includes('researcher');
            if (hasAdmin || hasResearcher) {
                this.$router.push({
                    path: "/basic/approvalDetail",
                    query: { itemId: newItem.approvalItemId, projectId: this.$route.query.projectId },
                });
            } else {
                this.$router.push({
                    path: "/formconstructor",
                    query: { itemId: item.approvalItemId, projectId: this.$route.query.projectId },
                });
            }
        },
        async handleClickItem(item) {
            this.currentItemInfo = item;
            this.currentClickButton = '调研信息';
            let newItem = await this.getRoleApprovalId(item);
            if (!newItem) return;
            console.log('newItem', newItem);
            this.$store.commit("changeItem", newItem);
            sessionStorage.setItem("itemInfo", newItem);
            sessionStorage.setItem('activeName', 'approvalDetail');
            this.$router.push({
                path: "/basic/approvalDetail",
                query: { itemId: newItem.approvalItemId, projectId: this.$route.query.projectId },
            });
        },
        async handleClickItemBangBan(item) {
            this.currentItemInfo = item;
            this.currentClickButton = '帮办工具';
            let newItem = await this.getRoleApprovalId(item);
            if (!newItem) return;
            console.log('newItem', newItem);
            this.$store.commit("changeItem", newItem);
            sessionStorage.setItem("itemInfo", newItem);
            sessionStorage.setItem('activeTab', 'formconstructor');
            this.$router.push({
                path: "/formconstructor",
                query: { itemId: newItem.approvalItemId, projectId: this.$route.query.projectId },
            });
        },
        async handleClose(item) {
            try {
                await this.$confirm("是否关闭项目", "确认关闭",);
                let result = await shutApprovalItem({ approvalItemId: item.approvalItemLordId });
                if (!result.success) return;
                await this.list();
                this.$message({ type: "success", message: "关闭成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消关闭" })
            }
        },
        async handleCurrentChange() {
            this.list();
        },
        async list() {
            let params = {
                approvalId: this.filterApprovalId,
                projectId: this.$route.query.projectId,
                keyword: this.filterKeyword,
                pageSize: this.pagesize,
                pageNum: this.currentPage,
            }
            if (this.timeRange != null && this.timeRange.length > 1) {
                params.startTime = this.timeRange[0];
                params.endTime = this.timeRange[1];
            }
            let result = await listApprovalItem(params);
            if (!result.success) return;
            this.tableData = result.data.records;
            this.totalCount = result.data.total;
        },
        // git多版本相关方法
        async getRoleApprovalId(row) {
            let result = await exApprovalItem({ approvalItemId: row.approvalItemLordId });
            if (!result.success) return;
            // 无当前用户的事项数据
            if (result.data === null) {
                try {
                    await this.$confirm("您当前无最新个人数据，是否从历史版本导入", "提示",);
                    let res = await listVersionItem({ approvalItemLordId: row.approvalItemLordId });
                    this.versionList = res.data;
                    this.versionList.forEach((item) => {
                        this.$set(item, 'loadingImport', false)
                    })
                    this.dialogVisibleVersion = true;
                    return false;
                } catch (e) {
                    this.$message({ type: "success", message: "新建版本" });
                    let request = {
                        approvalItemLordId: row.approvalItemLordId,
                        exImport: false
                    }
                    let res = await obtainVersionItem(request);
                    console.log('新建', res);
                    return res.data;
                }
            } else {
                let res = await isNewItemVersion({ approvalItemId: result.data.approvalItemId })
                if (res.data) {
                    this.$message.warning(res.data)
                }
                return result.data;
            }
        },
        formatBoolean(row, column, cellValue) {
            let ret = ''  //你想在页面展示的值
            if (cellValue) {
                ret = "最新"  //根据自己的需求设定
            } else {
                ret = "-"
            }
            return ret;
        },
        indexMethod(index) {
            return index + 1;
        },
        // 确认导入
        async confirmImport(row) {
            row.loadingImport = true;
            let request = {
                approvalItemLordId: row.approvalItemLordId,
                exImport: true,
                id: row.id
            }
            let res = await obtainVersionItem(request)
            if (res.success) {
                this.$message.success('导入事项数据成功！');
                row.loadingImport = false;
                this.dialogVisibleVersion = false;
                console.log('导入的id', res.data);
                if (this.currentClickButton === '事项名') {
                    this.handleClickItemDefault(this.currentItemInfo);
                } else if (this.currentClickButton === '调研信息') {
                    this.handleClickItem(this.currentItemInfo);
                } else {
                    this.handleClickItemBangBan(this.currentItemInfo);
                }
            } else {
                this.$message.warning('导入事项数据失败！');
                row.loadingImport = false;
            }
        }
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
