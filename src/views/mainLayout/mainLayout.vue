<template>
    <div class="mainLayout">
        <span class="crumbWrap">
            <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) of crumbList" :key="index" :to="{ path: item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb> -->
        </span>
        <transition name="slide-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "Main",
  data() {
    return {
      
    };
  },
  computed: {
      ...mapGetters('config',{
          crumbList: 'getCrumbList'
      })
  },
  created() {

  },
  mounted() {
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
