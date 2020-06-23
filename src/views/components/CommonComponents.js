
import Renderer from "./Renderer"

class CommonComponents{
    constructor(){
        // 24 ： 一行一个，12：一行两个
        this.span=new Renderer('ElInput',24)
        // 组件类型
        this.type=new Renderer('ElInput','')
        // 样例 值
        this.sample = new Renderer('ElInput','')
        // 验证 文字说明
        this.validate=new Renderer('ElInput','')
        // 交互限制 文字说明
        this.limitation=new Renderer('ElInput','')
        // 事件
        this.onchange=new Renderer('ElInput','')
        // 事件
        this.onfocus=new Renderer('ElInput','')
    }
}

export default CommonComponents