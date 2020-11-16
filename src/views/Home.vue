<template>
    <div class="home">
        <header>
            <span class="left">四象2.0</span>
            <div class="right">
                <div class="itemInfo-box" v-if="isShowItem()">
                    <!-- <span class="itemInfo-title">事项信息<i class="el-icon-document"></i> </span> -->

                    <i class="itemInfo-text">事项名称：<i class="itemInfo-text-in">{{ itemInfo.itemName }}</i>
                    </i>
                    <i class="itemInfo-text">事项编号：<i class="itemInfo-text-in">{{ itemInfo.itemNo }}</i> </i>
                </div>

                <el-dropdown @command="handleCommand" style="cursor: pointer;padding: 0 8px;" class="avatar">
                    <div class="center">
                        {{loginName}}
                        <img src="./../assets/png/user.png"
                            style="width:24px;height:24px;display:inline-block;vertical-align: middle;" />
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </header>
        <section class="main">
            <div class="mainLeft" @click="handleCollapse(false)">
                <leftside :showList="showList" v-if="showList"></leftside>
            </div>
            <div class="mianRight" :class="{'chosen': isCollapse}">
                <div class="routerView" :class="{bigContent:showList,smallContent:!showList}">
                    <MainLayout></MainLayout>
                </div>
            </div>
        </section>
    </div>
</template>


<script>
import { logout } from "@/api/item/index";
import Leftside from "./mainLayout/Leftside";
import MainLayout from "./mainLayout/mainLayout";
import { mapState, mapMutations } from 'vuex';
export default {
    name: "Home",
    data() {
        return {
            showList: true,
            loginName: localStorage.getItem('username')
        };
    },
    components: {
        Leftside,
        MainLayout
    },
    computed: {

        ...mapState({
            isCollapse: state => state.config.isCollapse,
            itemInfo: state => state.home.item,
        })
    },
    mounted() {

    },
    methods: {
        ...mapMutations('config', { handleCollapse: 'setCollapse' }),
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
                localStorage.removeItem("account");
                this.$router.push("/login");
            });
        },
        isShowItem() {
            if (this.$route.path === '/user' || this.$route.path === '/basic') {
                return false;
            } else {
                return true;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./../assets/css/common.scss";
.home {
    min-height: 100vh;
    header {
        width: 100%;
        height: 50px;
        position: fixed;
        -webkit-box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
            0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
            0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
        z-index: 4;
        background: #f0f2f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left{
            font-weight: 700;
            font-size: 24px;
            text-indent: 30px;
            letter-spacing: 3px;
        }
        .right{
            display:flex;
            .itemInfo-box{
                margin-right:10px;
                .itemInfo-text{
                   font-size:14px;
                }
                .itemInfo-text-in{
                    margin-right:8px;
                    color: #517bea;
                    font-weight:bold;
                    font-size:14px;
                }
           
            }
            
        }
        
        // .avatar {
        //     float: right;
        //     margin: 13px 16px 0 0;
        // }
    }

    .main {
        display: flex;
        width: 100%;
        min-width: 1400px;
        min-height: 100%;
        .mainLeft {
            box-shadow: 0 2px 4px #ccc;
            width: 180px;
        }
        .mianRight {
            width: calc(100% - 180px);
            margin-top: $header-height;
            //   height: calc(100% - #{$foot-height} - #{$header-height});
        }
    }
}
.slide-fade-enter-active {
    transition: all 0.25s linear;
}
.slide-fade-leave-active {
    transition: all 0.25s linear;
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(100px);
    opacity: 0;
}

.routerView {
    padding: $view-padding $view-padding $view-padding $view-padding;
}

.bigContent {
    margin: 0;
    transition: all 0.3s;
    min-height: calc(100vh - #{$header-height});
}
.foot {
    position: fixed;
    width: 100%;
    height: $foot-height;
    line-height: $foot-height;
    bottom: $foot-height / 2;
    text-align: center;
    span {
        font-size: 12px;
    }
}

.smallContent {
    margin: 0 0 0 0px;
    transition: all 0.3s;
}

.operation {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .help-doc,
    .notice {
        padding: 0 8px;
        cursor: pointer;
    }
    .version {
        font-size: 8px;
        padding-right: 5px;
        opacity: 0.8;
        font-style: oblique;
    }
}
</style>
