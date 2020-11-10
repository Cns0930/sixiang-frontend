import product from "../assets/leftHead/product.png"
import act_product from "../assets/leftHead/act_product.png"

import store from "@/vuex/store"

const originList = [
    {
        path: "/",
        label: "用户管理",
        authKey: ["admin"],
        group: "用户管理",
        // iconImg: product,
        // activeImg: act_product,
        iconClass:"el-icon-s-custom",
        children: [
            {
                path: '/user',
                label: '用户管理',
            },
        ],
        order: 4
    },
    {
        path: "/formconstructor",
        label: "超级帮办开发管理",
        authKey: ["admin","developer","researcher","test"],
        // iconImg: product,
        // activeImg: act_product,
        iconClass:"el-icon-data-line",
        children: [
            {
                path: `/formconstructor`,
                label: '帮办工具',
            },
        ],
        order: 3
    },
    {
        path: "/basic",
        label: "调研信息管理",
        authKey: ["admin","developer","researcher","test"],
        // iconImg: product,
        // activeImg: act_product,
        iconClass:"el-icon-magic-stick",
        children: [
            {
                path: `/basic/subitem`,
                label: '调研信息',
                children: [
                    {
                        path: '/basic/subitem',
                        label: '情形管理',
                    },
                    {
                        path: '/basic/AIdocument',
                        label: 'AI文档',
                    },
                    {
                        path: '/basic/material',
                        label: '帮办材料',
                    },
                    {
                        path: '/basic/singleWindow',
                        label: '单窗材料',
                    },
                    {
                        path: '/basic/field',
                        label: '材料字段',
                    },
                    {
                        path: '/basic/accessory',
                        label: '附件管理',
                    },
                ]
            },
        ],
        order: 2
    },
    {
        path: "/basic_",
        label: "事项管理",
        authKey: ["admin","developer","researcher","test"],
        // iconImg: product,
        // activeImg: act_product,
        iconClass:"el-icon-s-home",
        children: [
            {
                path: '/basic',
                label: '事项列表',
            }
        ],
        order: 1
    },
]
// 对于导航列表处理函数
const showList = (authList, originList) => {
    const roles = JSON.parse(authList) || []
    const itemInfo = store.state.home.item
    console.log('itemInfo');
    console.log(itemInfo);
    //todo先全部展示
    // var permitList = originList;
    var permitList = originList.filter(item => {
        // console.log("导航栏");
        // console.log(item);
        if (item.label === "调研信息管理" || item.label === "超级帮办开发管理") {
            if (!itemInfo.approvalItemId) {
                return false;
            }
        } else {
            if (!item.authKey.includes(roles[0])) {
                return false;
            }
        }
        return true;
    });
    return permitList
}
// 对外的接口函数
export const generaterNavList = (authList) => {
    return showList(authList, originList.sort((a, b) => a.order - b.order))
}
export const auth_path_list = originList;
