// 定义所需的 mutations
const mutations = {
    changeApprovalItem(state,data){
        console.log(data,'state')
        state.approvalItem=data;
    },
}

export default mutations
