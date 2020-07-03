


class Renderer {
    constructor(renderTemplateName, value,  attributes={}) {
        this.value = value;
        this.renderTemplateName = renderTemplateName;
        this.attributes = attributes
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