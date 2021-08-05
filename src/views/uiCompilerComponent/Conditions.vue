<template>
    <div class="conditions">
        
        <div>
            <select v-model="conditionBlock.logic">
                <option value="any">或</option>
                <option value="all">且</option>
            </select>
            <button @click="addCondition">添加条件</button>
            <button @click="addSubConditionBlock">添加子条件</button>
            <button @click="emitDeleteConditionBlock">删除条件块</button>
        </div>
        <div v-for="condition,i in conditionBlock.conditions" class="condition-box" :key="i">
            <template v-if="condition.type=='logical'">
                <el-select v-model="condition.subject" filterable @change="handleSubjectChange(condition)" style="width: 300px;">
                    <el-option v-for="field,i in list" :value="field.fieldNo" :label="field.fieldNo+' : '+field.label" :key="i" />
                </el-select>
                <span style="font-size: 18px; margin: 0 5px; line-height: 40px;">的</span>
                <el-select v-model="condition.subjectOption" style="width: 100px;">
                    <el-option v-for="option,i in condition.subjectOptions" :value="option" :label="option.label" :key="i" />
                </el-select>
                <el-select v-model="condition.predicate" style="width: 100px;">
                    <el-option v-for="option,i in predicateOptions" :value="option.value" :label="option.label" :key="i" />
                </el-select>
                <el-select v-if="currentField && currentField[condition.subject] && currentField[condition.subject].type === 'qingxingCheckbox'" v-model="condition.object" filterable style="width: 300px;">
                    <el-option v-for="option,i in currentField[condition.subject].componentDefs.options.value" :value="option.value" :label="option.label" :key="i" />
                </el-select>
                <el-select v-else-if="currentField && currentField[condition.subject] && currentField[condition.subject].type === 'select'" v-model="condition.object" style="width: 300px;">
                    <el-option v-for="option,i in currentField[condition.subject].componentDefs.options.value" :value="option" :label="option" :key="i" />
                </el-select>
                <el-select v-else-if="currentField && currentField[condition.subject]  && currentField[condition.subject].type === 'radio'" v-model="condition.object" style="width: 300px;">
                    <el-option v-for="option,i in currentField[condition.subject].componentDefs.options.value" :value="option" :label="option" :key="i" />
                </el-select>
                <el-input v-else v-model="condition.object" style="width: 300px;" />
                <el-button @click="deleteCondition(i)" style="font-size: 15px; padding: 10px; margin-left: 10px;">删除</el-button>
                <!-- <DropDown @addCondition="addCondition(v.children)" @addAction="addAction(v.children)"></DropDown> -->
            </template>
            <template v-else>
                <Conditions  :conditionBlock="condition.subConditionBlock" :list="list" @deleteConditionBlock="deleteConditionBlock(i)" class="inner-condition"></Conditions>
            </template>
        </div>

    </div>
</template>

<script>
import DropDown from "./DropDown"
export default {
    name: "Conditions",
    props: ['conditionBlock', 'list'],
    components: {
        DropDown
    },
    data() {
        return {
            predicateOptions: [
                {
                    label: "包含",
                    value: "includes",
                },
                {
                    label: "等于",
                    value: "==",
                }
            ],
            currentField: {},
        }
    },
    created() {
        // 初始化条件currentField
        this.initCurrentField();
    },
    methods: {
        initCurrentField() {
            this.conditionBlock.conditions.forEach(item => {
                this.currentField[item.subject] = this.list.find(d => d.fieldNo === item.subject)
            })
        },
        handleSubjectChange(v) {
            v.subjectOptions = []
            v.predicate = ''
            v.object = ''
            v.subjectOption = {}
            let field = this.list.find(d => d.fieldNo == v.subject);
            v.subjectOptions = field ? field.subjectOptions : []
            this.currentField[v.subject] = field;

        },
        // 添加条件
        addCondition() {
            this.conditionBlock.conditions.push({
                type: "logical",
                // 主体
                subject: "",
                // 主体的选项 
                subjectOptions: [],
                // 谓语 (操作)
                predicate: "",

                //  宾语
                object: "",
            })
        },
        // 添加子条件块
        addSubConditionBlock() {
            this.conditionBlock.conditions.push({
                type: "subLogical",
                subConditionBlock:{
                        // 逻辑
                        logic: "any",

                        // 条件 列表
                        conditions: [{
                            type: "logical",
                            // 主体
                            subject: "",
                            // 主体的选项 
                            subjectOptions: [],
                            // 谓语 (操作)
                            predicate: "",

                            //  宾语
                            object: "",
                        }],

                    }

            })
        },
        //  删除 条件
        deleteCondition(){

        },
        // 触发删除条件块
        emitDeleteConditionBlock(){
            this.$emit("deleteConditionBlock")
        },
        // 删除条件块
        deleteConditionBlock(i){
            this.conditionBlock.conditions.splice(i,1)
        },
        // 删除条件
        deleteCondition(i){
            this.conditionBlock.conditions.splice(i,1)
        }
    }
}
</script>

<style scoped lang="scss">
.condition-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
.conditions {
    // margin-left: 28px;
    // background: rgba(0, 77, 156, 0.3);
}
.inner-condition{
    margin-left: 28px;
}
</style>