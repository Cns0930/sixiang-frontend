import { getByApprovalItemId } from "@/api/basicInfo/approval";

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
        }
    }
}