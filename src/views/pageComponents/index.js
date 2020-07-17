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
    
]