import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SubHome from '../views/SubHome.vue'
import User from '../views/userInfo/user.vue'
import Editor from "../views/editor/Editor"
// import InlineEditor from "../views/inlineEditor/InlineEditor"
import FormConstructor from "@/views/formConstructor/FormConstructor"
import Preview from "@/views/formConstructor/PreviewLayout"
import PageConfigure from "@/views/formConstructor/PageConfigure"
import TemplateManager from "@/views/formConstructor/TemplateManager"
import MaterialManager from "@/views/formConstructor/MaterialManager"
import Run from "@/views/formConstructor/Run"
import ItemManager from "@/views/formConstructor/ItemManager"
import Login from "@/views/login/Login"
import Setting from "@/views/setting/Setting"
import Test from "@/views/test/Test"
Vue.use(VueRouter)
import store from "@/vuex/store"
import bangbanAxios from "@/api/ANew/config"

const routes = [
    {
        path: '/',
        component: Home,
        // beforeEnter: (to,from,next) => {
        //     let hasAdmin = store.state['config'].roles.includes('admin');
        //     console.log(hasAdmin,from.path == '/','has',from)
        //     if(hasAdmin && from.path == '/',hasAdmin) {
        //         console.log('adminTop')
        //         next('/user');
        //     } else if(!hasAdmin && from.path == '/') {
        //         console.log('noAdmin',hasAdmin);
        //         next('/subhome');
        //     }
        // },
        children: [
            {
                path: '/user',
                component: User,
                beforeEnter: (to,from,next) => {
                    store.commit('config/setCrumbList',[{label:'用户管理',path: '/user'}])
                    next();
                }
            },
            {
                path: '/subhome',
                component: SubHome,
                children: [
                    {
                        path:"/formconstructor",
                        name:"FormConstructor",
                        component:FormConstructor
                    },
                    {
                        path: '/editor',
                        name: 'Editor',
                        component: Editor,
                    },
                    // {
                    //     path: '/inlineeditor',
                    //     name: 'InlineEditor',
                    //     component: InlineEditor,
                    // },
                    {
                        path:"/preview",
                        name:"Preview",
                        component:Preview
                    },
                    {
                        path:"/pageconfigure",
                        name:"PageConfigure",
                        component:PageConfigure
                    },
                    {
                        path:"/templatemanager",
                        name:"templateManager",
                        component:TemplateManager
                    },
                    {
                        path:"/materialmanager",
                        name:"materialManager",
                        component:MaterialManager
                    },
                    {
                        path:"/run",
                        name:"run",
                        component:Run
                    },
                    {
                        path:"/subhome",
                        name:"itemManeger",
                        component:ItemManager
                    },
                    
                    {
                        path:"/setting",
                        name:"setting",
                        component:Setting,
                    }
                ]
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/test',
        name: 'test',
        component: Test
    },


]

const router = new VueRouter({
    routes
})

export default router

