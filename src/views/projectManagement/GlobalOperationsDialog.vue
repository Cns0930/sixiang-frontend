<template>
    <el-dialog title="全局操作-Dialog" :visible.sync="dialogVisible" width="1200px" :close-on-click-modal="false"
        @closed="closedFn">
        <div class="workHandleBoxContent">
            <div class="block">
                <span class="demonstration">请选择事项: </span>
                <el-button type="primary" :loading="loading" @click="downLoad('/ss/Import/downloadGitZipByLordId')"
                    style="margin-left: 20px; margin-bottom: 10px">下载</el-button>
                <span style="margin-left: 20px">已选择事项数量: </span>
                <span style="font-size: 18px; color: #2b3b65">{{itemCount}}</span>
                <!-- <el-progress :percentage="progress" status="success"></el-progress> -->
                <!-- <br />
                <el-cascader v-model="idList" placeholder="试试搜索：项目名称/阶段/事项名称" :options="approvalItemOptions"
                    :props="{ multiple: true }" filterable clearable style="width: 500px" @change="getCount">
                </el-cascader> -->
            </div>
            <div class="search-list">
                <el-input placeholder="请搜素项目" v-model="params.projectName" clearable @change="init()">
                </el-input>
                <el-input placeholder="请搜索事项" v-model="params.itemName" clearable @change="init()">
                </el-input>
                <el-select placeholder="筛选开发阶段" v-model="params.itemStage" clearable @change="init()">
                    <el-option value="开发中" label="开发中"></el-option>
                    <el-option value="提测" label="提测"></el-option>
                    <el-option value="验收" label="验收"></el-option>
                    <!-- <el-option value="停用" label="停用"></el-option>
                    <el-option value="demo" label="demo"></el-option> -->
                </el-select>
                <el-input placeholder="搜索标签" v-model="params.itemLabel" clearable @change="init()">
                </el-input>
                <el-button type="success" @click="search()">搜索</el-button>
            </div>
            <div style="width:1060px">
                <el-table ref="multipleTables" :data="tableList" border style="width: 100%" max-height="300"
                    @selection-change="handleSelectionChange" :row-key="getRowKeys" tooltip-effect="dark"
                    @clearSelection="clearSelectionList">
                    <el-table-column type="selection" width="50" :reserve-selection="true">
                    </el-table-column>
                    <el-table-column prop="projectName" label="项目名" width="180" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemName" label="事项名" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="itemStage" label="开发阶段" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="projectLabelNameList" label="标签" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.projectLabelNameList}}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination v-show="total>0" :total="total" :page.sync="params.pageNum" :limit.sync="params.pageSize"
                    @pagination="init()" style="float:right" />
            </div>
            <!-- <div class="handleBox">
                <p class="title">批量下载事项配置</p>
                <el-upload class="upload-demo" ref="upload" action="111" :multiple="true" :limit="50"
                    :with-credentials="true" :auto-upload='true' :before-upload="customUpload">
                    <el-button type="primary" icon="el-icon-upload" class="button" :loading="loading" @click="upLoad()">
                        上传json下载事项配置
                    </el-button>
                </el-upload>
            </div> -->
            <div class="block" v-show="tableVisible">
                <span>*如有标红数据，表示该事项没有对应git提交</span>
                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" highlight-current-row
                    style="width: 100%"
                    :header-cell-style="{background: '#f9faff',color:'#333',fontFamily:'MicrosoftYaHeiUI',fontSize:'15px',fontWeight:900}"
                    :row-style="{fontSize:'14px',color:'#666',fontFamily:'MicrosoftYaHeiUI'}"
                    :row-class-name="tableRowClassName">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="60">
                    </el-table-column>
                    <el-table-column prop="projectName" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="itemName" label="事项名称">
                    </el-table-column>
                    <el-table-column prop="developer" label="开发负责人">
                    </el-table-column>
                    <el-table-column prop="itemStage" label="事项阶段">
                    </el-table-column>
                    <el-table-column prop="commitLog" label="说明">
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </el-dialog>
</template>

