/**
 * 1.将结构化数据转成抽象语法树的json
 * 2. 将抽象语法树转成js代码
 * @param {*} data 
 */
import escodegen from "escodegen"
import {
    action as stepPageAction
} from "./stepPageCompiler"

function generateBaseWrapper() {
    return {
        "type": "FunctionDeclaration",
        "params": [{
                "type": "Identifier",
                "name": "state"
            },
            {
                "type": "Identifier",
                "name": "getters"
            }
        ],
        "body": {
            type: "BlockStatement",
            body: [

            ]
        }
    }
}



export default function (dataList) {

    // 每个元素是一个 ifstatement 或者 ExpressionStatement
    let astBodyJson = dataList.map(data => {

        return parseIFStatement(data)
    })

    let astJson = generateBaseWrapper()
    astJson.body.body = astBodyJson;
    //  增加一个  let output=[]
    astJson.body.body.unshift({
        "type": "VariableDeclaration",
        "start": 37,
        "end": 50,
        "declarations": [{
            "type": "VariableDeclarator",
            "id": {
                "type": "Identifier",
                "name": "output"
            },
            "init": {
                "type": "ArrayExpression",
                "elements": []
            }
        }],
        "kind": "let"
    })
    astJson.body.body.push({
        "type": "ReturnStatement",
        "argument": {
            "type": "Identifier",
            "name": "output"
        }
    })
    console.log(JSON.stringify(astJson, null, 4))
    return escodegen.generate(astJson)
}




// 转换 条件数据为ast
function parseIFStatement(data) {
    let {
        conditionBlock,
        actionBlock,
        type
    } = data;
    let actionFn
    console.log(type)
    if (type == "stepPage") {
        actionFn = stepPageAction;
    }
    return {
        "type": "IfStatement",
        "test": parseLogicalAST(conditionBlock),
        "consequent": {
            "type": "BlockStatement",
            "body": actionFn(actionBlock)
        }

    }


}

// 将 输出数组的 action 转为return ast
function parseReturnArray(actionBlock) {
    return actionBlock.actions.map(action => {
        return {
            "type": "ReturnStatement",
            "argument": {
                "type": "ArrayExpression",
                "elements": action.value.fields.map(v => ({
                    "type": "Literal",
                    "value": v
                }))
            }
        }
    })
}

//  多个 逻辑条件 
function parseLogicalAST(conditionBlock) {
    let {
        conditions,
        logic
    } = conditionBlock;

    if (conditions.length <= 1) {
        return parseTestAST(conditions[0])
    }

    let logicalSymbol = logic == "any" ? "||" : "&&";

    return conditions.reduce((result, condition, i) => {

        return {
            "type": "LogicalExpression",
            "left": i == 1 ? parseTestAST(result) : result,
            "operator": logicalSymbol,
            "right": condition.type == "subLogical" ? parseLogicalAST(condition.subConditionBlock) : parseTestAST(condition)

        }
    })

}



//  生成 ifstatement 中的 test 中的 ast
function parseTestAST(condition) {
    // 源对象
    let subject = condition.subject
    //  目标对象
    let object = condition.object;
    // 判断
    let predicate = condition.predicate;
    //  产生 BinaryExpression 的test wrapper
    if (predicate == "==") {
        return {
            "type": "BinaryExpression",
            "left": parseStateValue(subject),
            "operator": predicate,
            "right": {
                "type": "Literal",
                "value": object,
            },
        }

        //  产生 CallExpression 的test wrapper
    } else if (predicate == "includes") {
        return {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "object": parseStateValue(subject),
                "property": {
                    "type": "Identifier",
                    "name": "includes"
                },
                "computed": false,

            },
            "arguments": [{
                "type": "Literal",
                "value": object,
            }],
        }

    }

}


//  生成类似 state[fieldNo].value 的相应的ast
function parseStateValue(propertyName) {
    return {
        "type": "MemberExpression",
        "object": {
            "type": "MemberExpression",

            "object": {
                "type": "Identifier",
                "name": "state"
            },
            "property": {
                "type": "Literal",
                "value": propertyName,
            },
            "computed": true,

        },
        "property": {
            "type": "Identifier",
            "name": "value"
        },
        "computed": false,

    }
}