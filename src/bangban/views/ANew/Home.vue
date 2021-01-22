<template>
    <div>
        <section class="previewImgBox" @click="imgNext()" v-if="dialogTableVisible">
            <div class="previewImg" :style="{backgroundImage: `url(${imgUrl})`}"></div>
        </section>
        <div class="home new" ref="imageWrapper">
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
                <component v-if="step" :is="step.component" :config="getStepConfig()" @goNext="goNext"
                    @goPrev="goPrevious" :stepData="step" ref="components" :isLastStep="active==stepsData.length-1">
                </component>
            </div>
        </div>
        <!-- 重要注释，要保留！！ -->
        <!-- <div class="operate-btn changePosition">
            <el-button type="primary" class="big-btn btn-default" size="small" @click="toImage">生成截图</el-button>
        </div> -->
        <el-dialog class="message-dialog" title="系统提示" :visible.sync="showTestCommitDialog" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">是否确认生成测试用例</div>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="primary" class="dialog-primary-btn" @click="showTestCommitDialog = false">取 消
                    </el-button>
                    <el-button type="warning" class="dialog-warn-btn" @click="commitTestConfirm">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog class="message-dialog" title="生成测试用例" :visible.sync="showAddTestDialog" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <el-form ref="testAddform" :model="testAddform" label-width="150px">
                    <el-form-item label="情形选择：">
                        <el-select v-model="testAddform.approvalSubList" multiple collapse-tags style="width: 610px;"
                            placeholder="请选择情形名称">
                            <el-option v-for="item in approvalSubOptions" :key="item.approvalSubitemId"
                                :label="item.subitemName" :value="item.approvalSubitemId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用例名称：">
                        <el-input v-model="testAddform.name"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="primary" class="dialog-primary-btn" @click="showAddTestDialog = false">取 消
                    </el-button>
                    <el-button type="warning" class="dialog-warn-btn" @click="commitTestcase">确 定</el-button>
                </div>
            </div>
        </el-dialog>
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
import html2canvas from "html2canvas"
// 库
import AsyncValidator from 'async-validator';
import _ from "lodash"
// img
import stepIcon from '@/assets/png/step-icon.png'
// api
import { getStep, getStepResearcher } from "@/api/step/index";
import { getFieldAll } from "@/api/superForm/index";
import { getTemplate } from '@/api/template/index'
import { getById } from '@/api/item/index'
import { CommitSelfRecord, QueryBarcodeApi } from '@/api/ANew/index'
import { addTestcase } from '@/api/basicInfo/testcase'
import { listApprovalSubAll } from "@/api/basicInfo/approvalSub";
// 组件
import LeftSteper from './LeftSteper'
import ContentCard from './components/ContentCard'
import ApprovalSelectContent from "./stepPages/ApprovalSelectContent"
import MaterialExtract from "./stepPages/MaterialExtract"
import FormPage from "./stepPages/FormPage"
import IdCardInfo from "./stepPages/IdCardInfo"
import CommonMaterial from "./stepPages/CommonMaterial"
import LastStep from "./stepPages/LastStep"
import BaseFormPage from "./stepPages/BaseFormPage"
import BusinessFormPage from "./stepPages/BusinessFormPage"
import processing from "./components/Processing"
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

