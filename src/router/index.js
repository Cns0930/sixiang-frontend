import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Editor from "../views/editor/Editor"
import InlineEditor from "../views/inlineEtidor/InlineEditor"
import FormConstructor from "@/views/formConstructor/FormConstructor"
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
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
            }

        ]
    },

]

const router = new VueRouter({
    routes
})

export default router
