import InputDef from "./InputDef"
import ComputedDef from "./ComputedDef"
import SelectDef from "./SelectDef"
import SingleCheckboxDef from "./SingleCheckboxDef"
import QingxingCheckboxDef from "./QingxingCheckboxDef"
import DatePickerDef from "./DatePickerDef"
import RadioDef from "./RadioDef"
import ConstantDef from "./ConstantDef"
import IdentityCommonDef from "./IdentityCommonDef.js"
import InputListDef from "./InputListDef"
import DateRangePickerDef from "./DateRangePickerDef"
import CollectionDef from "./CollectionDef"
import GudongCommonDef from "./GudongCommonDef"
import TextInputLikeDef from "./TextInputLikeDef"
import ChuzifangshiDef from "./ChuzifangshiDef"
import OriginJingyingfanweiDef from "./OriginJingyingfanweiDef"
import JingyingfanweiDef from "./JingyingfanweiDef"
import JingyingqixianDef from "./JingyingqixianDef"
import AutocompleteDef from "./AutocompleteDef"
import CascaderDef from "./CascaderDef"
import RegionCascaderDef from "./RegionCascaderDef"
import QingxingCommentDef from "./QingxingCommentDef"
import ComputedTextDef from "./ComputedTextDef"
import QRCodeUploadDef from './QRCodeUploadDef'
import TipsCommonDef from './TipsCommonDef'
import TitleCommonDef from './TitleCommonDef'
import CollapseCommonDef from './CollapseCommonDef'
let mapping = [
    {label:"文本",value:"text",componentDef:TextInputLikeDef,isList:false},
    {label:"文本计算值",value:"computedText",componentDef:ComputedTextDef,isList:false},
    {label:"输入框",value:"input",componentDef:InputDef,isList:false},
    {label:"输入框带建议",value:"autocomplete",componentDef:AutocompleteDef,isList:false},
    {label:"输入框组",value:"inputList",componentDef:InputListDef,isList:false},
    {label:"下拉选择",value:"select",componentDef:SelectDef,isList:false},
    {label:"级联选择",value:"cascader",componentDef:CascaderDef,isList:false},
    {label:"行政区划级联选择",value:"regionCascader",componentDef:RegionCascaderDef,isList:false},
    {label:"勾选",value:"singleCheckbox",componentDef:SingleCheckboxDef,isList:false},
    {label:"情形多选",value:"qingxingCheckbox",componentDef:QingxingCheckboxDef,isList:false},
    {label:"情形说明",value:"qingxingComment",componentDef:QingxingCommentDef,isList:false},
    {label:"单选",value:"radio",componentDef:RadioDef,isList:false},
    {label:"日期选择",value:"datePicker",componentDef:DatePickerDef,isList:false},
    {label:"日期范围选择",value:"dateRangePicker",componentDef:DateRangePickerDef,isList:false},
    {label:"集合",value:"collection",componentDef:CollectionDef,isList:true},
    {label:"身份证扫描组件",value:"identityCommon",componentDef:IdentityCommonDef,isList:false},
    {label:"分类经营范围",value:"originJingyingfanwein",componentDef:OriginJingyingfanweiDef,isList:false},
    {label:"经营范围",value:"jingyingfanwei",componentDef:JingyingfanweiDef,isList:false},
    {label:"经营期限",value:"jingyingqixian",componentDef:JingyingqixianDef,isList:false},
    {label:"股东集合",value:"gudongCommon",componentDef:GudongCommonDef,isList:true},
    {label:"出资方式",value:"chuzifangshi",componentDef:ChuzifangshiDef,isList:false},
    {label:"合成属性",value:"computed",componentDef:ComputedDef,isList:false},
    {label:"常量",value:"constant",componentDef:ConstantDef,isList:false},
    {label:"二维码上传文件",value:"QRCodeUpload",componentDef:QRCodeUploadDef,isList:false},
    {label:"提取点",value:"checkpoint",componentDef:ComputedDef,isList:false},
    {label:"通知",value:"tipsCommon",componentDef:TipsCommonDef,isList:false},
    {label:"标题",value:"titleCommon",componentDef:TitleCommonDef,isList:false},
    {label:"折叠面板",value:"collapseCommon",componentDef:CollapseCommonDef,isList:true}
]

