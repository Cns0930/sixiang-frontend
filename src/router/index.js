import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
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
import BangbanRuning from "@/views/ANew/Home"
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        
        component: Home,
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
                path:"/",
                name:"itemManeger",
                component:ItemManager
            },
            {
                path:"bangbanruning",
                name:"bangbanRuning",
                component:BangbanRuning
            }

        ]
    },{
        path: '/login',
        name: 'login',
        component: Login
    },

]

const router = new VueRouter({
    routes
})

export default router
