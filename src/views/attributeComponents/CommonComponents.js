
import Renderer from "./Renderer"
import { getMapping } from "./index"


class CommonComponents {
    constructor({ type }) {
        // 24 ： 一行一个，12：一行两个
        
        this.span = new Renderer('NumberInput', 24,{vModel:24})
        // 组件类型

        const typeOptions = Object.keys(getMapping()).map(v => ({ value: v, label: v }))
        
        this.type = new Renderer("TypeSelector", type,  { value: type, options: typeOptions })
        // 样例 值
        this.sample = new Renderer('ElInput', '')
        // 验证 文字说明
        this.validate = new Renderer('ElInput', '')
        // 交互限制 文字说明
        this.limitation = new Renderer('ElInput', '')
        // 事件
        this.onchange = new Renderer('ElInput', '')
        // 事件
        this.onfocus = new Renderer('ElInput', '')
    }
}

export default CommonComponents