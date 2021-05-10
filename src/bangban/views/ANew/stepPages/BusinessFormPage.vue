<template>
    <div class="form-info-home">
        <content-card>
            <div slot="content" class="content">
                <div class="title">
                    <img src="~@/assets/svg/txt.svg" />
                    <span class="text">{{stepData.title}}</span>
                </div>
                <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk
                    class="form-detail" :rules="rules" ref="form" :validate-on-rule-change="false"
                    @submit.native.prevent :class="{'marinTopGap':hasMarginTop}">
                    <el-row >
                        <template v-for="(group,groupIndex) in fieldsGroup">

                            <el-col class="sub-title-n" v-if="group.fact">
                                <div class="tag"></div>
                                <span class="text">{{group.fact}}</span>
                            </el-col>

                            <template v-for="(v,i) in group.fields" >
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
                                    <el-form-item v-else 
                                    :key="i" 
                                    :label="v.label.trim()"  
                                    :label-width="v.label?_.isNil(v.labelWidth)? '200px':v.labelWidth:'50px'" 
                                    :prop="v.ruleKey || ''" 
                                    :obj="v">
                                        <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                                            @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                                            @input="v.oninput && v.oninput($event,itemState,itemGetters)"
                                            @select="v.select && v.select($event,itemState,itemGetters)"
                                            :class="{'default-text-color':v.hasConfirmed === false}" @focus="handleFocus(v)"></component>
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
        <el-dialog class="message-dialog dialogToMsgbox" title="系统提示" :visible.sync="showBusinessValidation" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">{{tipMsg}}</div>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="warning" class="dialog-warn-btn" @click="showBusinessValidation = false">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import ContentCard from '../components/ContentCard';
// import rules from "../config/ruleConfig"
import CommonForm from "../components/CommonForm"
import TestFormItem from "@/components/TestFormItem"
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
import _ from "lodash"
export default {
    name: 'BusinessFormPage',
    props: {
        config: {
            default() {
                return []
            }
        },
        stepData: {}
    },

    mixins: [CommonMixin],
    components: {
        ContentCard,
        CommonForm,
        ElFormItem: TestFormItem,
    },
    data() {
        return {
            // rules,
            tipMsg: '',
            showBusinessValidation: false,
        }
    },
    computed: {
        fact1() {
            return this.itemState["fact1"].value
        },
        fieldsGroup() {

            if (this.config.every(v => _.isString(v))) {
                return [{
                    fact: '',
                    fields: this.config.map(fieldNo => this.itemState[fieldNo]).sort((a,b)=>a.sort-b.sort)
                }]
            }
            return this.config.map(group => {

                return {
                    fact: group.fact,
                    fields: group.fields.map(fieldNo => this.itemState[fieldNo]).sort((a,b)=>a.sort-b.sort)
                }
            })
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
    methods: {
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
        handleFocus(v) {
         
            v.hasConfirmed = true;
        },
        // async validate() {
        //     return await this.$refs.form.validate();
        // },
        async beforeLeave() {
            return await this.validate();
        },
        async goNext() {
            let result = await this.beforeLeave();
            if (!result) {
                this.tipMsg = '请填写完整信息';
                this.showBusinessValidation = true;
                return;
            };
            this.$emit('goNext');
        },
        goPrev() {
            this.$emit('goPrev');
        },
    },
}
</script>

<style  lang="scss" scoped>
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