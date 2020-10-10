<template>
    <div class="interface">
        
        <p>条件：IF</p>
        <p></p>
        <Conditions :conditionBlock="model.conditionBlock" :list="list" @deleteConditionBlock="$emit('deleteConditionBlock')"></Conditions>
        
        <p>行为：</p>
        <Actions :actionBlock="model.actionBlock" :list="list" style="margin-left:20px"></Actions>
        <el-divider/>
    </div>
</template>

<script>
import DropDown from "./DropDown"
import Conditions from "./Conditions"
import Actions from "./Actions"
export default {
    name: "Interface",
    components: {
        DropDown, Conditions, Actions
    },
    props: {
        model: {
            default() {
                return {
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

                    }

                }
            }
        },
        list: {
            default() {
                return []
            }
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        
       
        

    }

}


</script>

<style scoped lang="scss">
// .interface {
//     margin-left: 28px;
// }
</style>

