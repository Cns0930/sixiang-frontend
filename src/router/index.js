import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Editor from "../views/editor/Editor"
import InlineEditor from "../views/inlineEtidor/InlineEditor"
import FormConstructor from "@/views/formConstructor/FormConstructor"
import Preview from "@/views/formConstructor/PreviewLayout"
import PageConfigure from "@/views/formConstructor/PageConfigure"
import TemplateManager from "@/views/formConstructor/TemplateManager"
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        
        component: Home,
        children: [
            {
                path:"/",
                name:"FormConstructor",
                component:FormConstructor
            },
            {
                path: '/editor',
                name: 'Editor',
                component: Editor,
            },
            {
                path: '/inlineeditor',
                name: 'InlineEditor',
                component: InlineEditor,
            },
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

        ]
    },

]

const router = new VueRouter({
    routes
})

export default router
