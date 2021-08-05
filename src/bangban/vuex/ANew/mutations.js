import state from "../home/state";

// 定义所需的 mutations
const mutations = {
    putItem(state,data){
        console.log(JSON.stringify(state.itemForm))
        state.itemForm.item = data;
    },
    putDocList(state,data){
        state.docList=data
    },
    putDocIndex(state,data){
        state.docIndex = data
    },
    addDocIndex(state,data){
        state.docIndex ++
    },
    minusDocIndex(state,data){
        state.docIndex--
    },
    putHasQueryDefaultInfo(state,data){
        state.hasQueryDefaultInfo = data;
    },
    putHasJingbanrenInfo(state,data){
        state.hasJingbanrenInfo=data;
    },
    putQingxingSpecial(state,data) {
        state.qingxingSpecial[data.sid] = data.value;
    }
}

export default mutations
