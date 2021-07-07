<template>
    <div class="workWrap">
        <header>项目管理</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="搜索项目" v-model="filterKeyword" clearable style="width: 200px;"
                    @change="loadProjects">
                </el-input>
                <el-input placeholder="搜索事项编号" v-model="itemNoKeyword" clearable style="width: 200px;"
                    @change="loadProjects">
                </el-input>
                <el-button @click="loadProjects">
                    搜索
                </el-button>
                <div class="handle">
                    <el-button type="primary" @click="handleClickAdd">
                        新增项目
                    </el-button>
                    <el-button type="primary" @click="openDialog">
                        全局操作
                    </el-button>
                </div>
            </div>
            <div class="titleBox">
                <span class="titleText">项目列表</span>
            </div>
            <div class="cardBox">
                <div class="cardItem" v-for="item in projectList" :key="item.projectId">
                    <div class="itemHeader">
                        <el-button type="text" class="itemTitle" @click="goApproval(item)">{{ item.projectName }}
                        </el-button>
                        <!-- <span class="itemText">状态：{{ item.projectStatus }}</span> -->
                        <span class="itemTexttwo">{{ item.projectDetails }}</span>
                    </div>
                    <div class="itemFooter">
                        <el-button type="plain" @click="handleClickEdit(item)">编辑项目</el-button>
                        <el-button type="primary" @click="goApproval(item)">事项管理</el-button>
                        <el-popover placement="bottom" width="120" trigger="click">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteProject(item)"
                                style="margin-left:20px">删除项目</el-button>
                            <el-button slot="reference">更多...</el-button>
                        </el-popover>
                    </div>
                </div>
            </div>
        </section>

        <section class="dialogBox">
            <!-- 新增项目窗口 -->
            <el-dialog title="新增项目" :visible.sync="dialogAddVisible" width="800px" :close-on-click-modal="false"
                :show-close='false'>
                <div class="attribute-content">
                    <el-form :model='tempItem' ref="tempItem" :inline="false" label-position="left"
                        class="demo-form-inline" :rules="rulesAdd">
                        <!-- <el-form-item label="项目编号" prop="projectId">
                            <el-input v-model="tempItem.projectId">
                            </el-input>
                        </el-form-item> -->
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="tempItem.projectName">
                            </el-input>
                        </el-form-item>
                        <!-- <el-form-item label="项目状态" prop="projectStatus">
                            <el-select v-model="tempItem.projectStatus" filterable>
                                <el-option label="Y" value="Y"></el-option>
                                <el-option label="N" value="N"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="项目详情">
                            <el-input v-model="tempItem.projectDetails">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="行政区划编码">
                            <el-input v-model="tempItem.areaCode">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetForm(tempItem)">
                        取消
                    </el-button>
                    <el-button type="primary" @click="saveProject(tempItem)">
                        确定
                    </el-button>
                </span>
            </el-dialog>

            <!-- 编辑窗口 -->
            <el-dialog title="编辑项目" :visible.sync="dialogUpdateVisible" width="800px" :close-on-click-modal="false">
                <div class="attribute-content">
                    <el-form :model='tempItem' ref="tempItem" :rules="rules" :inline="false" label-position="left"
                        class="demo-form-inline">
                        <!-- <el-form-item label="项目编号" prop="projectId">
                            <el-input v-model="tempItem.projectId">
                            </el-input>
                        </el-form-item> -->
                        <el-form-item label="项目名称" prop="projectName">
                            <el-input v-model="tempItem.projectName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="项目状态" prop="projectStatus">
                            <el-select v-model="tempItem.projectStatus" filterable>
                                <el-option label="Y" value="Y"></el-option>
                                <el-option label="N" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目详情">
                            <el-input v-model="tempItem.projectDetails">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="行政区划编码">
                            <el-input v-model="tempItem.areaCode">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUpdateVisible = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="updateProject(tempItem)">
                        确定
                    </el-button>
                </span>
            </el-dialog>
        </section>
        <!-- 全局操作弹框 -->
        <GlobalOperationsDialog ref="globalOperations" />
    </div>
</template>



<script>

import { mixin } from "@/mixin/mixin"
import _ from "lodash"
import Vue from "vue";
import { ref } from "@vue/composition-api";

import { mapGetters, mapState } from "vuex"
// 组件
import GlobalOperationsDialog from "./GlobalOperationsDialog"
// 接口
import {
    listProjectAll,
    addProject,
    updateProject,
    deleteProject
} from "../../api/basicInfo/approval";