<script>
import axios from 'axios'
import {
    listApprovalItemByStage, gitZipchecklistByLordId, apilistAllApprovalItem
} from "@/api/basicInfo/approval";
import Pagination from "@/components/Pagintion.vue";
export default {
    data() {
        return {
            dialogVisible: false,
            loading: false,
            approvalItemOptions: [],
            idList: [],
            tableData: [],
            itemCount: 0,
            // progress: 0,
            tableVisible: false,
            tableList: [],
            input: "",
            params: {
                itemLabel: "",
                itemName: "",
                itemStage: "",
                pageNum: 1,
                pageSize: 10,
                projectName: ""
            },
            multipleSelection: [],
            total: 0,
            timer: null
        }
    },
    components: {
        Pagination,
    },
    methods: {
        clearSelectionList(e) {
            this.$nextTick(() => {
                this.timer = setTimeout(() => {
                    this.$refs.multipleTables.clearSelection();
                }, 20)
            })
        },
        getRowKeys(row) {
            return row.approvalItemLordId
        },
        search() {
            this.init();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.itemCount = this.multipleSelection.length;
        },
        async init() {
            const result = await apilistAllApprovalItem(this.params);
            if (result.code === 200) {
                this.tableList = result.data.records;
                this.total = result.data.total;
            } else {
                this.$message.error(result.msg)
            }
        },
        async openDialog() {
            this.tableVisible = false;
            this.itemCount = 0,
                this.dialogVisible = true;
            // let res = await listApprovalItemByStage()
            // if (!res.success) return
            // this.approvalItemOptions = res.data;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        closedFn() {
            this.idList = []
            this.tableData = []
            clearInterval(this.timer);
            this.timer = null;
        },
        // getCount() {
        //     this.itemCount = this.idList.length
        // },
        // 下载 Post接口方法
        async downLoad(url) {
            if (!this.multipleSelection.length) {
                this.$message.warning('请先选择事项')
                return
            }
            // this.progress = 0;
            this.loading = true;
            let newIdList = this.multipleSelection.map(item => { return Number(item.approvalItemLordId) })
            console.log('newIdList');
            console.log(newIdList)
            let res = await axios({
                method: "post",
                url: url,
                data: {
                    idList: newIdList,
                },
                timeout: 1000 * 60 * 10,
                responseType: "arraybuffer",
                // onDownloadProgress: (evt) => {
                //     console.log("progressEvent===",evt )
                //     // 对原生进度事件的处理
                //     this.progress = parseInt((evt.loaded / evt.total) * 100)
                // }
            });
            if (res.data.byteLength === 0) {
                this.$message.warning("没有需要下载的文件");
                this.loading = false;
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
            this.loading = false;
            await this.getTableData(newIdList);
            this.tableVisible = true;
        },
        async getTableData(ids) {
            let res = await gitZipchecklistByLordId({ idList: ids })
            if (!res.success) return
            this.tableData = res.data
        },
        indexMethod(index) {
            return index + 1;
        },
        // 上传
        // upLoad() {
        //     this.$refs.upload.submit();
        // },
        // async customUpload(file) {
        //     console.log('file');
        //     console.log(file);
        //     this.loading = true;
        //     let fd = new FormData();
        //     fd.append("file", file);
        //     let Url = process.env.VUE_APP_BASE_IP + '/ss/Import/downloadGitZipBySid';
        //     console.log({
        //         method: "post",
        //         url: Url,
        //         data: { fd },
        //         responseType: "arraybuffer",
        //         timeout: 1000 * 60
        //     });
        //     let res = await axios(
        //         // baseUrl + '/ss/Import/downloadGitZipBySid',
        //         // fd, { timeout: 1000 * 180 }, {'Content-Type': 'multipart/form-data'},
        //         {
        //             method: "post",
        //             url: Url,
        //             data: fd,
        //             responseType: "arraybuffer",
        //             timeout: 1000 * 60
        //         }
        //     );
        //     console.log('res', res);
        //     let blob = new Blob([res.data], { type: "application/zip" });
        //     const a = document.createElement("a");
        //     // 生成文件路径
        //     let href = window.URL.createObjectURL(blob);
        //     // console.log('href')
        //     // console.log(href)
        //     a.href = href;
        //     // let _fileName = _res.headers['Content-disposition'].split(';')[1].split('=')[1].split('.')[0]
        //     let _fileName = res.headers["content-disposition"]
        //         .split(";")[1]
        //         .split("=")[1];
        //     // 文件名中有中文 则对文件名进行转码
        //     a.download = decodeURIComponent(_fileName);
        //     // 利用a标签做下载
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);
        //     window.URL.revokeObjectURL(href);
        //     this.loading = false;
        //     return false;
        // },

        tableRowClassName({ row, rowIndex }) {
            if (row) {
                if (row.project-sales === null || row.project-sales === '') {
                    return 'red-row'
                } else {
                    return ''
                }
            }
        }
    },
}
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workHandleBoxContent {
    .search-list {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 20px;
        /deep/.el-input {
            width: 200px;
        }
    }
    display: flex;
    // align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .block {
        width: 95%;
        margin: 20px;
    }
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
    .el-table .red-row {
        color: #ff5160;
        background: #ffeaea;
    }
}
</style>