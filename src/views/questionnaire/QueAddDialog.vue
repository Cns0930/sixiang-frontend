<template>
    <div>
        <el-dialog title="问卷自定义问题新增" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" :append-to-body="true">
            <el-button @click="showCopyArea = !showCopyArea">复制另一个问卷的所有自定义题目</el-button>
            <div v-if="showCopyArea" class="question-copy">
                <el-row>
                    <h3 style="margin-top: 20px;">自定义题目复制</h3>
                </el-row>
                <el-row>
                    <el-select v-model="sourceQuestionId" placeholder="请选择问卷" style="width: 400px">
                        <el-option v-for="option in paperOptions" :key="option.questionId"
                            :label="option.questionnaireName + ' - ' + option.creator + ' - ' + option.createTime"
                            :value="option.questionId"></el-option>
                    </el-select>
                    <el-button type="primary" @click="copyQuestion">确定复制</el-button>
                </el-row>
            </div>
            <el-divider></el-divider>
            <div class="chose-relevance" style="margin-top: 20px;">
                <el-row>
                    <h3>选择要添加的自定义问题的材料/字段</h3>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <el-select v-model="matchType" placeholder="问卷类型" style="" @change="searchMatch">
                                <el-option
                                    v-if="row.questionnaireType === 'material' || row.questionnaireType === 'materialAndField'"
                                    label="材料" value="material"></el-option>
                                <el-option
                                    v-if="row.questionnaireType === 'field' || row.questionnaireType === 'materialAndField'"
                                    label="字段" value="field"></el-option>
                                <el-option label="不关联特定材料和字段" value="none"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content bg-purple">
                            <el-select v-model="bindItem" placeholder="材料列表或字段列表或不需要选择" style="">
                                <el-option v-for="option in bindOptions" :key="option.originId" :label="option.label"
                                    :value="option.originId"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="question-describe">
                <el-row>
                    <h3 style="margin-top: 20px;">问题描述</h3>
                </el-row>
                <el-row>
                    <el-input v-model="questionDescribe" placeholder="输入问题描述"></el-input>
                </el-row>
            </div>
            <div class="question-component">
                <el-row>
                    <h3 style="margin-top: 20px;">选择问题的组件类型</h3>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <el-select v-model="componentType" placeholder="组件类型" style="">
                                <el-option v-for="option in typeOptions" :key="option.value" :label="option.label"
                                    :value="option.value"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="6" v-if="componentType === 1 || componentType === 2">
                        <div class="grid-content bg-purple">
                            <div v-for="(item,i) in questionOptions" :key="i"
                                style="display:flex; flex-direction: row; margin-bottom: 15px">
                                <el-input v-model="questionOptions[i]" placeholder="问题选项"></el-input>
                                <span><i v-if="questionOptions.length>=1"
                                        style="margin-left:10px;color:red;cursor: pointer;" class="el-icon-delete"
                                        @click="deletOption(i)"></i></span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" v-if="componentType === 1 || componentType === 2">
                        <el-button type="primary" @click="addOption()">新增选项</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="question-picture">
                <el-row>
                    <h3 style="margin-top: 20px;">是否有相关图片，上传（可传0~多张）</h3>
                </el-row>
                <div>
                    <div style="margin: 20px 0">
                        <span>上传区域：</span>
                        <el-input type="textarea" :rows="3" placeholder="粘贴图片到此处上传（截图或图片文件）" v-model="inputFile"
                            @paste.native.capture.prevent="handlePaste" style="width: 400px">
                        </el-input>
                    </div>
                </div>
                <div v-for="(pic, picIndex) in pictureList" :key="picIndex" style="width: 80%;display:flex;flex-direction: column;margin-bottom: 20px;">
                    <div>
                        <el-image style="width: 100%;border:1px solid #eeae85;" :src="pic.previewPath"
                            :preview-src-list="[pic.previewPath]">
                        </el-image>
                    </div>
                    <div>
                        <el-button  @click="imgOpen(pic.previewPath)">打开图片</el-button>
                        <el-button type="danger" @click="deletePic(picIndex)">删除</el-button>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
                <el-button type="primary" @click="addConfirm">确定添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import axios from 'axios'
// 组件
import Paper from "./showQueModule/paper"
// 接口
import {
    addCustomItem, listCustomMatchOptions, copyCustomItem
} from "@/api/questionnaire/questionConfig.js"

export default {
    mixins: [mixin],
    components: { Paper },
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            row: {},
            dialogVisible: false,
            // 自定义问题
            matchType: '',
            bindOptions: [],
            bindItem: '',
            questionDescribe: '',
            componentType: '',
            typeOptions: [
                { label: '单选', value: 1 },
                { label: '多选', value: 2 },
                { label: '填空', value: 3 },
                { label: '文件上传', value: 4 },
            ],
            questionOptions: [''],
            // 复制自定义问题
            showCopyArea: false,
            paperOptions: [],
            sourceQuestionId: '',
            // 图片上传和展示
            // 上传
            inputFile: null,
            pictureList: [],
        }
    },
    watch: {
    },
    methods: {
        async openDialog() {
            this.dialogVisible = true;
            await this.$nextTick();
            console.log('row', this.row);
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        // 确定添加题目
        async addConfirm() {
            let params = {
                label: this.questionDescribe,
                matchType: this.matchType,
                options: this.questionOptions,
                originId: this.bindItem,
                questionId: this.row.questionId,
                type: this.componentType,
                approvalItemId: this.itemId,
                picPath: this.pictureList
            }
            let res = await addCustomItem(params);
            if (!res.success) {
                this.$message.warning('新增问题失败,请尝试重新编辑问题。')
                return;
            }
            this.$message.success('新增问题成功,可继续新增或关闭窗口。')
        },
        // 查询自定义问题匹配的材料或字段下拉列表
        async searchMatch() {
            let params = {
                approvalItemId: this.itemId,
                matchType: this.matchType
            }
            let res = await listCustomMatchOptions(params);
            if (!res.success) return
            this.bindOptions = res.data;
        },
        // 删除选项
        deletOption(i) {
            this.questionOptions.splice(i, 1);
        },
        // 新增选项
        addOption() {
            this.questionOptions.push('');
        },
        // 复制自定义问题
        async copyQuestion() {
            let res = await copyCustomItem({ targetQuestionId: this.row.questionId, sourceQuestionId: this.sourceQuestionId })
            if (!res.success) {
                this.$message.warning('复制自定义问题失败')
                return
            }
            this.$message.success(res.data)
        },
        // 复制粘贴上传
        async handlePaste(event) {
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
            let pictureTempList = await axios.post(process.env.VUE_APP_BASE_IP + '/qnr/configure/uploadFile', formData).then(res => res.data.data);
            pictureTempList.forEach(item => this.pictureList.push(item))
            console.log('this.pictureList')
            console.log(this.pictureList)
        },
        imgOpen(valueUrl) {
            const a = document.createElement("a");
            a.href = valueUrl
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        // 删除
        deletePic(i) {
            this.pictureList.splice(i, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
    // margin-top: 20px;
    // &:first-child {
    //     margin-top: 0;
    // }
}
.el-col {
    border-radius: 4px;
}
// .bg-purple-dark {
//     // background: #99a9bf;
// }
// .bg-purple {
//     // background: #d3dce6;
// }
// .bg-purple-light {
//     // background: #e5e9f2;
// }
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    // background-color: #f9fafc;
}
</style>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
</style>