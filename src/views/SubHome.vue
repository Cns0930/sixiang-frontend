<template>
    <div class="subhome">
        
        <!-- <el-select placeholder="请选择" :value="$store.state.home.item.name" @input="$store.commit('changeItem', $event)">
            <el-option v-for="(item, index) in $store.state.home.itemOptions" :key="index" :label="item.name" :value="item"></el-option>
        </el-select>-->

        <!-- <div>当前选择事项：{{$store.state.home.item.name}}</div>
        <el-button @click="$router.push('/')">事项管理</el-button>-->
        <div class="menu">
            
            <!-- <el-page-header @back="$router.push('/subhome')" 
            title="返回事项列表"
            :content="$store.state.home.item.itemName?$store.state.home.item.itemName:'请先选择事项'">
            </el-page-header> -->
        
            <!-- <el-divider></el-divider> -->
            <!-- <el-divider direction="vertical" content-position="center"></el-divider> -->

            <!-- <el-button @click="$router.push({path:'/formconstructor', query:{'itemId':$store.state.home.item.approvalItemId}})">字段管理</el-button>
            <el-button @click="$router.push({path:'/materialmanager', query:{'itemId':$store.state.home.item.approvalItemId}})">材料管理</el-button>
            <el-button @click="$router.push({path:'/pageconfigure', query:{'itemId':$store.state.home.item.approvalItemId}})">步骤页面管理</el-button>
            <el-button @click="$router.push({path:'/setting'})">设置</el-button> -->
            <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
                <el-tab-pane label="字段管理" name="formconstructor"></el-tab-pane>
                <el-tab-pane label="材料管理" name="materialmanager"></el-tab-pane>
                <el-tab-pane label="步骤页面管理" name="pageconfigure"></el-tab-pane>
                <el-tab-pane label="步骤页面-调研" name="pageconfigure2"></el-tab-pane>
                <el-tab-pane label="设置" name="setting"></el-tab-pane>
            </el-tabs>
        </div>
        
        <!-- <el-divider></el-divider> -->

        <router-view></router-view>
    </div>
</template>

<script>
import { listAll } from "@/api/item/index";
import store from "@/vuex/store"
import { mapState,mapMutations } from 'vuex';
export default {
    name: "SubHome",
    components: {},
    data() {
        return {
            activeTab: "",
        }
    },
    created() {
        this.activeTab = sessionStorage.getItem('activeTab');
        console.log('this.activeTab');
        console.log(this.activeTab);
        if (this.activeTab === null) {
            this.activeTab = 'formconstructor';
        }
    },
    methods: {
        handleClick(tab, event) {
            if (this.activeTab === "formconstructor") {
                this.$router.push({
                    path: "/formconstructor",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
                sessionStorage.setItem('activeTab', 'formconstructor');
                this.$store.commit("config/setCrumbList", [{ path: "/formconstructor", label: '帮办工具' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/formconstructor", label: '字段管理' }])
            } else if (this.activeTab === "materialmanager") {
                this.$router.push({
                    path: "/materialmanager",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
                sessionStorage.setItem('activeTab', 'materialmanager');
                this.$store.commit("config/setCrumbList", [{ path: "/formconstructor", label: '帮办工具' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/materialmanager", label: '材料管理' }])
            } else if (this.activeTab === "pageconfigure") {
                this.$router.push({
                    path: "/pageconfigure",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
                sessionStorage.setItem('activeTab', 'pageconfigure');
                this.$store.commit("config/setCrumbList", [{ path: "/formconstructor", label: '帮办工具' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/pageconfigure", label: '步骤页面管理' }])
            } else if (this.activeTab === "pageconfigure2") {
                this.$router.push({
                    path: "/pageconfigureresearcher",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
                sessionStorage.setItem('activeTab', 'pageconfigure2');
                this.$store.commit("config/setCrumbList", [{ path: "/formconstructor", label: '帮办工具' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/pageconfigureresearcher", label: '步骤页面-调研' }])
            } else if (this.activeTab === "setting") {
                this.$router.push({
                    path: "/setting",
                    query: { itemId: this.$route.query.itemId, projectId: this.$route.query.projectId },
                });
                sessionStorage.setItem('activeTab', 'setting');
                this.$store.commit("config/setCrumbList", [{ path: "/formconstructor", label: '帮办工具' }])
                this.$store.commit("config/setCrumbListSecond", [{ path: "/setting", label: '设置' }])
            } 
        },
        
    }
};
</script>

<style scoped lang="scss">
.subhome {
    width: 100%;
   
    .menu{
        
        font-size: 8px;
    }
}
</style>
