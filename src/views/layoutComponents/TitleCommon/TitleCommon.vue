<template>
    <div class="title-common">
        <div class="one-name names" v-if="isOneTitle"><img class="one-img" src="./one.png">{{ titles || '情形标题' }}</div>
        <div class="two-name names" v-if="isTwoTitle"><img class="two-img" src="./two.png">{{ titles || '板块标题' }}</div>
    </div>
</template>

<script>
export default {
    name: "TitleCommon",
    props: ["value",'isOneTitle','isTwoTitle','titles'],
    data() {
        return {
        //    value:{

        //        isOneTitle:true,
        //        isTwoTitle:true
        //    }

        }
    },
    created(){
        
        // if(!this.value){
        //     this.emitEvent("货币")
        // }else if(this.options.includes(this.value)){
        //     this.radioValue = this.value
        // }else{
        //     this.inputValue = this.value;
        //     this.radioValue = "其他"
        // }
    },
    computed: {

    },
    methods: {

        handleExtraChange(v) {
           console.log(v)
        },
        commitConfirm() {
            if(!this.attribute.value) {
               this.$message.warning('请先阅读')
            } else{
               this.ifShowDialog = false
               this.$emit('change', false)
            }
            
        }
    }

}
</script>

<style scoped lang="scss">
  .title-common{
      background: red;
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