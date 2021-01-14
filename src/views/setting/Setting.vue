<template>
  <div class="setting">
      <div>超级帮办接口地址:</div>
      <el-input :value="bangbanUrl" @input="$store.commit('putBangbanUrl',$event)"></el-input>
  </div>
</template>

<script>
import {mapState} from "vuex"
import {mixin} from "@/mixin/mixin"

export default {
    name:"Setting",
    mixins: [mixin],
    computed:{
        ...mapState({
            bangbanUrl:state=>state.setting.bangbanUrl!=''?state.setting.bangbanUrl:"http://10.0.103.187:8081"
        })
    },
    async created() {
        // 获取项目信息
        await this.initProject();
        await this.init();
    }
}
</script>

<style scoped lang="scss">
.setting{

}
</style>