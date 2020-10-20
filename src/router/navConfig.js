import product from "../assets/leftHead/product.png"
import act_product from "../assets/leftHead/act_product.png"

const originList = [
    {
        path: "/",
        label: "用户管理",
        authKey: ["admin"],
        group: "用户管理",
        iconImg: product,
        activeImg: act_product,
        children: [
            {
                path: '/user',
                label: '用户管理',
            },
        ],
        order: 3
    },
    {
        path: "/subhome",
        label: "超级帮办开发管理",
        authKey: ["admin","developer","researcher","test"],
        iconImg: product,
        activeImg: act_product,
        children: [
            {
                path: '/subhome',
                label: '帮办工具',
            },
        ],
        order: 2
    },
    {
        path: "/basic",
        label: "调研信息管理",
        authKey: ["admin","developer","researcher","test"],
        iconImg: product,
        activeImg: act_product,
        children: [
            {
                path: '/basic',
                label: '调研信息',
            }
        ],
        order: 1
    },
]
// 对于导航列表处理函数
const showList = (authList, originList) => {
    const roles = JSON.parse(authList) || []
    //todo先全部展示
    // var permitList = originList;
    var permitList = originList.filter(item => item.authKey.includes(roles[0]));
    return permitList
}
// 对外的接口函数
export const generaterNavList = (authList) => {
    return showList(authList, originList.sort((a, b) => a.order - b.order))
}
export const auth_path_list = originList;
