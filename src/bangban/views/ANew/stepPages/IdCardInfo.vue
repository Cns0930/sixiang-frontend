<template>
    <div>
        <content-card class="id-card-info">
            <div slot="content" class="content">
                <div>
                    <!-- 证件照 -->
                    <div class="bar">
                        <span class="text">证件照</span>
                    </div>
                    <!-- <Identity v-model="fieldsMap['jingbanrenIdentity'].value" :isShowRecognise="true" @change="checked = false"></Identity> -->
                    <CommonForm :fields="fields" ref="fourStepForm" />
                </div>
            </div>
        </content-card>

        <div class="operate-btn">
            <el-button type="primary" class="big-btn btn-default" @click="goPrev">返回上一步</el-button>
            <el-button type="warning" class="big-btn btn-warn" @click="goNext">下一步</el-button>
        </div>
        <el-dialog class="warn-dialog" title="系统提示" :visible.sync="jingbanrenCheckError" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="warn-dialog-content">
                <div class="message">
                    证件信息与填写信息不一致请核对
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="warning" class="warn-btn" @click="jingbanrenCheckError = false">返回修改</el-button>
                    <el-button type="warning" class="warn-btn" @click="handleChecked">已核对</el-button>

                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ContentCard from '../components/ContentCard'
import CommonForm from "../components/CommonForm"

import Identity from "@/views/layoutComponents/IdentityCommon/IdentityCommon"
import { mapGetters } from "vuex"
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
export default {
    name: 'IdCardInfo',
    components: { ContentCard, CommonForm, Identity },
    props: ['active', 'config'],
    mixins: [CommonMixin],
    data() {
        return {
            // 经办人身份检查
            jingbanrenCheckError: false,
            checked: false,
        }
    },
    computed: {
        ...mapGetters(['getJingbanrenName', 'getJingbanrenMobile', 'getJingbanrenIdCard', 'getCompanyName']),
        fieldsMap() {
            return this.config.reduce((result, fieldNo) => {
                let item = this.itemState[fieldNo]
                result[fieldNo] = item;
                return result;
            }, {})
        },
        fields() {

            return this.config.map(fieldNo => this.itemState[fieldNo])
        },
        jingbanrenCardP() {
            return this.itemState["99_1"]
        },
        jingbanrenCardN() {
            return this.itemState["99_2"]
        },

    },
    watch: {
        active(newValue) {
            if (newValue == 2) {
                let dom = document.querySelector('.app-wrapper')
                dom.scrollTop = 0
            }
        },

    },
    async created() {
        // 赋值默认值
        if (this.itemState['jingbanren_name']) {
            this.$set(this.itemState['jingbanren_name'], 'value', this.getJingbanrenName);
        }
        if (this.itemState['jingbanren_mobilePhone']) {
            this.$set(this.itemState['jingbanren_mobilePhone'], 'value', this.getJingbanrenMobile);
        }
        if (this.itemState['jingbanren_idNum']) {
            this.$set(this.itemState['jingbanren_idNum'], 'value', this.getJingbanrenIdCard);
        }
    },
    methods: {

        beforeEnter() {
        },
        async beforeLeave() {
            let validateResult = await this.validate();
            if (!validateResult) {
                return false;
            }
            return await this.checkInfo();
        },

        async checkInfo() {
            if (this.checked) return true;
            // 获取经办人信息
            let result;

            let nameRecognise = this.fieldsMap['jingbanrenIdentity'].value.name;
            let idCardRecognise = this.fieldsMap['jingbanrenIdentity'].value.code;

            if (nameRecognise !== this.getJingbanrenName || idCardRecognise !== this.getJingbanrenIdCard) {


                try {
                    result = await this.$msgbox({
                        title: "系统提示",
                        message: <div class="">
                            <div class="form-line">

                                <span class="form-title" style="whidth:200px;">证件信息与填写信息不一致请核对</span>


                            </div>

                        </div>
                        ,
                        showCancelButton: true,
                        customClass: "msgbox",
                        cancelButtonClass: "button-warn",
                        confirmButtonClass: "button-warn",
                        cancelButtonText: "返回修改",
                        confirmButtonText: "已核对"

                    });
                } catch (e) {
                    result = "cancel"
                }
                if (result != "confirm") return false;

            }



            this.checked = true;
            return true;
        },
        handleChecked() {
            this.jingbanrenCheckError = false;
        },
        async goNext() {
            let result = await this.beforeLeave();

            if (!result) return;
            this.$emit('goNext')
        },
        goPrev() {
            this.$emit('goPrev')
        },
        async validate() {
            return await this.$refs.fourStepForm.validate()
        },
        async validateIdInfo() {
            return await this.$refs.identityCheck.checkInfo()
        }
    },
}
</script>

<style scoped lang="scss">
.bar {
    height: 40px;
    line-height: 40px;
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 0 -1px 0 0 rgba(255, 255, 255, 0.5),
        0 1px 0 0 rgba(255, 255, 255, 0.5);
    padding: 0 20px;
    display: flex;
    align-items: center;
    .text {
        background-image: url("~@/assets/svg/txt.svg");
        background-repeat: no-repeat;
        background-size: contain;
        padding-left: 25px;
        height: 20px;
        line-height: 20px;
        font-size: 20px;
        color: #ffffff;
    }
}
.consign {
    font-size: 18px;
    padding: 20px 40px;

    .consign-line {
        margin: 4px 0;
    }

    .el-radio {
        color: #fff;
    }

    .el-radio__input.is-checked + .el-radio__label {
        color: #fff;
        font-size: 18px;
    }
}
</style>
<style lang="scss">
.id-card-info {
    .consign {
        .el-radio__input.is-checked + .el-radio__label {
            color: #fff;
            font-size: 18px;
        }

        .el-radio__label {
            color: #fff;
            font-size: 18px;
        }
    }
}
</style>
