import { getByApprovalItemId } from "@/api/basicInfo/approval";
import dayjs from "dayjs"
export const mixin={
    methods: {
        async init(){
            if(this.$store.state.home.item.approvalItemId == null){
                let itemId = this.$route.query.itemId;
                let result = await getByApprovalItemId({approvalItemId: itemId});
                if (!result.success) {
                this.$message({ type: "warning", message: "获取初始事项信息失败" });
                return;
                }
                this.$store.commit("changeItem", result.data);
            }
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
    }
}