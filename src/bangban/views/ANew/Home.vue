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
                @goPrev="goPrevious" :stepData="step" ref="components" :isLastStep="active==stepsData.length-1">
            </component>
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

    </div>
</template>

<script>

// 库
import AsyncValidator from 'async-validator';
import _ from "lodash"
// img
import stepIcon from '@/assets/png/step-icon.png'
// api
import { getStep, } from "@/api/step/index";
import { getField } from "@/api/superForm/index";
import { getTemplate } from '@/api/template/index'
import { getById } from '@/api/item/index'
import { CommitSelfRecord, QueryBarcodeApi } from '@/api/ANew/index'
// 组件
import LeftSteper from './LeftSteper'
import ContentCard from './components/ContentCard'
import ApprovalSelectContent from "./stepPages/ApprovalSelectContent"
import MaterialExtract from "./stepPages/MaterialExtract"
import FormPage from "./stepPages/FormPage"
import IdCardInfo from "./stepPages/IdCardInfo"
import CommonMaterial from "./stepPages/CommonMaterial"
import BaseFormPage from "./stepPages/BaseFormPage"
import BusinessFormPage from "./stepPages/BusinessFormPage"
// minxin
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
import { mixin as initMixin } from "@/mixin/mixin"

import { mapState, mapGetters } from "vuex"
// import stepPagesMap from "./config/stepPagesMap"
// js模块
import Rules from "@/utils/ruleConfig"

import store from "@/vuex/store"
import { functionReviverRuntime, functionReviverEventRuntime, convertDefToConfigEventRuntime } from "@/views/formConstructor/util"
import { deserializeTableData } from "@/views/attributeComponents/index";

