<template>
    <div class="aihomen">
        <div class="menu">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="checkpoint" name="checkpoint"></el-tab-pane>
                <el-tab-pane label="sortconfig" name="sortconfig"></el-tab-pane>
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
    name: "AiHome",
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
            if (this.activeName === "checkpoint") {
                this.$router.push({
                    path: "/aipreview/checkpoint",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
            } else if (this.activeName === "sortconfig") {
                this.$router.push({
                    path: "/aipreview/sortconfig",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
            }
        },
    },
};
</script>

<style scoped lang="scss">
.aihomen {
    width: 100%;
    height: calc(100% - 20px);
    .menu {
      
        font-size: 8px;
    }
}
</style>
