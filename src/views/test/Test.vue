<template>
    <div>
        <DropDown @addCondition="addCondition(model)" @addAction="addAction(model)"></DropDown>
        <template v-for="v,i in model">
            <div v-if="v.type=='if'">
                <div>
                if <select v-model="v.logic">
                    <option value="any">或</option>
                    <option value="all">且</option>
                    </select>
                </div>
                <div>
                    <select v-model="v.subject">
                        <option v-for="field,i in fields" value="field.fieldNo">{{field.fieldNo}}</option>
                    </select>
                    <select v-model="v.predicate">
                        <option v-for="field,i in fields" value="field.fieldNo">{{field.fieldNo}}</option>
                    </select>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import DropDown from "./DropDown"
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
            fields:[{fieldNo:"compnayName"},{fieldNo:"code"}],
        }
    },
    methods: {
        addCondition(model) {
            model.push({
                type:"if",
                logic:"any",
                subject:"",
                predicate:""
            })
        },
        addAction() {

        }
    }


}
</script>

<style>
</style>