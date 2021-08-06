<template>
    <div class="workWrap">
        <header>
            <span class="title">SortConfig</span>
        </header>
        <div class="workBox">
            <div class="searchBox">
                <el-input placeholder="按材料编号或名称查询" v-model="keyWord" clearable style="width: 200px;" @change="search">
                </el-input>
                <el-button @click="search">搜索</el-button>
                <el-button @click="addSortConfig">新增</el-button>
                <el-button @click="loadSortConfig">载入数据</el-button>
                <el-button type="primary" @click="downLoadJson('/ai/aiSortconfig/getSortconfigJson')">生成Json</el-button>
                <el-upload class="upload-demo" ref="upload" :action="urlExcel" :multiple="false" :limit="1"
                    :with-credentials="true" :on-success="uploadSuccess" :on-remove="handleRemove"
                    :on-exceed="handleExceed" :auto-upload='true' :before-upload="customUpload">
                    <el-button type="primary" icon="el-icon-upload" class="button" :loading="loadings"
                        @click="upLoad()" style="margin-left: 20px;">Excel上传
                    </el-button>
                </el-upload>
                <el-button type="danger" style="margin-left: 20px" @click="deleteSortConfigAll">
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
                    <el-table-column prop="sortconfigId" label="sortconfig编号" width="100">
                    </el-table-column>
                    <el-table-column prop="documentsubDisplayname" label="材料名称" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="lordKeyword" label="主关键字"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="assistKeyword" label="辅助关键字"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="excludeKeyword" label="排除关键字"  show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="pageCode" label="多页编号" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="primary" style="font-size: 14px" @click="editSortConfig(scope.row)">编辑
                            </el-button>
                            <el-button type="danger" style="font-size: 14px" @click="deleteSortConfigButton(scope.row)">
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
        <!--添加SortConfig-->
        <el-dialog title="填写ai-SortConfig" :visible.sync="dialogVisbleAdd" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="addForm">
                <el-form-item label="材料" required>
                    <el-select v-model="addForm.approvalItemAndDocumentsubId" clearable placeholder="请选择材料展示名称">
                        <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主关键字">
                    <el-input v-model="addForm.lordKeyword"></el-input>
                </el-form-item>
                <el-form-item label="辅助关键字">
                    <el-input v-model="addForm.assistKeyword"></el-input>
                </el-form-item>
                <el-form-item label="排除关键字">
                    <el-input v-model="addForm.excludeKeyword"></el-input>
                </el-form-item>
                <el-form-item label="多页编号">
                    <el-input v-model="addForm.pageCode" placeholder="只允许数字"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--编辑SortConfig-->
        <el-dialog title="编辑ai-SortConfig" :visible.sync="dialogVisbleEdit" width="50%" :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm">
                <el-form-item label="材料" required>
                    <el-select v-model="editForm.approvalItemAndDocumentsubId" clearable placeholder="请选择材料展示名称">
                        <el-option v-for="(v,i) in materialOptions" :key="i" :label="v.documentsubDisplayname"
                            :value="v.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主关键字">
                    <el-input v-model="editForm.lordKeyword"></el-input>
                </el-form-item>
                <el-form-item label="辅助关键字">
                    <el-input v-model="editForm.assistKeyword"></el-input>
                </el-form-item>
                <el-form-item label="排除关键字">
                    <el-input v-model="editForm.excludeKeyword"></el-input>
                </el-form-item>
                <el-form-item label="多页编号">
                    <el-input v-model="editForm.pageCode" placeholder="只允许数字"></el-input>
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
    listSortconfig, getBySortconfigId, getSortconfig, getSortconfigJson,
    addSortconfig, updateSortconfig, deleteSortconfig, deleteSortconfigBatch
} from "@/api/aipreview/sortConfig"
import { listItemAndDocumentSub } from '@/api/basicInfo/approvalSub'


