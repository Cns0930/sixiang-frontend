
import _ from "lodash"
const getters = {
    sid: state=>{
        return state.shixiangForm.approval[1]
    },
    getCompanyName:state =>state.companyName,
    getJingbanrenName:state=>state.barcodeInfo.prmname,
    getJingbanrenIdCard:state=>state.barcodeInfo.idcard,
    getJingbanrenMobile:state=>state.barcodeInfo.mobile,
    getCurrentSelfServiceRecordId:state=>state.currentSelfServiceRecordId,
};
export default getters
