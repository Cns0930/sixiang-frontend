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
import ApprovalItem from "@/views/basicInfo/ApprovalItem"
import ApprovalSubItem from "@/views/basicInfo/ApprovalSubItem"
Vue.use(VueRouter)
import store from "@/vuex/store"
import bangbanAxios from "@/api/ANew/config"


const routes = [
    {
        path: '/',
        component: Home,
        redirect: to=> {
            let hasAdmin = store.state['config'].roles.includes('admin');
            let hasResearcher = store.state['config'].roles.includes('researcher');
            if(hasAdmin || hasResearcher) {
                return '/basic'
            } else {
                return '/subhome'
            }
        },
        children: [
            {
                path: '/user',
                component: User,
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
            {
                path: '/basic',
                component: ApprovalItem,
            },
            {
                path:"/subitem",
                component:ApprovalSubItem
            }
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

