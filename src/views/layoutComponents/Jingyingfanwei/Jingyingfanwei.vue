<template>
    <el-col>
        <el-col class="sub-title-n" v-if="title">
            <div class="tag"></div>
            <span class="text">{{title}}</span>
            <el-button @click="handleAdd" class="side" icon="el-icon-plus">添加</el-button>
        </el-col>
        <el-col :span="24" v-for="(v,i) in addList" :key="i">
            <el-col :span="12">
                <el-col class="position">
                    <div class="remove-btn remove-btn-position" @click="handleRemove(v,i)">
                        <span class="minus"></span>
                    </div>
                </el-col>
                <el-form-item :key="i" label="新增" prop="required" :obj="v.fanwei">
                    <el-select v-model="v.fanwei.value" :disabled="v.forbid" filterable placeholder="请输入内容" style="width:calc(100% - 140px)"
                        @change="handleChangeFanwei($event,v)">
                        <el-option v-for="(o,q) in ops" :key="q" :label="o.label" :value="o.value">
                        </el-option>
                    </el-select>
                    <el-button class="btn" icon="el-icon-check"
                        style="background: linear-gradient(180deg, #3397FF 0%, #013BD3 100%);border-radius: 4px;color:#fff;float:right;font-weight:bold;font-size:20px;padding:7px 10px"
                        @click="handleCopy(v)">
                    </el-button>
                </el-form-item>

            </el-col>
            <!-- <el-col :span="12">

                <el-form-item :key="i" label="许可事项" prop="none" :obj="v.shixiang">
                    <el-select v-model="v.shixiang.value" placeholder="请输入内容" style="width: 100%;">
                        <el-option v-for="(o,q) in v.shixiang.options" :key="q" :label="o.label" :value="o.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col> -->
        </el-col>
        <el-col :span="24">

            <el-form-item label="变更后经营范围" :prop="jingyingfanweiContext.ruleKey || ''" :obj="jingyingfanweiContext"
                :class="{'default-text-color':resultBlock.confirm === false}"  ref="jingyingfanweiFormItem">
                <div contenteditable="true" v-html="resultBlock.htmlValue" class="textarea-like" @input="onhtmlinput" @blur="handleBlur">
                </div>
            </el-form-item>
        </el-col>

        <el-col :span="24" style="padding: 0 10px; box-sizng:border-box;">
            <el-button class="putOut" @click="canShow">生成许可事项</el-button>
        </el-col>

        <el-col :span="24" v-if="showShixiang">
            <el-col class="sub-title-n" style="margin-top: 20px;background: transparent">
                <span class="text" style="font-size: 18px;display:inline-block;">请确认许可事项</span>
                <el-button @click="handleComfirmAdd" class="side" icon="el-icon-plus">添加</el-button>
            </el-col>
            <el-col :span="24" v-for="(v,i) in value.confirmList" :key="i">
                <el-col :span="12">
                    <el-col class="position">
                        <div class="remove-btn remove-btn-position" @click="handleComfirmRemove(v,i)">
                            <span class="minus"></span>
                        </div>
                    </el-col>
                    
                    <el-form-item label="表述条目" prop="required" :obj="v.fanwei">
                        <el-select v-model="v.fanwei.value" filterable placeholder="请输入内容" style="width:calc(100% - 140px)"
                            @change="handleChangeConfirm($event,v)">
                            <el-option v-for="(o,q) in opsXuke" :key="q" :label="o.label" :value="o.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="许可事项" prop="none" :obj="v.shixiang">
                        <el-select v-model="v.shixiang.value" placeholder="请输入内容" @change="handleXukeChange" style="width: 100%;">
                            <el-option v-for="(o,q) in v.shixiang.options" :key="q" :label="o.label" :value="o.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-col>
            <el-col :span="24">
                <el-form-item label="许可事项" :prop="shixiangContext.ruleKey || ''" :obj="shixiangContext">
                    <el-input type="textarea" v-model="value.joinValue" disabled class="xuketext"></el-input>
                </el-form-item>
            </el-col>
        </el-col>
        <!-- 空元素用来校验是-生成许可事项 -->
        <el-col :span="24" v-else>
            <el-form-item class="emptyEl" :prop="emptyXuke.ruleKey || ''" :obj="emptyXuke">
                <el-input type="textarea" v-model="emptyValue"></el-input>
            </el-form-item>
        </el-col>
        <el-dialog class="message-dialog dialogToMsgbox" title="系统提示" :visible.sync="showTroubleMask" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">{{troubleMsg}}</div>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="warning" class="dialog-warn-btn" @click="showTroubleMask = false">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </el-col>
