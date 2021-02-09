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
        <div v-for="condition,i in conditionBlock.conditions">
            <template v-if="condition.type=='logical'">
                <select v-model="condition.subject" @change="handleSubjectChange(condition)">
                    <option v-for="field,i in list" :value="field.fieldNo">{{field.fieldNo+' : '+field.label}}
                    </option>
                </select>
                的
                <select v-model="condition.subjectOption">
                    <option v-for="option,i in condition.subjectOptions" :value="option">{{option.label}}</option>
                </select>
                <select v-model="condition.predicate">
                    <option v-for="option,i in predicateOptions" :value="option.value">{{option.label}}</option>
                </select>
                <input v-model="condition.object">

                </input>
                <button @click="deleteCondition(i)">删除</button>
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
            ]
        }
    },
    methods: {
        handleSubjectChange(v) {
            let field = this.list.find(d => d.fieldNo == v.subject);

            v.subjectOptions = field ? field.subjectOptions : []

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
.conditions {
    // margin-left: 28px;
    // background: rgba(0, 77, 156, 0.3);
}
   .inner-condition{

        margin-left: 28px;
   }
</style>