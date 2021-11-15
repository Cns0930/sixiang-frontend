<template>
    <div>
        <!-- 事项编辑弹窗 -->
        <el-dialog title="事项属性填写" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false"
        :before-close="closeDialog">
            <div class="attribute-content">
                <el-form :model="tempItem" ref="tempItem" :inline="false" label-position="left"
                    class="demo-form-inline">
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
                    <el-form-item label="事项名称" prop="itemName">
                        <el-input v-model="tempItem.itemName">
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item label="补充业务信息描述" prop="extraInfo">
                        <el-input v-model="tempItem.extraInfo">
                        </el-input>
                    </el-form-item> -->
                    <el-form-item label="补充业务信息描述" class="ruleItem">
                        <div v-for="(item,i) in extraInfoList" :key="i" class="ruleItems">
                            <el-input v-model="item.keyValue" placeholder="请填入业务信息key值" clearable style="width:40%">
                            </el-input>
                            <el-input v-model="item.labelValue" placeholder="请填入业务信息value值" style="width:40%" clearable>
                            </el-input>
                            <i v-if="extraInfoList.length>1" style="margin-left:10px;color:red;cursor: pointer;"
                                class="el-icon-delete" @click="deletInputs(i)"></i>
                            <!-- </div> -->
                        </div>
                        <i class="el-icon-plus" style="margin-left:10px;color:#409EFF;cursor: pointer;"
                            @click="addExtraInfoList()"></i>
                        <!-- </div> -->
                    </el-form-item>
                    <el-form-item label="事项类型(如新增/变更)" prop="itemType">
                        <el-input v-model="tempItem.itemType">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="tempItem.sort">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="办件类型">
                        <el-select v-model="tempItem.sujectType" multiple filterable placeholder="个人/企业"
                            style="width:300px">
                            <el-option :value="Number(0)" label="个人"></el-option>
                            <el-option :value="Number(1)" label="企业"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否制件">
                        <el-select v-model="tempItem.isPart" placeholder="否/是" style="width:300px">
                            <el-option :value="Number(0)" label="否"></el-option>
                            <el-option :value="Number(1)" label="是"></el-option>
                        </el-select>
                        <span v-if="tempItem.isPart">制件方式：</span>
                        <el-radio-group v-if="tempItem.isPart" v-model="tempItem.partMode">
                            <el-radio label="邮寄">邮寄</el-radio>
                            <el-radio label="自取">自取</el-radio>
                            <el-radio label="邮寄or自取">邮寄or自取</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="支持的功能">
                        <div> 非查询类事项：
                        <el-checkbox v-model="tempItem.featureScope.bangban" @change="checkConflict">帮办</el-checkbox>
                        <el-checkbox v-model="tempItem.featureScope.yujian" @change="checkConflict">预检</el-checkbox>
                        <el-checkbox v-model="tempItem.featureScope.submit" @change="checkConflict">提交</el-checkbox>
                        </div> 
                        <div style="margin-left:82px"> 
                            查询类事项：
                        <el-checkbox v-model="tempItem.featureScope.enquiry" @change="handleEnquiry">查询</el-checkbox>
                        <el-checkbox v-model="tempItem.featureScope.facialAuth">人脸识别</el-checkbox>
                        <el-checkbox v-model="tempItem.featureScope.isPage">是否分页</el-checkbox>
                        </div>
                           <div style="margin-left:82px"> 
                            是否为“一件事”：
                            <el-checkbox v-model="tempItem.featureScope.isGroup">是</el-checkbox>
                           </div>
                            <div style="margin-left:82px" v-if="tempItem.featureScope.isGroup"> 
                              关联内部事项编号：<InputArray v-model="tempItem.featureScope.subItemInternalNo" placeholder="多个编号,隔开"> </InputArray>
                            </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" @click="updateItem">
                    确定
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import { InputArray } from "@/views/attributeComponents/defRendererComponents/defRendererComponents";
import axios from 'axios'
// 接口
import {
    listApprovalAll, updateApprovalItem
} from "@/api/basicInfo/approval"

export default {
    mixins: [mixin],
    components: { InputArray },
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            dialogVisible: false,
            tempItem: {
                featureScope:{
                }
            },
            approvalOptions: [],
            extraInfoList: [{
                keyValue: '',
                labelValue: '',
            }],
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
            let approvalRes = await listApprovalAll({ projectId: this.$route.query.projectId });
            if (approvalRes.success) {
                this.approvalOptions = approvalRes.data;
            }
            this.tempItem.approvalItemId = this.tempItem.approvalItemLordId;
            this.extraInfoList = JSON.parse(this.tempItem.extraInfo);
            console.log('this.tempItem')
            console.log(this.tempItem)
        },
        closeDialog() {
            this.$emit('changeDetil');
            this.$emit('changeMain');
            this.dialogVisible = false;
        },
        async updateItem() {
            this.tempItem.extraInfo = JSON.stringify(this.extraInfoList);
            this.tempItem.sujectType = this.tempItem.sujectType.toString();
            if (!this.tempItem.isPart) {
                this.tempItem.partMode = ''
            }
            let res = await updateApprovalItem(this.tempItem);
            if (res.success) {
                this.$message.success("事项修改成功!");
                // this.$emit('changeDetil');
                // this.$emit('changeMain');
                this.closeDialog();
            } else {
                this.$message.success("事项修改失败!");
            }
        },
        // 编辑事项相关
        addExtraInfoList() {
            this.extraInfoList.push({
                keyValue: '',
                labelValue: '',
            })
        },
        deletInputs(i) {
            this.extraInfoList.splice(i, 1);
        },
        handleEnquiry(v){
            if(v){
                this.tempItem.featureScope.bangban = false;
                this.tempItem.featureScope.yujian = false;
                this.tempItem.featureScope.submit = false;
                this.tempItem.featureScope.facialAuth = true;
                this.tempItem.featureScope.isPage = true;
            }
        },
        checkConflict(v){
            if(v){
                this.tempItem.featureScope.enquiry = false;
                this.tempItem.featureScope.facialAuth = false;
                this.tempItem.featureScope.isPage = false;
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../../assets/css/global.scss";
</style>