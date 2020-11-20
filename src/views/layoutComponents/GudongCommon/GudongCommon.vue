<template>
    <div>

        <!-- 股东 名称 tab -->
        <div class="tab-block">

            <!-- tab 标题 -->
            <div class="tab-list-title">
                {{title || "股东列表"}}
            </div>

            <!-- tab -->
            <div class="tab-list">
                <!-- tab item -->

                <div class="tab-list-item " v-for="(gudong ,gudongIndex) in children" :key="gudongIndex"
                    :class="{active:active==gudongIndex,unactive:active!=gudongIndex,'warning-border':!validatedStatus[gudongIndex]}"
                    @click="active = gudongIndex">
                    <img src="./p.png"></img>
                    <div class="tab-list-info">
                        <div class="tab-list-name">{{children[gudongIndex][labelFieldNo].value}}</div>
                        <!-- <div class="tab-list-type">{{gudong.type}}</div> -->

                    </div>

                    <el-tooltip v-if="!deleteOrigin || gudongIndex > (originNum - 1)" class="remove-btn remove-on-tab"
                        effect="dark" content="删除" placement="right-start">
                        <i class="delete-btn el-icon-close" @click.stop="handelRemove(gudongIndex)"></i>
                    </el-tooltip>

                </div>

                <!-- tab 添加按钮 -->
                <el-button type="primary" size="small" icon="el-icon-plus" style="width:100px" @click="addGudongDialog"
                    v-if="!canAdd">
                    {{addBtnContent || '添加'}}
                </el-button>
            </div>

        </div>
        <!--  股东基本信息 -->
        <div v-if="gudongActive">

            <!-- form 渲染 -->
            <div style="position:relative">
                <!-- 移除按钮 -->

                <PureComponents :fields="gudongActive" :key="'active'+active"
                    @itemValidated="handleItemValidated($event,gudongActive)" ref="active"> </PureComponents>
                <template v-for="(gudongPassive,gudongPassiveIndex) in gudongPassiveList">
                    <PureComponents v-show="false" :fields="gudongPassive" :key="'passive'+gudongPassiveIndex"
                        @itemValidated="handleItemValidated($event,gudongPassive)" ref="passive"></PureComponents>
                </template>

            </div>

        </div>
        <!-- 无表单的验证 —— 验证 本身 -->
        <el-col :span=" 24" key="listself">
            <el-form-item :prop="listContext.ruleKey || ''" :obj="listContext" ref="listFormItem">
            </el-form-item>
        </el-col>
        <el-dialog title="系统提示" :visible.sync="dialogVisible" width="45%" append-to-body :close-on-click-modal="false"
            class="message-dialog">
            <el-form ref="form" :model="form" label-width="250px" @submit.native.prevent>
                <el-form-item :label="addNameLabel || 股东名称 ">
                    <el-autocomplete :debounce='0' :fetch-suggestions="querySearchAsync" v-model="temp_GudongName">
                    </el-autocomplete>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button class="dialog-warn-btn" @click="dialogVisible = false">取消</el-button>
                <el-button class="dialog-warn-btn" type="primary" @click="onSubmit">确定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>


