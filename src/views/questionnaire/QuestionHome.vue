<template>
    <div class="Questionnairen">
        <div class="menu">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="问卷列表" name="questionmanagement"></el-tab-pane>
                <el-tab-pane label="初始配置" name="questionsetting"></el-tab-pane>
            </el-tabs>
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
import store from "@/vuex/store"
import { mapState, mapMutations } from 'vuex';
import { log } from 'handlebars';
export default {
    name: "Questionnaire",
    components: {},
    data() {
        return {
            activeName: "",
            nowUrl: null,
        };
    },
    created() {
        // this.activeName = sessionStorage.getItem('activeName');
        // if (this.activeName === null) {
        //     this.activeName = 'subitem';
        // }
    },
    beforeUpdate() {
        // 根据`URL地址捕获当前激活的标签
        this.nowUrl = this.$route.path;
        let urlName = this.nowUrl;
        let lastIndex = urlName.lastIndexOf('/');
        let name = urlName.slice(lastIndex + 1);
        this.activeName = name;
    },
    methods: {
        handleClick(tab, event) {
            if (this.activeName === "questionmanagement") {
                this.$router.push({
                    path: "/questionnaire/questionmanagement",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
            } else if (this.activeName === "questionsetting") {
                this.$router.push({
                    path: "/questionnaire/questionsetting",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
            } else if (this.activeName === "aidevelopment") {
                this.$router.push({
                    path: "/aipreview/aidevelopment",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
            }
        },
    },
};
</script>

<style scoped lang="scss">
.Questionnairen {
    width: 100%;
    height: calc(100% - 20px);
    .menu {
        font-size: 8px;
    }
}
</style>
