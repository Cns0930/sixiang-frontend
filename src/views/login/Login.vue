<template>
    <div class="login-bg-container">
        <div class="login-container">
            <el-form :model="ruleForm" label-position="left" label-width="0px"
                class="form-container">
                <div class="login-title">
                    <h1 style="color:#0A3D81;letter-spacing:4px;">四象2.0登录</h1>
                </div>
                <el-form-item prop="account" class="login-item-margin">
                    <el-input type="text" v-model="ruleForm.userName" auto-complete="off" placeholder="账号"
                        @keyup.native.enter="login(ruleForm)"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass" class="login-item-margin">
                    <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"
                        @keyup.native.enter="login(ruleForm)"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="ruleForm.rememberMe">记住密码</el-checkbox>
                    <!-- <el-button @click="$router.go(0)" style="margin-left: 20px">更新系统</el-button> -->
                </el-form-item>
                <el-form-item class="login-submit-bg">
                    <el-button class="submit-btn" @click.native.prevent="login(ruleForm)">登 录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="right-banner"></div>
    </div>
</template>

<script>
import axios from 'axios';
import store from '@/vuex/store'
import {login} from '@/api/item/index';
import {mapMutations} from 'vuex';
export default {
    name: "Login",
    data() {
        return {
            ruleForm: {
                userName: "",
                password: "",
                rememberMe: false
            },
        };
    },
    created() {
        if(sessionStorage.getItem('refresh') && sessionStorage.getItem('refresh') === 'getnew') {
            sessionStorage.setItem('refresh', 'isnew');
            this.$router.go(0)
        }
    },
    methods: {
        async login(ruleForm) {
            // 清空计时
            store.commit('clearTimeList');
            let { userName, password,rememberMe  } = ruleForm;
            if (!userName) {
                this.$message.error("请输入用户名");
                return;
            }
            if (!password) {
                this.$message.error("请输入密码");
                return;
            }
            const result = await this.getAuth(userName, password,rememberMe);
            if (!result.success) {
                this.$message.error("验证失败！");
                return;
            }
            localStorage.setItem("ticket", result.data.authorization);
            localStorage.setItem("username", result.data.userInfo.username);
            localStorage.setItem("account", result.data.userInfo.account);
            axios.defaults.headers.Authorization = result.data.authorization;
            this.$store.commit('config/setRoles',result.data.roles.sort())
            if(result.data.roles.length) {
                this.$message.success("登录成功");
            } else {
                this.$message.warning("账号权限不足，请联系系统管理员获取角色！");
            }

            let hasAdmin = result.data.roles.includes('admin');
            let hasResearcher = result.data.roles.includes('researcher');
            // if(hasAdmin || hasResearcher) {
                this.$router.push('/project')
            // } else {
            //     this.$router.push("/subhome");
            // }
        },
        async getAuth(userName, password,rememberMe) {
            // if (userName === "admin" && password === "Hg9s$ixuVe*x4J2X") {
            //     return { success: true, data: { authorization: "1234567890" } };
            // } else {
            //     return { success: false };
            // }
            let msg = {
                account: userName,
                password,
                rememberMe
            }
            let result = await login(msg);
            return result;
        },
    }
};
</script>

<style lang="scss">
html,
body {
    height: 100%;
}

.login-bg-container {
    display: flex;
    position: relative;
    background: #eceff3 url(./../../assets/png/BG.png);
    background-size: cover;
    .login-container{
        .form-container{
            .login-title{
                h1{
                    color:#0A3D81;
                    letter-spacing:8px;
                }
            }
            .login-type{
                margin-left: 14%;
            }
            .login-submit-bg{
                width: 100%;
                color: #ffffff;
                border-color: #4a6091;
                .submit-btn{
                    border-radius: 6px;
                    font-size: 18px;
                    box-shadow: 0 3px 2px 0 rgba(163, 173, 179, 0.51);
                }
            }
            
        }
    }
    .right-banner {
        background-size: 100% 100%;
        top: 0;
        width: 60%;
        height: 100vh;
    }
}


.login-container {
    position: absolute;
    top: 40%;
    width: 40%;
    .login-item-margin {
        // padding: 20px 0 20px 0;
        padding-bottom: 22px;
        width: 80%;
    }
    .login-submit-bg .el-button--primary {
        width: 100%;
        background: #4a6091;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 10px;
        border-color: #4a6091;
    }
    img {
        width: 8%;
        // height: auto;
        padding: 40px;
    }
}

.login-title {
    display: flex;
    align-items: center;
    height: 40px;
    line-height: 40px;
    padding-bottom: 50px;
}

.form-container {
    padding: 30px 50px 30px 50px;
    max-width: 550px;
    margin: 25px auto;
}

.control-label {
    display: inline-block;
    margin-bottom: 10px;
}
.submit-btn {
    width: 80%;
    background: linear-gradient(168.48deg, #0a3d81 100%, #914a16 0%) !important;
    border: none;
    color: #fff;
    font-size: 16px;
    span {
        color: white;
    }
}
.submit-btn:hover {
    color: #fff;
}
</style>
