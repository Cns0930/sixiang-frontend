### 约定

1. PureComponents 组件用于列表的子项； 例如 Collection GudongCommon 这种 列表组件

2. PureComponents 中 不渲染 $ 开头的fieldNo。 $开头的key 用于 属性控制 这个child

    2.1  Colleciton中的child 是否可删除，使用 $unremoveable  属性，与fieldNo同级；值为 undefined 与 false == 可删除，true == 不可删除

3. list类的赋值：gudongList.value = [{"子项fieldNo1":"值"},{"子项fieldNo1":"值"},]
    赋值后的结果：gudongList: {attributes:{children:[子项组件,子项组件],}}

4. GudongCommon 组件 的两个属性 语义与实际意义相反 ：
    4.1. canAdd ，实际意义是 不可添加（值为false的时候== 可添加）
    4.2. deleteOrigin, 实际意义是 不可删除 （值为false的时候 ==可删除）
# seassoon-selfservice-editor

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

