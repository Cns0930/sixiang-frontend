import state from "../home/state"

// 定义所需的 mutations
const mutations = {
    putBaseFields(state,data){
        state.baseFields = data
    },
    putComputedFields(state,data){
        state.computedFields = data;
    },
    pushBaseField(state,data){
        state.baseFields.push(data)
    },
    deleteBaseField(state,data){
        state.baseFields.splice(data,1)
    },
    pushComputedField(state,data){
        state.computedFields.push(data)
    },
    deleteComputedField(state,data){
        state.computedFields.splice(data,1)
    },
    pushStepPage(state,data){
        state.stepPages.push(data)
    },
    deleteStepPage(state,data){
        state.stepPages.splice(data,1)
    },
    putStepPageFields(state,data){
        state.stepPages.fields = data;
    },
    pushTemplate(state,data){
        state.templates.push(data)
    },
    pushPage(state,{index,data}){
        state.templates[index].pages.push(data)
    },
    deleteTemplate(state,data){
        state.templates.splice(data,1)
    },
    putTableData(state,data){
        state.tableData = data;
    }
}

export default mutations