import CommonForm from "./components/CommonForm"
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
            dialogTableVisible: false,
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
            // itemId: this.$route.query.itemId,
            type: this.$route.query.type,

            // 测试用例相关
            imgUrl: '',
            showTestCommitDialog: false,
            showAddTestDialog: false,
            testAddform: {
                approvalSubList: []
            },
            approvalSubOptions: [],
        }
    },
    components: { LeftSteper, ApprovalSelectContent, MaterialExtract, FormPage, IdCardInfo, CommonMaterial, BaseFormPage, BusinessFormPage, ContentCard, LastStep, processing },
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
        // itemName() {
        //     return this.$store.state.home.item.name
        // },
        itemId() {
            return this.$store.state.home.item.approvalItemId
        }

    },
    async created() {

        await this.init();
        await this.fetchBookInfo();
        // 获取 step data 和 field
        let result;
        if (this.type === 'researcher') {
            result = await Promise.all([
                getStepResearcher({ approvalItemId: this.itemId }),
                getFieldAll({ approvalItemId: this.itemId }),
            ])
        } else {
            result = await Promise.all([
                getStep({ approvalItemId: this.itemId }),
                getFieldAll({ approvalItemId: this.itemId }),
            ])
        }
        this.stepsData = result[0].data.map(v => {

            if (typeof v.stepObject.configFn == "string" && v.stepObject.configFn.indexOf('function') > -1) {

                v.stepObject.configFn = functionReviverRuntime(v.stepObject.configFn, v.stepObject.component);
            }
            if (v.stepObject.configType == 3 && typeof v.stepObject.configFnFromUiCompiler == "string" && v.stepObject.configFnFromUiCompiler.indexOf('function') > -1) {

                v.stepObject.configFnFromUiCompiler = functionReviverRuntime(v.stepObject.configFnFromUiCompiler, v.stepObject.component);
            }
            if (v.stepObject.useBeforeEnter) {
                v.stepObject.beforeEnterFn = functionReviverRuntime(`(${v.stepObject.beforeEnterFn})`)
            }
            if (v.stepObject.useAfterEnter) {
                v.stepObject.afterEnterFn = functionReviverRuntime(`(${v.stepObject.afterEnterFn})`)
            }

            return { ...v.stepObject, stepPagenum: v.stepPagenum }
        }).sort((a, b) => a.stepPagenum - b.stepPagenum)

        this.allFields = result[1].data.map(v => ({
            id: v.id, fieldType: v.fieldType, fieldName: v.fieldName,
            remark: v.remark,
            children: v.children, ...v.object
        })).map(deserializeTableData);
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
        console.log("baseFields:", baseFields)
        console.log("itemGetters:", itemGetters)
        let gettersList = Object.keys(itemGetters)


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


        this.$store.commit("putGettersList", gettersList)
        console.log(this.itemGetters)
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
        toImage() {
            html2canvas(this.$refs.imageWrapper).then(canvas => {
                let dataURL = canvas.toDataURL("image/png");
                this.imgUrl = dataURL;
                console.log(this.imgUrl)
                if (this.imgUrl !== "") {
                    this.dialogTableVisible = true;
                }
            });
        },
        imgNext() {
            this.dialogTableVisible = false;
            this.showTestCommitDialog = true;
        },
        commitTestConfirm() {
            this.showTestCommitDialog = false;
            this.showAddTestDialog = true;
            this.getApprovalSubOptions();
            console.log('this.stepsData');
            console.log(this.stepsData);
            console.log('this.step');
            console.log(this.step);
        },
        // 生成测试用例
        commitTestcase() {
            console.log('this.testAddform');
            console.log(this.testAddform);
            this.showAddTestDialog = false;
        },
        // 情形选项
        async getApprovalSubOptions() {
            let result = await listApprovalSubAll({ approvalItemId: this.$route.query.itemId })
            this.approvalSubOptions = result.data;
        },
        getStepConfig() {
            console.log("计算config", this.itemState, this.itemGetters)
            if (this.step.configType == 1) {
                return this.step.config
            } else if (this.step.configType == 2) {
                return this.step.configFn(this.itemState, this.itemGetters)
            } else {
                return this.step.configFnFromUiCompiler(this.itemState, this.itemGetters)
            }

        },
        async init() {

            let itemId = this.$route.query.itemId;
            let result = await getById({ approvalItemId: itemId });
            if (!result.success) {
                this.$message({ type: "warning", message: "获取初始事项信息失败" });
                return;
            }
            this.$store.commit("changeItem", result.data);
            this.$store.commit("putSid", result.data.sid)

        },
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
                await this.onBarcodeScanned(this.dev_barcode)
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
    min-width: 1370px;
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
.previewImgBox {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    & > .previewImg {
        position: absolute;
        top: 10%;
        left: 50%;
        min-width: 1000px;
        height: 100%;
        max-height: 80%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        transform: translateX(-50%);
    }
}
.changePosition {
    transform: translate(-50px, -115px);
    width: 300px;
}
</style>