export default {
    name: "ProjectList",
    mixins: [mixin],
    components: {
        GlobalOperationsDialog
    },
    setup() {
        const globalOperations = ref(null);
        return {
            globalOperations,
        }
    },
    data() {
        return {
            // 页面信息
            type: "work",
            // 筛选
            filterProjectId: null,
            filterApprovalId: null,
            itemNoKeyword: '',
            filterKeyword: "",
            // 弹窗
            dialogAddVisible: false,
            dialogUpdateVisible: false,
            tempItem: {},
            projectList: [], // 项目列表
            approvalOptions: [],
            currentPage: 1,
            pagesize: 15,
            totalCount: 0,
            rules: {
                projectName: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                ],
                projectStatus: [
                    { required: true, message: '请选择项目状态', trigger: 'change' }
                ]
            },
            rulesAdd: {
                projectName: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                ]
            }
        };
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' }),
        ...mapState({
            roles: state => state.config.roles,
        })
    },
    async created() {
        await this.loadProjects();

        let itemInfo = this.$store.state.home.item;
        itemInfo = {};
        this.$store.commit("changeItem", itemInfo);
        sessionStorage.removeItem('itemInfo');
    },
    methods: {
        async handleClickAdd() {
            this.dialogAddVisible = true;
            this.tempItem = {};
        },
        async handleClickEdit(item) {
            this.dialogUpdateVisible = true;
            this.tempItem = _.cloneDeep(item);
        },
        //新增取消
        resetForm(tempItem) {
            this.dialogAddVisible = false
        },
        // 新增项目保存
        async saveProject(tempItem) {
            this.$refs.tempItem.validate(async (valid) => {
                if (valid) {
                    this.tempItem.projectStatus = 'Y';
                    let res = await addProject(this.tempItem);
                    if (res.success) {
                        this.$message.success("项目保存成功!");
                        this.tempItem = {};
                        this.dialogAddVisible = false;
                        await this.loadProjects()
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        // 修改项目保存
        async updateProject(tempItem) {
            this.$refs.tempItem.validate(async (valid) => {
                if (valid) {
                    let res = await updateProject(this.tempItem);
                    if (res.success) {
                        this.$message.success("项目修改成功!");
                        this.tempItem = {};
                        this.dialogUpdateVisible = false;
                        await this.loadProjects();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async loadProjects() {
            // 获取项目列表
            let projectRes = await listProjectAll({ keyword: this.filterKeyword, itemNoKeyword: this.itemNoKeyword });
            if (!projectRes.success) return;
            if (projectRes.success) {
                if(this.roles.includes('intern')) {
                    this.projectList = projectRes.data.filter(item => item.projectId === 2);
                } else {
                    this.projectList = projectRes.data;
                }     
            }
        },
        handleClickItemDefault(item) {

            this.$store.commit("changeItem", item);
            sessionStorage.setItem("itemInfo", item);
            sessionStorage.setItem('activeName', 'subitem');
            // this.$router.push({
            //     path: "/basic/subitem",
            //     query: { itemId: item.approvalItemId },
            // });
            let hasAdmin = this.$store.state['config'].roles.includes('admin');
            let hasResearcher = this.$store.state['config'].roles.includes('researcher');
            if (hasAdmin || hasResearcher) {
                this.$router.push({
                    path: "/basic/subitem",
                    query: { itemId: item.approvalItemId },
                });
            } else {
                this.$router.push({
                    path: "/formconstructor",
                    query: { itemId: item.approvalItemId },
                });
            }
        },
        goApproval(item) {
            // 保存项目信息
            this.$store.commit("changeItem", item);
            this.$store.commit("changeProject", item);
            this.$router.push({
                path: "/basic",
                query: { projectId: item.projectId }
            });
        },
        async deleteProject(item) {
            console.log('item');
            console.log(item);
            const confirmResult = await this.$confirm('此操作不可逆，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            /*如果用户确认打印confirm,如果用户取消显示cancel*/
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除!');
            }
            console.log('确认了删除');
            let request = {
                isdelete: 1,
                projectId: item.projectId,
            }
            let result = await deleteProject(request);
            if (result.success) {
                this.$message.success('删除项目成功');
            }
            await this.loadProjects();
        },
        // 打开全局操作弹框
        openDialog() {
            this.globalOperations && this.globalOperations.openDialog();
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
            // margin-left: auto;
            margin-top: 1px;
        }
    }
    .titleBox {
        margin-top: 16px;
        margin-left: 10px;
        width: calc(100% - 10px);
        background-color: #ffffff;
        .titleText {
            font-size: 18px;
            font-weight: bold;
            padding-left: 10px;
            border-left: 4px solid #6389e7;
        }
    }
    .cardBox {
        margin-top: 16px;
        margin-left: 10px;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: calc(100% - 10px);
        .cardItem {
            border: thin #f7f3f3 solid;
            box-shadow: 1px 1px 3px #e2dddd;
            border-radius: 10px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            margin-right: 30px;
            padding: 5px;
            width: 20%;
            min-width: 300px;
            height: 200px;
            background: #ffffff;
            // margin: 20px;
            margin-top: 20px;
            margin-left: 10px;
            .itemHeader {
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                width: 90%;
                height: 70%;
                .itemTitle {
                    color: #3397ff;
                    font-size: 25px;
                    font-weight: bold;
                }
                .itemText {
                    font-size: 20px;
                    color: #7bbafd;
                }
                .itemTexttwo {
                    font-size: 16px;
                    color: #90c6ff;
                }
            }
            .itemFooter {
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: space-around;
                width: 90%;
                height: 30%;
                border-top: 2px solid #f0f3f7;
            }
        }
    }
}
</style>
