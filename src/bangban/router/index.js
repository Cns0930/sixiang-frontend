import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/login/Login"
import BangbanRuning from "@/bangban/views/ANew/Home"
Vue.use(VueRouter)
import store from "@/vuex/store"
import bangbanAxios from "@/api/ANew/config"
import PrintSelect from "@/bangban/views/print/PrintSelect"
const routes = [
    {
        path: '/',
        name:"home",
        component: BangbanRuning,
        beforeEnter(to, from, next){
            bangbanAxios.defaults.baseUrl = store.state.setting.bangbanUrl;
            next();
        },
        children: [
            

        ]
    },
    {
        path: '/selectprint',
        name: 'print',
      
        component: PrintSelect
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
   

]

const router = new VueRouter({
    routes
})

export default router
