<template>
    <div class="form-info-home">
        <content-card>
            <div slot="content" class="content">
                
                <CommonForm :fields="fields" :rules="rules" ref="form"></CommonForm>
            </div>
        </content-card>
        <div class="operate-btn">
            <el-button type="primary" class="big-btn btn-default" @click="goPrev">返回上一步</el-button>
            <el-button type="warning" class="big-btn btn-warn" @click="goNext">下一步</el-button>
        </div>
    </div>
</template>

<script>
import ContentCard from '../components/ContentCard';
// import rules from "../config/ruleConfig"
import CommonForm from "../components/CommonForm"
import TestFormItem from "@/components/TestFormItem"
import CommonMixin from "@/views/ANew/CommonMixin"
export default {
    name: 'FormPage',
    props: {
        config:{
            default(){
                return []
            }
        }
    },

    mixins:[CommonMixin],
    components: {
        ContentCard,
        CommonForm,
        ElFormItem: TestFormItem ,
    },
    data() {
        return {
            // rules,

        }
    },
    computed: {
        fact1(){
            return this.itemState["fact1"].value
        },
        fields() {
         
            return this.config.map(fieldNo => this.itemState[fieldNo])
        }
    },
    methods: {
        async validate() {
            return await this.$refs.form.validate();
        },
        async beforeLeave(){
            return await this.validate();
        },
        async goNext() {
            let result = await this.beforeLeave();
            if(!result) return;
            this.$emit('goNext');
        },
        goPrev() {
            this.$emit('goPrev');
        },
    },
}
</script>

<style  lang="scss">
.form-info-home {
    height: 100%;
    width: calc(100% - 6px);

    .content {
        padding-bottom: 20px;
    }
}
</style>
