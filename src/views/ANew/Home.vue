<template>
    <div class="home new">
        <div class="left">
            <content-card title="收件流程" :img="stepIcon">
                <LeftSteper slot="content" :stepsData="stepsData" :active.sync="active"
                    @requestUpdateActive="handleUpdateActive"></LeftSteper>
            </content-card>
        </div>
        <div class="right">
            <!-- <template v-for="(step,index) in stepsData" >
                <component  v-if="index == active" :is="step.component" :config="step.configType ==1 ? step.config:step.configFn(itemState,itemGetters)" @goNext="goNext" @goPrev="goPrevious" :stepData="step" ref="components"></component>
            </template> -->
            <component v-if="step" :is="step.component"
                :config="step.configType ==1 ? step.config:step.configFn(itemState,itemGetters)" @goNext="goNext"
                @goPrev="goPrevious" :stepData="step" ref="components" :isLastStep="active==stepsData.length-1"></component>
        </div>
        <processing v-if="msg" :msg="msg" />
        <el-dialog :show-close="false" class="message-dialog" title="系统提示" :visible.sync="showValidation" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">{{validateDialogMsg}}</div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="warning" class="dialog-warn-btn" @click="showValidation = false">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog class="message-dialog" title="系统提示" :visible.sync="showCommitDialog" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">是否确认生成文档</div>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="primary" class="dialog-primary-btn" @click="showCommitDialog = false">取消
                    </el-button>
                    <el-button type="warning" class="dialog-warn-btn" @click="commitDataConfirm">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog :show-close="false" class="message-dialog" title="系统提示" :visible.sync="showConfirm" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">{{confirmDialogMsg}}</div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="warning" class="dialog-warn-btn" @click="handleAllConfirm">确认信息无误</el-button>
                    <el-button type="warning" class="dialog-warn-btn" @click="showConfirm = false">返回修改</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
// img
import stepIcon from '@/assets/png/step-icon.png'
// api
import { getStep, } from "@/api/step/index";
// 组件
import LeftSteper from './LeftSteper'
import { mapState, mapGetters } from "vuex"
// import stepPagesMap from "./config/stepPagesMap"
import ApprovalSelectContent from "./stepPages/ApprovalSelectContent"
import MaterialExtract from "./stepPages/MaterialExtract"
import FormPage from "./stepPages/FormPage"
import IdCardInfo from "./stepPages/IdCardInfo"
import CommonMaterial from "./stepPages/CommonMaterial"
import Rules from "@/views/ANew/config/ruleConfig"
import AsyncValidator from 'async-validator';
import { CommitSelfRecord,QueryBarcodeApi } from '@/api/ANew/index'

import CommonMixin from "@/views/ANew/CommonMixin"
import BaseFormPage from "./stepPages/BaseFormPage"
import BusinessFormPage from "./stepPages/BusinessFormPage"
import _ from "lodash"
import store from "@/vuex/store"

