<template>
    <div class="home">
        <header>
            <span>四象2.0</span>
            <el-dropdown @command="handleCommand" style="cursor: pointer;padding: 0 8px;" class="avatar">
                <div class="center">
                    {{loginName}}
                    <img src="./../assets/png/see.png" style="width:24px;height:24px;display:inline-block;vertical-align: middle;" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </header>
        <section class="main">
          <div class="mainLeft" @click="handleCollapse(false)">
            <leftside :showList="showList" v-if="showList"></leftside>
          </div>
          <div class="mianRight" :class="{'chosen': isCollapse}" @click="handleCollapse(true)">
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
import { mapState , mapMutations } from 'vuex';
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
    ...mapState('config',{
        isCollapse: 'isCollapse'
    })
  },
  mounted() {

  },
  methods: {
    ...mapMutations('config',{handleCollapse: 'setCollapse'}),
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

<style lang="scss" scoped>
@import "./../assets/css/common.scss";
.home {
  height: 100vh;
  header {
    width: 100%;
    height: 50px;
    position: fixed;
    -webkit-box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12), 0 1px 8px 0 rgba(0, 0, 0, 0.2);
    z-index: 4;
    background: #f0f2f5;
    &>span {
        float: left;
        font-weight: 700;
        font-size: 24px;
        height: 100%;
        line-height: 50px;
        text-indent: 30px;
        letter-spacing: 3px;
    }
    .avatar {
        float: right;
        margin: 13px 16px 0 0;
    }
  }
  .change_city {
      font-size: 13px;
      margin: 0 10px;
  }
  .main {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    .mainLeft {
      box-shadow: 0 2px 4px #ccc;
    }
    .mianRight {
      width: calc(100% - 205px);
      margin-top: $header-height;
      height: calc(100% - #{$foot-height} - #{$header-height});
    }
    .mianRight.chosen {
      width: 99.9%;
      transition: .3s width ease-in-out;
    }

  }
}
    .slide-fade-enter-active {
      transition: all .25s linear;
    }
    .slide-fade-leave-active {
      transition: all .25s linear;
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
