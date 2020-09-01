<template>
    <div class="form-info-home">
        <content-card>
            <div slot="content" class="content">
                <div class="title">
                    <img src="~@/assets/svg/txt.svg" />
                    <span class="text">基本信息</span>
                </div>

                <div class="form-section">
                    <CommonForm :fields="fields" :rules="rules" ref="form"></CommonForm>
                </div>
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
                    <el-button type="warning" class="dialog-warn-btn" @click="showBaseValidation = false">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import FormPage from "@/bangban/views/ANew/stepPages/FormPage"
import { queryDefault } from "@/api/ANew/newA"
import { mapGetters, mapState } from "vuex"
import _ from "lodash"
export default {
    name: "BaseFormPage",
    mixins: [FormPage],
    computed: {
        ...mapGetters(['getCompanyName', 'getCurrentSelfServiceRecordId']),
        ...mapState({
            hasQueryDefaultInfo: state => state.ANew.hasQueryDefaultInfo,
        })
    },
    data() {
        return {
            showBaseValidation: false,
        }
    },
    async created() {
        if (this.hasQueryDefaultInfo) return;
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
        if(this.itemState['companyName']){
            this.$set(this.itemState['companyName'], "value", this.getCompanyName)
        }
        
        console.log("默认值获取完毕")
        
        if(this.stepData.useAfterEnter){
            this.stepData.afterEnterFn(this.itemState,this.itemGetters)
        }
    },
    methods: {
        async beforeEnter() {

        },
        async validate() {
            return await this.$refs.form.validate();
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
.form-section {
    // margin-top: 20px;
}
</style>