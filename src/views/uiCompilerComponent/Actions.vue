<template>
    <div class="actions">

        <button @click="addReturnAction">添加行为-独立情形</button>
        <button @click="addPushAction">添加行为-复合情形</button>
        <el-collapse v-model="activeNames">
            <template v-for="action,i in actionBlock.actions" >

                <template v-if="action.type=='return' || action.type=='push'">
                    <!-- <button @click="switchMultiChosen(action,i)">页面字段设置</button>
                <button @click="deleteAction(i)">删除行为</button> -->

                    <el-collapse-item :title="action.value.fact || '（未设置）'" :name="i">

                        <template slot="title">
                            <span style="margin-right:20px">{{action.value.fact || '（未设置）'}}</span>
                            <button @click.stop="switchMultiChosen(action,i)" style="margin-right:15px">页面字段设置</button>
                            <button @click.stop="deleteAction(i)" style="margin-right:15px">删除行为</button>
                            <button @click.stop="goUp(i)" v-if="i!=0" style="margin-right:15px">上移</button>
                            <button @click.stop="goDown(i)"  v-if="i!=actionBlock.actions.length-1">下移</button>
                        </template>

                        <draggable v-model=" action.value.fields" @start="drag=true" @end="drag=false">
                            <div v-for="v,i in action.value.fields" :key="i" class="drag-line">

                                <p class="title">
                                    <el-tag type="primary" effect="dark" size="small">{{v}}</el-tag>
                                </p>
                                <p style="">{{list.find(obj=>obj.fieldNo == v).label}}</p>
                                <!-- <p>{{list.find(obj=>obj.fieldNo == v).remark}}</p> -->

                            </div>

                        </draggable>
                    </el-collapse-item>

                </template>
            </template>
        </el-collapse>
        <el-dialog title="选择fieldNo" :visible.sync="multiChosenDialog" width="80%" :close-on-click-modal="false">
            <div>
                标题：<input v-model="tempChosenValue.fact" />
                <el-checkbox-group v-model="tempChosenValue.fields">
                    <el-table :data="list" max-height="250">
                        <el-table-column label="选择fieldNo">
                            <template slot-scope="scope">
                                <el-checkbox :label="scope.row.fieldNo"></el-checkbox>
                            </template>
                        </el-table-column>

                        <el-table-column prop="label" label="label"></el-table-column>
                    </el-table>

                </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="multiChosenDialog = false">取 消</el-button>
                <el-button type="primary" @click="copyToAction">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    name: "Actions",
    props: ["actionBlock", "list"],
    components: { draggable },
    data() {
        return {
            multiChosenDialog: false,
            tempChosenValue: { fact: "", fields: [] },
            tempActionIndex: null,
            activeNames: [],
        }
    },
    methods: {
        handleSubjectChange(v) {
            let field = this.list.find(d => d.fieldNo == v.subject);

            v.subjectOptions = field ? field.subjectOptions : []

        },
        changeRightType(action) {
            if (action.rightType == 'true') {
                action.right = true;
            } else if (action.rightType == 'false') {
                action.right = false;
            } else if (action.rightType == 'num') {
                action.right = 0
            } else if (action.rightType == 'text') {
                action.right = ""
            }
        },
        addReturnAction() {
            this.actionBlock.actions.push({
                type: "return",

                // 主体名
                value: { fact: "", fields: [] },

            })
        },
        addPushAction() {
            this.actionBlock.actions.push({
                type: "push",

                // 主体名
                value: { fact: "", fields: [] },

            })
        },
        //  打开 关闭 多选框
        switchMultiChosen(action, index) {
            this.tempActionIndex = index;
            this.tempChosenValue = action.value;
            this.multiChosenDialog = true;
            return;
            // console.log(action)
            let newAction = _.clone(action);

            newAction.multiChosenOpen = !action.multiChosenOpen

            this.$set(this.actionBlock.actions, index, newAction)

        },
        // 删除行为
        deleteAction(index) {
            this.actionBlock.actions.splice(index, 1)
        },
        // handleSelect(v,action){
        //     action.value = v.map(v=>v.fieldNo)
        //     // console.log(v)
        // },
        copyToAction() {
            // let action = this.actionBlock.actions[this.tempActionIndex];
            // action.value =  _.clone(this.tempChosenValue);
            this.multiChosenDialog = false;
            this.tempChosenValue = { fact: "", fields: [] };
            this.tempActionIndex = null;
        },
        goUp(index) {
            if (index - 1 < 0) return;
            let originIndex = index;
            let targetIndex = index - 1;

            let temp = this.actionBlock.actions[targetIndex];

            this.$set(this.actionBlock.actions, targetIndex, this.actionBlock.actions[originIndex]);
            this.$set(this.actionBlock.actions, originIndex, temp);
        },
        goDown(index) {
            if (index + 1 > this.actionBlock.actions.length - 1) return;
            let originIndex = index;
            let targetIndex = index + 1;

            let temp = this.actionBlock.actions[targetIndex];

            this.$set(this.actionBlock.actions, targetIndex, this.actionBlock.actions[originIndex]);
            this.$set(this.actionBlock.actions, originIndex, temp);
        }
    }
}
</script>

<style scoped lang="scss">
.actions {
    
    //  background: rgba(0, 77, 156, 0.3);
}
.drag-line {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #77b5f3;
    cursor: grab;
    p {
        width: 300px;
    }
}
</style>