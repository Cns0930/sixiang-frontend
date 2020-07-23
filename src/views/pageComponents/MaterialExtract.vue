<template>
  <div>
       <el-button @click="goPrev">上一步</el-button>
      <el-button @click="goNext">下一步</el-button>
  </div>
  
</template>

<script>
import CommonMixin from "./CommonMixin"
export default {
    name:"MaterialExtract",
    mixins: [CommonMixin],
}
</script>

<style>

</style>