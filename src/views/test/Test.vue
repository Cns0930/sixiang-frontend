<template>
    <div>
        <button @click="addConditionBlock">添加条件块</button>
        <button>添加行为</button>
        <button @click="compile">编译</button>
        <div class="statement">
            <Interface v-for="model,i in models" :key="i" :model="model" :list="tableDataWithOptions" class="statement"
                @deleteConditionBlock="deleteConditionBlock(i)"></Interface>
        </div>
    </div>
</template>

<script>
import DropDown from "./DropDown"
import { mapState } from "vuex"
import compiler from "./compiler/compiler"
export default {
    name: "Test",
    components: {
        DropDown
    },
    data() {
        return {
            baseFunctionAst: {
                "type": "FunctionDeclaration",
                "params": [{
                    "type": "Identifier",
                    "name": "state"
                },
                {
                    "type": "Identifier",
                    "name": "getters"
                }
                ],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                }
            },
            models: [],
            fields: [{ fieldNo: "compnayName", }, { fieldNo: "code" }],
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
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            tableData: state =>
                state.fieldModel.tableData
        }),
        tableDataWithOptions() {
            return this.tableData.map(data => {
                if (data.componentDefs.getDSLOptions) {
                    return { ...data, subjectOptions: data.componentDefs.getDSLOptions() }
                }
                return data;
            })
        },

    },
    methods: {
        addConditionBlock() {
            this.models.push({
                conditionBlock: {

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


                },
                actionBlock: {
                    actions:[
                       
                    ]
                },
                type:"stepPage"
            })
        },
        // 删除条件块
        deleteConditionBlock(i) {
            this.models.splice(i, 1)
        },
        addAction() {

        },
        compile(){
            console.log(this.models);
            console.log(compiler(this.models));
            
        }

    }


}
</script>

<style scoped lang="scss">
.statement {
    margin-bottom: 16px;
}
</style>