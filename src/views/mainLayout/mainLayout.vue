<template>
    <div class="mainLayout">
        <span class="crumbWrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) of crumbList" :key="index" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) of crumbListSecond" :key="index + '^-^' "  :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="itemInfo-box">
                <span class="itemInfo-title">事项信息<i class="el-icon-document"></i> </span>
                <span class="itemInfo-text">事项编号：<span class="itemInfo-text-in">{{ itemInfo.itemNo }}</span> </span>
                <span class="itemInfo-text">事项名称：<span class="itemInfo-text-in">{{ itemInfo.itemName }}</span> </span>
            </div>
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
      ...mapGetters('config',{
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
    
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/css/common.scss";
.mainLayout {
    margin: 0 14px;
    width: calc(100% - 28px);
    height: calc(100vh - #{$header-height});
    padding: 10px 0 0 0;
    box-sizing: border-box;
    border-radius: 8px 8px 0 0;
    .crumbWrap {
        display: inline-block;
        .itemInfo-box {
            font-size: 15px;
            padding: 10px;
            width: 100%;
            background: #f0f2f5;
            display: flex;
            flex-direction: row;
            .itemInfo-title {
                font-size: 15px;
                font-weight: bold;
                margin-right: 25px;
            }
            .itemInfo-text {
                margin-right: 20px;
                .itemInfo-text-in {
                    color: rgb(0, 3, 204);
                }
            }
        }
    }
    .slide-fade-enter-active {
        transition: all .3s ease-in-out;
    }
    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(5px);
        opacity: 0;
    }
}
</style>
