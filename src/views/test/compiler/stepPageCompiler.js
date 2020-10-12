export function action(actionBlock) {
    return actionBlock.actions.map(action => {

        if (action.type == "return") {
            return {
                "type": "ReturnStatement",
                "argument": {
                    "type": "ArrayExpression",
                    "elements": [generateResultObject(action)]
                },


            }
        } else if (action.type == "push") {
            return {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "MemberExpression",
                        "object": {
                            "type": "Identifier",
                            "name": "output"
                          },
                          "property": {
                            "type": "Identifier",
                            "name": "push"
                          },
                          "computed": false,
                    },
                    "arguments": [
                        generateResultObject(action)
                    ]
                }
            }
        }

        return {
            "type": "ReturnStatement",
            "argument":null
        }
    })
}

export function condition() {

}

//  生成 {fact:"",fields:[]} 格式的 ast
function generateResultObject(action){
    return {
        "type": "ObjectExpression",
        "properties": [{
                "type": "Property",
                "key": {
                    "type": "Literal",
                    "value": "fact",
                },
                "value": {
                    "type": "Literal",
                    "value": action.value.fact,
                },
                "kind": "init"
            },
            {
                "type": "Property",
                "key": {
                    "type": "Literal",
                    "value": "fields",
                },
                "value": {
                    "type": "ArrayExpression",
                    "elements": action.value.fields.map(v => ({
                        "type": "Literal",
                        "value": v
                    }))
                },
                "kind": "init"
            }
        ]

    }
}