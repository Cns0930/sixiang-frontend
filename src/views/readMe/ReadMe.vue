<template>
<div style="padding:20px">
       <markdown-it-vue class="md-body" :content="content"  />
</div>

</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
export default {
    name: "ReadMe",
    components: {
       MarkdownItVue
    },
    data() {
    return {
      content: `# 开发说明
### 代码框控制组件
1. list类的赋值：gudongList.value = [{"子项fieldNo1":"值"},{"子项fieldNo1":"值"},],赋值后的结果：gudongList: {attributes:{children:[子项组件,子项组件],}}

2. GudongCommon 组件 的两个属性 语义与实际意义相反

    2.1 canAdd ，实际意义是 不可添加（值为false的时候== 可添加）

    2.2 deleteOrigin, 实际意义是 不可删除 （值为false的时候 ==可删除）

3. PureComponents 组件用于列表的子项； 例如 Collection GudongCommon 这种 列表组件

4. PureComponents 中 不渲染 $ 开头的fieldNo。 $开头的key 用于 属性控制 这个child

    4.1  Colleciton中的child 是否可删除，使用 $unremoveable  属性，与fieldNo同级；值为 undefined 与 false == 可删除，true == 不可删除

### 代码框 helper说明
1. axios 请求 ; 例:

[axios 文档](https://www.kancloud.cn/yunye/axios/234845)

默认策略与超级帮办应用相同； base ip 为超级帮办后端地址，没有写上http://ip  就会自动加上base ip ;
\`\`\`
axios.post("/api/address",{key:value}).then(v=>{
    console.log(v)
})

axios.get("/api/address",{params:{key:value}}).then(v=>{
    console.log(v)
})
\`\`\`

2. dayjs
[dayjs 文档](https://day.js.org/)


\`\`\`
// 常用格式化
dayjs().format("YYYY-MM-DD HH:mm:ss")
\`\`\`

3. _ (lodash的变量名)
[lodash 文档](https://lodash.com/docs/4.17.4)

4. helper 内置辅助函数
\`\`\`
//  验证统一社会信用代码 
helper.CheckSocialCreditCode 
// 验证身份证
helper.IdentityCodeValid,
// 设置 select组件的options
helper.setOptions,
// 验证手机号
helper.CheckPhone,
// 验证邮箱
helper.CheckMail,
// 验证邮编
helper.CheckPostCode,
// 验证固定电话
helper.CheckFixedTelephone
\`\`\`
    `
    }
  }
}
</script>

<style>
</style>