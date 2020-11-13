<template>
    <div>
        <content-card>
            <div slot="content" class="content">
                <div class="finished" />
                <div class="line" />
                <div class="text">材料录入完成！</div>
            </div>
        </content-card>
        <div class="operate-btn" style="float: right">
            <el-button type="warning" class="big-btn btn-warn" @click="goPrint">立即打印</el-button>
        </div>
    </div>
</template>

<script>
import ContentCard from '../components/ContentCard'

export default {
    name: 'LastStep',
    components: { ContentCard },
    methods:{
        goPrint(){
            // let selfServiceRecordId = sessionStorage.getItem('currentSelfServiceRecordId');
            let selfServiceRecordId =this.$store.state.home.currentSelfServiceRecordId;
            this.$router.push({path: "/selectprint", query: {'selfServiceRecordId':selfServiceRecordId}});
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    padding: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: calc(100% - 120px);

    .finished {
        background-image: url("~@/assets/svg/last-step.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        height: 372px;
        width: 100%;
        margin-bottom: 50px;
    }

    .line {
        width: 800px;
        height: 4px;
        margin: 20px auto;
        background: #fff;
        border-radius: 50% / 50%;
    }
    .text {
        font-size: 36px;
        color: #FFFFFF;
        letter-spacing: 1.64px;
        text-align: center;
    }
}
</style>