import { getEnterpriseInfo, getEnterpriseInfoLike } from "@/api/ANew/index"
import PureComponents from "../PureComponents"
import CommonMixin from "@/views/pageComponents/CommonMixin"
import TestFormItem from '@/components/TestFormItem'
export default {
    name: "GudongCommon",
    props: ['value', 'children', 'meta', 'labelFieldNo', "gudongNameFieldNo", "deleteOrigin", "canAdd",'addHook',"originNum", "title", "ruleKey", "validateFn","addNameLabel","addBtnContent"],
    mixins: [CommonMixin],
    components: { PureComponents, ElFormItem: TestFormItem, },
    data() {
        return {
            active: 0,
            dialogVisible: false,
            form: {},
            temp_GudongName: "",
            emptyValue: "",
        };
    },
    watch: {
        "children": {
            handler: async function (v) {
                await this.$nextTick();
                await this.validate();
            },
            immediate: true
        }
    },
    computed: {


        gudongActive() {
            return this.children[this.active]
        },
        gudongPassiveList() {
            return this.children.filter((v, i) => i != this.active)
        },
        validatedStatus() {

            return this.children.map(gudong => {

                return Object.values(gudong).filter(v => !v.hidden && v.type != 'computedText').map(v => v.validateStatus).every(Boolean)
            })
        },
        listContext() {
            return {
                value: this.value,
                ruleKey: this.ruleKey,
                validateFn: (value, state, getters) => {
                    return this.validateFn(state, getters)
                }
            }
        },

    },
    methods: {
        async validate() {

            let fields = [this.$refs.active ? this.$refs.active.$refs.formItem : [], ...(this.$refs.passive ? this.$refs.passive.map(v => v.$refs.formItem) : []),this.$refs.listFormItem].flat()

            let promises = fields.map(field => {
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

        addGudongDialog() {
            this.temp_GudongName = ""

            this.dialogVisible = true;
        },
        async onSubmit() {
            // let res = await getEnterpriseInfo({value:item._temp.temp_GudongName});
            // if(res.message==="SUCCESS" && res.data){
            //     this.$set(this.item._temp, '_tmpGudongIdCardNum', res.data.unifiedSocialCreditCode);
            // }
            let child = _.cloneDeep(this.meta);
            child[this.gudongNameFieldNo].value = this.temp_GudongName;

            this.children.push(child)
            if (this.addHook && typeof this.addHook == 'function') {
                this.addHook(this.itemState, this.itemGetters, child, this.children)
            }
            this.dialogVisible = false
            // let result = item._temp.pushGroup(item);
        },
        handleItemValidated({ success = true, context = {} }, gudong,) {
            let fieldNo = context.fieldNo;
            this.$set(gudong[fieldNo], "validateStatus", success)

        },

        async querySearchAsync(queryString, cb) {
            let res = await getEnterpriseInfoLike({ value: queryString });
            if (res.message == "SUCCESS" && res.data.length > 0) {
                cb(res.data.map(v => ({ value: v.corporateName })))
            } else {
                cb([])
            }
        },
        handelRemove(i) {
            this.children.splice(i, 1)
        }
    }

}
</script>

<style lang="scss" scoped>
.tab-block {
    // background: rgba(255, 255, 255, 0.2);

    // background: linear-gradient(
    //     180deg,
    //     rgba(52, 52, 52, 0.1) -0.31%,
    //     rgba(255, 255, 255, 0.1) 100.31%
    // );

    // border-radius: 4px;
    // border: 1px solid rgba(255, 255, 255, 1);
    margin: 10px;
    display: flex;
    .tab-list-title {
        width: 174px;
        color: rgba(255, 255, 255, 1);
        font-size: 18px;
        padding: 30px 10px 0px 0px;
        text-align: right;
    }
}
.tab-list {
    display: flex;
    align-items: center;
    min-height: 70px;

    flex-wrap: wrap;
    color: #fff;
    .tab-list-item {
        position: relative;
        display: flex;
        align-items: center;

        border-radius: 4px;
        cursor: pointer;
        &.active {
            background: linear-gradient(
                to bottom,
                rgba(126, 152, 255, 1) 0%,
                rgba(0, 146, 253, 1) 100%
            );
        }
        &.unactive {
            background: rgba(8, 59, 145, 1);
        }
        &.warning-border {
            border: 1px solid #ff4949;
        }
        border: 1px solid rgba(212, 215, 224, 1);
        min-width: 150px;
        height: 50px;
        margin: 4px 15px;
        // box-sizing: border-box;
        img {
            padding: 0 10px;
        }
        .tab-list-info {
            padding: 4px;
        }
        .tab-list-name {
            font-size: 16px;
            min-height: 20px;
            // max-width:120px;
            margin-right: 28px;
            // overflow:hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
        }
        .tab-list-type {
            font-size: 12px;
            height: 16px;
        }
        .remove-on-tab {
            position: absolute;
            right: 0px;
            top: 0px;
        }
    }
}
.tab-type .form {
    .remove-btn {
        position: absolute;
        left: 10px;
        top: 46px;
        z-index: 10;
        margin-left: 5px;
        width: 25px;
        height: 25px;
        background-color: #fe7215;
        display: inline-flex;
        vertical-align: middle;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        cursor: pointer;

        .minus {
            width: 18px;
            height: 2px;
            background: white;
        }
    }
}
.delete-btn {
    display: none;
}
.tab-list-item:hover .delete-btn {
    z-index: 30;
    color: #fff;
    margin: 0;
    width: 24px;
    height: 24px;
    font-size: 12px;
    background: #881d39;
    border: 1px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<style lang="scss">
</style>