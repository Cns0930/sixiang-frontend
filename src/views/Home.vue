<template>
    <div class="home">
        
        <!-- <el-select placeholder="请选择" :value="$store.state.home.item.name" @input="$store.commit('changeItem', $event)">
            <el-option v-for="(item, index) in $store.state.home.itemOptions" :key="index" :label="item.name" :value="item"></el-option>
        </el-select>-->

        <!-- <div>当前选择事项：{{$store.state.home.item.name}}</div>
        <el-button @click="$router.push('/')">事项管理</el-button>-->
        <div class="menu">
            
            <el-page-header @back="$router.push('/')" 
            title="返回事项列表"
            :content="$store.state.home.item.name?$store.state.home.item.name:'请先选择事项'">
            </el-page-header>
        
            <!-- <el-divider></el-divider> -->
            <el-divider direction="vertical" content-position="center"></el-divider>

            <el-button @click="$router.push({path:'/formconstructor', query:{'itemId':$store.state.home.item.id}})">字段管理</el-button>
            <el-button @click="$router.push({path:'/materialmanager', query:{'itemId':$store.state.home.item.id}})">材料管理</el-button>
            <el-button @click="$router.push({path:'/pageconfigure', query:{'itemId':$store.state.home.item.id}})">步骤页面管理</el-button>
            <el-button @click="$router.push({path:'/setting'})">设置</el-button>
            <el-dropdown @command="handleCommand" style="cursor: pointer;padding: 0 8px">
                <div class="center">
                    {{loginName}}
                    <img src="./../assets/png/see.png" style="width:24px;height:24px;display:inline-block;vertical-align: middle;" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item disabled>{{username}}</el-dropdown-item> -->
                    <!-- <el-dropdown-item command="modPassword">修改密码</el-dropdown-item> -->
                    <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        
        <el-divider></el-divider>

        <router-view></router-view>
    </div>
</template>

<script>
import { listAll , logout } from "@/api/item/index";
export default {
    name: "Home",
    components: {},
    data() {
        return {
            loginName: localStorage.getItem('username')
        }
    },
    methods: {
        handleCommand(command) {
            if (command === "logout") {
                this.logout();
            } else if (command === "modPassword") {
                this.modPassword();
            }
        },
        logout() {
            logout().then(v => {
                if (!v.success) return
                localStorage.removeItem("ticket");
                localStorage.removeItem("username");
                this.$router.push("/login");
            });
        },
    }
};
</script>

<style scoped>
.menu{
    display: inline-flex;
    font-size: 8px;
}
</style>
