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

### 约定

1. PureComponents 组件用于列表的子项 如何 Collection GudongCommon 这种 列表组件

2. PureComponents 中 不渲染 $ 开头的fieldNo。 $开头的key 用于 属性控制 这个child

    2.1  Colleciton中的child 是否可删除，使用 $unremoveable  属性，与fieldNo同级；值为 undefined 与 false == 可删除，true == 不可删除