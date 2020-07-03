// 定义所需的 mutations
const mutations = {
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
    }
}

export default mutations
