<template>
    <div class="interface">
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
                    <select v-model="v.subject" @change="handleSubjectChange(v)">
                        <option v-for="field,i in data" :value="field.fieldNo">{{field.fieldNo}}
                        </option>
                    </select>
                    的
                    <select v-model="v.subjectOption">
                        <option v-for="option,i in v.subjectOptions" :value="option">{{option.label}}</option>
                    </select>
                    <select v-model="v.predicate">
                        <option v-for="option,i in predicateOptions" :value="option.value">{{option.label}}</option>
                    </select>
                    <input v-model="v.object">

                    </input>
                    <DropDown @addCondition="addCondition(v.children)" @addAction="addAction(v.children)"></DropDown>
                </div>
            </div>
            <div v-if="v.children.length>0">
                <Interface :model="v.children" :data="data"></Interface>
            </div>
        </template>
    </div>
</template>

<script>
import DropDown from "./DropDown"
export default {
    name: "Interface",
    components: {
        DropDown
    },
    props: {
        model: {
            default() {
                return [{
                    type: "if",
                    logic: "any",
                    // 主体
                    subject: "",
                    // 主体的选项 
                    subjectOptions: [],
                    // 谓语 (操作)
                    predicate: "",

                    //  宾语
                    object: "",
                    // 嵌套 逻辑
                    children: []
                }]
            }
        },
        data: {
            default() {
                return []
            }
        }
    },
    data(){
        return {
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
    methods: {
        addCondition(model) {
            model.push({
                type: "if",
                logic: "any",
                // 主体
                subject: "",
                // 主体的选项 
                subjectOptions: [],
                // 谓语 (操作)
                predicate: "",

                //  宾语
                object: "",
                // 嵌套 逻辑
                children: []
            })
        },
        addAction() {

        },
        handleSubjectChange(v) {
            let field = this.data.find(d => d.fieldNo == v.subject);

            v.subjectOptions = field ? field.subjectOptions : []

        }
    }

}


</script>

<style scoped lang="scss">
.interface{
    margin-left:20px;
}

</style>

