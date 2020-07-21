import { getById } from "@/api/item/index";

export const mixin={
    methods: {
        async init(){
            if(this.$store.state.home.item.id == null){
                let itemId = this.$route.query.itemId;
                let result = await getById({id: itemId});
                if (!result.success) {
                this.$message({ type: "warning", message: "获取初始事项信息失败" });
                return;
                }
                this.$store.commit("changeItem", result.data);
            }
        }
    }
}