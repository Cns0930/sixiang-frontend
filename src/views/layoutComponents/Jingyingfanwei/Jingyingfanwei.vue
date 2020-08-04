<template>
    <el-col>
        <el-button @click="handleAdd" class="side" icon="el-icon-plus">添加</el-button>
        <el-divider></el-divider>
        <el-col :span="24" v-for="(v,i) in addList" :key="i">
            <el-col :span="12">
                <el-button @click="handleRemove(v,i)" class="side" icon="el-icon-minus" style="float:left">删除
                </el-button>
                <el-form-item :key="i" label="新增" prop="required" :obj="v.fanwei">
                    <el-select v-model="v.fanwei.value" filterable placeholder="请输入内容" style="width:calc(100% - 140px)"
                        @change="handleChangeFanwei($event,v)">
                        <el-option v-for="(o,q) in ops" :key="q" :label="o.label" :value="o.value">
                        </el-option>
                    </el-select>
                    <el-button class="btn" icon="el-icon-check"
                        style="background: linear-gradient(180deg, #3397FF 0%, #013BD3 100%);border-radius: 4px;color:#fff;float:right;font-weight:bold;font-size:20px;padding:7px 10px" @click="handleCopy(v)">
                    </el-button>
                </el-form-item>

            </el-col>
            <el-col :span="12">

                <el-form-item :key="i" label="许可事项" prop="none" :obj="v.shixiang">
                    <el-select v-model="v.shixiang.value" placeholder="请输入内容" style="width: 100%;">
                        <el-option v-for="(o,q) in v.shixiang.options" :key="q" :label="o.label" :value="o.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-col>
        <el-col :span="24">

            <el-form-item label="变更后经营范围" prop="required" :obj="resultBlock"
                :class="{'default-text-color':resultBlock.confirm === false}">
                <div contenteditable="true" v-html="resultBlock.htmlValue" class="textarea-like" @input="onhtmlinput">
                </div>
            </el-form-item>

        </el-col>
    </el-col>
</template>

<script>

import { scopes, getMatter } from "./businessConfig"
import _ from "lodash"
import hightlightJingyingfanwei from "./hilightJingyingfanwei"
let ops = scopes.map(v => ({ value: v, label: v }));
import CommonMixin from "@/views/pageComponents/CommonMixin"
import TestFormItem from '@/components/TestFormItem'
export default {
    name: "Jingyingfanwei",
    mixins: [CommonMixin],
    components: { ElFormItem: TestFormItem, },
    // value 格式 ：{jingyingfanwei:{value:"",htmlValue:"",textArray:[]},addList:[{ fanwei: { value: "" }, shixiang: { value: "",options:[] } }]}
    props: ["value"],
    data() {
        return {
            // addList: [{ fanwei: { value: "" }, shixiang: { value: "",options:[] } }],
            ops,
            meta: { fanwei: { value: "" }, shixiang: { value: "", options: [] } },

        }
    },
    computed: {
        addList() {
            return this.value.addList;
        },
        resultBlock() {
            return this.value.jingyingfanwei;
        },
    },
    created(){
        this.$set(this.resultBlock,"htmlValue",this.valueToHtmlValue(this.resultBlock.value))
    },
    methods: {
        handleAdd() {
            this.value.addList.push(_.cloneDeep(this.meta))
        },
        handleChangeFanwei(e, data) {
            let shixiang = data.shixiang;
            shixiang.options = getMatter(e);
            if (shixiang.options.length > 0) {
                shixiang.value = shixiang.options[0].value
            }
        },
        // 移除添加项
        handleRemove(data, i) {
            let added = data.fanwei;
            let textarea = this.resultBlock;
            if (textarea && added) {
                textarea.value = textarea.value.replace("，" + added.value, "");
                textarea.htmlValue = this.valueToHtmlValue(textarea.value)
                textarea.textArray = _.remove(textarea.textArray, added.value)
            }

            this.addList.splice(i, 1)
        },
        onhtmlinput(e) {
            this.$set(this.resultBlock, "value", e.target.innerText);
        },
        handleCopy(data){
            let context = data.fanwei
            
            if (!context.value.trim()) return;
            let textarea = this.resultBlock;
            console.log()

            if (!textarea.textArray.includes(context.value)) {
                textarea.textArray.push(context.value)
                // 句号后面加上
                let lastFullStopIndex = textarea.value.lastIndexOf("。")
                lastFullStopIndex<0 && (lastFullStopIndex=0);
                let regex = new RegExp("(.{" + lastFullStopIndex + "})")
                  
                textarea.value = textarea.value.replace(regex, "$1" + "，" + context.value)
                textarea.confirm = true;

                textarea.htmlValue = this.valueToHtmlValue(textarea.value)
              
            }
          
        },
        valueToHtmlValue(value) {
            let valueArr = value.split("。")
            let realValue = valueArr[0];
            valueArr.splice(0, 1);
            let restValue = "。" + valueArr.join("。")
            let realValueArr = realValue.split("，")
            let htmlValue = realValueArr.reduce((result, item) => {
                if (hightlightJingyingfanwei.includes(item)) {
                    return `${result}，<span style="color:#00C3FF">${item}</span>`
                } else {
                    return result + "，" + item
                }
            }, '');

            htmlValue = htmlValue.substring(1, htmlValue.length) + restValue;;
            return htmlValue
        },
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
    min-height:100px;
}
</style>