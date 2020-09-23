<template>
    <div class="basichome">
        <div class="menu">
            <el-divider></el-divider>

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="情形管理" name="subitem"></el-tab-pane>
                <el-tab-pane label="材料管理" name="material"></el-tab-pane>
                <el-tab-pane label="字段管理" name="field"></el-tab-pane>
                <el-tab-pane label="附件管理" name="accessory"></el-tab-pane>
            </el-tabs>

            <!-- <el-button
                @click="$router.push({path:'/formconstructor', query:{'itemId':$store.state.home.item.approvalItemId}})"
            >字段管理</el-button>
            <el-button
                @click="$router.push({path:'/materialmanager', query:{'itemId':$store.state.home.item.approvalItemId}})"
            >材料管理</el-button>
            <el-button
                @click="$router.push({path:'/pageconfigure', query:{'itemId':$store.state.home.item.approvalItemId}})"
            >步骤页面管理</el-button>
            <el-button @click="$router.push({path:'/setting'})">设置</el-button>-->
        </div>

        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "BasicHome",
    components: {},
    data() {
        return {
            activeName: "",
        };
    },
    methods: {
        handleClick(tab, event) {
            
                if (this.activeName === "subitem") {
                    this.$router.push({
                        path: "/basic/subitem",
                        query: { itemId: this.$route.query.itemId },
                    });
                }else if (this.activeName === "material") {
                    this.$router.push({
                        path: "/basic/material",
                        query: { itemId: this.$route.query.itemId },
                    });
                }else if (this.activeName === "field") {
                    this.$router.push({
                        path: "/basic/field",
                        query: { itemId: this.$route.query.itemId },
                    });
                }else if (this.activeName === "accessory") {
                    this.$router.push({
                        path: "/basic/accessory",
                        query: { itemId: this.$route.query.itemId },
                    });
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
