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
                            <el-checkbox v-if="extraAttribute" style="margin-left: 20px;" v-model="extraAttribute.value">{{extraAttribute.label}}</el-checkbox>
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
import CommonMixin from "@/bangban/views/ANew/CommonMixin"
export default {
    name: 'ApprovalSelectContent',
    components: { ContentCard, ElFormItem: TestFormItem },
    props: ["config","isLastStep"],
    mixins:[CommonMixin],
    data() {
        return {
            options: [],
            // rules,
            extraAttribute: {},
            changeShowList: [],//存放需要控制显示/隐藏的option
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
            this.extraAttribute = this.itemState["qingxing_checkbox"];
            return this.config.filter(v => v != 'qingxing_checkbox').map(fieldNo => this.itemState[fieldNo])
        },

    },
    watch: {
        //处理extraAttribute.value为真,且选了changeShowList中数据后又改为false
        "extraAttribute.value": function(newVal) {
            var _this = this;
            if(!newVal) {
                this.fields.forEach((v,index) => {
                    if(v.label === '情形') {
                        v.value.length > 0 && this.changeShowList.forEach(item => {
                            v.value = v.value.filter(m => m != item.value)
                        })
                        v.attributes.options.forEach((item,i) => {
                            
                            _this.changeShowList.forEach(m => {
                                
                                if(item.value == m.value) {
                                    this.$set(this.fields[index].attributes.options[i],"hidden",true);
                                }
                            })
                        })
                    }
                })
            } else {
                this.fields.forEach((item,index) => {
                    if(item.label === '情形') {
                        item.attributes.options.forEach((v,i) => {
                            _this.changeShowList.forEach(m => {
                                if(v.value == m.value) {
                                    this.$set(this.fields[index].attributes.options[i],"hidden",false);
                                }
                            })
                        })
                    }
                })
            }
        }
    },
    created() {
        let fieldIndex = this.fields.findIndex(v => v.label == '情形');
        //首先容错&&防止其他页面切回当前后changeShowList为空，属性随配置走
        if (this.extraAttribute && typeof this.fields[fieldIndex].attributes.adjustOptions == "undefined") {
            this.fields[fieldIndex].attributes.adjustOptions = this.fields[fieldIndex].attributes.options.filter(v => v.hidden);
        }
        this.changeShowList = this.fields[fieldIndex].attributes.adjustOptions;

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
        this.$store.commit("putHasJingbanrenInfo",false)
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
    .content-block {
        position: relative;
        .tips {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
        }
        .el-form-item__content {
            line-height: 36px;
        }
    }
    .el-radio-group {
        line-height: 24px;
        margin-top: -10px;
        margin-left: 10px;
    }
    .select-form .el-form-item__content .el-checkbox-group .el-col {
        line-height: 50px;
    }
}
</style>
