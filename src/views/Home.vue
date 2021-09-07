<template>
    <div class="home">
        <header>
            <!-- <span class="left">四象2.0</span> -->
            <div class="-center left">
                <img  src="~@/assets/png/logo.png" />

                <el-popover
                    v-for=" menu,i in topMenuList"
                    :key="i"
                    placement="bottom-start"
                    width="150"
                    trigger="click" 
                    popper-class="dropdown-menu-top"
                    v-model="menu.visible">
                    <div class="dropdown-btn -center" slot="reference">{{menu.label}}<i class="el-icon-arrow-down"></i></div>
                    <ul class="dropdown-list">
                        <li v-for="item,k in menu.children" @click="handleJump(item.path)" :key="k" v-show="canItShow(item.label)">{{item.label}}</li>
                    </ul>
                </el-popover>
                <!-- <el-popover
                    placement="bottom-start"
                    width="150"
                    trigger="click" 
                    popper-class="dropdown-menu-top"
                    v-model="userManagementListVisible">
                    <div class="dropdown-btn -center" slot="reference">用户管理<i class="el-icon-arrow-down"></i></div>
                    <ul class="dropdown-list">
                        <li  @click="handleJump('/user')">用户管理</li>
                     
                    </ul>
                </el-popover> -->
            </div>
            <div class="right">
                <div class="itemInfo-box" >
                    <!-- <span class="itemInfo-title">事项信息<i class="el-icon-document"></i> </span> -->
                    <i v-show="isShowProject()" class="itemInfo-text">项目名称：<i class="itemInfo-text-in">{{ projectInfo.projectName }}</i> </i>
                    <i v-show="isShowItem()" class="itemInfo-text">事项名称：<i class="itemInfo-text-in">{{ itemInfo.itemName }}</i> </i>
                    <i v-show="isShowItem()" class="itemInfo-text">事项编号：<i class="itemInfo-text-in">{{ itemInfo.itemNo }}</i> </i>
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
            <div class="mainLeft" @click="handleCollapse(false)" v-if="showList">
                <leftside :showList="showList" ></leftside>
            </div>
            <div class="mianRight" :class="{'chosen': isCollapse}">
                <div class="routerView" :class="{bigContent:showList,smallContent:!showList}">
                  
                    <router-view></router-view>
                   
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
import { generaterTopMenuList } from '@/router/navConfig';
export default {
    name: "Home",
    data() {
        return {
            // showList: false,
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
            projectInfo: state => state.home.project,
            roles:state=>state.config.roles,
        }),
        showList(){
           
            return this.$route.matched.reduce((result,r)=>{
                if(r.meta.hasOwnProperty('showLeftMenu')){
                    result = r.meta.showLeftMenu;
                }
                return result;
            },false)
          
        },
        topMenuList() {
            let topMenuList = generaterTopMenuList(this.roles);
            if (this.$route.path === '/project' || this.$route.path === '/document' || this.$route.path === '/user'
                || this.$route.path === '/timeconsume' || this.$route.path === '/weibanju' || this.$route.path === '/datum'){
                topMenuList = topMenuList.filter(item => 
                    item.label !== '事项管理' && item.label !== '文档管理' && item.label !== '说明'
                )
            }
            return topMenuList
        }
         
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
        isShowProject() {
            if (this.$route.path === '/user' || this.$route.path === '/project' || this.$route.path === '/document'
            || this.$route.path === '/timeconsume') {
                return false;
            } else {
                return true;
            }
        },
        isShowItem() {
            if (this.$route.path === '/user' || this.$route.path === '/basic' || this.$route.path === '/project'
            || this.$route.path === '/publicdocument' || this.$route.path === '/publicsubdocument'
            || this.$route.path === '/examination' || this.$route.path === '/readme'
            || this.$route.path === '/public' || this.$route.path === '/allEdit' || this.$route.path === '/document'
            || this.$route.path === '/approval' || this.$route.path === '/timeconsume') {
                return false;
            } else {
                return true;
            }
        },
        handleJump (path) {
            this.topMenuList.forEach(v=>{
                this.$set(v,"visible",false)
            })
            this.$router.push({
                path: path,
                query: { projectId: this.$route.query.projectId || this.projectInfo.projectId }
            });
        },
        // 校验下拉项目是否展示
        canItShow(label) {
            if (label === '标签管理' || label === '测试环境管理') {
                if (this.roles.includes('admin') || this.roles.includes('test') ) {
                    return true;
                } else {
                    return false;
                }
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
        height: $header-height;
        position: fixed;
        -webkit-box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
            0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14),
            0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
        z-index: 4;
        background: #2b3b65;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .left {
            
            margin-left: 20px;
            height: 30px;
           
            img{
                margin-right:120px;
            }
            .dropdown-btn{
                color:#fff;
                cursor:pointer;
                font-size:12px;
                height: 32px;
                border-radius: 4px;
                padding: 6px 8px;
                font-weight: bold;
                i{
                    margin-left:10px;
                    font-size:12px;
                }
                &:hover{
                    background-color: rgba(235,202,197,0.2);
                }
                
            }
            
        }
        .right {
            display: flex;
            .itemInfo-box {
                margin-right: 10px;
                .itemInfo-text {
                    font-size: 14px;
                }
                .itemInfo-text-in {
                    margin-right: 8px;
                    color: #f5588a;
                    font-weight: bold;
                    font-size: 14px;
                }
            }
            ::v-deep {
                .el-dropdown {
                    color: #fff;
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