export function getMapping() {
    return mapping
}


export function deserializeBaseField(fieldJSON) {

    // console.log("===fieldJSON===")
    // console.log(fieldJSON)

    let componentDefs = fieldJSON.componentDefs
    let ComponentDefClass = mapping.find(v=>v.value == fieldJSON.type)?.componentDef
   
    let actualComponentDefs = new ComponentDefClass();
    Object.keys(actualComponentDefs).forEach(key => {
        if(componentDefs[key]){
            actualComponentDefs[key].value = componentDefs[key].value
        }
        
    })
    

    let output = {
        id:fieldJSON.id,
        fieldNo: fieldJSON.fieldNo,
        type: fieldJSON.type,
        fieldType: fieldJSON.fieldType,
        isList:fieldJSON.isList,
        label: fieldJSON.label,
        fieldName: fieldJSON.fieldName,
        parentId: fieldJSON.parentId,
        descriptionInfo: fieldJSON.descriptionInfo,
        validationInfo: fieldJSON.validationInfo, 
        remark: fieldJSON.remark,
        createRole: fieldJSON.createRole,
        componentDefs: actualComponentDefs
    }

    return output


}

export function deserializeComputedField(fieldJSON){
    
    let componentDefs = fieldJSON.componentDefs
    let actualComponentDefs = new ComputedDef();
    Object.keys(actualComponentDefs).forEach(key => {
        if(componentDefs[key]){
            actualComponentDefs[key].value = componentDefs[key].value
        }
        
    })
    let output = {
        id:fieldJSON.id,
        fieldNo: fieldJSON.fieldNo,
        type: fieldJSON.type,
        fieldType: 2,
        fieldName: fieldJSON.fieldName,
        descriptionInfo: fieldJSON.descriptionInfo,
        validationInfo: fieldJSON.validationInfo, 
        remark: fieldJSON.remark,
        createRole: fieldJSON.createRole,
        label: fieldJSON.label,
        componentDefs:actualComponentDefs
    }
    return output

}

export function deserializeTableData(fieldJSON){
    console.log(fieldJSON)
    // type为1或2时分别调用其他方法
    if(fieldJSON.fieldType == 1){
      
        
        let output = deserializeBaseField(fieldJSON)
        
        // 处理子项
        if(fieldJSON.children != null){
           
            
            if(fieldJSON.children.some(e=>e.validationInfo)||fieldJSON.children.some(e=>e.descriptionInfo)) {
                let children = fieldJSON.children.map(v => ({...v.object, id: v.id, fieldType: v.fieldType,validationInfo:v.validationInfo,descriptionInfo:v.descriptionInfo })).map(deserializeBaseField)
                if (output.componentDefs.meta) {
                    output.componentDefs.meta.value = children
                }
                output.list =children;
            } else {
                let children = fieldJSON.children.map(v => ({ ...v.object, id: v.id, fieldType: v.fieldType  })).map(deserializeBaseField)
                if (output.componentDefs.meta) {
                    output.componentDefs.meta.value = children
                }
                output.list =children;
            }
            
            // output.componentDefs.meta.value = children
            // output.list =children;
        }
       
        return output
    }
    if(fieldJSON.fieldType == 2){
        return deserializeComputedField(fieldJSON)
    }
    if(fieldJSON.fieldType == 3){
        return deserializeBaseField(fieldJSON)
    }
}

// export function deserializeTableDatas(fieldJSON){
//     // console.log(fieldJSON)
//     // type为1或2时分别调用其他方法
//     if(fieldJSON.fieldType == 1){
      
        
//         let output = deserializeBaseField(fieldJSON)
        
//         // 处理子项
//         if(fieldJSON.children != null){
           
//             let children = fieldJSON.children.map(v => ({ id: v.id, fieldType: v.fieldType,validationInfo:v.validationInfo?v.validationInfo:null, ...v.object })).map(deserializeBaseField)
//             output.componentDefs.meta.value = children
//             output.list =children;
//         }
       
//         return output
//     }
//     if(fieldJSON.fieldType == 2){
//         return deserializeComputedField(fieldJSON)
//     }
//     if(fieldJSON.fieldType == 3){
//         return deserializeBaseField(fieldJSON)
//     }
// }


export default mapping