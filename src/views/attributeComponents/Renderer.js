


class Renderer {
    constructor(renderTemplateName, value,  attributes={},label=null) {
        this.value = value;
        this.renderTemplateName = renderTemplateName;
        this.attributes = attributes || {};
        this.label=label

    }
}

export function rendererBuilder(type = "input", value = "") {
    if (type === "input") {
        return new Renderer('ElInput', value)
    } else if (type === "text") {
    
        return new Renderer("TextSpan", value,  )
    }else {
        return new Renderer("", value,  )
    }
   


}

export default Renderer