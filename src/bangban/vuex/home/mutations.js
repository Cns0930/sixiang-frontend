// 定义所需的 mutations
const mutations = {
    changeItemName(state,data){
        state.itemName = data;
    },
    changeItem(state,data){
        state.item=data;
    },
    // changeItemOptions(state,data){
    //     state.itemOptions=data;
    // }
    putCurrentSelfServiceRecordId(state,data){
        state.currentSelfServiceRecordId = data;
    },
    putSelfServiceCaseId(state,data){
        state.selfServiceCaseId = data;
    },
    putCompanyName(state,data){
        state.companyName=data;
    },
    putBarcodeInfo(state,data){
        state.barcodeInfo = data;
    },
    putAllFieldNo(state,data){
        state.allFieldNo = data;
    },
    putQingxingItem(state,data){
        state.shixiangForm.checkList = data;
    },
    putIsHistoryRecord(state,data){
        state.isHistoryRecord= data;
    },
    putSid(state,data){
        let shixiangForm = _.cloneDeep(state.shixiangForm)
        shixiangForm.approval[1] =data
        state.shixiangForm=shixiangForm
    }
}

export default mutations
