<template>
    <div class="basichome">
        <div class="menu">
            <el-divider></el-divider>

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="情形管理" name="subitem"></el-tab-pane>
                <el-tab-pane label="AI文档" name="AIdocument"></el-tab-pane>
                <el-tab-pane label="帮办材料" name="material"></el-tab-pane>
                <el-tab-pane label="单窗材料" name="singleWindow"></el-tab-pane>
                <el-tab-pane label="材料字段" name="field"></el-tab-pane>
                <el-tab-pane label="前端字段" name="" disabled></el-tab-pane>
                <el-tab-pane label="附件管理" name="accessory"></el-tab-pane>
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
    name: "BasicHome",
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
        console.log('this.$route.path');
        console.log(this.$route.path);
        this.nowUrl = this.$route.path;
        let urlName = this.nowUrl;
        // console.log(urlName);
        let lastIndex = urlName.lastIndexOf('/');
        let name = urlName.slice(lastIndex + 1);
        // console.log('name');
        // console.log(name);
        this.activeName = name;
    },
    methods: {
        handleClick(tab, event) {
            if (this.activeName === "subitem") {
                this.$router.push({
                    path: "/basic/subitem",
                    query: { itemId: this.$route.query.itemId },
                });
                sessionStorage.setItem('activeName', 'subitem');
                this.$store.commit("config/setCrumbList", [{ path: `/basic/subitem?itemId=${this.$route.query.itemId}`, label: '调研信息' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/basic/subitem", label: '情形管理' }])
            } else if (this.activeName === "material") {
                this.$router.push({
                    path: "/basic/material",
                    query: { itemId: this.$route.query.itemId },
                });
                sessionStorage.setItem('activeName', 'material');
                this.$store.commit("config/setCrumbList", [{ path: `/basic/subitem?itemId=${this.$route.query.itemId}`, label: '调研信息' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/basic/material", label: '帮办材料' }])
            } else if (this.activeName === "field") {
                this.$router.push({
                    path: "/basic/field",
                    query: { itemId: this.$route.query.itemId },
                });
                sessionStorage.setItem('activeName', 'field');
                this.$store.commit("config/setCrumbList", [{ path: `/basic/subitem?itemId=${this.$route.query.itemId}`, label: '调研信息' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/basic/field", label: '材料字段' }])
            } else if (this.activeName === "accessory") {
                this.$router.push({
                    path: "/basic/accessory",
                    query: { itemId: this.$route.query.itemId },
                });
                sessionStorage.setItem('activeName', 'accessory');
                this.$store.commit("config/setCrumbList", [{ path: `/basic/subitem?itemId=${this.$route.query.itemId}`, label: '调研信息' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/basic/accessory", label: '附件管理' }])
            } else if (this.activeName === "AIdocument") {
                this.$router.push({
                    path: "/basic/AIdocument",
                    query: { itemId: this.$route.query.itemId },
                });
                sessionStorage.setItem('activeName', 'AIdocument');
                this.$store.commit("config/setCrumbList", [{ path: `/basic/subitem?itemId=${this.$route.query.itemId}`, label: '调研信息' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/basic/AIdocument", label: 'AI文档' }])
            } else if (this.activeName === "singleWindow") {
                this.$router.push({
                    path: "/basic/singleWindow",
                    query: { itemId: this.$route.query.itemId },
                });
                sessionStorage.setItem('activeName', 'singleWindow');
                this.$store.commit("config/setCrumbList", [{ path: `/basic/subitem?itemId=${this.$route.query.itemId}`, label: '调研信息' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/basic/singleWindow", label: '单窗材料' }])
            }
        },
    },
};
</script>

<style scoped lang="scss">
.basichome {
    width: 100%;
    height: calc(100% - 20px);
    .menu {
        display: inline-flex;
        font-size: 8px;
    }
}
</style>