export default {
    name: "Home",
    mixins: [ CommonMixin],
    provide() {
        return {
            $itemState: ()=>{
                return this.itemState
            },

            $itemGetters:()=>{
                return this.itemGetters
            },

        }
    },
    data() {
        return {
            rules: {},
            stepPagesMap,
            active:0,
        }
    },
    
    created() {
        // if (this.$route.params.item) {
        //     this.$store.commit("putItem", this.$route.params.item)
        // }


        this.rules = new Rules(this.itemState, this.itemGetters).rules;
        // this.stepsData = 
    },
    components: { LeftSteper, ApprovalSelectContent, MaterialExtract, FormPage, IdCardInfo, CommonMaterial, BaseFormPage, BusinessFormPage },
    computed: {

        // ...mapGetters(['sid', "item_code"]),
        ...mapState({
            // docList:state=>state.ANew.docList,
            selfServiceCaseId: state => state.home.selfServiceCaseId,
            isHistoryRecord: state => state.home.isHistoryRecord
        }),
        // 步骤页面的数据—— 根据事项 来定一 步骤页面 和每个步骤的组件
        // stepsData() {
        //     return stepPagesMap[this.sid] || [];
        // },
        step() {
            
            return this.stepsData[this.active]
        },
        globalState() {
            return this.$store.state.ANew;
        },
        // itemState() {
        //     return this.$store.state[this.item_code]
        // },
        // itemGetters() {
        //     return this.$store.getters
        // },


    },
    methods: {
         async init() {
            if (this.itemId == null) {
                let itemId = this.$route.query.itemId;
                let result = await getById({ id: itemId });
                if (!result.success) {
                    this.$message({ type: "warning", message: "获取初始事项信息失败" });
                    return;
                }
                this.$store.commit("changeItem", result.data);
            }

        },
        async loadAll() {
            let result = await Promise.all([
                getStep({ itemName: this.itemName }),
                getField({ itemName: this.itemName }),
                getTemplate({ itemName: this.itemName })
            ])
            if (result.some(v => !v.success)) return;
            return result;


        },

        async goNext(data) {
            let nextActive = this.active + 1;

            // if(this.$refs.components[nextActive].beforeEnter){

            //     await this.$refs.components[nextActive].beforeEnter();
            // }
          
            let nextStep = this.stepsData[nextActive]
            let beforeEnterFn = nextStep.beforeEnterFn;
            if(beforeEnterFn){
                beforeEnterFn(this.itemState,this.itemGetters)
            }

            if (this.stepsData[this.active + 1].component == "LastStep") {

                let result = await this.msgBox("是否确认生成文档");
                if (result != "confirm") return false;
                await this.commitDataConfirm();

            }
            this.active++;
        },
        // 提交数据
        async commitDataConfirm() {
            this.showCommitDialog = false

            let sub = this.itemState.fact1?this.itemState.fact1.value:""
            sub =Object.prototype.toString.call(sub) != "[object Array]"? [sub] : sub

            let selfServiceRecordId = this.$store.state.home.currentSelfServiceRecordId;

            const params = {
                'selfServiceRecordId': selfServiceRecordId,
                // 'fields': prepareData,
                'approval_item': sub,
                docList: this.$store.state.ANew.docList,
                selfServiceCaseId: this.selfServiceCaseId,
                "isHistoryRecord": this.isHistoryRecord,
            }
            this.msg = '正在生成文档......';
            let res = await CommitSelfRecord(params)

            const { code, message, data } = res;
            if (code === 200 && message === 'SUCCESS' && data) {
                this.msg = '';
                this.$message.success('材料提交成功!');

            } else {
                this.msg = '';
                this.$message.error('材料提交失败!');
            }

        },
        async handleUpdateActive(v, oldActive) {
            console.log(v, oldActive)
            if (v == oldActive) return;
            if (v > oldActive) {

                let result = this.$refs.components.validate ? await this.$refs.components.validate() : true;

                if (!result) {
                    this.showValidation = true
                    return;
                }
                for (let i = oldActive + 1; i < v; i++) {
                    let result
                    try {
                        result = await this.validateData(i)
                    } catch (e) {
                        console.log(e)
                    }

                    console.log(result)
                    if (!result) {
                        this.showValidation = true
                        return;
                    }

                }
            }
            if (this.stepsData[v].component == "LastStep") {
                let result = await this.msgBox("是否确认生成文档");
                if (result != "confirm") return false;
                await this.commitDataConfirm();
            }
            this.active = v;
        },
        async validateData(index) {

            let step = this.stepsData[index]
            let config = step.configType == 1 ? step.config : step.configFn(this.itemState, this.itemGetters);

            let fields = config.map(fieldNo => this.itemState[fieldNo]).filter(v => v && !v.hidden);
            let params = fields.map(field => {
                let validateRule = this.rules[field.ruleKey || "required"];

                if (validateRule.length == 0) {
                    console.log(field, validateRule, this.rules)
                }

                let prop = field.ruleKey ? field.ruleKey : field.required !== false ? 'required' : '';

                const descriptor = {};
                descriptor[prop] = validateRule;


                const validator = new AsyncValidator(descriptor);
                const model = {};

                model[prop] = field.ruleKey === "custom" ? field : field && field.value;

                return { validator, model, field }


            })

            let validateResult
            try {

                validateResult = await Promise.all(params.map(this.promisedValidate));
            } catch (e) {
                console.log(e)
            }


            if (validateResult.every(result => !result)) {
                return true;
            }
            console.log("错误的字段")

            return false;

        },
        async promisedValidate({ validator, model }) {

            return new Promise((resolve, reject) => {

                validator.validate(model, { firstFields: true }, (errors, invalidFields) => {

                    resolve(errors, invalidFields)
                });
            })
        },
        async msgBox(message) {
            let result
            try {
                result = await this.$msgbox({
                    title: "系统提示",
                    message: <div class="">
                        <div class="form-line">

                            <span class="form-title" style="whidth:200px;">{message}</span>


                        </div>

                    </div>
                    ,
                    showCancelButton: true,
                    customClass: "msgbox",
                    cancelButtonClass: "button-warn",
                    confirmButtonClass: "button-warn",

                });
            } catch (e) {
                result = "cancel"
            }
            return result
        }
    }

}
</script>

<style>
</style>