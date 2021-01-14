import { getByApprovalItemId, getByProjectId } from "@/api/basicInfo/approval";
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
        async initProject(){
            if(this.$store.state.home.project.projectId === undefined){
                let projectId = this.$route.query.projectId;
                let result = await getByProjectId({projectId: projectId});
                if (!result.success) {
                    this.$message({ type: "warning", message: "获取初始项目信息失败" });
                    return;
                }
                this.$store.commit("changeProject", result.data);
            }
        },
        timeFormatter(row, column, cellValue, index) {
            return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
        },
    }
}