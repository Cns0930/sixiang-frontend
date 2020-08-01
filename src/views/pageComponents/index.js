import path from "path"


const pageComponents = require.context("@/views/pageComponents",true,/.vue$/)

export const components={}
pageComponents.keys().forEach(item=>{
    const name = path.basename(item,".vue")
    components[name] = pageComponents(item).default
})


export default [
    {
        name:"CommonForm",
        label:"通用表单页",
        type:"field"
    },
    {
        name:"CommonMaterial",
        label:"通用材料页",
        type:"material"
    },
    {
        name:"CommonForm",
        label:"事项选择",
        type:"field"
    },
    {
        name:"MaterialExtract",
        label:"智能提取材料——空白",
        type:"field"
    },
    {
        name:"CommonForm",
        label:"基本信息确认",
        type:"field"
    },
    {
        name:"CommonForm",
        label:"业务信息录入",
        type:"field"
    },
    {
        name:"CommonForm",
        label:"经办人信息验证",
        type:"field"
    },
    {
        name:"CommonMaterial",
        label:"材料预览",
        type:"material"
    },
    
]