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
        <el-menu  router :default-active="$route.path" @open="handleOpen"
            @close="handleClose" :collapse="isCollapse">
           
             <el-menu-item v-for="(t,i) of navList" @click="changeCrumbListSecond(t)"
                    :index="t.path" :key="i" >{{t.label}}</el-menu-item>
        </el-menu>
    </div>
</template>


<script>
import store from "@/vuex/store"
import { mapState, mapMutations } from 'vuex';
import { generaterNavList } from '../../router/navConfig';
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
    computed: {
        ...mapState('config', ["isCollapse", "roles"]),
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
        ...mapMutations('config', ['setCrumbList']),
        changeCrumbListSecond(t) {
            sessionStorage.setItem('activeName', 'subitem');
            sessionStorage.setItem('activeTab', 'formconstructor');
            this.$router.push({
                path: t.path,
                query: { itemId: store.state.home.item.approvalItemId,
                projectId: store.state.home.project.projectId },
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
    background: #53628a;
    .sideBar-router {
        cursor: pointer;
        padding: 20px 0;
        p {
            text-align: center;
            font-size: 14px;
            // opacity: 0.8;
            font-weight: normal;
            line-height: 22px;
            color: white;
            i {
                font-size: 18px;
            }
        }
    }
    .el-menu .el-submenu .el-submenu__title {
        padding-left: 12px !important;
    }
    .el-menu-item {
        min-width: auto !important;
    }
}
</style>
