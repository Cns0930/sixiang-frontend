<template>
    <div class="home">
        <el-select placeholder="请选择" :value="$store.state.home.itemName" @input="$store.commit('changeItemName', $event)">
            <el-option v-for="(item, index) in $store.state.home.itemOptions" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>

        <el-divider></el-divider>
        
        <router-view></router-view>
    </div>
</template>

<script>


export default {
    name: 'Home',
    components: {
    
    },
    mounted() {
        console.log(this.$store.state.home.itemOptions);
    },
}
</script>
