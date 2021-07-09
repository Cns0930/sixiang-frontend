<template>
    <div>
        <el-dialog title="问卷自定义问题新增" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false">

            <!-- <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content bg-purple"></div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple"></div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple"></div>
                </el-col>
                <el-col :span="4">
                    <div class="grid-content bg-purple"></div>
                </el-col>
            </el-row> -->
            <div class="chose-relevance">
                <el-row>
                    <h3>选择要添加的自定义问题的材料/字段</h3>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="grid-content bg-purple">
                            <el-select v-model="matchType" placeholder="问卷类型" style="" @change="searchMatch">
                                <el-option
                                    v-if="row.questionnaireType === 'material' || row.questionnaireType === 'materialAndField'"
                                    label="材料问卷" value="material"></el-option>
                                <el-option
                                    v-if="row.questionnaireType === 'field' || row.questionnaireType === 'materialAndField'"
                                    label="字段问卷" value="field"></el-option>
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
                            <div v-for="(item,i) in questionOptions" :key="i" style="display:flex; flex-direction: row; margin-bottom: 15px" >
                                <el-input v-model="questionOptions[i]" placeholder="问题选项"></el-input>
                                <span><i v-if="questionOptions.length>=1" style="margin-left:10px;color:red;cursor: pointer;"
                                    class="el-icon-delete" @click="deletOption(i)"></i></span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" v-if="componentType === 1 || componentType === 2">
                        <el-button type="primary" @click="addOption()">新增选项</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- <div class="question-picture">
                <el-row>
                    <h3 style="margin-top: 20px;">是否有相关图片，上传（可传0~多张）</h3>
                </el-row>
                <div>
                </div>
            </div> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
                <el-button type="primary" @click="addConfirm">确定添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
// 组件
import Paper from "./showQueModule/paper"
// 接口
import {
    addCustomItem, listCustomMatchOptions
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
            }
            let res = await addCustomItem(params);
            if(!res.success) {
                this.$message.warning('新增问题失败,请尝试重新编辑问题。')
                return;
            }
            this.$message.warning('新增问题成功,可继续新增或关闭窗口。')
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