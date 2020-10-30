<template>
    <div id="sideBar">
        <!-- <transition-group name="nav-fade">
            <div class="sideBar-wrapper left-big-nav" key="big">
                <router-link tag="div" class="sideBar-router" v-for="(item,index) in navList" :key="index"
                    :to="item.path">
                    <p>
                        <img :src="item.iconImg" v-if="$route.path == item.path"/>
                        <img :src="item.activeImg" v-if="$route.path !=item.path"/>
                    </p>
                    <p>{{item.label}}</p>
                </router-link>
            </div>
        </transition-group> -->
        <el-menu
            class="el-menu-vertical-demo"
            router
            :default-active="$route.path"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            collapse-transition
        >
            <el-submenu v-for="(item,index) of navList" :index="item.path" :key="index">
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{item.label}}</span>
                </template>
                <el-menu-item v-for="(t,i) of item.children" @click="setCrumbList([...t]);changeCrumbListSecond(t)" :index="t.path" :key="i" v-if="item.children.length">{{t.label}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>


<script>
import store from "@/vuex/store"
import { mapState,mapMutations } from 'vuex';
import {generaterNavList} from '../../router/navConfig';
export default {
    name: 'Leftside',
    props: {},
    data() {
        return {
            //侧边导航列表
        };
    },
    created() {
        // 生成左侧导航菜单 todo
        // const roles = "[]";
        // const authList = roles;
        // this.navList = generaterNavList(authList);
    },
    computed:{
        ...mapState('config',["isCollapse","roles"]),
        navList() {
            return generaterNavList(JSON.stringify(this.roles))
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        ...mapMutations('config',['setCrumbList']),
        changeCrumbListSecond(t) {
            sessionStorage.setItem('activeName', 'subitem');
            sessionStorage.setItem('activeTab', 'formconstructor');
            this.$store.commit("config/setCrumbListSecond",[{path: "", label:'' }]);
            if (t.label === '帮办工具'|| t.label === '调研信息' )
            this.$router.push({
                query: { itemId: store.state.home.item.approvalItemId },
            });
        },
    },
};
</script>
<style lang="scss">
@import "../../assets/css/common.scss";
/*collapse动画*/
.nav-fade-enter-active {
    transition: all 0.3s ease 0.3s;
}

.nav-fade-enter,
.nav-fade-leave {
    opacity: 0;
    transition: all 0s;
}
#sideBar {
    width: 100%;
    height: calc(100% - #{$header-height});
    margin-top: $header-height;
    background: #fff;
    .sideBar-router {
        cursor: pointer;
        padding: 20px 0;
        p {
            text-align: center;
            font-size: 14px;
            // opacity: 0.8;
            font-weight: normal;
            line-height: 22px;
            color:white;
            i {
                font-size: 18px;
            }
        }
    }
    .el-menu .el-submenu .el-submenu__title {
        padding-left: 8px !important;
    }
    .el-submenu.is-active {
        .el-submenu__title {
            color: #00adff;
        }
    }
    .el-menu-item {
        min-width: auto !important;
    }
    .el-menu-item.is-active {
        position: relative;
        background: #d9f0fb;
        &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 2px;
            height: 100%;
            background: #00adff;
        }
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 200px;
    }
}
</style>
