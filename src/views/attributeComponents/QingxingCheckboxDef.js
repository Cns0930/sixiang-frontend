import CommonComponents from "./CommonComponents"
import Renderer,{rendererBuilder} from "./Renderer"

let ListInput = {
    name:"ListInput",
    props:["value"],
   
    render(){
        let scopedSlotsLabel ={default:(scope)=><el-input vModel={scope.row.label} style="width:100%"></el-input>}
        let  scopedSlotsValue ={default:(scope)=><el-input vModel={scope.row.value} style="width:100%"></el-input>}
        let scopedSlotsCode ={default:(scope)=><el-input vModel={scope.row.code} style="width:100%"></el-input>}
        let scopedSlotsDisabled ={default:(scope)=><el-checkbox vModel={scope.row.disabled} ></el-checkbox>}
        let scopedSlotsHidden ={default:(scope)=><el-checkbox vModel={scope.row.needHidden} ></el-checkbox>}
  
        let scopedSlotsChosen ={default:(scope)=><el-checkbox vModel={scope.row.chosen} ></el-checkbox>}
        let scopedSlotOp ={default:(scope)=><div>
            <el-button onclick={() => { this.value.splice(scope.$index + 1, 0, {label:"",value:"",code:"",disabled:false}) }}>添加</el-button>
            <el-button onClick={() => { this.value.splice(scope.$index, 1) }}>删除</el-button>
            </div>}
        return <ElTable data={this.value}>
                <el-table-column prop="label" label="情形名称" scopedSlots={scopedSlotsLabel}></el-table-column>
                <el-table-column prop="value" label="情形值（同名称）" scopedSlots={scopedSlotsValue}> </el-table-column>
                
                <el-table-column prop="code" label="情形编号" scopedSlots={scopedSlotsCode}> </el-table-column>
                <el-table-column prop="disabled" label="是否禁用" scopedSlots={scopedSlotsDisabled}> </el-table-column>
                <el-table-column prop="needHidden" label="是否需要隐藏" scopedSlots={scopedSlotsHidden}> </el-table-column>
                <el-table-column prop="chosen" label="是否默认选中" scopedSlots={scopedSlotsChosen}> </el-table-column>
                <el-table-column  label="操作" scopedSlots={scopedSlotOp}> </el-table-column>
            </ElTable>
    }
}

class QingxingCheckboxDef extends CommonComponents{
    constructor(){
        super({type:"qingxingCheckbox"})

        // this.options = new Renderer("InputArray",[""],{})
        this.options = new Renderer(ListInput,[{label:"xxxx",value:"",code:"",needHidden: false,disabled:false,}],{})

        this.component = rendererBuilder("text","ElCheckboxC")

        this.value = rendererBuilder("text",[]) 
        this.colSpan = new Renderer('ElInput',12,{vModel:12},"情形多列展示(24为100%)")
        
        this.isHidden =  new Renderer('ElSingleCheckboxC', true,{options:[true]},"是否默认启用隐藏")

    }
    getAttributes(){
        return {
            colSpan: this.colSpan.value,
            options:this.options.value,
            isHidden:this.isHidden.value,
        }
    }
}

export default QingxingCheckboxDef