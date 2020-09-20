<template>
    <div class="basichome">
        <div class="menu">
            <el-divider></el-divider>

            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="情形管理" name="subitem"></el-tab-pane>
                <el-tab-pane label="材料管理" name="material"></el-tab-pane>
                <el-tab-pane label="字段管理" name="field"></el-tab-pane>
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
            <el-button @click="$router.push({path:'/setting'})">设置</el-button> -->
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
            activeName: "subitem",
        };
    },
    methods: {
        handleClick(tab, event) {
            // TODO: 如果切换了标签 则跳转 带上事项id
            if(this.activeName !== tab.name){
                if(this.activeName === 'subitem'){

                }
            }
        }
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
