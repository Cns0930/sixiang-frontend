<template>
    <div>
       <Interface :model="model" :data="tableDataWithOptions"></Interface>
    </div>
</template>

<script>
import DropDown from "./DropDown"
import {mapState} from "vuex"
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
            model: [],
            fields:[{fieldNo:"compnayName",},{fieldNo:"code"}],
            predicateOptions:[
                {
                    label:"包含",
                    value:"includes",
                },
                {
                    label:"等于",
                    value:"==",
                }
            ]
        }
    },
    computed:{
         ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            tableData: state =>
                state.fieldModel.tableData
        }),
        tableDataWithOptions(){
            return this.tableData.map(data=>{
                if(data.componentDefs.getDSLOptions){
                    return {...data,subjectOptions:data.componentDefs.getDSLOptions()}
                }
                return data;
                })
        },
        
    },
    methods: {
        addCondition(model) {
            model.push({
                type:"if",
                logic:"any",
                // 主体
                subject:"",
                // 主体的选项 
                subjectOptions:[],
                // 谓语 (操作)
                predicate:"",
                
                //  宾语
                object:"",
                // 嵌套 逻辑
                children:[]
            })
        },
        addAction() {

        },
        handleSubjectChange(v){
            let field = this.tableDataWithOptions.find(d=>d.fieldNo==v.subject);
         
            v.subjectOptions = field?field.subjectOptions : []
           
        }
    }


}
</script>

<style>
</style>