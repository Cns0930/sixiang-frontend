<template>
    <div>
        <el-dialog title="配置图片管理" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">
            <div>
                <span>配置选择：</span>
                <el-select v-model="materialId" style="width: 400px" @change="getTableData" filterable>
                    <el-option v-for="option in settingOptions" :key="option.materialId" :label="option.materialName"
                        :value="option.materialId"></el-option>
                </el-select>
            </div>
            <div style="margin: 20px 0">
                <span>上传区域：</span>
                <el-input type="textarea" :rows="3" placeholder="粘贴图片到此处上传（截图或图片文件）" v-model="inputFile"
                    @paste.native.capture.prevent="handlePaste" style="width: 400px">
                </el-input>
            </div>
            <el-table class="workTable" :data="tableData" style="width: 100%" border tooltip-effect="dark">
                <el-table-column label="序号" type="index" width="60px" :index="indexMethod">
                </el-table-column>
                <el-table-column prop="picUrl" label="预览图" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-image :src="scope.row.picUrl" :alt="'图片路径:'+scope.row.picUrl"
                            :preview-src-list="[scope.row.picUrl]" :z-index="10000" style="max-height: 100px">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="deletePic(scope.row.id)" icon="el-icon-minus">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import axios from 'axios'
// 接口
import {
    listPicConfigByMaterialId,
    deleteMaterialQnrPicById,
} from "@/api/questionnaire/questionConfig.js"

export default {
    mixins: [mixin],
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            dialogType: '',
            dialogVisible: false,
            // 材料和字段下拉选项
            settingOptions: [],
            materialId: '',
            fieldId: '',
            // 图片列表
            tableData: [],
            // 上传
            inputFile: null,
        }
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        async openDialog() {
            this.dialogVisible = true;
            await this.$nextTick();
            console.log('dialogType', this.dialogType);
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        // 复制粘贴上传
        async handlePaste(event) {
            if (this.materialId === '') {
                this.$message.warning('请先选择材料')
                return
            }
            let items = event.clipboardData && event.clipboardData.items;
            let formData = new FormData();
            if (items && items.length) {
                // 检索剪切板items
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        console.log(items[i].getAsFile())
                        formData.append('file', items[i].getAsFile());
                    }
                }
            }
            formData.append('materialId', this.materialId);
            await axios.post(process.env.VUE_APP_BASE_IP + '/qnr/configure/uploadFile', formData);
            this.getTableData()
        },
        // 获取图片列表数据
        async getTableData() {
            let res = await listPicConfigByMaterialId({ materialId: this.materialId });
            if (!res.success) return
            this.tableData = res.data;
        },
        indexMethod(index) {
            // return (this.currentPage - 1) * this.pagesize + (index + 1);
            return index + 1;
        },
        async deletePic(id) {
            let result = await deleteMaterialQnrPicById({id})
            if(!result.success) {
                this.$message.warning('删除失败')
                return
            }
            this.getTableData()
        },
    }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/global.scss";
</style>