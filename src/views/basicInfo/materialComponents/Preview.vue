<template>
    <div>
        <el-dialog ref="elDialog" title="预览图信息" :visible.sync="previewVisible" width="80%" top="13vh"
            :close-on-click-modal="false">
            <div class="tableWrap">
                <el-upload class="upload-demo" ref="upload" action="upLoadUrl" :on-preview="handlePreview"
                    :on-remove="handleRemove" multiple :limit="15" :on-exceed="handleExceed" :file-list="fileList"
                    :before-upload="customUpload">
                    <el-button size="small" type="primary">点击上传预览图</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>
                <el-table class="workTable" :data="tableDataPreview" style="width: 100%" border tooltip-effect="dark">
                    <el-table-column label="序号" type="index" width="50px" :index="indexMethod"></el-table-column>
                    <el-table-column prop="docxTemplateName" label="预览图" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-image :src="scope.row.imgUrl" :alt="'预览图编号:'+scope.row.figureId"
                                :preview-src-list="scope.row.imgUrlList" :z-index="10000" style="max-height: 100px">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fileName" label="预览图名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="fileInfo" label="预览图说明" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="fileIndex" label="排序值" width="70px" show-overflow-tooltip>
                        <template slot-scope="scopeD">
                            <el-input v-if="scopeD.row.flag" placeholder="仅填正整数" v-model="scopeD.row.fileIndex"
                                clearable>
                            </el-input>
                            <span v-else>{{scopeD.row.fileIndex}}</span>
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
                                <el-button size="mini" icon="el-icon-close"
                                    @click="closeText(scope.$index, scope.row, tableDataPreview)">
                                </el-button>
                                <el-button size="mini" type="primary" icon="el-icon-check" @click="saveText(scope.row)">
                                </el-button>
                            </div>
                            <div v-else>
                                <el-button size="mini" type="danger" @click="deleteMaterialTemplate(scope.row.id)"
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
                <el-button @click="previewVisible = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 编辑上传弹窗 -->
        <el-dialog title="编辑预览图" :visible.sync="editOtherDialogVisible" width="50%" :close-on-click-modal="false">
            <el-form label-width="150px" :model="editForm">
                <el-form-item label="预览图名称">
                    <el-input v-model="editForm.fileName"></el-input>
                </el-form-item>
                <el-form-item label="排序值">
                    <el-input v-model="editForm.fileIndex"></el-input>
                </el-form-item>
                <el-form-item label="预览图说明">
                    <el-input v-model="editForm.fileInfo"></el-input>
                </el-form-item>
                <el-form-item label="修改上传图片">
                    <el-upload class="upload-demo" ref="uploadEdit" :action="urlEdit" :limit="1"
                        accept=".jpeg, .png, .jpg" :with-credentials="true" :data="this.editForm"
                        :on-remove="handleRemove" :on-exceed="handleExceedEdit" :auto-upload="false"
                        :before-upload="customUploadEdit">
                        <el-button type="primary">添加</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editOtherDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadEdit()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import _ from "lodash";
// 接口
import { listMaterialAndFigure, deleteMaterialAndFigure } from '../../../api/basicInfo/material';