export default {
    mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            // 搜索区域
            keyWord: '',
            // 表格区域
            tableData: [],
            multipleSelection: [],
            // 分页
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
            // 新增弹窗
            dialogVisbleAdd: false,
            addForm: {},
            materialOptions: [],
            cutImgTagList: [],
            initPositionList: [],
            valueFieldList: [],
            valuePatternList: [],
            // 编辑弹窗
            dialogVisbleEdit: false,
            editForm: {
                cutImgTag: [],
                initPosition: [],
                valueField: [],
                valuePattern: [],
            },
            // 上传EXCEL
            loadings: false,
            urlExcel: process.env.VUE_APP_BASE_IP + '/ss/Import/aiSortConfigImportData',
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
        await this.getSortConfigList();
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
            await this.getSortConfigList();
        },
        async handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val;
            await this.getSortConfigList();
        },

        // 加载表单
        async getSortConfigList() {
            let request = {
                approvalItemId: this.itemId,
                globalDocumentSubNameAndCode: this.keyWord,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            let res = await listSortconfig(request);
            if (!res.success) return;
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
        },

        // 载入ba填写的数据
        async loadSortConfig() {
            try {
                await this.$confirm("是否导入BA已填数据", "确认载入",);
                let res = await getSortconfig({ approvalItemId: this.itemId });
                if (!res.success) return;
                this.getSortConfigList();
                this.$message({ type: "success", message: "载入成功" })
            } catch (e) {
                this.$message({ type: "warning", message: "取消载入" })
            }
        },

        // 搜索
        search() {
            this.currentPage = 1;
            this.getSortConfigList();
        },

        // 加载下拉框选项
        async getOptions() {
            let resMaterial = await listItemAndDocumentSub({ approvalItemId: this.itemId, pageNum: 1, pageSize: 500 });
            if (!resMaterial.success) return;
            this.materialOptions = resMaterial.data.records;
        },

        // 新增打开弹框
        async addSortConfig() {
            this.dialogVisbleAdd = true;
        },

        // 确认新增
        async addConfirm() {
            this.addForm.approvalItemId = this.itemId;
            console.log('this.addForm', this.addForm);
            let res = await addSortconfig(this.addForm);
            if (!res.success) return;
            this.dialogVisbleAdd = false;
            this.getSortConfigList();
        },

        // 编辑
        async editSortConfig(row) {
            this.editForm = _.cloneDeep(row);
            console.log('this.editForm');
            console.log(this.editForm);
            this.dialogVisbleEdit = true;
        },
        // 确认编辑
        async editConfirm() {
            let res = await updateSortconfig(this.editForm);
            if (!res.success) return;
            this.dialogVisbleEdit = false;
            this.getSortConfigList();
        },
        // 删除checkPoint
        async deleteSortConfigButton(row) {
            let res = await deleteSortconfig({ sortconfigId: row.sortconfigId  });
            if (!res.success) return;
            this.getSortConfigList();
        },
        // 批量删除
        async deleteSortConfigAll() {
            if(this.multipleSelection.length === 0) {
                this.$message.warning('请先选择要删除的sortConfig')
                return
            }
            console.log('this.multipleSelection')
            console.log(this.multipleSelection)
            let ids = this.multipleSelection.map( item => {return item.sortconfigId})
            console.log('ids')
            console.log(ids)
            let res = await deleteSortconfigBatch({idList: ids})
            if(!res.success) return
            this.$message.success('批量删除成功')
            this.getSortConfigList()
        },
        // 生成Json
        async downLoadJson(url) {
            if (this.multipleSelection.length === 0) {
                this.$message({ type: "warning", message: "请在表格中勾选要生成Json的数据" })
                return;
            }
            let sortconfigIds = [];
            this.multipleSelection.forEach(item => {
                sortconfigIds.push(item.sortconfigId );
            })
            let res = await axios({
                method: "get",
                url: url,
                params: {
                    approvalItemId: this.itemId,
                    sortconfigIds: sortconfigIds.toString(),
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
                            this.getSortConfigList();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                            this.loadings = false;
                            this.getSortConfigList();
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