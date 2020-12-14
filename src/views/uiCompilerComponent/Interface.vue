<template>
    <div class="interface">
        <div class="block condition-block">
            <p class="-center">条件</p>

            <Conditions :conditionBlock="model.conditionBlock" :list="list"
                @deleteConditionBlock="$emit('deleteConditionBlock')" class="block-content"></Conditions>
        </div>

        <div class="block action-block">
            <p class="-center">行为</p>
            <Actions :actionBlock="model.actionBlock" :list="list" class="block-content" ></Actions>
        </div>

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
.interface {
  
}
.block-content{
    // background: rgba(103, 178, 255, 0.3);
    padding: 10px;

    flex: 1;
}
.block {
    margin-bottom: 4px;
    display: flex;
    border:1px solid #C5C7C9;
    border-left:none;
    
}
.condition-block p{
    background:rgba(248,123,19,0.2);
    width: 40px;
    border-left:2px solid #F87B13; 
}
.action-block p {
    background:rgba(212,29,29,0.2);
     width: 40px;
     border-left:2px solid #D41D1D; 
}
</style>

