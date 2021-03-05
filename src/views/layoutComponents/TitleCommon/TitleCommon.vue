<template>
 <el-col :span="24">
    <div class="title-common">
        <div class="one-name names" v-if="isWhichTitle =='一级标题'"><img class="one-img" src="./one.png">{{ titles || '情形标题' }}</div>
        <div class="two-name names" v-if="isWhichTitle=='二级标题'"><img class="two-img" src="./two.png">{{ titles || '板块标题' }}</div>
    </div>
    </el-col>
</template>

<script>
export default {
    name: "TitleCommon",
    props: ["value",'isWhichTitle','titles'],
    data() {
        return {

        }
    },
    created(){

    },
    computed: {

    },
    methods: {

        // handleExtraChange(v) {
        //    console.log(v)
        // },
        // commitConfirm() {
        //     if(!this.attribute.value) {
        //        this.$message.warning('请先阅读')
        //     } else{
        //        this.ifShowDialog = false
        //        this.$emit('change', false)
        //     }
            
        // }
    }

}
</script>

<style scoped lang="scss">
  .title-common{
    //   background: red;
      .names{
        text-align: left;
        color: #ffffff;
        display: flex;
        align-items: center;
      }
    // .one-name{ 
    //     .one-img{
            
    //     }
    // }
    // .two-name{
    //     .two-img{
            
    //     }
    // }
  }
</style>