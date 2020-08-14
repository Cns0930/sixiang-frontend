<template>
    <div class="approval">
        <content-card>
            <div slot="content">
                <div class="select-form">
                    <el-form hide-required-asterisk ref="approvalSelectForm" label-width="200px" label-position="left"
                        @submit.native.prevent :rules="rules" label-suffix="：">
                        <el-form-item label="请选择委办局" prop="department">
                            <el-select filterable v-model="form.department" placeholder="请选择委办局" style="width: 400px">
                                <el-option label="市场监管局" value="市场监管局"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-divider />
                        <el-form-item label="请选择事项" prop="approval">
                            <el-cascader :show-all-levels="false" filterable style="width: 400px" v-model="form.approval"
                                :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                        <el-divider />
                        <el-form-item v-for="(v,i) in fields" :key="i" :label="v.label"
                            :prop="v.ruleKey ? v.ruleKey : v.required !== false ? 'required' : ''" :obj="v">
                            <component :is="v.component" v-model="v.value" v-bind="v.attributes"></component>
                        </el-form-item>
                    </el-form>
                </div>
               
            </div>
        </content-card>
        <div class="operate-btn" style="float: right">
            <el-button type="warning" class="big-btn btn-warn" @click="goNext" v-if="!isLastStep">下一步</el-button>
        </div>
    </div>
</template>

<script>
import ContentCard from '../components/ContentCard'
// import approvalConfig from "@/views/config/approvalConfig"
import TestFormItem from "@/components/TestFormItem"
// import rules from "../config/ruleConfig"
import { mapState } from "vuex"
import CommonMixin from "@/views/ANew/CommonMixin"
export default {
    name: 'ApprovalSelectContent',
    components: { ContentCard, ElFormItem: TestFormItem },
    props: ["config","isLastStep"],
    mixins:[CommonMixin],
    data() {
        return {
            options: [],
            // rules,
        }
    },
    computed: {
        ...mapState({
            // form: state => state.ANew.itemForm
            form: state => state.home.shixiangForm
        }),
        globalState() {
            return this.$store.state.ANew;
        },
        fields() {
          
            return this.config.map(fieldNo => this.itemState[fieldNo])
           
        },

    },
    methods: {
       
        async validate(){
            let promises = this.$refs.approvalSelectForm.fields.map(field => {
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
        async beforeLeave(){
            return await this.validate();
        },
        async beforeEnter(){
            
        },
        async goNext() {
            
            let result = await this.beforeLeave();
            if(!result) return;
            this.$emit('goNext')
            

        },
        handleChange(v){
            this.$store.commit("putHasQueryDefaultInfo", false)
                if(v[1] == "310115-418-03"){
                    
                    this.$router.push({name:"办理",params:{item:v}})
                }
            },
        
    }
}
</script>

<style scoped lang="scss">
.select-form {
    padding: 20px;
}
</style>
<style lang="scss">
.approval {
    .el-radio {
        color: #fff;
        .el-radio__label {
            font-size: 20px;
        }
        .el-radio__inner {
            width: 20px;
            height: 20px;
        }
    }
    .el-radio-group {
        line-height: 24px;
        margin-top: -10px;
        margin-left: 10px;
    }
}
</style>
