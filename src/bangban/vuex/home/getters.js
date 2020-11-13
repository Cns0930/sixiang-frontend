
import _ from "lodash"
const getters = {
    qingxingItems: (state,getters,rootState, rootGetters) =>{
    
      
   
            let item_code = rootGetters.item_code;
           
            let fact1 = rootState[item_code]?.fact1.value;
            return fact1;
        
    
          
      } ,
    sid: state=>{
        return state.item.itemNo
    },
    getSid: state=>{
        return state.item.itemNo
    },
    getCompanyName:state =>state.companyName,
    getJingbanrenName:state=>state.barcodeInfo.prmname,
    getJingbanrenIdCard:state=>state.barcodeInfo.idcard,
    getJingbanrenMobile:state=>state.barcodeInfo.mobile,
    getCurrentSelfServiceRecordId:state=>state.currentSelfServiceRecordId,

    getUserId:state=>1
};
export default getters
