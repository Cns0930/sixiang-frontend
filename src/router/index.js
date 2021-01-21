import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SubHome from '../views/SubHome.vue'
import BasicHome from '../views/BasicHome.vue'
import User from '../views/userInfo/user.vue'
import AllEdit from '../views/allEdit/allEdit.vue'
import ChangeEdit from '../views/allEdit/changeEdit.vue'
import Editor from "../views/editor/Editor"
// import InlineEditor from "../views/inlineEditor/InlineEditor"
import FormConstructor from "@/views/formConstructor/FormConstructor"
import Preview from "@/views/formConstructor/PreviewLayout"
import PageConfigure from "@/views/formConstructor/PageConfigure"
import PageConfigureResearcher from "@/views/formConstructor/PageConfigureResearcher"
import TemplateManager from "@/views/formConstructor/TemplateManager"
import MaterialManager from "@/views/formConstructor/MaterialManager"
import Run from "@/views/formConstructor/Run"
import ItemManager from "@/views/formConstructor/ItemManager"
import Login from "@/views/login/Login"
import Setting from "@/views/setting/Setting"

import ApprovalItem from "@/views/publicManagement/ApprovalItem"
import ApprovalSubItemText from "@/views/basicInfo/ApprovalSubItemText"
import PublicApprovalItem from "@/views/basicInfo/PublicApprovalItem"
import Material from "@/views/basicInfo/Material"
import ApprovalSubItem from "@/views/basicInfo/ApprovalSubItem"
import Field from "@/views/basicInfo/Field"
import Accessory from "@/views/basicInfo/Accessory"
import singleWindow from "@/views/basicInfo/singleWindowMaterial"
import ApprovalRules from "@/views/basicInfo/ApprovalRules"
import ApprovalSubItemRule from "@/views/basicInfo/ApprovalSubitemRule"

import OnlineDocumentEditor from "@/views/basicInfo/OnlineDocumentEditor"
import UiCompilerComponent from "@/views/uiCompilerComponent/Index"
import PublicDocument from "@/views/publicManagement/PublicDocument"
import PublicSubDocument from "@/views/publicManagement/PublicSubDocument"
import Examination from "@/views/publicManagement/Examination"
import ReadMe from "@/views/readMe/ReadMe"
import ProjectList from "@/views/projectManagement/ProjectList"
Vue.use(VueRouter)
import store from "@/vuex/store"
import bangbanAxios from "@/api/ANew/config"


const routes = [
    {
        path: '/',
        component: Home,
        redirect: to=> {
            // let hasAdmin = store.state['config'].roles.includes('admin');
            // let hasResearcher = store.state['config'].roles.includes('researcher');
            // if(hasAdmin || hasResearcher) {
            //     return '/basic'
            // } else {
            //     return '/subhome'
            // }
            return '/project';
        },
        children: [
            {
                path: '/user',
                component: User,
            },
            {
                path: '/allEdit',
                component: AllEdit,
                name:'AllEdit'
            },
            {
                path: '/changeEdit',
                component: ChangeEdit,
                name:'ChangeEdit'
            },
            {
                path: '/subhome',
                component: SubHome,
                meta:{
                    showLeftMenu:true,
                },
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
                        path:"/pageconfigureresearcher",
                        name:"PageConfigureResearcher",
                        component:PageConfigureResearcher
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
                path: '/project',
                name: 'ProjectList',
                component: ProjectList,
            },
            {
                path: '/basic',
                name: 'ApprovalItem',
                component: ApprovalItem,
            },
            {
                path: '/basic/subitem',
                component: BasicHome,
                meta:{
                    showLeftMenu:true,
                },
                children: [
                    {
                        path: '/basic/material',
                        name: 'Material',
                        component: Material,
                    },
                    {
                        path: '/basic/subitem',
                        component: ApprovalSubItem
                    },
                    {
                        path: '/basic/field',
                        component: Field
                    },
                    {
                        path: '/basic/accessory',
                        component: Accessory
                    },
                    {
                        path: '/basic/ApprovalSubItemText',
                        component: ApprovalSubItemText
                    },
                    
                    {
                        path: '/basic/singleWindow',
                        component: singleWindow
                    },
                    {
                        path: '/basic/approvalRules',
                        component: ApprovalRules
                    },
                    
                    {
                        path: '/basic/onlineDocumentEditor',
                        name: 'OnlineDocumentEditor',
                        component: OnlineDocumentEditor
                    },
                    {
                        path: '/basic/subItemRule',
                        name: 'ApprovalSubItemRule',
                        component: ApprovalSubItemRule
                    }
                ]
            }, 
            {
                path: '/public',
                name: 'PublicApprovalItem',
                component: PublicApprovalItem,
            },  
            {
                path: '/publicdocument',
                name: 'PublicDocument',
                component: PublicDocument,
            },
            {
                path: '/publicsubdocument',
                name: 'PublicSubDocument',
                component: PublicSubDocument,
            },
            {
                path: '/examination',
                name: 'examination',
                component: Examination,
            },
            {
                path:"/readme",
                name:"ReadMe",
                component:ReadMe,
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
        component: UiCompilerComponent
    },


]

const router = new VueRouter({
    routes
})

export default router

