<template>
  <div class="setting">
      <div>超级帮办接口地址:</div>
      <el-input :value="bangbanUrl" @input="$store.commit('putBangbanUrl',$event)"></el-input>
  </div>
</template>

<script>
import {mapState} from "vuex"

export default {
    name:"Setting",
    computed:{
        ...mapState({
            bangbanUrl:state=>state.setting.bangbanUrl!=''?state.setting.bangbanUrl:"http://10.0.103.187:8081"
        })
    },
}
</script>

<style scoped lang="scss">
.setting{

}
</style>