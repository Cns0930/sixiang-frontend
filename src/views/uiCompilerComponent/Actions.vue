<template>
    <div>
        <button @click="addReturnAction">添加行为-独立情形</button>
        <button @click="addPushAction">添加行为-复合情形</button>
        <div v-for="action,i in actionBlock.actions">
            <!-- <template v-if="action.type=='set'">
                设置  
                <select v-model="action.subject" @change="handleSubjectChange(action)">
                    <option v-for="field,i in list" :value="field.fieldNo">{{field.fieldNo}}
                    </option>
                </select>
                的
                <select v-model="action.subjectOption">
                    <option v-for="option,i in action.subjectOptions" :value="option">{{option.label}}</option>
                </select>
                为
                <select v-model="action.rightType" @change="changeRightType(action)">
                    <option value="true">是</option>
                    <option value="false">否</option>
                    <option value="num">自定义数值</option>
                    <option value="text">自定义文本</option>
                </select>


                <input v-if="action.rightType=='num'" v-model.number="action.right"></input>
                <input v-if="action.rightType=='text'" v-model="action.right"></input>

                <button @click="deleteAction(i)">删除行为</button>
            </template> -->
            <template v-if="action.type=='return' || action.type=='push'">
                <button @click="switchMultiChosen(action,i)">页面字段设置</button>
                <button @click="deleteAction(i)">删除行为</button>

                <div>
                    标题：{{action.value.fact}}
                </div>
                <div>
                    字段：
                    
                    <draggable v-model=" action.value.fields"  @start="drag=true" @end="drag=false">
                        <div v-for="v,i in action.value.fields" :key="i" class="drag-line">
                            
                                <p class="title">{{v}}</p>
                                <p>{{list.find(obj=>obj.fieldNo == v).label}}</p>
                                <p>{{list.find(obj=>obj.fieldNo == v).remark}}</p>
                            
                        </div>
                        
                    </draggable>
                </div>
            </template>
        </div>
        <el-dialog title="选择fieldNo" :visible.sync="multiChosenDialog" width="80%" :close-on-click-modal="false">
            <div>
                (04页)标题：<input v-model="tempChosenValue.fact" />
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
    components:{draggable},
    data() {
        return {
            multiChosenDialog: false,
            tempChosenValue: { fact: "", fields: [] },
            tempActionIndex: null,

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
    }
}
</script>

<style scoped lang="scss">
.drag-line{
    display:flex;
    justify-content: space-between;
    border-bottom:2px solid #77b5f3;
    cursor:grab;
    p{
        width:300px;
    }
    
}
</style>