<template>
    <div class="home">
        <!-- <el-select placeholder="请选择" :value="$store.state.home.item.name" @input="$store.commit('changeItem', $event)">
            <el-option v-for="(item, index) in $store.state.home.itemOptions" :key="index" :label="item.name" :value="item"></el-option>
        </el-select>-->

        <!-- <div>当前选择事项：{{$store.state.home.item.name}}</div>
        <el-button @click="$router.push('/')">事项管理</el-button>-->
        <el-page-header @back="$router.push('/')" :content="$store.state.home.item.name?$store.state.home.item.name:'请先选择事项'"></el-page-header>
        <el-divider></el-divider>

        <el-button @click="$router.push('/formconstructor')">字段管理</el-button>
        <el-button @click="$router.push('/materialmanager')">材料管理</el-button>
        <el-button @click="$router.push('/pageconfigure')">步骤页面管理</el-button>

       

        <el-divider></el-divider>

        <router-view></router-view>
    </div>
</template>

<script>
import { listAll } from "@/api/item/index";
export default {
    name: "Home",
    components: {},
};
</script>
