<template>
    <div class="mainLayout">
        <span class="crumbWrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) of crumbList" :key="index" :to="{ path: item.path }">
                    {{item.label}}</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) of crumbListSecond" :key="index + '^-^' "
                    :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
            
        </span>
        <transition name="slide-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from "@/vuex/store"
export default {
    name: "Main",
    data() {
        return {

        };
    },
    computed: {
        ...mapGetters('config', {
            crumbList: 'getCrumbList',
            crumbListSecond: 'getCrumbListSecond'
        }),
        itemInfo() {
            //   console.log('store.state.home.item');
            //   console.log(store.state.home.item);
            return store.state.home.item;
        }

    },
    created() {

    },
    mounted() {
        // this.itemInfo = store.state.home.item
        // console.log('提示itemInfo');
        // console.log(this.itemInfo);
        console.log('this.crumbList');
        console.log(this.crumbList);

    },
    methods: {
        isShow() {
            if (this.$route.path === '/user' || this.$route.path === '/basic') {
                return false;
            } else {
                return true;
            }
        }

    }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/common.scss";
.mainLayout {
    margin: 0 14px;
    // width: calc(100% - 28px);
    // height: calc(100vh - #{$header-height});
    padding: 10px 0 0 0;
    box-sizing: border-box;
    border-radius: 8px 8px 0 0;
    .crumbWrap {
        display:flex;
        justify-content:space-between;
        align-items: center;
        margin-top:4px;
        margin-bottom:8px;
    }

}
</style>