export default {
    name: "Home",
    mixins: [CommonMixin, initMixin],
    provide() {
        return {
            $itemState: () => {
                return this.itemState
            },

            $itemGetters: () => {
                return this.itemGetters
            },

        }
    },
    data() {
        return {
            stepIcon,
            rules: {},
            // stepPagesMap,
            active: 0,
            stepsData: [],
            msg: "",
            showValidation: false,
            validateDialogMsg: "请填写完整信息",
            showCommitDialog: false,
            showConfirm: false,
            dev_barcode: this.$route.query.barcode,
            barcode: "",
        }
    },
    components: { LeftSteper, ApprovalSelectContent, MaterialExtract, FormPage, IdCardInfo, CommonMaterial, BaseFormPage, BusinessFormPage, ContentCard },
    computed: {

        // ...mapGetters(['sid', "item_code"]),
        // ...mapState({

        //     selfServiceCaseId: state => state.home.selfServiceCaseId,
        //     isHistoryRecord: state => state.home.isHistoryRecord
        // }),
        // 步骤页面的数据—— 根据事项 来定一 步骤页面 和每个步骤的组件
        // stepsData() {
        //     return stepPagesMap[this.sid] || [];
        // },
        step() {

            return this.stepsData[this.active]
        },
        itemName() {
            return this.$store.state.home.item.name
        }

    },
    async created() {

        await this.init();
        await this.fetchBookInfo();
        // 获取 step data 和 field
        let result = await Promise.all([
            getStep({ itemName: this.itemName }),
            getField({ itemName: this.itemName }),
        ])

        this.stepsData = result[0].data.map(v => {

            if (typeof v.stepObject.configFn == "string" && v.stepObject.configFn.indexOf('function') > -1) {
                v.stepObject.configFn = functionReviverRuntime(v.stepObject.configFn, v.component);
            }
            if (v.stepObject.useBeforeEnter) {
                v.stepObject.beforeEnterFn = eval(`(${v.stepObject.beforeEnterFn})`)
            }
            if (v.stepObject.useAfterEnter) {
                v.stepObject.afterEnterFn = eval(`(${v.stepObject.afterEnterFn})`)
            }

            return { ...v.stepObject, stepPagenum: v.stepPagenum }
        }).sort((a, b) => a.stepPagenum - b.stepPagenum)

        this.allFields = result[1].data.map(v => ({ id: v.id, fieldType: v.fieldType, children: v.children, ...v.object })).map(deserializeTableData);
        let baseFields = this.allFields.filter(v => v.fieldType == 1)

        let itemState = convertDefToConfigEventRuntime(baseFields);


        let itemGetters = this.allFields.filter(v => v.fieldType == 2).reduce((result, item) => {
            // let attrObj = _.mapValues(item.componentDefs, (o) => this.parseFunction(o.value));
            if (!item.componentDefs.getter) {
                console.log(item.componentDefs)
            }
            result[item.fieldNo] = functionReviverRuntime(item.componentDefs.getter.value, item.fieldNo);

            return result;
        }, {});
        let gettersList = Object.keys(itemGetters)
        this.$store.commit("putGettersList", gettersList)

        // 注册模块
        let module = {
            namespaced: true,
            state: itemState,
            getters: itemGetters
        };

        if (this.$store.hasModule("run")) {
            this.$store.unregisterModule("run");
        }
        console.log(itemState)
        // console.log(JSON.stringify(module.state, null, 4));
        this.$store.registerModule("run", module);


        this.rules = new Rules(this.itemState, this.itemGetters).rules;
    },

    methods: {
        // async loadAll() {
        //     let result = await Promise.all([
        //         getStep({ itemName: this.itemName }),
        //         getField({ itemName: this.itemName }),
        //         getTemplate({ itemName: this.itemName })
        //     ])
        //     if (result.some(v => !v.success)) return;
        //     return result;


        // },

        async goNext(data) {
            let nextActive = this.active + 1;

            // if(this.$refs.components[nextActive].beforeEnter){

            //     await this.$refs.components[nextActive].beforeEnter();
            // }

            let nextStep = this.stepsData[nextActive]
            let beforeEnterFn = nextStep.beforeEnterFn;
            if (beforeEnterFn) {
                beforeEnterFn(this.itemState, this.itemGetters)
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

            let sub = this.itemState.fact1 ? this.itemState.fact1.value : ""
            sub = Object.prototype.toString.call(sub) != "[object Array]" ? [sub] : sub

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
        goPrevious() {
            if (this.active > 0) {
                this.active--;
            }
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
        },
        async fetchBookInfo() {
            if (this.dev_barcode && this.dev_barcode.trim()) {
               await  this.onBarcodeScanned(this.dev_barcode)
            } else {
                this.$message.warning('请输入票号..')
            }
        },
        async onBarcodeScanned(barcode) {
            this.barcode = barcode
            if (!this.barcode || !this.barcode.trim()) return;

            let { code, message, data } = await QueryBarcodeApi({ barcode: this.barcode.trim() })


            // 获取预约信息


            // 提前退出条件
            // if (data && data.Numbertaking && data.Numbertaking.barcodetype === 'barcode' && message !== "SUCCESS") {
            //     this.showErrorVisible = true;
            //     this.loading = false;
            //     return;
            // }
            // 保存 票号
            // if (data && data.Numbertaking && data.Numbertaking.barcodetype === 'barcode') {
            //     data.Numbertaking.selfServiceCaseId && this.$store.commit("putSelfServiceCaseId", data.Numbertaking.selfServiceCaseId)
            // }

            if (code === 200 && message === 'SUCCESS' && data) {
                this.showResult = data.Numbertaking
                this.showResult.barcode = this.barcode.trim()

                sessionStorage.setItem('baseInfo', JSON.stringify(this.showResult))
                sessionStorage.setItem('barcode', barcode)
                this.$store.commit("putCompanyName", data.Numbertaking.companyname)
                this.$store.commit("putBarcodeInfo", data.Numbertaking)


                //如果是条形码 ，直接跳04
                // if (this.showResult.barcodetype === "barcode") {
                //     this.goNext();
                // } else {
                //     this.step = 1;
                // }

            }





        },
    }

}
</script>

<style scoped lang="scss">
//  @import "~@/assets/css/index.css";
.new {
    background-image: url("~@/assets/new_background.jpeg");
    &.home {
        height: calc(100vh - 105px);
        color: white;

        margin-top: 105px;
    }
}
.home {
    height: 100%;
    display: flex;
    padding: 20px 60px 20px 60px;
    min-width: 1340px;
    overflow: auto;

    .left {
        width: 320px;
        margin-right: 26px;
    }

    .right {
        height: 100%;
        flex: 1;

        div {
            height: 100%;
        }
    }
}
</style>
