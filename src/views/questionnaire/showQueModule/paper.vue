<template>
    <div>
        <el-container class="zero-class-box">
            <el-row class="one-class-row">
                <el-col :span="24" class="one-middle">
                    <div class="grid-content bg-purple-light">
                        <div class="paper-title">
                            <h1 style="color:#8B4513;letter-spacing:4px;">
                                {{questionnaireInfo ? questionnaireInfo.questionnaireName : ''}}</h1>
                        </div>
                        <div v-if="fatherName === 'QuestionManagement'" class="survey-header-subtitle">{{describe}}
                        </div>
                        <el-divider />
                        <div>
                            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px"
                                label-position="top" class="demo-dynamic" size="medium"
                                :validate-on-rule-change="false">
                                <div class="paper-area">
                                    <!-- <div v-show="groupIndex + 1 === currentPage" -->
                                    <div v-for="group in paperList" :key="group.groupId">
                                        <el-divider />
                                        <div>
                                            <h1>{{group.label}}</h1>
                                        </div>
                                        <div v-if="group.picPath && group.picPath.length > 0" class="demo-image__preview"
                                            style="margin: 20px">
                                            <div v-for="(pic, picIndex) in group.picPath" :key="picIndex"
                                                style="width: 33%; height: 200px;">
                                                <el-image style="width: 90%; height: 90%;border:1px solid #eeae85;"
                                                    :src="pic" :preview-src-list="group.picPath">
                                                </el-image>
                                            </div>
                                        </div>
                                        <div v-for="(question, index) in group.groupItem"
                                            :key="question.questionItemId">
                                            <el-form-item v-if="fatherName === 'QueLogDialog'?   question.isDefaultDisplay? true : false     : true "
                                                :label="index+1 + ' ' + question.label" :prop="question.formItemId">
                                                <!-- :rules="question.expand && JSON.parse(question.expand).rule ? JSON.parse(question.expand).rule[0] : []" -->
                                                <i v-if="fatherName === 'QuestionManagement' && question.isDefaultDisplay"
                                                    class="el-icon-star-on" style="color:#F56C6C"></i>
                                                <el-button type="primary" v-if="fatherName === 'QuestionManagement'"
                                                    @click="editQue(question)" style="margin-left: 20px">编辑</el-button>
                                                <el-button type="danger" v-if="fatherName === 'QuestionManagement'"
                                                    @click="deleteQue(question)" style="margin-left: 20px">删除
                                                </el-button>
                                                <QuestionComponent :form-conf="question"
                                                    class="question-area" />
                                            </el-form-item>
                                        </div>
                                    </div>
            
                                </div>
                            </el-form>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-container>
        <!-- 修改问题和选项描述弹框 -->
        <el-dialog title="编辑问卷题目" :visible.sync="dialogVisbleEdit" width="50%" append-to-body
            :close-on-click-modal="false">
            <el-form label-width="120px" :model="editForm">
                <el-form-item label="题目描述">
                    <el-input v-model="editForm.label"></el-input>
                </el-form-item>
                <div v-if="editForm.expand">
                    <el-form-item v-for="(item, i) in editForm.expand.options" :key="i" :label="'选项' + String(i)">
                        <el-input v-model="item.label"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisbleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
// 组件
import QuestionComponent from './components/QuestionComponent'
// 接口
import { updateItem, deleteItem } from '@/api/questionnaire/management';
export default {
    name: "paper",
    props: {
        paperList: {
            type: Array,
            required: true
        },
        questionnaireInfo: {
            type: Object,
        },
        fatherName: {
            type: String,
        }
    },
    components: {
        QuestionComponent
    },
    data() {
        return {
            question_key: this.$route.query.question_key,
            describe: '有红色五角星的题目为问卷默认展示题目',
            // 表单
            dynamicValidateForm: {
                answerer: '',
                paperList: [],
            },
            // 校验规则
            rules: [
                [{ required: true, message: '请填入您的姓名', trigger: 'blur' }]
            ],
            // 时间计算
            timestampStart: 0,
            // 编辑题目描述
            dialogVisbleEdit: false,
            editForm: {
                expand: {
                    options: []
                }
            },
        };
    },
    mounted() {
    },
    methods: {
        // 编辑题目和选项描述
        editQue(question) {
            console.log('question')
            console.log(question)
            this.editForm = _.cloneDeep(question)
            this.dialogVisbleEdit = true
        },
        // 确认编辑
        async editConfirm() {
            let params = this.editForm;
            let res = await updateItem(params)
            if (!res.success) {
                this.$message.warning('编辑失败')
                return
            }
            this.$message.success('修改成功')
            this.dialogVisbleEdit = false
            this.$emit('getQuestionnaireItem', this.questionnaireInfo.questionKey)
        },
        // 删除题目
        async deleteQue(question) {
            try {
                await this.$confirm('是否确定删除该题目?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
            } catch (e) {
                this.$message.info('取消了删除')
                return;
            }
            let res = await deleteItem({ questionItemId: question.questionItemId })
            if (!res.success) {
                this.$message.warning('删除失败')
                return;
            }
            this.$message.success('删除成功')
            this.$emit('getQuestionnaireItem', this.questionnaireInfo.questionKey)
        }
    }
};
</script>

<style>
.demo-dynamic .el-form-item__label {
    font-size: 18px;
    letter-spacing: 2px;
    font-family: 'PingFang SC', tahoma, arial, 'helvetica neue', 'hiragino sans gb', 'microsoft yahei', sans-serif;
}
</style>

<style scoped lang="scss">
.zero-class-box {
    max-width: 1920px; /*设置div的宽度*/
    min-height: 600px; /*设置div的高度，实际制作网页中可以让高度自适应内容。或者根据内容人工调整高度值*/
    //background-color: #f9c; /*设置背景颜色，帮助制作者查看div的位置，网页制作完成后，可以删除背景颜色*/
    margin: 0px auto; /*设置外边距上下0px，左右auto，即可实现左右居中的效果*/
    // border: thin #f7f3f3 solid;
    // box-shadow: 1px 1px 3px #e2dddd;
    // border-radius: 10px;
    padding: 10px;
    // background: #eceff3 url(./../../assets/img/question.jpg);
    .one-class-row {
        width: 100%;
    }
    .one-middle {
        background-color: #fff;
        border: thin #f7f3f3 solid;
        box-shadow: 1px 1px 3px #e2dddd;
        border-radius: 10px;
        padding: 34px 72px 84px 72px;
        overflow: hidden;
        .paper-title {
            text-align: center;
            margin-top: 40px;
        }
        .survey-header-subtitle {
            padding: 0 30px;
            margin: 40px 0;
            font-size: 16px;
            word-break: break-word;
        }
        .question-area {
            padding: 0 20px;
        }
        .footer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            // background: rgb(245, 252, 237);
        }
        // 问卷答题区域样式
        .paper-area {
            // background: #e2dddd;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .demo-image__preview {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
            }
            .pagination {
                width: 100%;
                // background: #e2dddd;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
