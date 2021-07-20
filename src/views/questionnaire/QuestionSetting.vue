<template>
    <div class="workWrap">
        <header>
            <span class="title">初始配置</span>
        </header>
        <el-tabs type="border-card">
            <el-tab-pane label="材料问卷">
                <h4>材料问卷</h4>
                <HandsontableMaterial />
            </el-tab-pane>
            <el-tab-pane label="字段问卷">
                <h4>字段问卷</h4>
                <HandsontableField />
            </el-tab-pane>
        </el-tabs>

    </div>
</template>


<script>
import axios from 'axios'
import HandsontableMaterial from './settingComponents/HandsontableMaterial.vue'
import HandsontableField from './settingComponents/HandsontableField.vue'
import { mixin } from "@/mixin/mixin"


export default {
    name: 'Handsontable',
    mixins: [mixin],
    components: {
        HandsontableMaterial,
        HandsontableField
    },
    data() {
        return {
            // 初始事项参数
            itemId: this.$route.query.itemId,
            projectId: this.$route.query.projectId,
            activeName: '',
        }
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
    },
    mounted() {
    },
    methods: {
    }
}
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
        .title {
            margin-right: 20px;
        }
    }
    .searchBox {
        margin-left: 20px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
    }
    .workBox {
        width: 100%;
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        margin-top: 20px;
        box-sizing: border-box;
        background: #fff;
        .sampleTable {
            margin: 20px;
        }
    }
    .workHandleBox {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: flex-start;
        margin: 30px;
        .button {
            margin-right: 12px;
        }
        // background: rgb(219, 237, 238);
        .handleBox {
            width: 300px;
            margin: 20px;
            padding: 10px;
            display: flex;
            // background: rgb(250, 218, 218);
            align-items: center;
            flex-direction: column;
            justify-content: center;
            .title {
                margin: 20px;
            }
        }
    }
    .ruleItems {
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 10px;
        margin-bottom: 5px;
    }
    .releaseDialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 10px 20px;
        // background: rgb(250, 218, 246);
        .nike {
            font-size: 50px;
            color: #409eff;
        }
        .urltext {
            text-align: center;
        }
    }
}
</style>