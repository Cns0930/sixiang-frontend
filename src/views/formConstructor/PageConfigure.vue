<template>
    <div class="page-configure">
        <div class="op-bar">

            <el-button @click="createStepPage"> 创建步骤页面</el-button>
        </div>
        <div class="main">

            <!-- 页面 -->
            <div class="computed-field">
                <div v-for="(v,i) in stepPages" :key="i">
                    <el-button type="text" @click="handleClickPage(v)" style="width:150px;margin:0">
                        {{v.name}}
                    </el-button>
                    <el-button style="width:45px;margin:0" @click="handleDeleteStepPage(i)">删除</el-button>
                </div>
            </div>

            <!-- 页面属性填写 -->
            <div class="attribute-content">
                <div class="attribute" v-for="(v,i) in temp_page_attribute" :key="i">{{i}}

                    

                </div>
            </div>

        </div>

        <!-- 创建步骤页面 -->
        <el-dialog title="创建步骤页面" :visible.sync="stepPageCreateVisible" width="50%">
            <div>
                页面名称:<el-input v-model="temp_page_name"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogComputedVisible = false">取 消</el-button>
                <el-button type="primary" @click="addStepPage">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    name: "PageConfigure",
    data() {
        return {
            // 创建页面用
            stepPageCreateVisible: false,
            temp_page_name: "",
            temp_page_attribute:{},
        }

    },
    computed: {
        ...mapState({
            baseFields: state => state.fieldModel.baseFields,
            computedFields: state => state.fieldModel.computedFields,
            stepPages: state => state.fieldModel.stepPages,
        })

    },
    methods: {
        createStepPage() {
            this.stepPageCreateVisible = true;
        },
        addStepPage() {
            let data = {
                name: this.temp_page_name
            }
            this.$store.commit("pushStepPage", data);
            this.stepPageCreateVisible = false;
        },
        handleDeleteStepPage(i) {
            this.$store.commit("deleteStepPage", i)
        },
        handleClickPage(page){
            console.log(page)
        },
    }

}
</script>

<style lang="scss" scoped>
.page-configure {
    display: flex;
    flex-direction: column;
    .main {
        display: flex;
        height: calc(100vh - 40px);
    }
    .el-input {
        width: 400px;
    }
    .el-textarea {
        width: 400px;
    }
}
.base-field-list {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: red 1px solid;

    height: 100%;
}
.computed-field {
    width: 200px;
    border: green 1px solid;
    height: 100%;
}
.attribute-content {
    flex: 1;
    border: blue 1px solid;
    height: 100%;
    .attribute {
        margin: 4px 0;
    }
}
</style>