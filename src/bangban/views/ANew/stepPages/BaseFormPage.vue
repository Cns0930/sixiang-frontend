<template>
    <div class="form-info-home">
        <content-card>
            <div slot="content" class="content">
                <div class="title">
                    <img src="~@/assets/svg/txt.svg" />
                    <span class="text">基本信息</span>
                </div>

                <!-- <div class="form-section">
                    <CommonForm :fields="fields" :rules="rules" ref="form"></CommonForm>
                </div> -->
                <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk
                    class="form-detail" :rules="rules" ref="form" :validate-on-rule-change="false"
                    @submit.native.prevent :class="{'marinTopGap':hasMarginTop}">
                    <el-row>
                        <template v-for="(group,groupIndex) in fieldsGroup">
                            
                            <el-col class="sub-title-n" v-if="group.fact">
                                <div class="tag"></div>
                                <span class="text">{{group.fact}}</span>
                            </el-col>

                            <template v-for="(v,i) in group.fields">
                                <el-col :span="24" v-if="v.wrapStart"></el-col>
                                <template v-if="v.hidden"></template>
                                <el-col v-else :span="v.span || 12" :key="''+groupIndex+i">
                                    <!-- if 列表组件 -->
                                    <component v-if="v.isList" :is="v.component" v-bind="v.attributes" :value="v.value"
                                        @change="v.onchange && v.onchange($event,itemState)"
                                        @input="v.oninput && v.oninput($event,itemState)"></component>
                                    <!-- if 独立组件 -->
                                    <component v-else-if="v.independent" :is="v.component" v-bind="v.attributes"
                                        @change="v.onchange && v.onchange($event,itemState)"
                                        @input="v.oninput && v.oninput($event,itemState)" v-model="v.value">
                                    </component>
                                    <!-- if 普通组件 -->
                                    <el-form-item v-else :key="i" :label="v.label.trim()"
                                        :label-width="v.label?_.isNil(v.labelWidth)? '200px':v.labelWidth:'50px'"
                                        :prop="v.ruleKey || ''" :obj="v">
                                        <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                                            @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                                            @input="v.oninput && v.oninput($event,itemState,itemGetters)"
                                            @select="v.select && v.select($event,itemState,itemGetters)"
                                            :class="{'default-text-color':v.hasConfirmed === false}"
                                            @focus="handleFocus(v)"></component>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24" v-if="v.wrapEnd"></el-col>
                                <!-- <el-form-item :key="i" :label="v.label"
                                    :label-width="v.label?_.isNil(v.labelWidth)? '200px':v.labelWidth:'50px'"
                                    :prop="v.ruleKey || ''" :obj="v">

                                    <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                                        @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                                        @input="v.oninput && v.oninput($event,itemState,itemGetters)"
                                        :class="{'default-text-color':v.hasConfirmed === false}"></component>
                                </el-form-item> -->
                            </template>

                        </template>
                    </el-row>
                </el-form>
            </div>
        </content-card>
        <div class="operate-btn">
            <el-button type="primary" class="big-btn btn-default" @click="goPrev">返回上一步</el-button>
            <el-button type="warning" class="big-btn btn-warn" @click="goNext">下一步</el-button>
        </div>

        <el-dialog class="message-dialog dialogToMsgbox" title="系统提示" :visible.sync="showBaseValidation" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">请填写完整信息</div>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="warning" class="dialog-warn-btn" @click="showBaseValidation = false">确 定
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// import FormPage from "@/bangban/views/ANew/stepPages/FormPage"
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
import ContentCard from '../components/ContentCard';
import TestFormItem from "@/components/TestFormItem"
import { queryDefault } from "@/api/ANew/newA"
import { mapGetters, mapState } from "vuex"
// import TitleCommon from "@/views/layoutComponents/TitleCommon/TitleCommon"
import _ from "lodash"
export default {
    name: "BaseFormPage",
    // mixins: [FormPage],
    mixins: [CommonMixin],
    props: {
        config:{
            default(){
                return []
            }
        }
    },
    components: {
        ContentCard,
        ElFormItem: TestFormItem ,
    },
    computed: {

        ...mapGetters(['getCompanyName', 'getCurrentSelfServiceRecordId']),
        ...mapState({
            hasQueryDefaultInfo: state => state.ANew.hasQueryDefaultInfo,
        }),
        fact1() {
            return this.itemState["fact1"].value
        },
        fieldsGroup() {
            console.log(config,'config 测试====')
            if (this.config.every(v => _.isString(v))) {
                return [{
                    fact: '',
                    fields: this.config.map(fieldNo => this.itemState[fieldNo]).sort((a, b) => a.sort - b.sort)
                }]
            }
            return this.config.map(group => {

                return {
                    fact: group.fact,
                    fields: group.fields.map(fieldNo => this.itemState[fieldNo]).sort((a, b) => a.sort - b.sort)
                }
            })
        },
        fields(){
             
            return this.fieldsGroup.map(block=>block.fields).flat();
            
          
        },
        hasMarginTop(){
            if(this.fieldsGroup.length<1) return false;
            let firstGroup = this.fieldsGroup[0]
            let firstFields = firstGroup.fields[0]
            let hasFirstListTitle =firstFields.isList && firstFields.title;
            if(!firstGroup.fact && !hasFirstListTitle){
                return true
            }
            return false;
        }
    },
    data() {
        return {
            showBaseValidation: false,
        }
    },
    async created() {
        console.log(this.fieldsGroup, 'fieldsGroup++++++++++++++++++++++++++++++')
        if (this.hasQueryDefaultInfo) {
            this.executeAfterEnterFn();
            return;
        };
        let result = await queryDefault({ companyName: this.getCompanyName, selfserviceRecordId: this.getCurrentSelfServiceRecordId })
        if (!result.code == 200) return;
        this.$store.commit("putHasQueryDefaultInfo", true)
        let list = result.data;
        list.forEach(field => {
            let fieldNo = field.fieldNo;
            let fieldState = this.itemState[fieldNo]

            if (fieldState) {

                // 如果是list组件
                if (fieldState.isList) {

                    let num = field.value.length;
                    fieldState.attributes.children = Array.from({ length: num }).map(() => _.cloneDeep(fieldState.meta))
                    fieldState.attributes.children.forEach((child, i) => {

                        let fieldsList = field.value[i];
                        fieldsList.forEach(v => {
                            if (child[v.fieldNo] && v.value) {
                                child[v.fieldNo].value = v.value
                            }
                        })
                    })
                    // fieldState.attributes.children.forEach(child)
                } else {
                    this.$set(this.itemState[fieldNo], "value", field.value)
                }


            }
        })
        // 公司名来自 票号
        if (this.itemState['companyName']) {
            this.$set(this.itemState['companyName'], "value", this.getCompanyName)
        }

        console.log("默认值获取完毕")

        this.executeAfterEnterFn();
        
    },
    methods: {
        executeAfterEnterFn() {
            if (this.stepData.useAfterEnter) {
                this.stepData.afterEnterFn(this.itemState, this.itemGetters)
            }
        },
        async beforeEnter() {

        },
        handleFocus(v) {
           
            v.hasConfirmed = true;
        },
        async validate() {
            let promises = this.$refs.form.fields.map(field => {
                return new Promise((resolve, reject) => {
                    field.validate('', '', (message, field) => {

                        if (message) {
                            resolve(false)

                        } else {
                            resolve(true)
                        }

                    })
                })
            })
            let result = await Promise.all(promises)

            return result.every(Boolean)
        },
        async beforeLeave() {
            let result = await this.validate();
            if (!result) return result;
            // 确认雨预填信息
            result = await this.validateConfirm();

            if (!result) {
                result = await this.msgBox("请确认预填信息是否正确！", "返回修改", "确认信息无误");
                if (result != "confirm") {
                    return false;
                } else {

                    this.fields.forEach(v => { v.hasConfirmed = true })

                    return true;
                }
            }

            return result
        },
        async validateConfirm() {
            return !this.fields.some(field => !field.hasConfirmed);
        },
        goPrev() {
            this.$emit('goPrev');
        },
        async goNext() {
            let result = await this.beforeLeave();
            if (!result) {
                this.showBaseValidation = true;
                return;
            };
            this.$emit('goNext');
        },
        async msgBox(message, cancelBtnText, confirmBtnText) {
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
                    cancelButtonText: cancelBtnText,
                    confirmButtonText: confirmBtnText

                });
            } catch (e) {
                result = "cancel"
            }
            return result
        }
    }

}
</script>

<style lang="scss" scoped>
.form-info-home {
    height: 100%;
    width: calc(100% - 6px);

    .content {
        padding-bottom: 20px;
    }
}
.form-section {
    // margin-top: 20px;
}
</style>