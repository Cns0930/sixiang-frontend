
import store from "@/vuex/store"

const originList = [
   

    {
        path: "/basic/subitem",
        label: "调研信息管理",
        authKey: ["admin","developer","researcher","test"],

        iconClass:"el-icon-magic-stick",
       
        order: 2
    },
    {
        path: "/formconstructor",
        label: "超级帮办开发管理",
        authKey: ["admin","developer","researcher","test"],

        iconClass:"el-icon-data-line",
        
        order: 3
    },
   
 
]

const topMenuList=[
    {
        label: "项目管理",
        authKey: ["admin","developer","researcher","test"],
        children:[
            {
                path: "/project",
                label: "项目管理",
            }
        ],
        order: 1
    },
    {
        label: "事项管理",
        authKey: ["admin","developer","researcher","test"],
        children:[
            {
                path: "/basic",
                label: "事项管理",
            },
            {
                path: "/public",
                label: "公共事项",
            },
            {
                path: "/allEdit",
                label: "批量编辑",
            },
        ],
        order: 2
    },
    {
        label: "用户管理",
        authKey: ["admin"],
        children:[
            {
                path: "/user",
                label: "用户管理",
            },
        ],
        order: 5
    },
    {
        label: "文档管理",
        authKey: ["admin","developer","researcher","test"],
        children:[
            {
                path: "/publicdocument",
                label: "公共一级材料",
            },
            {
                path: "/publicsubdocument",
                label: "公共二级材料",
            },
            {
                path: "/examination",
                label: "信息点管理",
            },
            
        ],
        order: 3
    },
    {
        label: "说明",
        authKey: ["admin","developer","researcher","test"],
        children:[
            {
                path: "/readme",
                label: "开发说明",
            },
        ],
        order: 4
    },
    // {
    //     label: "批量编辑",
    //     authKey: ["admin","developer","researcher","test"],
    //     children:[
    //         {
    //             path: "/allEdit",
    //             label: "批量编辑",
    //         },
    //     ],
    //     order: 4
    // },
]
// 对于导航列表处理函数
const showList = (authList, originList) => {
    const roles = JSON.parse(authList) || []


    return originList.filter(item => _.intersection(item.authKey,roles).length>0);
    
}

const showTopMenu = (authList, topMenuList) => {
    const roles = authList|| []


    return topMenuList.filter(item => _.intersection(item.authKey,roles).length>0);
    
}

// 对外的接口函数
export const generaterNavList = (authList) => {
    return showList(authList, originList.sort((a, b) => a.order - b.order));
    
}
export const generaterTopMenuList = (authList) => {
   
    return showTopMenu(authList,topMenuList.sort((a, b) => a.order - b.order));

}
export const auth_path_list = originList;
