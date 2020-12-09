// 定义所需的 mutations
const mutations = {
    changeItemName(state,data){
        state.itemName = data;
    },
    changeItem(state,data){
        state.item=data;
    },
    changeEditList(state,data){
        state.editList=data;
    },
    // changeItemOptions(state,data){
    //     state.itemOptions=data;
    // }
}

export default mutations