</template>

<script>

import _ from "lodash"
import {getListHighlighterScopes} from "./hilightJingyingfanwei"
import {getScopes, getScopesRelation} from "./businessConfig"
import CommonMixin from "@/views/pageComponents/CommonMixin"
import TestFormItem from '@/components/TestFormItem'
export default {
    name: "Jingyingfanwei",
    mixins: [CommonMixin],
    components: { ElFormItem: TestFormItem, },
    // value 格式 ：{jingyingfanwei:{value:"",htmlValue:"",textArray:[]},addList:[{ fanwei: { value: "" }, shixiang: { value: "",options:[] } },confirmList:[{ fanwei: { value: "" }, shixiang: { value: "",options:[] } }],joinValue:''}
    props: ["value", "title", "validateFn", "ruleKey"],
    data() {
        return {
            // addList: [{ fanwei: { value: "" }, shixiang: { value: "",options:[] } }],
            ops: [],
            scopeWithMatter: [],
            opsXuke: [],//有许可的和ops区分
            meta: { fanwei: { value: "" }, shixiang: { value: "", options: [] } ,forbid: false},
            showTroubleMask: false,
            troubleMsg: '',
            addList: [],
            nowAddList: [],//当前页面添加的经营范围
            emptyValue: '',
            hightlightJingyingfanwei: [],
        }
    },
    computed: {
        //需要将第一次进来的没数据的addList置空，就放在created中
        // addList() {
        //     return this.value.addList;
        // },
        showShixiang() {
            return typeof this.value.showShixiang == "undefined"? false : this.value.showShixiang;
        },
        resultBlock() {
            this.value.jingyingfanwei.value = this.value.jingyingfanwei.value.replace(/\,/g,'，').replace(/\s*/g,"");
            return this.value.jingyingfanwei;
        },
        jingyingfanweiContext() {

            let result = {
                value: this.value.jingyingfanwei.value,
                ruleKey: this.ruleKey,
                validateFn: (value, state, getters) => {
                    return this.validateFn(state, getters)
                }
            }

            return result

        },
        emptyXuke() {
            let result = {
                value: this.emptyValue,
                ruleKey: 'required',
            }

            return result
        },
        shixiangContext() {
            let result = {
                value: this.value.joinValue,
                ruleKey: 'required',
            }

            return result
        },
    },
    async created() {
        this.hightlightJingyingfanwei = await getListHighlighterScopes();
        let ops = await getScopes();
        this.ops = ops.map(v => ({ value: v, label: v }));
        this.scopeWithMatter = await getScopesRelation();
        this.opsXuke = this.scopeWithMatter.map(v => ({ value: v.scopes, label: v.scopes }));
        if(this.value.jingyingfanwei.textArray.length == 0) {
            this.value.addList = []
            this.addList = this.value.addList;
        } else {
            this.addList = this.value.addList;
        }
        
        // console.log(this.value,'value123123');
        this.$set(this.resultBlock, "htmlValue", this.valueToHtmlValue(this.resultBlock.value))
    },
    methods: {
        getMatter(scopes) {
            if (!scopes) {
                return []
            }
            let find = this.scopeWithMatter.find(s => s.scopes == scopes)
            if (find) {
                return find.matter.map(s => ({value:s,label:s}))
            }
            return []
        },
        handleAdd() {
            this.value.addList.push(_.cloneDeep(this.meta))
        },
        handleComfirmAdd() {
            this.value.confirmList.push(_.cloneDeep(this.meta))
        },
        handleChangeFanwei(e, data) {
            // console.log(e,data,'edata');
            let shixiang = data.shixiang;
            shixiang.options = this.getMatter(e);
            if (shixiang.options.length > 0) {
                shixiang.value = shixiang.options[0].value
            } else {
                shixiang.value = '';
            }
            // this.handleCopy(data,'Fanwei');
        },
        handleChangeConfirm(e, data) {
            console.log(e,data,'edata');
            let shixiang = data.shixiang;
            shixiang.options = this.getMatter(e);
            if (shixiang.options.length > 0) {
                shixiang.value = shixiang.options[0].value
            } else {
                shixiang.value = '';
            }
            this.handleCopy(data,'Xuke');
        },
        // 移除添加项
        handleRemove(data, i) {
            console.log(data, i, 'delete')
            let added = data.fanwei;
            let textarea = this.resultBlock;
            if (textarea && added) {
                textarea.value = textarea.value.replace("，" + added.value, "");
                textarea.htmlValue = this.valueToHtmlValue(textarea.value)
                textarea.textArray = _.remove(textarea.textArray, added.value)
            }
            this.addList.splice(i, 1)
        },
        handleComfirmRemove(data,i) {

            this.value.confirmList.splice(i, 1);
            this.adjustXuke();
        },
        onhtmlinput(e) {
            this.$set(this.resultBlock, "value", e.target.innerText);
        },
        handleCopy(data,flag = 'Fanwei') {
            // console.log(data,'vvv',flag);
            let allFanweiList = this.getAllFanweiList(this.resultBlock.value);
            if(flag == 'Xuke') {
                this.adjustXuke();
                return;
            }
            let context = data.fanwei;
            if(!context.value) {
                this.troubleMsg = '请填写完整信息';
                this.showTroubleMask = true;
                return;
            } else if (allFanweiList.includes(context.value)) {
                this.troubleMsg = '已经存在当前经营范围';
                this.showTroubleMask = true;
                return;
            }

            this.nowAddList.push(context.value);

            if (!context.value.trim()) return;
            let textarea = this.resultBlock;

            if (!textarea.textArray.includes(context.value)) {
                textarea.textArray.push(context.value)
                let lastFullStopIndex = null;
                // 句号后面加上
                if(textarea.value.includes('【')) {
                    lastFullStopIndex = textarea.value.lastIndexOf("。【")
                } else if(textarea.value.includes('（')) {
                    lastFullStopIndex = textarea.value.lastIndexOf("。（")
                } else {
                    lastFullStopIndex = textarea.value.lastIndexOf("。")
                }
                lastFullStopIndex<0 && (lastFullStopIndex=0);
                let regex = new RegExp("(.{" + lastFullStopIndex + "})")
                textarea.value = textarea.value.replace(regex, "$1" + "，" + context.value)
                textarea.confirm = true;

                textarea.htmlValue = this.valueToHtmlValue(textarea.value)
            }
            data.forbid = true;
            if(flag == 'Fanwei') {
                this.handleAdd();
            }
            // console.log(data,this.value,'add');
        },
        valueToHtmlValue(value) {
            let valueArr = value.split("。")
            let realValue = valueArr[0];
            valueArr.splice(0, 1);
            let restValue = "。" + valueArr.join("。")
            let realValueArr = realValue.split("，")
            let totalValueArr = realValueArr.map(v => {
                if(v.includes('；')) {
                    return v.split('；');
                }
                return v
            }).flat();
            let htmlValue = totalValueArr.reduce((result, item) => {
                // if (hightlightJingyingfanwei.includes(item) && !this.nowAddList.includes(item)) {
                if (this.hightlightJingyingfanwei.includes(item)) {
                    return `${result}，<span style="color:#00C3FF">${item}</span>`
                } else {
                    return result + "，" + item
                }
            }, '');
            htmlValue = htmlValue.substring(1, htmlValue.length) + restValue;
            return htmlValue
        },
        handleBlur(){
            
            this.$refs.jingyingfanweiFormItem.validate("blur",this.resultBlock.value)
        },
        canShow() {

            this.$set(this.value,'showShixiang',true);
            this.$set(this.value,'confirmList',_.cloneDeep(this.value.addList.filter(v => v.shixiang.value)));
            // console.log(this.value.confirmList,'confirmList');
            this.advanceAdjuct(this.value.jingyingfanwei.value);
            this.adjustXuke();
        },
        /*
        *对03页手动添加经营范围后携带到04的处理 or 04页面手动添加-变更后经营范围-中经营范围
        *目的:循环逗号切割的经营范围数组每一项判断它是否有许可事项，有则在B区展示
        */
        advanceAdjuct(value) {
            let totalValueArr = this.getAllFanweiList(value);
            let htmlValue = totalValueArr.forEach((result, item) => {
                this.addAdJust(result);
            });
        },
        getAllFanweiList(value) {
            let valueArr = value.split("。")
            let realValue = valueArr[0];
            let realValueArr = realValue.split("，");
            let totalValueArr = realValueArr.map(v => {
                if(v.includes('；')) {
                    return v.split('；');
                }
                return v
            }).flat();
            return totalValueArr;
        },
        addAdJust(value) {
            if(this.getMatter(value).length > 0) {
                let msg = _.cloneDeep(this.meta);
                msg.fanwei.value = value;
                msg.shixiang.options = this.getMatter(value);
                if(msg.shixiang.options.length > 0) {
                    msg.shixiang.value = msg.shixiang.options[0].value;
                } else {
                    msg.shixiang.value = '';
                }
                this.value.confirmList.push(msg);
            }
        },
        handleXukeChange(val) {
            this.adjustXuke();
        },
        //每次修改许可事项后触发
        adjustXuke() {
            // console.log(_.uniqBy(this.value.confirmList,'fanwei.value'),'fanwei123');
            this.value.confirmList = _.uniqBy(this.value.confirmList,'fanwei.value');
            this.$set(this.value,'joinValue',_.uniq(this.value.confirmList.filter(v => v.shixiang.value).map(v =>v.shixiang.value)).join('，'))
            if(!this.value.joinValue) {
                this.troubleMsg = '当前无办理审批手续后方能经营的事项';
                this.showTroubleMask = true;
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.textarea-like {
    font-size: 20px;
    line-height: 1.5;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 5px 15px;
    min-height: 100px;
}
.position {
    position: relative;
    top: 0px;
    left: 0px;
}
.putOut  {
    color: #fff;
    border: none;
    border-radius: 14px;
    background: linear-gradient(
        to bottom,
        rgba(51, 151, 255, 1) 0%,
        rgba(1, 59, 211, 1) 100%
    );
}
.remove-btn {
    position: absolute;
    left: 6px;
    top: 0px;
    z-index: 10;
    margin-left: 5px;
    width: 25px;
    height: 25px;
    border-radius: 4px;
    background: linear-gradient(
        to bottom,
        rgba(51, 151, 255, 1) 0%,
        rgba(1, 59, 211, 1) 100%
    );

    display: inline-flex;
    vertical-align: middle;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    .minus {
        width: 18px;
        height: 2px;
        background: white;
    }
}
/deep/  .xuketext {
    .el-textarea__inner {
        resize: none;
        background-color: #00286D;
    }
}
/deep/ .emptyEl {
    position: relative;
    width: 120px;
    height: 20px;
    .el-form-item__content {
        margin: 0 !important;
        width: 120px;
        height: 40px;
        position: absolute;
        .el-textarea {
            position: absolute;
            .el-textarea__inner {
                height: 20px !important;
                opacity: 0;
            }
        }
        .el-form-item__error {
            top: 10% !important;
            left: 10px;
        }
    }
}
</style>