export default {
    data() {
        return {
            previewVisible: false,
            fatherRow: {},
            tableDataPreview: [],
            // 上传图片相关
            upLoadUrl: process.env.VUE_APP_BASE_IP + "/ss/MaterialAndFigure/uploadFigure",
            fileList: [],
            // 编辑预览图
            urlEdit: process.env.VUE_APP_BASE_IP + "/ss/MaterialAndFigure/updateMaterialAndFigure",
            editOtherDialogVisible: false,
            editForm: {},
            updateId: null, // 当前编辑的预览图数据id
        }
    },
    created() {

    },
    methods: {
        init() {
            console.log('fatherRow', this.fatherRow);
            // console.log('this.$refs.elDialog', this.$refs.elDialog);
            // this.$refs.elDialog.$el.firstChild.style.height = '1000px';
            this.previewVisible = true;
            this.getListMaterialAndFigure();
        },
        indexMethod(index) {
            // return (this.currentPage - 1) * this.pagesize + (index + 1);
            return index + 1;
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
        // 获取一级材料列表
        async getListMaterialAndFigure() {
            this.$forceUpdate();
            // this.tableDataPreview = [];
            let request = {
                materialId: this.fatherRow.materialId
            }
            let res = await listMaterialAndFigure(request);
            if (!res.success) {
                this.$message.warning('查询材料预览图列表失败');
                return;
            }
            // 赋予图片路径
            res.data.forEach(item => {
                let imgUrl = '';
                if (item.id === this.updateId) {
                    imgUrl = process.env.VUE_APP_BASE_IP + `/ss/MaterialAndFigure/getMaterialFigure?figureId=${item.id}&?number=${Math.random()}`; //加随机数避免浏览器缓存
                } else {
                    imgUrl = process.env.VUE_APP_BASE_IP + `/ss/MaterialAndFigure/getMaterialFigure?figureId=${item.id}`;
                }
                this.$set(item, 'imgUrl', imgUrl)
                this.$set(item, 'imgUrlList', [imgUrl])
                // item.imgUrlList = [imgUrl];
            })
            this.tableDataPreview = res.data;
            console.log('tableDataPreview', this.tableDataPreview);
        },
        // 增删改查
        // 修改
        Edit(item) {
            console.log('edit row', item);
            this.editOtherDialogVisible = true;
            this.editForm = _.cloneDeep(item);
            this.updateId = this.editForm.id;
        },
        // 删除
        async deleteMaterialTemplate(id) {
            try {
                await this.$confirm('是否确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                return;
            }
            let result = await deleteMaterialAndFigure({ id });
            if (!result.success) return;
            this.$message.success('删除成功');
            this.getListMaterialAndFigure();
        },
        // 上传图片相关
        // 上传文件
        customUpload(file) {
            let fd = new FormData();
            fd.append("files", file);
            fd.append("materialId", this.fatherRow.materialId);
            console.log('fd');
            console.log(fd);
            axios.post(
                this.upLoadUrl,
                fd
            )
                .then(
                    (res) => {
                        console.log('res');
                        console.log(res);
                        if (res.data.success) {
                            this.$message.success('上传成功');
                            this.$refs.upload.clearFiles();
                            this.getListMaterialAndFigure();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                        }
                    },
                );
            return false;
        },
        // 编辑上传文件
        customUploadEdit(file) {
            let fd = new FormData();
            if (file !== null) {
                fd.append("figure", file);
            }
            fd.append("fileIndex", this.editForm.fileIndex);
            fd.append("fileInfo", this.editForm.fileInfo);
            fd.append("fileName", this.editForm.fileName);
            fd.append("id", this.editForm.id);
            fd.append("materialId", this.editForm.materialId);
            console.log('fdEdit');
            console.log(fd);
            axios.post(
                this.urlEdit,
                fd
            )
                .then(
                    (res) => {
                        console.log('res');
                        console.log(res);
                        if (res.data.success) {
                            if (file === null) {
                                this.$message.success('上传成功');
                            }
                            this.getListMaterialAndFigure();
                            this.editOtherDialogVisible = false;
                            this.$forceUpdate();
                        } else {
                            this.$message.warning('上传失败,请重新上传');
                        }
                    },
                );
            return false;
        },
        uploadEdit() {
            console.log('确认编辑');
            console.log(this.$refs.uploadEdit);
            this.$refs.uploadEdit.submit();
            this.customUploadEdit(null);
        },
        upload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 15 个图片，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleExceedEdit(files, fileList) {
            this.$message.warning(`当前限制选择 1 个图片`);
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/global.scss";
.tableWrap {
    // height: 1000px;
}
</style>