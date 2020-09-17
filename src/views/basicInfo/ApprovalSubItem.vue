<template>
    <div class="workWrap">
        <header>情形管理</header>
    </div>
</template>

<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import {
    listApprovalAll,
    listProjectAll,
    addApprovalItem,
    updateApprovalItem,
    getByApprovalItemId,
} from "../../api/basicInfo/approval";

export default {
    name: "ApprovalSubItem",
    mixins: [basicMixin],
    data() {
        return {
            // 页面信息
            type: "subItem",
        };
    },
    async created() {
        await this.init();
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
    }
}
</style>